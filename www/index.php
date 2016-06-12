<?php

/**
 * Main budget functions and routing
 *
 * @author Benjamin Roch <roch.bene@gmail.com>
 * @author Dominic Lord <dlord@outlook.com>
 */

/**
 * This is how we will call classes
 * autoload will make sure everything is available
 * @todo Move this.
 */

use \Charcoal\App\App;
use \Charcoal\App\AppConfig;
use \Charcoal\App\AppContainer;

use \Budget\Utils\RandomStringGenerator as RandomStringGenerator;
use \Budget\Utils\CharcoalHelper;

/** If we're not using PHP 5.6+, explicitly set the default character set. */
if ( PHP_VERSION_ID < 50600 ) {
    ini_set('default_charset', 'UTF-8');
}

/** For the time being, let's track and show all issues. */
ini_set('error_reporting', E_ALL);
ini_set('display_errors', true);

/** Register The Composer Autoloader */
require dirname(__DIR__) . '/vendor/autoload.php';

/** Import the application's settings */
$config = new AppConfig();
$config->addFile(dirname(__DIR__) . '/config/config.php');
// $config->set('ROOT', dirname(__DIR__) . '/');

/** Build a DI container */
$container = new AppContainer([
    'settings' => [
        'displayErrorDetails' => $config['dev_mode']
    ],
    'config' => $config
]);

$app = App::instance($container);

// Set up dependencies
require __DIR__.'/../config/dependencies.php';
// Register middleware
require __DIR__.'/../config/middlewares.php';

/** Start new or resume existing session */
if (!session_id()) {
    session_start();
}

/** CharcoalHelper */
$charcoalHelper = new CharcoalHelper($container);

$appContainer = new \Slim\Container([
    'settings' => [
        'displayErrorDetails' => true,
    ],
    'view' => function ($c) {
        $view = new \Slim\Views\PhpRenderer('assets/views');
        return $view;
    }
]);

$budgetApp = new \Slim\App($appContainer);

/** Build database tables */
$budgetApp->get('/build', function () use ($charcoalHelper) {
    $charcoalHelper->collection('budget/object/transaction')->source()->createTable();
    $charcoalHelper->collection('budget/object/transaction-category')->source()->createTable();
});

/** Simple, catchall routing for prototyping. */
$budgetApp->get('/[{foo}]', function ($request, $response, $args) use ($charcoalHelper) {
    return $this->view->render($response, '/index.html', $args);
});

/*
=============================

URL                            HTTP Method      Operation
/api/v1/transations            GET              Returns an array of transactions
/api/v1/transations/:id        GET              Returns the transaction with id of :id
/api/v1/transations            POST             Adds a new transaction and returns it with an id attribute added
/api/v1/transations/:id        PUT              Updates the transaction with id of :id

/api/v1/transation-categories  GET              Returns an array of transaction categories

=============================
*/

/**
 * Main API group
 */
