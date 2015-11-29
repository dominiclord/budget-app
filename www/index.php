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
$app->group('/api', function () use ($app, $db) {

    /**
     * API group v1
     * @param $app  Application
     * @param $db   Database connection
     */
    $app->group('/v1', function () use ($app, $db) {

        /**
        * Fetch all transactions
        * @todo Add authentification
        * @param $app  Application
        * @param $db   Database connection
        */
        $app->get('/transactions', function ( ) use ($app, $db) {

            try {
                $transactions = $db
                    ->transactions()
                    ->order('timestamp DESC');

                $_transactions = [];

                foreach ($transactions as $transaction) {
                    $_transaction = $transaction;
                    $_transactions[] = $_transaction;
                }

                $response = [
                    'results' => $_transactions,
                    'status' => 'OK'
                ];
            } catch(PDOException $e) {
                $response = [
                    'error_message' => $e->getMessage(),
                    'results' => [],
                    'status' => 'ERROR'
                ];
            }

            $app->response()->headers->set('Content-Type', 'application/json');
            $app->response()->setStatus(200);
            echo json_encode($response);
            die();
        });

        /**
         * Fetch a single transaction
         * @todo Add authentification
         * @param $app  Application
         * @param $db   Database connection
         */
        $app->get('/transactions/:id', function ($id = null) use ($app, $db) {

            try {
                $row = $db->{'transactions'}[$id];

                if ($row) {
                    $response = [
                        'results' => $row,
                        'status' => 'OK'
                    ];
                } else {
                    throw new PDOException('No transactions found.');
                }
            } catch(PDOException $e) {
                $response = [
                    'error_message' => $e->getMessage(),
                    'results' => [],
                    'status' => 'ERROR'
                ];
            }

            $app->response()->headers->set('Content-Type', 'application/json');
            $app->response()->setStatus(200);
            echo json_encode($response);
            die();
        });

        /**
         * Create a transaction
         * @todo Add authentification
         * @param $app  Application
         * @param $db   Database connection
         */
        $app->post('/transactions', function () use ($app, $db) {
            /**
             * @todo Everything
             */

            $request_body = $app->request()->getBody();
            $data = json_decode($request_body);

            if (empty($data->timestamp)) {
                $timestamp_date = new \DateTime( 'now', new \DateTimeZone('America/Montreal') );
                $timestamp = $timestamp_date->getTimestamp();
            } else {
                var_dump($data->timestamp);
                die();
            }

            $amount      = empty($data->amount) ? '' : $data->amount;
            $category    = empty($data->category) ? '' : $data->category;
            $description = empty($data->description) ? '' : $data->description;

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

                    $response = [
                        'results' => $result,
                        'status' => 'OK'
                    ];
                }
            } catch(Exception $e) {
                $response = [
                    'error_message' => $e->getMessage(),
                    'results' => [],
                    'status' => 'ERROR'
                ];
            }

            $app->response()->headers->set('Content-Type', 'application/json');
            $app->response()->setStatus(200);
            echo json_encode($response);
            die();
        });

        /**
         * Modify a post
         * @todo Add authentification
         * @param $app  Application
         * @param $db   Database connection
         */
        $app->put('/transaction/:id', function ( $id = null ) use ( $app, $db ) {
            try{

                $data = $app->request()->put();
                $transaction = $db->{'transactions'}[$id];

                $app->response()->headers->set('Content-Type', 'application/json');

                if ($transaction) {

                    $timestamp_date = new \DateTime( 'now', new \DateTimeZone('America/Montreal') );
                    $timestamp = $timestamp_date->getTimestamp();

                    foreach ($data as $key => $value) {
                        $transaction[$key] = $value;
                    }

                    // If no status is set, data is being modified, and we need to update the modified_timestamp
                    if( empty( $data['status'] ) ) {
                        $transaction['timestamp_modified'] = $timestamp;
                    }

                    $transaction->update();

                    $app->response->setStatus(200);
                    $app->response()->headers->set('Content-Type', 'application/json');
                    echo '{"success":{"text":"Transaction modified successfully"}}';
                } else {
                    throw new PDOException('No transactions found.');
                }

            } catch(PDOException $e) {
                $app->response()->setStatus(404);
                echo '{"error":{"text":"'. $e->getMessage() .'"}}';
            }
            die();
        });

    });

});

$app->run();