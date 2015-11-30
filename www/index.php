<?php

/**
 * Main budget functions and routing
 *
 * @author Benjamin Roch <roch.bene@gmail.com>
 * @author Dominic Lord <dlord@outlook.com>
 * @copyright 2015 dominiclord
 * @link http://github.com/dominiclord/budget-app
 */

/**
 * This is how we will call classes
 * autoload will make sure everything is available
 * @todo Move this.
 */
use \Budget\Client;
use \Budget\User;
use \Budget\Transaction;
use \Budget\Category;
use \Utils\Config;
use \Utils\Base;
use \Utils\RandomStringGenerator;

/**
 * That would be config matters
 * @todo Move that shit
 */
$autoloader = require_once '../vendor/autoload.php';
$autoloader->add('Budget\\', __DIR__.'/../src/');
$autoloader->add('Utils\\', __DIR__.'/../src/');

require_once('../mustache-view.php');

$container = new \Slim\Container;
$container['view'] = function ($c) {
    $view = new \Slim\Views\Mustache('assets/templates');
    return $view;
};

$app = new \Slim\App($container);

include '../config.php';
// $db  = new NotORM($pdo);

// DB
$db = Base::notorm();

/**
 * Simple, catchall routing. Specific routing is handled by Backbone
 *
 * @param $app  Application
 * @param $db   Database connection
 * @todo  Add authentification?
 */
$app->get('/[{foo}]', function ($request, $response, $args) {
    return $this->view->render($response, 'index', $args);
    /*
    // PHP Mustache method
    $app->view()->setData([
        'title' => 'Hello world.'
    ]);
     */
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
$app->group('/api', function () use ($db) {

    /**
     * API group v1
     * @param $app  Application
     * @param $db   Database connection
     */
    $this->group('/v1', function () use ($db) {

        /**
        * Fetch all transactions
        * @param $db   Database connection
        * @todo Add authentification
        */
        $this->get('/transactions', function ($request, $response) use ($db) {

            try {
                $transactions = $db
                    ->transactions()
                    ->order('timestamp DESC');

                $_transactions = [];

                foreach ($transactions as $transaction) {
                    $_transaction = $transaction;
                    $_transactions[] = $_transaction;
                }

                $body = [
                    'results' => $_transactions,
                    'status' => 'OK'
                ];
            } catch (PDOException $e) {
                $body = [
                    'error_message' => $e->getMessage(),
                    'results' => [],
                    'status' => 'ERROR'
                ];
            }

            $response->write(json_encode($body));
            $response->withHeader('Content-Type', 'application/json');
            $response->withStatus(200);
            return $response;
        });

        /**
         * Fetch a single transaction
         * @param $db   Database connection
         * @todo Add authentification
         */
        $this->get('/transactions/{id}', function ($request, $response, $args) use ($db) {

            try {
                $row = $db->{'transactions'}[$args['id']];

                if ($row) {
                    $body = [
                        'results' => $row,
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

            $response->write(json_encode($body));
            $response->withHeader('Content-Type', 'application/json');
            $response->withStatus(200);
            return $response;
        });

        /**
         * Create a transaction
         * @param $db   Database connection
         * @todo Everything
         * @todo Add authentification
         */
        $this->post('/transactions', function ($request, $response, $args) use ($db) {
            $data = $request->getParsedBody();

            if (empty($data['timestamp'])) {
                $timestamp_date = new \DateTime( 'now', new \DateTimeZone('America/Montreal') );
                $timestamp = $timestamp_date->getTimestamp();
            } else {
                var_dump($data['timestamp']);
                die();
            }

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

            $response->write(json_encode($body));
            $response->withHeader('Content-Type', 'application/json');
            $response->withStatus(200);
            return $response;
        });

        /**
         * Modify a post
         * @param $db   Database connection
         * @todo Add authentification
         */
        $this->put('/transaction/{id}', function ($request, $response, $args) use ($db) {
            $data = $request->getParsedBody();

            try{
                $transaction = $db->{'transactions'}[$args['id']];

                if ($transaction) {
                    $timestamp_date = new \DateTime('now', new \DateTimeZone('America/Montreal'));
                    $timestamp = $timestamp_date->getTimestamp();

                    foreach ($data as $key => $value) {
                        $transaction[$key] = $value;
                    }

                    // If no status is set, data is being modified, and we need to update the modified_timestamp
                    if (empty($data['status'])) {
                        $transaction['timestamp_modified'] = $timestamp;
                    }

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

            $response->write(json_encode($body));
            $response->withHeader('Content-Type', 'application/json');
            return $response;
        });

    });

});

$app->run();