/* jshint esnext: true */
import { $document, $window, $html, $body } from './utils/environment';
import tap  from './ractive/ractive-events-tap';
import load from './ractive/ractive-load';
import fade from './ractive/ractive-transitions-fade';

class App {
	constructor() {

        /* Load template parts */
        load('assets/templates/NewTransaction.html').then((NewTransactionView) => {
            this.newTransactionController = this.initNewTransactionController(NewTransactionView);
        }).catch(this.ractiveLoadCatch);

        load('assets/templates/RecentTransactions.html').then((RecentTransactionsView) => {
            this.recentTransactionsController = this.initRecentTransactionsController(RecentTransactionsView);
        }).catch(this.ractiveLoadCatch);
	}

    /**
     * This controller is used for creating new transactions
     * Allows communication between the form and the API
     *
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
                // news: window.newsOptions.news,
                // page: window.newsOptions.page,
                // nextPage: window.newsOptions.nextPage,
                // state: window.newsOptions.state
            },
            events: { tap },
            transitions: { fade },

            /**
             * Allows us to set proxy events and run other tasks when controller is initialized
             *
             * @param  {array}  options  Array of options
             */
            oninit: function(options) {
                /* Load transaction categories */
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
                .always(() => {
                    $('select').chosen();
                });

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
     *
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
             *
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
     * Transaction model
     * @param  {object}  params  Initial values for the model
     * @return {object}          Transaction model
     *
     * Model properties
     *
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
     * Catches Ractive Load errors
     * The setTimeout ensures the error doesn't get swallowed (this can be a problem with promises...)
     * @param  {Object} err
     */
    ractiveLoadCatch(err) {
        setTimeout(function(err) {
            throw err;
        });
    }
}

new App();
