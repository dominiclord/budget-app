import Ractive from 'ractive';
import load from '../ractive/ractive-load';
import ractiveLoadCatch from '../utils/ractive';

import * as TransactionList from './transaction/transaction-list';

var TransactionListComponent;

var Promise = Ractive.Promise;

export function loadDependencies() {
    return new Promise(function (fulfil, reject) {
        load({
            TransactionListView: 'assets/views/transaction/transaction-list.html'
        }).then((components) => {
            TransactionListComponent = TransactionList.createComponent(components.TransactionListView, {});
            fulfil();
        }).catch(ractiveLoadCatch);
    });
}

export function createComponent(ListView) {
    var Page = Ractive.components.ListPage = ListView.extend({
        data: {},
        components: {
            TransactionListComponent: TransactionListComponent
        }
    });
    Page._name = 'ListPage';
    return Page;
}
