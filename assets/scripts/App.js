/* jshint esnext: true */
import { $document, $window, $html, $body } from './utils/environment';
import tap from './ractive/ractive-events-tap';
import fade from './ractive/ractive-transitions-fade';
import load from './ractive/ractive-load';

class App {
	constructor() {
        /**
         * Create a new transaction (form and event management)
         */
        var newTransactionController;

        Ractive.load('assets/templates/NewTransaction.html').then( function ( NewTransactionView ) {
            // NewTransactionView is a constructor that extends Ractive
            // i.e. NewTransactionView = Ractive.extend({...})
            newTransactionController = new NewTransactionView({
                el: '#newTransaction',
                data: {
                    headerTitle: 'New transaction'
                }
            });

            initNewTransactionController();

        }).catch( function ( err ) {
            // the setTimeout ensures the error doesn't get swallowed
            // (this can be a problem with promises...)
            setTimeout( function ( err ) {
                throw err;
            });
        });

        function initNewTransactionController() {
            // newTransactionController.on( 'newTransaction', function ( transaction ) {
            //     console.log( 'saving to server...', transaction );

            //     var jqxhr = $.ajax({
            //         method: 'POST',
            //         url: '/api/v1/transactions',
            //         data: transaction
            //     })
            //     .done(function(response) {
            //         console.log(response.message);

            //         if (response.status === 'ok') {
            //             console.log(response.results);
            //         }
            //     })
            //     .fail(function() {
            //         console.log('error');
            //     })
            //     .always(function() {
            //         console.log('finished');
            //     });
            // });
        }

        /**
         * Display recent transactions list
         */
        var recentTransactionsController;

        Ractive.load('assets/templates/RecentTransactions.html').then( function ( RecentTransactionsView ) {
            // NewTransactionView is a constructor that extends Ractive
            // i.e. NewTransactionView = Ractive.extend({...})
            recentTransactionsController = new RecentTransactionsView({
                el: '#recentTransactions',
                data:{
                    transactions: [],
                    sort: function ( array, column ) {
                        array = array.slice(); // clone, so we don't modify the underlying data

                        return array.sort( function ( a, b ) {
                            return a[ column ] < b[ column ] ? 1 : -1;
                        });
                    },
                    sortColumn: 'creation_date'
                }
            });

            recentTransactionsController.on( 'sort', function ( event, column ) {
                this.set( 'sortColumn', column );
            });

            initRecentTransactionsController();

        }).catch( function ( err ) {
            setTimeout( function ( err ) {
                throw err;
            });
        });

        function initRecentTransactionsController() {
            console.log( 'Loading recent transactions' );

            var jqxhr = $.ajax({
                method: 'GET',
                url: '/api/v1/transactions',
                data: {
                    count: 5
                }
            })
            .done(function(response) {
                console.log(response.message);

                if (response.status === 'ok') {
                    recentTransactionsController.set('transactions', response.results);
                }
            })
            .fail(function() {
                console.log('error');
            })
            .always(function() {
                console.log('finished');
            });

            newTransactionController.on('newTransactionSaved', function (transaction) {
                recentTransactionsController.push('transactions', transaction);
            });
        }
	}
}

new App();
