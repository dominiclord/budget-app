import load from '../ractive/ractive-load';
import ractiveLoadCatch from '../utils/ractive';

import router from '../plugins/router';

import HomePage from '../components/home-page';

// import UserPage from '../components/user-page';
// import UserModel from '../models/user';

var routes = new Map();

routes.set('/', (context, next) => {
    load('assets/views/home-page.html').then((HomeView) => {
        next(null, HomePage(HomeView));
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
