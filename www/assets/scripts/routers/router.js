/*global define*/
define([
    'common',
    'views/NewTransactionView'
], function (Common, NewTransactionView) {
    'use strict';

    var AppRouter = Backbone.Router.extend({
        routes: {
            //'*filter': 'setFilter'
            '' : 'home'
        },

        home: function () {
            Common.currentView = 'NewTransactionView';

            return new NewTransactionView();
        }

        /*
        setFilter: function (param) {
            // Set the current filter to be used
            Common.TodoFilter = param || '';

            // Trigger a collection filter event, causing hiding/unhiding
            // of the Todo view items
            Todos.trigger('filter');
        }
        */
    });

    return AppRouter;
});