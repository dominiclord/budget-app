import Ractive from 'ractive';
import load from '../ractive/ractive-load';
import ractiveLoadCatch from '../utils/ractive';

import * as NewTransaction from './transaction/new-transaction';
import * as TransactionList from './transaction/transaction-list';

var NewTransactionComponent;
var TransactionListComponent;

var Promise = Ractive.Promise;

export function loadDependencies() {
    return new Promise(function (fulfil, reject) {
        load({
            NewTransactionView: 'assets/views/transaction/new-transaction.html',
            TransactionListView: 'assets/views/transaction/transaction-list.html'
        }).then((components) => {
            NewTransactionComponent = NewTransaction.createComponent(components.NewTransactionView);
            TransactionListComponent = TransactionList.createComponent(components.TransactionListView, {
                count: 5,
                data: {
                    transactionListTitle: 'Recent transactions'
                }
            });
            fulfil();
        }).catch(ractiveLoadCatch);
    });
}

export function createComponent(HomeView) {
    var Page = Ractive.components.HomePage = HomeView.extend({
        data: {},
        components: {
            NewTransactionComponent: NewTransactionComponent,
            TransactionListComponent: TransactionListComponent
        }
    });
    Page._name = 'HomePage';
    return Page;
}
