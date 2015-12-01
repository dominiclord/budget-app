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
            this.$confirmation = this.$('.js-newTransactionMessage');

            this.Transaction = Transactions.create();
            this.listenTo(this.Transaction, 'sync', this.manageSyncResponse);
            this.listenTo(this.Transaction, 'request', this.displayLoader);
            //this.listenTo(this.Transaction, 'invalid', this.displayFormErrors);
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

        displayLoader: function (model, response, options) {
            $('body').addClass('is-transmitting-transaction');
        },

        manageSyncResponse: function (e) {
            var self = this;

            self.$form.find(':input')
                .not(':button, :submit, :reset, :hidden')
                .val('')
                .removeAttr('checked')
                .removeAttr('selected')
                .removeClass('active valid invalid');

            self.$form.find('label')
                .removeClass('active');

            window.setTimeout(function(){
                $('body').addClass('is-transmission-completed');
                self.$confirmation.one('webkitTransitionEnd transitionend msTransitionEnd oTransitionEnd', function() {
                    $('body').removeClass('is-transmitting-transaction is-transmission-completed');
                    self.$confirmation.unbind('webkitTransitionEnd transitionend msTransitionEnd oTransitionEnd');
                });
            }, 2000);

            /*
            window.setTimeout(function(){
                var rendered = Mustache.to_html(successTemplate, self.Post.toJSON());
                self.$user_form.html(rendered);
            }, 1000);
            */
        }

    });

    return AppView;
});