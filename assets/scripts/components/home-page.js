import Ractive from 'ractive';
import load from '../ractive/ractive-load';
import ractiveLoadCatch from '../utils/ractive';

import * as NewTransaction from './transaction/new-transaction';
import * as RecentTransactions from './transaction/recent-transactions';

var NewTransactionComponent;
var RecentTransactionsComponent;

var Promise = Ractive.Promise;

export function loadDependencies(HomeView) {
    return new Promise( function ( fulfil, reject ) {
        load({
            NewTransactionView: 'assets/views/transaction/new-transaction.html',
            RecentTransactionsView: 'assets/views/transaction/recent-transactions.html',
        }).then((components) => {
            NewTransactionComponent = NewTransaction.createComponent(components.NewTransactionView);
            RecentTransactionsComponent = RecentTransactions.createComponent(components.RecentTransactionsView);
            fulfil();
        }).catch(ractiveLoadCatch);
    });
}

export function createComponent(HomeView) {
    var Page = Ractive.components.HomePage = HomeView.extend({
        data: {
            info: 'Hello world.'
        },
        components: {
            NewTransactionComponent: NewTransactionComponent,
            RecentTransactionsComponent: RecentTransactionsComponent
        }
    });
    Page._name = 'HomePage';
    return Page;
}
