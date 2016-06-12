import tap from '../../ractive/ractive-events-tap';
import fade from '../../ractive/ractive-transitions-fade';

export function createComponent(RecentTransactionsView) {

    var Component = Ractive.components.RecentTransactions = RecentTransactionsView.extend({
        data: function () {
            return {
                transactions: [],
                sortColumn: 'creationDate'
            }
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
    Component._name = 'RecentTransactions';
    return Component;
}