$budgetApp->group('/api', function () use ($charcoalHelper) {

    /**
     * API group v1
     */
    $this->group('/v1', function () use ($charcoalHelper) {

        /**
         * Fetch all transactions
         * @todo Add authentification
         */
        $this->get('/transactions', function ($request, $response, $args) use ($charcoalHelper) {
            $status = 200;

            // Params are used for filtering and sorting transaction list
            $params = $request->getQueryParams();
            // Default : 20
            $count = (isset($params['count']) && is_numeric($params['count'])) ? $params['count'] : 20;
            // Default : 1
            $page = (isset($params['page']) && is_numeric($params['page'])) ? $params['page'] : 1;
            // Default : sorted from newest to oldest
            $order = (isset($params['order'])) ? $params['order'] : 'DESC';

            try {
                $transactions = $charcoalHelper
                    ->collection('budget/object/transaction')
                    ->addFilter('active', true)
                    ->addOrder('creationDate', $order)
                    ->setPage(1)
                    ->setNumPerPage($count)
                    ->load()
                    ->objectsPublic();

                $data = [
                    'message' => 'List of transactions',
                    'results' => $transactions,
                    'status' => 'ok'
                ];
            } catch (Exception $e) {
                $status = 404;
                $data = [
                    'message' => 'An error occured : ' . $e->getMessage(),
                    'results' => [],
                    'status' => 'error'
                ];
            }

            return $response->withStatus($status)
                    ->withHeader('Content-Type', 'application/json')
                    ->write(json_encode($data));
        });

        /**
         * Fetch a single transaction
         * @todo Add authentification
         */
        $this->get('/transactions/{id}', function ($request, $response, $args) use ($charcoalHelper) {
            $status = 200;
            try {
                $transaction = $charcoalHelper
                    ->obj('budget/object/transaction')
                    ->load($args['id']);

                if ($transaction->id()) {
                    $data = [
                        'message' => 'Transaction found',
                        'results' => [
                            $transaction->publicData()
                        ],
                        'status' => 'ok'
                    ];

                } else {
                    throw new Exception('No transactions found.');
                }
            } catch (Exception $e) {
                $status = 404;
                $data = [
                    'message' => 'An error occured : ' . $e->getMessage(),
                    'results' => [],
                    'status' => 'error'
                ];
            }

            return $response->withStatus($status)
                    ->withHeader('Content-Type', 'application/json')
                    ->write(json_encode($data));
        });

        /**
         * Create a transaction
         * @todo Add authentification
         */
        $this->post('/transactions', function ($request, $response, $args) use ($charcoalHelper) {
            $status = 200;
            $body = $request->getParsedBody();

            if (empty($body['creationDate'])) {
                $creationDate = new \DateTime('now', new \DateTimeZone('America/Montreal'));
            } else {
                $creationDate = new \DateTime($body['creationDate'], new \DateTimeZone('America/Montreal'));
            }

            // Is income : type 1
            // Is expense : type 0
            // Default is expense since it's the most common transaction
            $type = empty($body['type']) ? 0 : $body['type'];
            $amount = empty($body['amount']) ? '' : $body['amount'];
            $category = empty($body['category']) ? '' : $body['category'];
            $description = empty($body['description']) ? '' : $body['description'];

            $error = false;

            // Generate a unique id for the post
            $generator = new RandomStringGenerator;
            $token = $generator->generate(40);

            try {
                if ($amount === '' || $category === '' || $type === '') {
                    throw new Exception('Empty amount, category or type');
                } else {

                    // Here we test for existing category
                    // $category could be of two formats
                    // - string (create a new category)
                    // - UUID (use existing category)
                    $transactionCategory = $charcoalHelper
                        ->obj('budget/object/transaction-category')
                        ->load($category);

                    if (!$transactionCategory->id()) {
                        $transactionCategory = $charcoalHelper
                            ->obj('budget/object/transaction-category')
                            ->setData([
                                'name' => $category
                            ]);

                        $transactionCategory->save();
                    }

                    // Create a new transaction that we save and then return in our response
                    $transaction = $charcoalHelper
                        ->obj('budget/object/transaction')
                        ->setData([
                            // 'id' => $token,
                            'type' => $type,
                            'amount' => $amount,
                            'creationDate' => $creationDate->format('Y-m-d H:i:s'),
                            'modifiedDate' => $creationDate->format('Y-m-d H:i:s'),
                            'category' => $transactionCategory->id(),
                            'description' => $description
                        ]);

                    $transaction->save();

                    $data = [
                        'message' => 'New transaction created',
                        'results' => [
                            $transaction->publicData()
                        ],
                        'status' => 'ok'
                    ];
                }
            } catch (Exception $e) {
                $status = 404;
                $data = [
                    'message' => 'An error occured : ' . $e->getMessage(),
                    'results' => [],
                    'status' => 'error'
                ];
            }

            return $response->withStatus($status)
                    ->withHeader('Content-Type', 'application/json')
                    ->write(json_encode($data));
        });

        /**
         * Modify a transaction
         * @todo  Add authentification
         * @todo  Change modifiedDate only if data changes?
         */
        $this->patch('/transactions/{id}', function ($request, $response, $args) use ($charcoalHelper) {
            $body = $request->getParsedBody();
            var_dump($body);
            die();
            /*
            $status = 200;
            $data = $request->getParsedBody();
            // getParsedBody() doesn't seem to get parameters
            // figure out how to to use update() properly
            die();

            try{
                $transaction = $charcoalHelper
                    ->obj('budget/object/transaction')
                    ->loadFrom('id', $args['id']);

                if ($transaction->id()) {

                    // Be safe in regards to ID
                    if (isset($data['id'])) {
                        unset($data['id']);
                    }

                    // Transaction is being modified
                    $modifiedDate = new \DateTime('now', new \DateTimeZone('America/Montreal'));
                    $data['modifiedDate'] = $modifiedDate->format('Y-m-d H:i:s');

                    $transaction->setData($data);
                    $valid = $transaction->validate();

                    if ($valid) {
                        $transaction->update();

                        $body = [
                            'message' => 'Transaction updated',
                            'results' => $transaction->data(),
                            'status' => 'ok'
                        ];

                    } else {
                        throw new Exception('Failed to update object: validation error(s).');
                    }
                } else {
                    throw new Exception('No transactions found.');
                }

            } catch (Exception $e) {
                $status = 404;
                $body = [
                    'message' => 'An error occured : ' . $e->getMessage(),
                    'results' => [],
                    'status' => 'error'
                ];
            }

            return $response->withStatus($status)
                    ->withHeader('Content-Type', 'application/json')
                    ->write(json_encode($data));
            */
            // return $response;
            var_dump($request->getParsedBody());
            return $response->write(var_export($request->getParsedBody(), true));
        });

        /**
         * Fetch all transaction categories
         * @todo Add authentification
         */
        $this->get('/transaction-categories', function ($request, $response, $args) use ($charcoalHelper) {
            $status = 200;

            // Params are used for filtering and sorting transaction category list
            $params = $request->getQueryParams();
            // Default : 20
            $count = (isset($params['count']) && is_numeric($params['count'])) ? $params['count'] : 20;
            // Default : 1
            $page = (isset($params['page']) && is_numeric($params['page'])) ? $params['page'] : 1;
            // Default : sorted alphabetically a-z according to name property
            $order = (isset($params['order'])) ? $params['order'] : 'ASC';

            try {
                $transactionCategories = $charcoalHelper
                    ->collection('budget/object/transaction-category')
                    ->addOrder('name', $order)
                    ->setPage(1)
                    ->setNumPerPage($count)
                    ->load()
                    ->objectsPublic();

                $data = [
                    'message' => 'List of transaction categories',
                    'results' => $transactionCategories,
                    'status' => 'ok'
                ];
            } catch (Exception $e) {
                $status = 404;
                $data = [
                    'message' => 'An error occured : ' . $e->getMessage(),
                    'results' => [],
                    'status' => 'error'
                ];
            }

            return $response->withStatus($status)
                    ->withHeader('Content-Type', 'application/json')
                    ->write(json_encode($data));
        });

        /**
         * Create a transaction category
         * @todo Add authentification
         */
        $this->post('/transaction-categories', function ($request, $response, $args) use ($charcoalHelper) {
            $status = 200;
            $body = $request->getParsedBody();

            $name = empty($body['name']) ? '' : $body['name'];

            $error = false;

            try {
                if ($name === '') {
                    throw new Exception('Empty name');
                } else {


                    // Here we test for existing category by name
                    $transactionCategory = $charcoalHelper
                        ->obj('budget/object/transaction-category')
                        ->loadFrom('name', $name);

                    if (!$transactionCategory->id()) {
                        $transactionCategory = $charcoalHelper
                            ->obj('budget/object/transaction-category')
                            ->setData([
                                'name' => $name
                            ]);

                        $message = 'New transaction category created';
                        $transactionCategory->save();
                    } else {
                        $message = 'Existing category found';
                    }

                    $data = [
                        'message' => $message,
                        'results' => [
                            $transactionCategory->publicData()
                        ],
                        'status' => 'ok'
                    ];
                }
            } catch (Exception $e) {
                $status = 404;
                $data = [
                    'message' => 'An error occured : ' . $e->getMessage(),
                    'results' => [],
                    'status' => 'error'
                ];
            }

            return $response->withStatus($status)
                    ->withHeader('Content-Type', 'application/json')
                    ->write(json_encode($data));
        });
    });

});

$budgetApp->run();
