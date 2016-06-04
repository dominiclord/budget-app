<?php

/**
 * Application HTTP Middlewares
 *
 * @global \Charcoal\App\App $app The Charcoal application.
 */

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

use \Charcoal\App\App;
use \Charcoal\App\AppContainer;

/** @var AppContainer $container The DI container used by the application. */
$container = $app->getContainer();