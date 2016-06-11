/* jshint esnext: true */
import { $document, $window, $html, $body } from './utils/environment';
import fade from './ractive/ractive-transitions-fade';
import load from './ractive/ractive-load';
import tap  from './ractive/ractive-events-tap';
import select2Decorator from './ractive/ractive-decorators-select2'; //@shame

class App {
	constructor() {
        /* Prepare decorators */
        this.prepareDecorators();

        /* Load template parts */
        load('assets/templates/NewTransaction.html').then((NewTransactionView) => {
            this.newTransactionController = this.initNewTransactionController(NewTransactionView);
        }).catch(this.ractiveLoadCatch);

        load('assets/templates/RecentTransactions.html').then((RecentTransactionsView) => {
            this.recentTransactionsController = this.initRecentTransactionsController(RecentTransactionsView);
        }).catch(this.ractiveLoadCatch);
	}

    /**
     * Transaction model
     * @param  {object}  params  Initial values for the model
     * @return {object}          Transaction model
     *
     * Model properties
     * @param {boolean}  type          Expense (false) or income (true)
     * @param {number}   amount        Positive amount
     * @param {string}   category      Category ident
     * @param {string}   creationDate  YYYY-MM-DD format
     * @param {string}   description   Description
     */
    getTransactionModel(params) {
        var defaults = {
            type: 0,
            amount: '',
            category: null,
            creationDate: '',
            description: ''
        };
        return $.extend(defaults, params);
    }

    /**
     * This controller is used for creating new transactions
     * Allows communication between the form and the API
     * @param  {Ractive Object} NewTransactionView  Constructor that extends Ractive
     *                                              i.e. NewTransactionView = Ractive.extend({...})
     * @return {Ractive Object} controller          Ractive instance
     */
    initNewTransactionController(NewTransactionView) {
        var _this = this;
        var controller = new NewTransactionView({
            el: '#newTransaction',
            data: {
                headerTitle: 'New transaction',
                transactionCategories: []
            },
            events: { tap },
            transitions: { fade },

            /**
             * Load transaction categories
             */
            loadCategories: function() {
                $.ajax({
                    method: 'GET',
                    url: '/api/v1/transaction-categories',
                    data: {}
                })
                .done((response) => {
                    if (response.status === 'ok') {
                        this.set('transactionCategories', response.results);
                    }
                })
                .fail(() => {
                    console.log('Error');
                })
                .always(() => {});
            },

            /**
             * Allows us to set proxy events and run other tasks when controller is initialized
             * @param  {array}  options  Array of options
             */
            oninit: function(options) {
                this.loadCategories();

                /* Proxy events */
                this.on({
                    /**
                     * Event triggered when new transaction form is submitted
                     * Extracts data from the form and submits it to API
                     * @param  {object}  event  Ractive event object
                     */
                    submitTransaction: function(event) {
                        // Prevent the page from reloading
                        event.original.preventDefault();

                        let transactionModel = _this.getTransactionModel({
                            type: this.get('type'),
                            amount: this.get('amount'),
                            category: this.get('category'),
                            creationDate: this.get('creationDate'),
                            description: this.get('description')
                        });

                        console.log('Saving to server...', transactionModel);

                        // Send the data to our API
                        $.ajax({
                            method: 'POST',
                            url: '/api/v1/transactions',
                            data: transactionModel
                        })
                        .done((response) => {
                            if (response.status === 'ok') {
                                // Push the new transaction to the recent transaction list
                                let transaction = response.results.shift();
                                if (typeof transaction !== 'undefined') {
                                    _this.recentTransactionsController.push('transactions', transaction);

                                    // We also update the category list in case of a new creation
                                    this.loadCategories();
                                }

                                // Reset the form
                                document.activeElement.blur();
                                $('.valid').removeClass('valid');

                                this.set({
                                    type: 0,
                                    amount: '',
                                    category: null,
                                    timestamp: '',
                                    description: ''
                                });
                            }
                        })
                        .fail(() => {
                            console.log('Error');
                        })
                        .always(() => {
                            console.log('Finished');
                        });
                    }
                });
            }
        });
        return controller;
    }

    /**
     * This controller is displays recent transactions in a list
     * @param  {Ractive Object} RecentTransactionsView  Constructor that extends Ractive
     * @return {Ractive Object} controller              Ractive instance
     */
    initRecentTransactionsController(RecentTransactionsView) {
        var _this = this;
        var controller = new RecentTransactionsView({
            el: '#recentTransactions',
            data: {
                transactions: [],
                sortColumn: 'creationDate'
            },
            computed: {
                sortedTransactions: function() {
                    let column = this.get('sortColumn');
                    return this.get('transactions').slice().sort(function(a, b) {
                        return a[column] < b[column] ? 1 : -1;
                    });
                }
            },
            events: { tap },
            transitions: { fade },

            /**
             * Allows us to set proxy events and run other tasks when controller is initialized
             * @param  {array}  options  Array of options
             */
            oninit: function(options) {
                console.log('Loading recent transactions');

                /* Load most recent transactions */
                $.ajax({
                    method: 'GET',
                    url: '/api/v1/transactions',
                    data: {
                        count: 5
                    }
                })
                .done((response) => {
                    if (response.status === 'ok') {
                        this.set('transactions', response.results);
                    }
                })
                .fail(() => {
                    console.log('Error');
                })
                .always(() => {
                    console.log('Finished');
                });

                /* Proxy events */
                this.on({
                    /**
                     * Sets the sorting column
                     * @param  {object}  event   Ractive event object
                     * @param  {object}  column  Column ident
                     */
                    sort: (event, column) => {
                        this.set('sortColumn', column);
                    }
                });
            }
        });
        return controller;
    }

    /**
     * Decorators need to be in Ractive before any templates are loaded
     */
    prepareDecorators() {
        window.Ractive.decorators.select2.type.transactionCategories = function (node) {
            /* Select2 options */
            return {
                createTag: function (params) {
                    let term = $.trim(params.term);

                    if (term === '') {
                        return null;
                    }

                    return {
                        id: term,
                        text: term,
                        newTag: true
                    };
                },
                placeholder: 'Select a category',
                tags: true,
                tokenSeparators: [',']
            }
        }
    }

    /**
     * Catches Ractive Load errors
     * The setTimeout ensures the error doesn't get swallowed (this can be a problem with promises...)
     * @param  {Object} err
     */
    ractiveLoadCatch(err) {
        setTimeout(() => {
            throw err;
        });
    }
}

window.App = new App();
