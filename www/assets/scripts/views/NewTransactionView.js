/*global define*/
define([
    'mustache',
    'views/AbstractView',
    'collections/transactions',
    'text!../../templates/NewTransaction.mustache'
], function (Mustache, AbstractView, Transactions, NewTransactionTemplate) {
    'use strict';

    var NewTransactionView = AbstractView.extend({

        // Instead of generating a new element, bind to the existing skeleton of
        // the App already present in the HTML.
        //el: '#app',render

        template: NewTransactionTemplate,

        events: {
            'submit .js-newTransactionForm': 'submitForm'
        },

        initialize: function () {
            // @TODO FIX VIEW VS PAGE ISSUE WITH FORM
            this.$form = this.$('.js-newTransactionForm');
            this.$confirmation = this.$('.js-newTransactionMessage');

            this.Transaction = Transactions.create();
            this.listenTo(this.Transaction, 'sync', this.manageSyncResponse);
            this.listenTo(this.Transaction, 'request', this.displayLoader);
            this.listenTo(this.Transaction, 'invalid', this.displayFormErrors);

            this.render();
        },

        render: function () {
            var templateData = {
                headerTitle: 'New transaction'
            };

            console.log('lelelel');

            this.renderView(this.el, this.template, templateData);

            //$(this.el).html(Mustache.render(this.template, templateData));
            //NewTransactionTemplate
            //this.$el.toggleClass('completed', this.model.get('completed'));

            //this.toggleVisible();
            //this.$input = this.$('.edit');
            //return this;
        },

        newAttributes: function () {
            return this.$form.serializeObject();
        },

        submitForm: function (e) {
            e.preventDefault();

            // Clean the form of errors
            // @todo


            var attributes = this.newAttributes();
            console.log(attributes);
            this.Transaction.set(attributes);
            this.Transaction.save();
        },

        /**
         * Display a loader for transmitting
         * @param  {Object}  model     A copy of the submitted model
         * @param  {Object}  response  XHR response object
         * @param  {Object}  options
         */
        displayLoader: function (model, response, options) {
            $('body').addClass('is-transmitting-transaction');
        },

        /**
         * Display errors in form on `invalid` event
         * @param  {Object}  model  A copy of the submitted model
         * @param  {Object}  error  A custom response object
         */
        displayFormErrors: function (model, error) {
            console.log(model);
            console.log(error);

            var fields = error.fields;

            for (var i = 0, len = fields.length; i < len; i++) {
                this.$form.find('[name="' + fields[i] + '"]').addClass('invalid');
            }
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

    return NewTransactionView;
});