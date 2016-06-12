import tap from '../../ractive/ractive-events-tap';
import fade from '../../ractive/ractive-transitions-fade';

// Default component options and dataset
var defaultViewOptions = {
    count: 20, // @todo Currently loads most recent 20, integrate paging eventually
    data: {
        sortColumn: 'creationDate',
        transactions: [],
        transactionListTitle: 'Transaction list'
    }
}

export function createComponent(TransactionListView, parentViewOptions) {
    // Merging default component options with parent supplied options
    var viewOptions = $.extend(true, {}, defaultViewOptions, parentViewOptions);

    var Component = Ractive.components.TransactionList = TransactionListView.extend({
        data: function () {
            return viewOptions.data;
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
            console.log('Loading transactions');

            /* Load most recent transactions */
            $.ajax({
                method: 'GET',
                url: '/api/v1/transactions',
                data: {
                    count: viewOptions.count
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
    Component._name = 'TransactionList';
    return Component;
}
