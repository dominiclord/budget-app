/*global define*/
define([
    'common',
    'views/NewTransactionView'
], function (Common, NewTransactionView) {
    'use strict';

    var BudgetRouter = Backbone.Router.extend({
        routes: {
            '' : 'home',
            '*filter': 'setFilter'
        },

        home: function () {
            return new NewTransactionView();
        },

        setFilter: function (param) {
            // Set the current filter to be used
            //Common.TodoFilter = param || '';

            // Trigger a collection filter event, causing hiding/unhiding
            // of the Todo view items
            //Todos.trigger('filter');
        }
    });

    return BudgetRouter;
});