import fade from '../../ractive/ractive-transitions-fade';

// Default component options and dataset
var defaultViewOptions = {
    id: '',
    data: {
        transaction: []
    }
}

export function createComponent(TransactionDetailsView, parentViewOptions) {
    // Merging default component options with parent supplied options
    var viewOptions = $.extend(true, {}, defaultViewOptions, parentViewOptions);

    var Component = Ractive.components.TransactionDetails = TransactionDetailsView.extend({
        data: function () {
            return viewOptions.data;
        },
        transitions: { fade },

        /**
         * Allows us to set proxy events and run other tasks when controller is initialized
         * @param  {array}  options  Array of options
         */
        oninit: function(options) {
            console.log('Loading transaction');

            /* Load most recent transactions */
            $.ajax({
                method: 'GET',
                url: '/api/v1/transactions/' + viewOptions.id,
                data: {}
            })
            .done((response) => {
                if (response.status === 'ok') {
                    this.set('transaction', response.results);
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
            });
        }
    });
    Component._name = 'TransactionDetails';
    return Component;
}
