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
        $this->get('/transactions', function ($request, $response) use ($helper) {

            try {
                $transactions = $helper
                    ->fetch_collection('budget/object/transaction')
                    ->addFilter('active', true)
                    ->addOrder('creation_date', 'ASC')
                    ->load()
                    ->objects();

                $body = [
                    'results' => $transactions,
                    'status' => 'OK'
                ];
            } catch (PDOException $e) {
                $body = [
                    'error_message' => $e->getMessage(),
                    'results' => [],
                    'status' => 'ERROR'
                ];
            }

            $response->write(json_encode($body))
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(200);

            return $response;
        });

        /**
         * Fetch a single transaction
         * @param $db   Database connection
         * @todo Add authentification
         */
        $this->get('/transactions/{id}', function ($request, $response, $args) use ($helper) {

            try {
                $transaction = $helper
                    ->obj('budget/object/transaction')
                    ->loadFrom('id', $args['id'])
                    ->load();

                if ($transaction->id()) {
                    $body = [
                        'results' => $transaction->data(),
                        'status' => 'OK'
                    ];

                } else {
                    throw new PDOException('No transactions found.');
                }
            } catch (PDOException $e) {
                $body = [
                    'error_message' => $e->getMessage(),
                    'results' => [],
                    'status' => 'ERROR'
                ];
            }

            $response->write(json_encode($body))
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(200);

            return $response;
        });

        /**
         * Create a transaction
         * @param $db   Database connection
         * @todo Everything
         * @todo Add authentification
         */
        $this->post('/transactions', function ($request, $response, $args) use ($helper) {
            $data = $request->getParsedBody();

            if (empty($data['timestamp'])) {
                $timestamp_date = new \DateTime('now', new \DateTimeZone('America/Montreal'));
            } else {
                $timestamp_date = new \DateTime($data['timestamp'], new \DateTimeZone('America/Montreal'));
            }
            $timestamp = $timestamp_date->getTimestamp();

            $amount      = empty($data['amount']) ? '' : $data['amount'];
            $category    = empty($data['category']) ? '' : $data['category'];
            $description = empty($data['description']) ? '' : $data['description'];

            $error = false;

            // Generate a unique id for the post
            $generator = new RandomStringGenerator;
            $token = $generator->generate(40);

            try {
                if ($amount === '' || $category === '') {
                    throw new Exception('Empty amount or category');
                } else {
                    $transaction = [
                        'id'          => $token,
                        'timestamp'   => $timestamp,
                        'category'    => $category,
                        'description' => $description
                    ];

                    $result = $db->transactions->insert($transaction);

                    $body = [
                        'results' => $result,
                        'status' => 'OK'
                    ];
                }
            } catch (Exception $e) {
                $body = [
                    'error_message' => $e->getMessage(),
                    'results' => [],
                    'status' => 'ERROR'
                ];
            }

            $response->write(json_encode($body))
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(200);

            return $response;
        });

        /**
         * Modify a transaction
         * @param $db   Database connection
         * @todo  Add authentification
         * @todo  Change timestamp_modified only if data changes?
         */
        $this->put('/transactions', function ($request, $response, $args) use ($helper) {
            $data = $request->getParsedBody();

            try{
                $transaction = $db->{'transactions'}[$data['id']];

                if ($transaction) {
                    foreach ($data as $key => $value) {
                        $transaction[$key] = $value;
                    }

                    $timestamp_date = new \DateTime('now', new \DateTimeZone('America/Montreal'));
                    $timestamp = $timestamp_date->getTimestamp();
                    $transaction['timestamp_modified'] = $timestamp;

                    $result = $transaction->update();

                    $response->withStatus(200);
                    $body = [
                        'results' => $result,
                        'status' => 'OK'
                    ];
                } else {
                    throw new PDOException('No transactions found.');
                }

            } catch (PDOException $e) {
                $response->withStatus(404);
                $body = [
                    'error_message' => $e->getMessage(),
                    'results' => [],
                    'status' => 'ERROR'
                ];
            }

            $response->write(json_encode($body))
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(200);

            return $response;
        });

    });

});

$app->run();