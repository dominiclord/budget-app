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
use \Utils\RandomStringGenerator;

require_once '../vendor/autoload.php';
require_once '../config/helper.php';
require_once '../config/mustache-view.php';

/**
 * Charcoal configuration
 */
$helper = new CharcoalHelper();

$config = new AppConfig();
$config->addFile(__DIR__.'/../config/config.php');
$config->set('ROOT', dirname(__DIR__) . '/');

// Create container and configure it (with charcoal-config)
$container = new AppContainer([
    'settings' => [
        'displayErrorDetails' => true
    ],
    'config' => $config
]);

$charcoalapp = App::instance($container);

// $container->register(new \Charcoal\Model\ServiceProvider\ModelServiceProvider);
// var_dump($container['model/factory']);

if (!session_id()) {
    session_start();
}

$container = new \Slim\Container([
    'settings' => [
        'displayErrorDetails' => true,
    ],
    'view' => function ($c) {
        $view = new \Slim\Views\PhpRenderer('assets/templates');
        return $view;
    }
]);

$app = new \Slim\App($container);

/**
 * Simple, catchall routing for prototyping.
 */
$app->get('/[{foo}]', function ($request, $response, $args) use ($helper) {
    return $this->view->render($response, '/index.html', $args);
});

/*
=============================

URL                          HTTP Method      Operation
/api/v1/transations          GET              Returns an array of transactions
/api/v1/transations/:id      GET              Returns the transaction with id of :id
/api/v1/transations          POST             Adds a new transaction and returns it with an id attribute added
/api/v1/transations/:id      PUT              Updates the transaction with id of :id

=============================
*/

/**
 * Main API group
 * @param $app  Application
 * @param $db   Database connection
 */
$app->group('/api', function () use ($helper) {

    /**
     * API group v1
     * @param $app  Application
     * @param $db   Database connection
     */
    $this->group('/v1', function () use ($helper) {

        /**
        * Fetch all transactions
        * @param $db   Database connection
        * @todo Add authentification
        */
        $this->get('/transactions', function ($request, $response, $args) use ($helper) {
            $status = 200;
            $count = (isset($args['count']) && is_integer($args['count'])) ? $args['count'] : false;

            try {
                $transactions = $helper
                    ->fetch_collection('budget/object/transaction')
                    ->addFilter('active', true)
                    ->addOrder('creation_date', 'ASC');

                if ($count) {
                    $transactions = $transactions->setNumPerPage($count);
                }

                $transactions = $transactions
                    ->load()
                    ->objects();

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
         * @param $db   Database connection
         * @todo Add authentification
         */
        $this->get('/transactions/{id}', function ($request, $response, $args) use ($helper) {
            $status = 200;
            try {
                $transaction = $helper
                    ->obj('budget/object/transaction')
                    ->loadFrom('id', $args['id']);

                if ($transaction->id()) {
                    $data = [
                        'message' => 'Transaction found',
                        'results' => $transaction->data(),
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
         * @param $db   Database connection
         * @todo Everything
         * @todo Add authentification
         */
        $this->post('/transactions', function ($request, $response, $args) use ($helper) {
            $status = 200;
            $body = $request->getParsedBody();
            error_log(print_R($body, true));

            if (empty($body['timestamp'])) {
                $creation_date = new \DateTime('now', new \DateTimeZone('America/Montreal'));
            } else {
                $creation_date = new \DateTime($body['timestamp'], new \DateTimeZone('America/Montreal'));
            }

            // Is income : type 1
            // Is expense : type 0
            // Default is expense since most common
            $type = empty($body['type']) ? 0 : $body['type'];
            $amount = empty($body['amount']) ? '' : $body['amount'];
            $category = empty($body['category']) ? '' : $body['category'];
            $description = empty($body['description']) ? '' : $body['description'];

            $error = false;

            // Generate a unique id for the post
            $generator = new \Utils\RandomStringGenerator;
            $token = $generator->generate(40);

            try {
                if ($amount === '' || $category === '' || $type === '') {
                    throw new Exception('Empty amount, category or type');
                } else {

                    $transaction = $helper
                        ->obj('budget/object/transaction')
                        ->setData([
                            // 'id'            => $token,
                            'type'          => $type,
                            'amount'        => $amount,
                            'creation_date' => $creation_date->format('Y-m-d H:i:s'),
                            'modified_date' => $creation_date->format('Y-m-d H:i:s'),
                            'category'      => $category,
                            'description'   => $description
                        ]);

                    $transaction->save();

                    $data = [
                        'message' => 'New transaction created',
                        'results' => $transaction->data(),
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
         * @param $db   Database connection
         * @todo  Add authentification
         * @todo  Change timestamp_modified only if data changes?
         */
        $this->patch('/transactions/{id}', function ($request, $response, $args) use ($helper) {
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
                $transaction = $helper
                    ->obj('budget/object/transaction')
                    ->loadFrom('id', $args['id']);

                if ($transaction->id()) {

                    // Be safe in regards to ID
                    if (isset($data['id'])) {
                        unset($data['id']);
                    }

                    // Transaction is being modified
                    $modified_date = new \DateTime('now', new \DateTimeZone('America/Montreal'));
                    $data['modified_date'] = $modified_date->format('Y-m-d H:i:s');

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
            return $response->write(var_export($request->getParsedBody(),true));
        });

    });

});

$app->run();