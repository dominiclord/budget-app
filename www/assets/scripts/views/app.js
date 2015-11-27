/*global define*/
define([
    'jquery',
    'underscore',
    'backbone',
    'collections/transactions',
    'mustache',
    'common'
], function ($, _, Backbone, Transactions, Mustache, Common) {
    'use strict';

    // Our overall **AppView** is the top-level piece of UI.
    var AppView = Backbone.View.extend({

        // Instead of generating a new element, bind to the existing skeleton of
        // the App already present in the HTML.
        el: '.js-newTransactionView',

        events: {
            'submit .js-newTransactionForm': 'submitForm'
        },

        initialize: function () {
            this.$form = this.$('.js-newTransactionForm');

            this.Transaction = Transactions.create();
            this.listenTo(this.Transaction, 'sync', this.displaySyncResponse);
            //this.listenTo(this.Transaction, 'request', this.displayLoader);
            //this.listenTo(this.Transaction, 'invalid', this.displayFormErrors);
            /*
            $(':input','#myform')
              .not(':button, :submit, :reset, :hidden')
              .val('')
              .removeAttr('checked')
              .removeAttr('selected');
             */
        },

        newAttributes: function () {
            return this.$form.serializeObject();
        },

        submitForm: function (e) {
            e.preventDefault();

            // Clean the form of errors
            // @todo

            var attributes = this.newAttributes();
            this.Transaction.set(attributes);
            this.Transaction.save();
        },

    });

    return AppView;
});