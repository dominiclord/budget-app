import fade from '../../ractive/ractive-transitions-fade';
import select2Decorator from '../../ractive/ractive-decorators-select2'; //@shame

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
function getTransactionModel(params) {
    var defaults = {
        type: 0,
        amount: '',
        category: null,
        creationDate: '',
        description: ''
    };
    return $.extend({}, defaults, params);
}

/**
 * Decorators need to be in Ractive before any templates are initialized
 */
function prepareDecorators() {
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

export function createComponent(NewTransactionView) {
    prepareDecorators();

    var Component = Ractive.components.NewTransaction = NewTransactionView.extend({
        data: function () {
            // Merging basic transaction model dataset with other view specific datasets
            return $.extend(getTransactionModel(), {
                transactionCategories: []
            });
        },
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

                    let transactionModel = getTransactionModel({
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
                                // _this.recentTransactionsController.push('transactions', transaction);

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
    Component._name = 'NewTransaction';
    return Component;
}
