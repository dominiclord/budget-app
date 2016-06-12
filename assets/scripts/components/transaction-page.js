import Ractive from 'ractive';
import load from '../ractive/ractive-load';
import ractiveLoadCatch from '../utils/ractive';

import * as TransactionPage from './transaction/transaction-details';

var TransactionDetailsComponent;

var Promise = Ractive.Promise;

export function loadDependencies(options) {
    return new Promise(function (fulfil, reject) {
        load({
            TransactionDetailsView: 'assets/views/transaction/transaction-details.html'
        }).then((components) => {
            TransactionDetailsComponent = TransactionPage.createComponent(components.TransactionDetailsView, {
                id: options.id
            });
            fulfil();
        }).catch(ractiveLoadCatch);
    });
}

export function createComponent(TransactionView) {
    var Page = Ractive.components.TransactionPage = TransactionView.extend({
        data: {},
        components: {
            TransactionDetailsComponent: TransactionDetailsComponent
        }
    });
    Page._name = 'TransactionPage';
    return Page;
}
