/*global require*/
'use strict';

// Require.js allows us to configure shortcut alias
require.config({
    // The shim config allows us to configure dependencies for
    // scripts that do not call define() to register a module
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
        materialize: {
            deps: [
                'hammerjs'
            ]
        }
    },
    paths: {
        jquery: '../../../node_modules/jquery/dist/jquery',
        underscore: '../../../node_modules/underscore/underscore',
        backbone: '../../../node_modules/backbone/backbone',
        materialize: '../../../node_modules/materialize-css/dist/js/materialize.min',
        hammerjs: '../../../node_modules/hammerjs/hammer.min',
        text: '../../../node_modules/requirejs-text/text',
        mustache: '../../../node_modules/mustache/mustache.min'
    }
});

require([
    'backbone',
    'views/app',
    'routers/router'
], function (Backbone, AppView, Workspace) {
    /*jshint nonew:false*/
    // Initialize routing and start Backbone.history()
    new Workspace();
    Backbone.history.start();

    // Initialize the application view
    new AppView();
});