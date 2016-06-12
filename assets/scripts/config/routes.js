import load from '../ractive/ractive-load';
import ractiveLoadCatch from '../utils/ractive';

import router from '../plugins/router';

import * as HomePage from '../components/home-page';
import * as ListPage from '../components/list-page';
import * as TransactionPage from '../components/Transaction-page';

// import UserPage from '../components/user-page';
// import UserModel from '../models/user';

var routes = new Map();

routes.set('/', (context, next) => {
    load('assets/views/home-page.html').then((HomeView) => {
        HomePage.loadDependencies().then(() => {
            next(null, HomePage.createComponent(HomeView));
        });
    }).catch(ractiveLoadCatch);
});

routes.set('/list', (context, next) => {
    load('assets/views/list-page.html').then((ListView) => {
        ListPage.loadDependencies().then(() => {
            next(null, ListPage.createComponent(ListView));
        });
    }).catch(ractiveLoadCatch);
});

routes.set('/transaction/:id', (context, next) => {
    let id = context.params.id;
    load('assets/views/transaction-page.html').then((TransactionView) => {
        TransactionPage.loadDependencies({
            id: id
        }).then(() => {
            next(null, TransactionPage.createComponent(TransactionView));
        });
    }).catch(ractiveLoadCatch);
});

// routes.set('/user/:username', (context, next) => {
//     UserModel.findByName(context.params.username)
//         .then((user) => {
//             next(null, UserPage, {
//                 user: user
//             });
//         })
//         .catch((err) => {
//             err.displayMessage = 'User data not found!';
//             next(err);
//         });
// });

export default routes;
