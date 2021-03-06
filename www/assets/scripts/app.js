(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

var _ractive = (typeof window !== "undefined" ? window['Ractive'] : typeof global !== "undefined" ? global['Ractive'] : null);

var _ractive2 = _interopRequireDefault(_ractive);

var _ractiveLoad = require('./ractive/ractive-load');

var _ractiveLoad2 = _interopRequireDefault(_ractiveLoad);

var _ractive3 = require('./utils/ractive');

var _ractive4 = _interopRequireDefault(_ractive3);

var _ractiveTransitionsFade = require('./ractive/ractive-transitions-fade');

var _ractiveTransitionsFade2 = _interopRequireDefault(_ractiveTransitionsFade);

var _router = require('./plugins/router');

var RouterPlugin = _interopRequireWildcard(_router);

var _routes = require('./config/routes');

var _routes2 = _interopRequireDefault(_routes);

var _router2 = require('./components/layout/router');

var _router3 = _interopRequireDefault(_router2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _ractiveLoad2.default)('assets/views/app.html').then(function (AppView) {
    initApp(AppView);
}).catch(_ractive4.default);

function initApp(AppView) {
    var App = new AppView({
        el: '#app',
        components: {
            // SearchUser: SearchUserComponent,
            Router: _router3.default,
            EmptyPage: _ractive2.default.extend({ template: '' })
        },
        data: {
            componentName: 'EmptyPage',
            headerTitle: 'Budget App'
        },
        transitions: { fade: _ractiveTransitionsFade2.default },
        oncomplete: function oncomplete() {
            // Wait for the app to be rendered so we properly handle transition
            // from EmptyPage to the one the URL dictates
            RouterPlugin.init(_routes2.default, this.onNavigation.bind(this));
            console.log('App::oninit# Application initialized!');
        },
        onNavigation: function onNavigation(error, navigationContext) {
            console.log('APP::onNavigation# Navigating to:', navigationContext.pageName, 'with context:', navigationContext);

            if (error) {
                console.warn('App::onNavigation# Error navigating:', error);
                this.showAlert(error.displayMessage || error.message);
            } else {
                this.set({
                    req: {
                        params: navigationContext.params,
                        body: navigationContext.state
                    },
                    componentName: navigationContext.pageName
                });
            }
        },
        showAlert: function showAlert(message) {
            var _this = this;

            this.set('errorMsg', message);
            setTimeout(function () {
                _this.set('errorMsg', null);
            }, 2500);
        }
    });
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./components/layout/router":3,"./config/routes":9,"./plugins/router":10,"./ractive/ractive-load":13,"./ractive/ractive-transitions-fade":14,"./utils/ractive":15}],2:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.loadDependencies = loadDependencies;
exports.createComponent = createComponent;

var _ractive = (typeof window !== "undefined" ? window['Ractive'] : typeof global !== "undefined" ? global['Ractive'] : null);

var _ractive2 = _interopRequireDefault(_ractive);

var _ractiveLoad = require('../ractive/ractive-load');

var _ractiveLoad2 = _interopRequireDefault(_ractiveLoad);

var _ractive3 = require('../utils/ractive');

var _ractive4 = _interopRequireDefault(_ractive3);

var _newTransaction = require('./transaction/new-transaction');

var NewTransaction = _interopRequireWildcard(_newTransaction);

var _transactionList = require('./transaction/transaction-list');

var TransactionList = _interopRequireWildcard(_transactionList);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NewTransactionComponent;
var TransactionListComponent;

var Promise = _ractive2.default.Promise;

function loadDependencies() {
    return new Promise(function (fulfil, reject) {
        (0, _ractiveLoad2.default)({
            NewTransactionView: 'assets/views/transaction/new-transaction.html',
            TransactionListView: 'assets/views/transaction/transaction-list.html'
        }).then(function (components) {
            NewTransactionComponent = NewTransaction.createComponent(components.NewTransactionView);
            TransactionListComponent = TransactionList.createComponent(components.TransactionListView, {
                count: 5,
                data: {
                    transactionListTitle: 'Recent transactions'
                }
            });
            fulfil();
        }).catch(_ractive4.default);
    });
}

function createComponent(HomeView) {
    var Page = _ractive2.default.components.HomePage = HomeView.extend({
        data: {},
        components: {
            NewTransactionComponent: NewTransactionComponent,
            TransactionListComponent: TransactionListComponent
        }
    });
    Page._name = 'HomePage';
    return Page;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../ractive/ractive-load":13,"../utils/ractive":15,"./transaction/new-transaction":6,"./transaction/transaction-list":8}],3:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ractive = (typeof window !== "undefined" ? window['Ractive'] : typeof global !== "undefined" ? global['Ractive'] : null);

var _ractive2 = _interopRequireDefault(_ractive);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
    This router has been built on top of the ideas from this Stack Overflow question:
    http://stackoverflow.com/questions/31075341/how-to-create-ractives-subcomponents-dynamically-and-change-them-programmatical
*/

var Router = _ractive2.default.extend({
    template: '<router-handler/>',
    components: {
        'router-handler': function routerHandler() {
            return this.get('componentName');
        }
    },
    oninit: function oninit() {
        this.observe('componentName', function (newValue, oldValue) {
            if (this.fragment.rendered) {
                this.reset();
            }
        });
    }
});

exports.default = Router;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],4:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.loadDependencies = loadDependencies;
exports.createComponent = createComponent;

var _ractive = (typeof window !== "undefined" ? window['Ractive'] : typeof global !== "undefined" ? global['Ractive'] : null);

var _ractive2 = _interopRequireDefault(_ractive);

var _ractiveLoad = require('../ractive/ractive-load');

var _ractiveLoad2 = _interopRequireDefault(_ractiveLoad);

var _ractive3 = require('../utils/ractive');

var _ractive4 = _interopRequireDefault(_ractive3);

var _transactionList = require('./transaction/transaction-list');

var TransactionList = _interopRequireWildcard(_transactionList);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TransactionListComponent;

var Promise = _ractive2.default.Promise;

function loadDependencies() {
    return new Promise(function (fulfil, reject) {
        (0, _ractiveLoad2.default)({
            TransactionListView: 'assets/views/transaction/transaction-list.html'
        }).then(function (components) {
            TransactionListComponent = TransactionList.createComponent(components.TransactionListView, {});
            fulfil();
        }).catch(_ractive4.default);
    });
}

function createComponent(ListView) {
    var Page = _ractive2.default.components.ListPage = ListView.extend({
        data: {},
        components: {
            TransactionListComponent: TransactionListComponent
        }
    });
    Page._name = 'ListPage';
    return Page;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../ractive/ractive-load":13,"../utils/ractive":15,"./transaction/transaction-list":8}],5:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.loadDependencies = loadDependencies;
exports.createComponent = createComponent;

var _ractive = (typeof window !== "undefined" ? window['Ractive'] : typeof global !== "undefined" ? global['Ractive'] : null);

var _ractive2 = _interopRequireDefault(_ractive);

var _ractiveLoad = require('../ractive/ractive-load');

var _ractiveLoad2 = _interopRequireDefault(_ractiveLoad);

var _ractive3 = require('../utils/ractive');

var _ractive4 = _interopRequireDefault(_ractive3);

var _transactionDetails = require('./transaction/transaction-details');

var TransactionPage = _interopRequireWildcard(_transactionDetails);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TransactionDetailsComponent;

var Promise = _ractive2.default.Promise;

function loadDependencies(options) {
    return new Promise(function (fulfil, reject) {
        (0, _ractiveLoad2.default)({
            TransactionDetailsView: 'assets/views/transaction/transaction-details.html'
        }).then(function (components) {
            TransactionDetailsComponent = TransactionPage.createComponent(components.TransactionDetailsView, {
                id: options.id
            });
            fulfil();
        }).catch(_ractive4.default);
    });
}

function createComponent(TransactionView) {
    var Page = _ractive2.default.components.TransactionPage = TransactionView.extend({
        data: {},
        components: {
            TransactionDetailsComponent: TransactionDetailsComponent
        }
    });
    Page._name = 'TransactionPage';
    return Page;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../ractive/ractive-load":13,"../utils/ractive":15,"./transaction/transaction-details":7}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createComponent = createComponent;

var _ractiveTransitionsFade = require('../../ractive/ractive-transitions-fade');

var _ractiveTransitionsFade2 = _interopRequireDefault(_ractiveTransitionsFade);

var _ractiveDecoratorsSelect = require('../../ractive/ractive-decorators-select2');

var _ractiveDecoratorsSelect2 = _interopRequireDefault(_ractiveDecoratorsSelect);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//@shame

/**
 * Transaction model
 * @param  {object}  params  Initial values for the model
 * @return {object}          Transaction model
 *
 * Model properties
 * @param {boolean}  type          Expense (false) or income (true)
 * @param {number}   amount        Positive amount
 * @param {string}   category      Category ident
 * @param {string}   location      Location ident
 * @param {string}   creationDate  YYYY-MM-DD format
 * @param {string}   description   Description
 */
function getTransactionModel(params) {
    var defaults = {
        type: 0,
        amount: '',
        category: null,
        location: null,
        creationDate: '',
        description: ''
    };
    return $.extend({}, defaults, params);
}

/**
 * Decorators need to be in Ractive before any templates are initialized
 */
var defaultSelect2Options = {
    createTag: function createTag(params) {
        var term = $.trim(params.term);

        if (term === '') {
            return null;
        }

        return {
            id: term,
            text: term,
            newTag: true
        };
    },
    tags: true,
    tokenSeparators: [',']
};
function prepareDecorators() {
    window.Ractive.decorators.select2.type.transactionCategories = function (node) {
        return $.extend(true, {}, defaultSelect2Options, {
            placeholder: 'Select a category'
        });
    };
    window.Ractive.decorators.select2.type.transactionLocations = function (node) {
        return $.extend(true, {}, defaultSelect2Options, {
            placeholder: 'Select a location'
        });
    };
}

function createComponent(NewTransactionView) {
    prepareDecorators();

    var Component = Ractive.components.NewTransaction = NewTransactionView.extend({
        data: function data() {
            // Merging basic transaction model dataset with other view specific datasets
            return $.extend(getTransactionModel(), {
                transactionCategories: [],
                transactionLocations: []
            });
        },
        transitions: { fade: _ractiveTransitionsFade2.default },

        /**
         * Load transaction categories
         * @return this
         */
        loadCategories: function loadCategories() {
            var _this = this;

            $.ajax({
                method: 'GET',
                url: '/api/v1/transaction-categories',
                data: {}
            }).done(function (response) {
                if (response.status === 'ok') {
                    _this.set('transactionCategories', response.results);
                }
            }).fail(function () {
                console.log('Error');
            }).always(function () {});
            return this;
        },

        /**
         * Load transaction locations
         * @return this
         */
        loadLocations: function loadLocations() {
            var _this2 = this;

            $.ajax({
                method: 'GET',
                url: '/api/v1/transaction-locations',
                data: {}
            }).done(function (response) {
                if (response.status === 'ok') {
                    _this2.set('transactionLocations', response.results);
                }
            }).fail(function () {
                console.log('Error');
            }).always(function () {});
            return this;
        },

        /**
         * Allows us to set proxy events and run other tasks when controller is initialized
         * @param  {array}  options  Array of options
         */
        oninit: function oninit(options) {
            this.loadCategories().loadLocations();

            /* Proxy events */
            this.on({
                /**
                 * Event triggered when new transaction form is submitted
                 * Extracts data from the form and submits it to API
                 * @param  {object}  event  Ractive event object
                 */
                submitTransaction: function submitTransaction(event) {
                    var _this3 = this;

                    // Prevent the page from reloading
                    event.original.preventDefault();

                    var transactionModel = getTransactionModel({
                        type: this.get('type'),
                        amount: this.get('amount'),
                        category: this.get('category'),
                        location: this.get('location'),
                        creationDate: this.get('creationDate'),
                        description: this.get('description')
                    });

                    console.log('Saving to server...', transactionModel);

                    // Send the data to our API
                    $.ajax({
                        method: 'POST',
                        url: '/api/v1/transactions',
                        data: transactionModel
                    }).done(function (response) {
                        if (response.status === 'ok') {
                            // Push the new transaction to the recent transaction list
                            var transaction = response.results.shift();
                            if (typeof transaction !== 'undefined') {
                                // _this.recentTransactionsController.push('transactions', transaction);

                                // We also update the category and location list in case of a new creation
                                _this3.loadCategories().loadLocations();
                            }

                            // Reset the form
                            document.activeElement.blur();
                            $('.valid').removeClass('valid');

                            _this3.set({
                                type: 0,
                                amount: '',
                                category: null,
                                location: null,
                                timestamp: '',
                                description: ''
                            });
                        }
                    }).fail(function () {
                        console.log('Error');
                    }).always(function () {
                        console.log('Finished');
                    });
                }
            });
        }
    });
    Component._name = 'NewTransaction';
    return Component;
}

},{"../../ractive/ractive-decorators-select2":11,"../../ractive/ractive-transitions-fade":14}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createComponent = createComponent;

var _ractiveTransitionsFade = require('../../ractive/ractive-transitions-fade');

var _ractiveTransitionsFade2 = _interopRequireDefault(_ractiveTransitionsFade);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Default component options and dataset
var defaultViewOptions = {
    id: '',
    data: {
        transaction: []
    }
};

function createComponent(TransactionDetailsView, parentViewOptions) {
    // Merging default component options with parent supplied options
    var viewOptions = $.extend(true, {}, defaultViewOptions, parentViewOptions);

    var Component = Ractive.components.TransactionDetails = TransactionDetailsView.extend({
        data: function data() {
            return viewOptions.data;
        },
        transitions: { fade: _ractiveTransitionsFade2.default },

        /**
         * Allows us to set proxy events and run other tasks when controller is initialized
         * @param  {array}  options  Array of options
         */
        oninit: function oninit(options) {
            var _this = this;

            console.log('Loading transaction');

            /* Load most recent transactions */
            $.ajax({
                method: 'GET',
                url: '/api/v1/transactions/' + viewOptions.id,
                data: {}
            }).done(function (response) {
                if (response.status === 'ok') {
                    _this.set('transaction', response.results);
                }
            }).fail(function () {
                console.log('Error');
            }).always(function () {
                console.log('Finished');
            });

            /* Proxy events */
            this.on({});
        }
    });
    Component._name = 'TransactionDetails';
    return Component;
}

},{"../../ractive/ractive-transitions-fade":14}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createComponent = createComponent;

var _ractiveEventsTap = require('../../ractive/ractive-events-tap');

var _ractiveEventsTap2 = _interopRequireDefault(_ractiveEventsTap);

var _ractiveTransitionsFade = require('../../ractive/ractive-transitions-fade');

var _ractiveTransitionsFade2 = _interopRequireDefault(_ractiveTransitionsFade);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Default component options and dataset
var defaultViewOptions = {
    count: 20, // @todo Currently loads most recent 20, integrate paging eventually
    data: {
        sortColumn: 'creationDate',
        transactions: [],
        transactionListTitle: 'Transaction list'
    }
};

function createComponent(TransactionListView, parentViewOptions) {
    // Merging default component options with parent supplied options
    var viewOptions = $.extend(true, {}, defaultViewOptions, parentViewOptions);

    var Component = Ractive.components.TransactionList = TransactionListView.extend({
        data: function data() {
            return viewOptions.data;
        },
        computed: {
            sortedTransactions: function sortedTransactions() {
                var column = this.get('sortColumn');
                return this.get('transactions').slice().sort(function (a, b) {
                    return a[column] < b[column] ? 1 : -1;
                });
            }
        },
        events: { tap: _ractiveEventsTap2.default },
        transitions: { fade: _ractiveTransitionsFade2.default },

        /**
         * Allows us to set proxy events and run other tasks when controller is initialized
         * @param  {array}  options  Array of options
         */
        oninit: function oninit(options) {
            var _this = this;

            console.log('Loading transactions');

            /* Load most recent transactions */
            $.ajax({
                method: 'GET',
                url: '/api/v1/transactions',
                data: {
                    count: viewOptions.count
                }
            }).done(function (response) {
                if (response.status === 'ok') {
                    _this.set('transactions', response.results);
                }
            }).fail(function () {
                console.log('Error');
            }).always(function () {
                console.log('Finished');
            });

            /* Proxy events */
            this.on({
                /**
                 * Sets the sorting column
                 * @param  {object}  event   Ractive event object
                 * @param  {object}  column  Column ident
                 */
                sort: function sort(event, column) {
                    _this.set('sortColumn', column);
                }
            });
        }
    });
    Component._name = 'TransactionList';
    return Component;
}

},{"../../ractive/ractive-events-tap":12,"../../ractive/ractive-transitions-fade":14}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ractiveLoad = require('../ractive/ractive-load');

var _ractiveLoad2 = _interopRequireDefault(_ractiveLoad);

var _ractive = require('../utils/ractive');

var _ractive2 = _interopRequireDefault(_ractive);

var _router = require('../plugins/router');

var _router2 = _interopRequireDefault(_router);

var _homePage = require('../components/home-page');

var HomePage = _interopRequireWildcard(_homePage);

var _listPage = require('../components/list-page');

var ListPage = _interopRequireWildcard(_listPage);

var _TransactionPage = require('../components/Transaction-page');

var TransactionPage = _interopRequireWildcard(_TransactionPage);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import UserPage from '../components/user-page';
// import UserModel from '../models/user';

var routes = new Map();

routes.set('/', function (context, next) {
    (0, _ractiveLoad2.default)('assets/views/home-page.html').then(function (HomeView) {
        HomePage.loadDependencies().then(function () {
            next(null, HomePage.createComponent(HomeView));
        });
    }).catch(_ractive2.default);
});

routes.set('/list', function (context, next) {
    (0, _ractiveLoad2.default)('assets/views/list-page.html').then(function (ListView) {
        ListPage.loadDependencies().then(function () {
            next(null, ListPage.createComponent(ListView));
        });
    }).catch(_ractive2.default);
});

routes.set('/transaction/:id', function (context, next) {
    var id = context.params.id;
    (0, _ractiveLoad2.default)('assets/views/transaction-page.html').then(function (TransactionView) {
        TransactionPage.loadDependencies({
            id: id
        }).then(function () {
            next(null, TransactionPage.createComponent(TransactionView));
        });
    }).catch(_ractive2.default);
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

exports.default = routes;

},{"../components/Transaction-page":5,"../components/home-page":2,"../components/list-page":4,"../plugins/router":10,"../ractive/ractive-load":13,"../utils/ractive":15}],10:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.init = init;
exports.navTo = navTo;

var _page = (typeof window !== "undefined" ? window['page'] : typeof global !== "undefined" ? global['page'] : null);

var _page2 = _interopRequireDefault(_page);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function navigationHandler(routeHandler, onNavigation) {
    return function (context /*, next*/) {
        routeHandler(context, function (error) {
            var PageComponent = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
            var data = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

            // if (!error && !Ractive.components[PageComponent._name]) { // I'm not proud of this
            //  Ractive.components[PageComponent._name] = PageComponent;
            // }

            context.pageName = PageComponent._name;
            context.state = data;
            onNavigation(error, context);
        });
    };
}

function init(routes, onNavigation) {

    routes.forEach(function (routeHandler, path) {
        (0, _page2.default)(path, navigationHandler(routeHandler, onNavigation));
    });

    (0, _page2.default)({
        // hashbang: true
    });
}

function navTo(url) {
    _page2.default.show(url);
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],11:[function(require,module,exports){
'use strict';

/*

    ractive-decorators-select2
    =============================================

    Integrate Ractive with Select2

    ==========================

    Troubleshooting: If you're using a module system in your app (AMD or
    something more nodey) then you may need to change the paths below,
    where it says `require( 'ractive' )` or `define([ 'ractive' ]...)`.

    ==========================

    Usage: Include this file on your page below Ractive, e.g:

        <script src='lib/ractive.js'></script>
        <script src='lib/ractive-decorators-select2.js'></script>

    Or, if you're using a module loader, require this module:

        // requiring the plugin will 'activate' it - no need to use
        // the return value
        require( 'ractive-decorators-select2' );

*/

(function (global, factory) {

    'use strict';

    // Common JS (i.e. browserify) environment

    if (typeof module !== 'undefined' && module.exports && typeof require === 'function') {
        factory((typeof window !== "undefined" ? window['Ractive'] : typeof global !== "undefined" ? global['Ractive'] : null), (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null));
    }

    // AMD?
    else if (typeof define === 'function' && define.amd) {
            define(['ractive', 'jquery'], factory);
        }

        // browser global
        else if (global.Ractive && global.jQuery) {
                factory(global.Ractive, global.jQuery);
            } else {
                throw new Error('Could not find Ractive or jQuery! They must be loaded before the ractive-decorators-select2 plugin');
            }
})(typeof window !== 'undefined' ? window : undefined, function (Ractive, $) {

    'use strict';

    var _select2Decorator;

    _select2Decorator = function select2Decorator(node, type) {

        var ractive = node._ractive.root || node._ractive.ractive;
        var setting = false;
        var observer;

        var options = {};
        if (type) {
            if (!_select2Decorator.type.hasOwnProperty(type)) {
                throw new Error('Ractive Select2 type "' + type + '" is not defined!');
            }

            options = _select2Decorator.type[type];
            if (typeof options === 'function') {
                options = options.call(this, node);
            }
        }

        // Push changes from ractive to select2
        if (node._ractive.binding) {
            var binding = node._ractive.binding;
            var keypath = binding.keypath ? binding.keypath.str : binding.model.key;
            observer = ractive.observe(keypath, function (newvalue) {
                console.log(keypath);
                console.log(newvalue);
                if (!setting) {
                    setting = true;
                    window.setTimeout(function () {
                        if (newvalue === "") $(node).select2("val", "");

                        $(node).change();
                        setting = false;
                    }, 0);
                }
            });
        }

        // Pull changes from select2 to ractive
        $(node).select2(options).on('change', function () {
            if (!setting) {
                setting = true;
                ractive.updateModel();
                setting = false;
            }
        });

        return {
            teardown: function teardown() {
                $(node).select2('destroy');

                if (observer) {
                    observer.cancel();
                }
            }
        };
    };

    _select2Decorator.type = {};

    Ractive.decorators.select2 = _select2Decorator;
});

},{}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var DISTANCE_THRESHOLD = 5; // maximum pixels pointer can move before cancel
var TIME_THRESHOLD = 400; // maximum milliseconds between down and up before cancel

function tap(node, callback) {
    return new TapHandler(node, callback);
}

function TapHandler(node, callback) {
    this.node = node;
    this.callback = callback;

    this.preventMousedownEvents = false;

    this.bind(node);
}

TapHandler.prototype = {
    bind: function bind(node) {
        // listen for mouse/pointer events...
        if (window.navigator.pointerEnabled) {
            node.addEventListener('pointerdown', handleMousedown, false);
        } else if (window.navigator.msPointerEnabled) {
            node.addEventListener('MSPointerDown', handleMousedown, false);
        } else {
            node.addEventListener('mousedown', handleMousedown, false);
        }

        // ...and touch events
        node.addEventListener('touchstart', handleTouchstart, false);

        // native buttons, and <input type='button'> elements, should fire a tap event
        // when the space key is pressed
        if (node.tagName === 'BUTTON' || node.type === 'button') {
            node.addEventListener('focus', handleFocus, false);
        }

        node.__tap_handler__ = this;
    },
    fire: function fire(event, x, y) {
        this.callback({
            node: this.node,
            original: event,
            x: x,
            y: y
        });
    },
    mousedown: function mousedown(event) {
        var _this = this;

        if (this.preventMousedownEvents) {
            return;
        }

        if (event.which !== undefined && event.which !== 1) {
            return;
        }

        var x = event.clientX;
        var y = event.clientY;

        // This will be null for mouse events.
        var pointerId = event.pointerId;

        var handleMouseup = function handleMouseup(event) {
            if (event.pointerId != pointerId) {
                return;
            }

            _this.fire(event, x, y);
            cancel();
        };

        var handleMousemove = function handleMousemove(event) {
            if (event.pointerId != pointerId) {
                return;
            }

            if (Math.abs(event.clientX - x) >= DISTANCE_THRESHOLD || Math.abs(event.clientY - y) >= DISTANCE_THRESHOLD) {
                cancel();
            }
        };

        var cancel = function cancel() {
            _this.node.removeEventListener('MSPointerUp', handleMouseup, false);
            document.removeEventListener('MSPointerMove', handleMousemove, false);
            document.removeEventListener('MSPointerCancel', cancel, false);
            _this.node.removeEventListener('pointerup', handleMouseup, false);
            document.removeEventListener('pointermove', handleMousemove, false);
            document.removeEventListener('pointercancel', cancel, false);
            _this.node.removeEventListener('click', handleMouseup, false);
            document.removeEventListener('mousemove', handleMousemove, false);
        };

        if (window.navigator.pointerEnabled) {
            this.node.addEventListener('pointerup', handleMouseup, false);
            document.addEventListener('pointermove', handleMousemove, false);
            document.addEventListener('pointercancel', cancel, false);
        } else if (window.navigator.msPointerEnabled) {
            this.node.addEventListener('MSPointerUp', handleMouseup, false);
            document.addEventListener('MSPointerMove', handleMousemove, false);
            document.addEventListener('MSPointerCancel', cancel, false);
        } else {
            this.node.addEventListener('click', handleMouseup, false);
            document.addEventListener('mousemove', handleMousemove, false);
        }

        setTimeout(cancel, TIME_THRESHOLD);
    },
    touchdown: function touchdown() {
        var _this2 = this;

        var touch = event.touches[0];

        var x = touch.clientX;
        var y = touch.clientY;

        var finger = touch.identifier;

        var handleTouchup = function handleTouchup(event) {
            var touch = event.changedTouches[0];

            if (touch.identifier !== finger) {
                cancel();
                return;
            }

            event.preventDefault(); // prevent compatibility mouse event

            // for the benefit of mobile Firefox and old Android browsers, we need this absurd hack.
            _this2.preventMousedownEvents = true;
            clearTimeout(_this2.preventMousedownTimeout);

            _this2.preventMousedownTimeout = setTimeout(function () {
                _this2.preventMousedownEvents = false;
            }, 400);

            _this2.fire(event, x, y);
            cancel();
        };

        var handleTouchmove = function handleTouchmove(event) {
            if (event.touches.length !== 1 || event.touches[0].identifier !== finger) {
                cancel();
            }

            var touch = event.touches[0];
            if (Math.abs(touch.clientX - x) >= DISTANCE_THRESHOLD || Math.abs(touch.clientY - y) >= DISTANCE_THRESHOLD) {
                cancel();
            }
        };

        var cancel = function cancel() {
            _this2.node.removeEventListener('touchend', handleTouchup, false);
            window.removeEventListener('touchmove', handleTouchmove, false);
            window.removeEventListener('touchcancel', cancel, false);
        };

        this.node.addEventListener('touchend', handleTouchup, false);
        window.addEventListener('touchmove', handleTouchmove, false);
        window.addEventListener('touchcancel', cancel, false);

        setTimeout(cancel, TIME_THRESHOLD);
    },
    teardown: function teardown() {
        var node = this.node;

        node.removeEventListener('pointerdown', handleMousedown, false);
        node.removeEventListener('MSPointerDown', handleMousedown, false);
        node.removeEventListener('mousedown', handleMousedown, false);
        node.removeEventListener('touchstart', handleTouchstart, false);
        node.removeEventListener('focus', handleFocus, false);
    }
};

function handleMousedown(event) {
    this.__tap_handler__.mousedown(event);
}

function handleTouchstart(event) {
    this.__tap_handler__.touchdown(event);
}

function handleFocus() {
    this.addEventListener('keydown', handleKeydown, false);
    this.addEventListener('blur', handleBlur, false);
}

function handleBlur() {
    this.removeEventListener('keydown', handleKeydown, false);
    this.removeEventListener('blur', handleBlur, false);
}

function handleKeydown(event) {
    if (event.which === 32) {
        // space key
        this.__tap_handler__.fire();
    }
}

exports.default = tap;

},{}],13:[function(require,module,exports){
(function (process,Buffer){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _ractive = (typeof window !== "undefined" ? window['Ractive'] : typeof global !== "undefined" ? global['Ractive'] : null);

var _ractive2 = _interopRequireDefault(_ractive);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getName(path) {
    var pathParts, filename, lastIndex;

    pathParts = path.split('/');
    filename = pathParts.pop();

    lastIndex = filename.lastIndexOf('.');
    if (lastIndex !== -1) {
        filename = filename.substr(0, lastIndex);
    }

    return filename;
}

/**
 * Finds the line and column position of character `char`
   in a (presumably) multi-line string
 * @param {array} lines - an array of strings, each representing
   a line of the original string
 * @param {number} char - the character index to convert
 * @returns {object}
     * @property {number} line - the zero-based line index
     * @property {number} column - the zero-based column index
     * @property {number} char - the character index that was passed in
 */
function getLinePosition(lines, char) {
    var line = 0;
    var lineStart = 0;

    var lineEnds = lines.map(function (line) {
        var lineEnd = lineStart + line.length + 1; // +1 for the newline

        lineStart = lineEnd;
        return lineEnd;
    });

    lineStart = 0;

    while (char >= lineEnds[line]) {
        lineStart = lineEnds[line];
        line += 1;
    }

    var column = char - lineStart;
    return { line: line, column: column, char: char };
}

var requirePattern = /require\s*\(\s*(?:"([^"]+)"|'([^']+)')\s*\)/g;
var TEMPLATE_VERSION = 3;

function parse(source) {
    var parsed, template, links, imports, scriptItem, script, styles, match, modules, i, item, result;

    if (!rcu.Ractive) {
        throw new Error('rcu has not been initialised! You must call rcu.init(Ractive) before rcu.parse()');
    }

    parsed = rcu.Ractive.parse(source, {
        noStringify: true,
        interpolate: { script: false, style: false },
        includeLinePositions: true
    });

    if (parsed.v !== TEMPLATE_VERSION) {
        throw new Error('Mismatched template version (expected ' + TEMPLATE_VERSION + ', got ' + parsed.v + ')! Please ensure you are using the latest version of Ractive.js in your build process as well as in your app');
    }

    links = [];
    styles = [];
    modules = [];

    // Extract certain top-level nodes from the template. We work backwards
    // so that we can easily splice them out as we go
    template = parsed.t;
    i = template.length;
    while (i--) {
        item = template[i];

        if (item && item.t === 7) {
            if (item.e === 'link' && item.a && item.a.rel === 'ractive') {
                links.push(template.splice(i, 1)[0]);
            }

            if (item.e === 'script' && (!item.a || !item.a.type || item.a.type === 'text/javascript')) {
                if (scriptItem) {
                    throw new Error('You can only have one <script> tag per component file');
                }
                scriptItem = template.splice(i, 1)[0];
            }

            if (item.e === 'style' && (!item.a || !item.a.type || item.a.type === 'text/css')) {
                styles.push(template.splice(i, 1)[0]);
            }
        }
    }

    // Clean up template - trim whitespace left over from the removal
    // of <link>, <style> and <script> tags from start...
    while (/^\s*$/.test(template[0])) {
        template.shift();
    }

    // ...and end
    while (/^\s*$/.test(template[template.length - 1])) {
        template.pop();
    }

    // Extract names from links
    imports = links.map(function (link) {
        var href = link.a.href;
        var name = link.a.name || getName(href);

        if (typeof name !== 'string') {
            throw new Error('Error parsing link tag');
        }

        return { name: name, href: href };
    });

    result = {
        source: source, imports: imports, modules: modules,
        template: parsed,
        css: styles.map(extractFragment).join(' '),
        script: ''
    };

    // extract position information, so that we can generate source maps
    if (scriptItem) {
        var content = scriptItem.f[0];

        var contentStart = source.indexOf('>', scriptItem.p[2]) + 1;

        // we have to jump through some hoops to find contentEnd, because the contents
        // of the <script> tag get trimmed at parse time
        var contentEnd = contentStart + content.length + source.slice(contentStart).replace(content, '').indexOf('</script');

        var lines = source.split('\n');

        result.scriptStart = getLinePosition(lines, contentStart);
        result.scriptEnd = getLinePosition(lines, contentEnd);

        result.script = source.slice(contentStart, contentEnd);

        while (match = requirePattern.exec(result.script)) {
            modules.push(match[1] || match[2]);
        }
    }

    return result;
}

function extractFragment(item) {
    return item.f;
}

var _eval;
var isBrowser;
var isNode;
var head;
var Module;
var base64Encode;
var SOURCE_MAPPING_URL = 'sourceMappingUrl';
var DATA = 'data';

// This causes code to be eval'd in the global scope
_eval = eval;

if (typeof document !== 'undefined') {
    isBrowser = true;
    head = document.getElementsByTagName('head')[0];
} else if (typeof process !== 'undefined') {
    isNode = true;
    Module = (require.nodeRequire || require)('module');
}

if (typeof btoa === 'function') {
    base64Encode = function base64Encode(str) {
        str = str.replace(/[^\x00-\x7F]/g, function (char) {
            var hex = char.charCodeAt(0).toString(16);
            while (hex.length < 4) {
                hex = '0' + hex;
            }return '\\u' + hex;
        });

        return btoa(str);
    };
} else if (typeof Buffer === 'function') {
    base64Encode = function base64Encode(str) {
        return new Buffer(str, 'utf-8').toString('base64');
    };
} else {
    base64Encode = function base64Encode() {};
}

function eval2(script, options) {
    options = options || {};

    if (options.sourceMap) {
        script += '\n//# ' + SOURCE_MAPPING_URL + '=data:application/json;charset=utf-8;base64,' + base64Encode(JSON.stringify(options.sourceMap));
    } else if (options.sourceURL) {
        script += '\n//# sourceURL=' + options.sourceURL;
    }

    try {
        return _eval(script);
    } catch (err) {
        if (isNode) {
            locateErrorUsingModule(script, options.sourceURL || '');
            return;
        }

        // In browsers, only locate syntax errors. Other errors can
        // be located via the console in the normal fashion
        else if (isBrowser && err.name === 'SyntaxError') {
                locateErrorUsingDataUri(script);
            }

        throw err;
    }
}

eval2.Function = function () {
    var arguments$1 = arguments;

    var i,
        args = [],
        body,
        wrapped,
        options;

    i = arguments.length;
    while (i--) {
        args[i] = arguments$1[i];
    }

    if (_typeof(args[args.length - 1]) === 'object') {
        options = args.pop();
    } else {
        options = {};
    }

    // allow an array of arguments to be passed
    if (args.length === 1 && Object.prototype.toString.call(args) === '[object Array]') {
        args = args[0];
    }

    if (options.sourceMap) {
        options.sourceMap = clone(options.sourceMap);

        // shift everything a line down, to accommodate `(function (...) {`
        options.sourceMap.mappings = ';' + options.sourceMap.mappings;
    }

    body = args.pop();
    wrapped = '(function (' + args.join(', ') + ') {\n' + body + '\n})';

    return eval2(wrapped, options);
};

function locateErrorUsingDataUri(code) {
    var dataURI, scriptElement;

    dataURI = DATA + ':text/javascript;charset=utf-8,' + encodeURIComponent(code);

    scriptElement = document.createElement('script');
    scriptElement.src = dataURI;

    scriptElement.onload = function () {
        head.removeChild(scriptElement);
    };

    head.appendChild(scriptElement);
}

function locateErrorUsingModule(code, url) {
    var m = new Module();

    try {
        m._compile('module.exports = function () {\n' + code + '\n};', url);
    } catch (err) {
        console.error(err);
        return;
    }

    m.exports();
}

function clone(obj) {
    var cloned = {},
        key;

    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            cloned[key] = obj[key];
        }
    }

    return cloned;
}

var charToInteger = {};
var integerToChar = {};

'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='.split('').forEach(function (char, i) {
    charToInteger[char] = i;
    integerToChar[i] = char;
});

function encode(value) {
    var result, i;

    if (typeof value === 'number') {
        result = encodeInteger(value);
    } else {
        result = '';
        for (i = 0; i < value.length; i += 1) {
            result += encodeInteger(value[i]);
        }
    }

    return result;
}

function encodeInteger(num) {
    var result = '',
        clamped;

    if (num < 0) {
        num = -num << 1 | 1;
    } else {
        num <<= 1;
    }

    do {
        clamped = num & 31;
        num >>= 5;

        if (num > 0) {
            clamped |= 32;
        }

        result += integerToChar[clamped];
    } while (num > 0);

    return result;
}

/**
 * Encodes a string as base64
 * @param {string} str - the string to encode
 * @returns {string}
 */
function btoa$1(str) {
    return new Buffer(str).toString('base64');
}

var SourceMap = function SourceMap(properties) {
    this.version = 3;

    this.file = properties.file;
    this.sources = properties.sources;
    this.sourcesContent = properties.sourcesContent;
    this.names = properties.names;
    this.mappings = properties.mappings;
};

SourceMap.prototype = {
    toString: function toString() {
        return JSON.stringify(this);
    },

    toUrl: function toUrl() {
        return 'data:application/json;charset=utf-8;base64,' + btoa$1(this.toString());
    }
};

var alreadyWarned = false;

/**
 * Generates a v3 sourcemap between an original source and its built form
 * @param {object} definition - the result of `rcu.parse( originalSource )`
 * @param {object} options
 * @param {string} options.source - the name of the original source file
 * @param {number=} options.offset - the number of lines in the generated
   code that precede the script portion of the original source
 * @param {string=} options.file - the name of the generated file
 * @returns {object}
 */
function generateSourceMap(definition, options) {
    var lines, mappings, offset;

    if (!options || !options.source) {
        throw new Error('You must supply an options object with a `source` property to rcu.generateSourceMap()');
    }

    if ('padding' in options) {
        options.offset = options.padding;

        if (!alreadyWarned) {
            console.log('rcu: options.padding is deprecated, use options.offset instead');
            alreadyWarned = true;
        }
    }

    // The generated code probably includes a load of module gubbins - we don't bother
    // mapping that to anything, instead we just have a bunch of empty lines
    offset = new Array((options.offset || 0) + 1).join(';');

    lines = definition.script.split('\n');
    mappings = offset + lines.map(function (line, i) {
        if (i === 0) {
            // first mapping points to code immediately following opening <script> tag
            return encode([0, 0, definition.scriptStart.line, definition.scriptStart.column]);
        }

        if (i === 1) {
            return encode([0, 0, 1, -definition.scriptStart.column]);
        }

        return 'AACA'; // equates to [ 0, 0, 1, 0 ];
    }).join(';');

    return new SourceMap({
        file: options.file,
        sources: [options.source],
        sourcesContent: [definition.source],
        names: [],
        mappings: mappings
    });
}

function make(source, config, callback, errback) {
    var definition, url, createComponent, loadImport, imports, loadModule, modules, remainingDependencies, onloaded, ready;

    config = config || {};

    // Implementation-specific config
    url = config.url || '';
    loadImport = config.loadImport;
    loadModule = config.loadModule;

    definition = parse(source);

    createComponent = function createComponent() {
        var options, Component, factory, component, exports, prop;

        options = {
            template: definition.template,
            partials: definition.partials,
            css: definition.css,
            components: imports
        };

        if (definition.script) {
            var sourceMap = generateSourceMap(definition, {
                source: url,
                content: source
            });

            try {
                factory = new eval2.Function('component', 'require', 'Ractive', definition.script, {
                    sourceMap: sourceMap
                });

                component = {};
                factory(component, config.require, rcu.Ractive);
                exports = component.exports;

                if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {
                    for (prop in exports) {
                        if (exports.hasOwnProperty(prop)) {
                            options[prop] = exports[prop];
                        }
                    }
                }

                Component = rcu.Ractive.extend(options);
            } catch (err) {
                errback(err);
                return;
            }

            callback(Component);
        } else {
            Component = rcu.Ractive.extend(options);
            callback(Component);
        }
    };

    // If the definition includes sub-components e.g.
    //     <link rel='ractive' href='foo.html'>
    //
    // ...then we need to load them first, using the loadImport method
    // specified by the implementation.
    //
    // In some environments (e.g. AMD) the same goes for modules, which
    // most be loaded before the script can execute
    remainingDependencies = definition.imports.length + (loadModule ? definition.modules.length : 0);

    if (remainingDependencies) {
        onloaded = function onloaded() {
            if (! --remainingDependencies) {
                if (ready) {
                    createComponent();
                } else {
                    setTimeout(createComponent, 0); // cheap way to enforce asynchrony for a non-Zalgoesque API
                }
            }
        };

        if (definition.imports.length) {
            if (!loadImport) {
                throw new Error('Component definition includes imports (e.g. `<link rel="ractive" href="' + definition.imports[0].href + '">`) but no loadImport method was passed to rcu.make()');
            }

            imports = {};

            definition.imports.forEach(function (toImport) {
                loadImport(toImport.name, toImport.href, url, function (Component) {
                    imports[toImport.name] = Component;
                    onloaded();
                });
            });
        }

        if (loadModule && definition.modules.length) {
            modules = {};

            definition.modules.forEach(function (name) {
                loadModule(name, name, url, function (Component) {
                    modules[name] = Component;
                    onloaded();
                });
            });
        }
    } else {
        setTimeout(createComponent, 0);
    }

    ready = true;
}

function resolvePath(relativePath, base) {
    var pathParts, relativePathParts, part;

    // If we've got an absolute path, or base is '', return
    // relativePath
    if (!base || relativePath.charAt(0) === '/') {
        return relativePath;
    }

    // 'foo/bar/baz.html' -> ['foo', 'bar', 'baz.html']
    pathParts = (base || '').split('/');
    relativePathParts = relativePath.split('/');

    // ['foo', 'bar', 'baz.html'] -> ['foo', 'bar']
    pathParts.pop();

    while (part = relativePathParts.shift()) {
        if (part === '..') {
            pathParts.pop();
        } else if (part !== '.') {
            pathParts.push(part);
        }
    }

    return pathParts.join('/');
}

var rcu = {
    init: function init(copy) {
        rcu.Ractive = copy;
    },

    parse: parse,
    make: make,
    generateSourceMap: generateSourceMap,
    resolve: resolvePath,
    getName: getName
};

var get;

// Test for XHR to see if we're in a browser...
if (typeof XMLHttpRequest !== 'undefined') {
    get = function get(url) {
        return new _ractive2.default.Promise(function (fulfil, reject) {
            var xhr, onload, loaded;

            xhr = new XMLHttpRequest();
            xhr.open('GET', url);

            onload = function onload() {
                if (xhr.readyState !== 4 || loaded) {
                    return;
                }

                fulfil(xhr.responseText);
                loaded = true;
            };

            xhr.onload = xhr.onreadystatechange = onload;
            xhr.onerror = reject;
            xhr.send();

            if (xhr.readyState === 4) {
                onload();
            }
        });
    };
}

// ...or in node.js
else {
        get = function get(url) {
            return new _ractive2.default.Promise(function (fulfil, reject) {
                require('fs').readFile(url, function (err, result) {
                    if (err) {
                        return reject(err);
                    }

                    fulfil(result.toString());
                });
            });
        };
    }

var get$1 = get;

var promises = {};
var global = typeof window !== 'undefined' ? window : {};
// Load a single component:
//
//     Ractive.load( 'path/to/foo' ).then( function ( Foo ) {
//       var foo = new Foo(...);
//     });
function loadSingle(path, parentUrl, baseUrl, cache) {
    var promise, url;

    url = rcu.resolve(path, path[0] === '.' ? parentUrl : baseUrl);

    // if this component has already been requested, don't
    // request it again
    if (!cache || !promises[url]) {
        promise = get$1(url).then(function (template) {
            return new _ractive2.default.Promise(function (fulfil, reject) {
                rcu.make(template, {
                    url: url,
                    loadImport: function loadImport(name, path, parentUrl, callback) {
                        // if import has a relative URL, it should resolve
                        // relative to this (parent). Otherwise, relative
                        // to load.baseUrl
                        loadSingle(path, parentUrl, baseUrl, cache).then(callback, reject);
                    },
                    require: ractiveRequire
                }, fulfil, reject);
            });
        });

        promises[url] = promise;
    }

    return promises[url];
}

function ractiveRequire(name) {
    var dependency, qualified;

    dependency = load.modules.hasOwnProperty(name) ? load.modules[name] : global.hasOwnProperty(name) ? global[name] : null;

    if (!dependency && typeof require === 'function') {
        try {
            dependency = require(name);
        } catch (e) {
            if (typeof process !== 'undefined') {
                dependency = require(process.cwd() + '/' + name);
            } else {
                throw e;
            }
        }
    }

    if (!dependency) {
        qualified = !/^[$_a-zA-Z][$_a-zA-Z0-9]*$/.test(name) ? '["' + name + '"]' : '.' + name;
        throw new Error('Ractive.load() error: Could not find dependency "' + name + '". It should be exposed as Ractive.load.modules' + qualified + ' or window' + qualified);
    }

    return dependency;
}

// Create globally-available components from links found on the page:
//
//     <link rel='ractive' href='path/to/foo.html'>
//
// You can optionally add a name attribute, otherwise the file name (in
// the example above, 'foo') will be used instead. The component will
// be available as `Ractive.components.foo`:
//
//     Ractive.load().then( function () {
//       var foo = new Ractive.components.foo(...);
//     });
function loadFromLinks(baseUrl, cache) {
    var promise = new _ractive2.default.Promise(function (resolve, reject) {
        var links, pending;

        links = toArray(document.querySelectorAll('link[rel="ractive"]'));
        pending = links.length;

        links.forEach(function (link) {
            var name = getNameFromLink(link);

            loadSingle(link.getAttribute('href'), '', baseUrl, cache).then(function (Component) {
                _ractive2.default.components[name] = Component;

                if (! --pending) {
                    resolve();
                }
            }, reject);
        });
    });

    return promise;
}

function getNameFromLink(link) {
    return link.getAttribute('name') || rcu.getName(link.getAttribute('href'));
}

function toArray(arrayLike) {
    var arr = [],
        i = arrayLike.length;

    while (i--) {
        arr[i] = arrayLike[i];
    }

    return arr;
}

// Load multiple components:
//
//     Ractive.load({
//       foo: 'path/to/foo.html',
//       bar: 'path/to/bar.html'
//     }).then( function ( components ) {
//       var foo = new components.foo(...);
//       var bar = new components.bar(...);
//     });
function loadMultiple(map, baseUrl, cache) {
    var promise = new _ractive2.default.Promise(function (resolve, reject) {
        var pending = 0,
            result = {},
            name,
            load;

        load = function load(name) {
            var path = map[name];

            loadSingle(path, baseUrl, baseUrl, cache).then(function (Component) {
                result[name] = Component;

                if (! --pending) {
                    resolve(result);
                }
            }, reject);
        };

        for (name in map) {
            if (map.hasOwnProperty(name)) {
                pending += 1;
                load(name);
            }
        }
    });

    return promise;
}

rcu.init(_ractive2.default);

function load(url) {
    var baseUrl = load.baseUrl;
    var cache = load.cache !== false;

    if (!url) {
        return loadFromLinks(baseUrl, cache);
    }

    if ((typeof url === 'undefined' ? 'undefined' : _typeof(url)) === 'object') {
        return loadMultiple(url, baseUrl, cache);
    }

    return loadSingle(url, baseUrl, baseUrl, cache);
}

load.baseUrl = '';
load.modules = {};

exports.default = load;

}).call(this,require('_process'),require("buffer").Buffer)
},{"_process":21,"buffer":18,"fs":17}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var DEFAULTS = {
    delay: 0,
    duration: 300,
    easing: 'linear'
};

function fade(t, params) {
    var targetOpacity;

    params = t.processParams(params, DEFAULTS);

    if (t.isIntro) {
        targetOpacity = t.getStyle('opacity');
        t.setStyle('opacity', 0);
    } else {
        targetOpacity = 0;
    }

    t.animateStyle('opacity', targetOpacity, params).then(t.complete);
}

exports.default = fade;

},{}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

/**
 * Catches Ractive Load errors
 * The setTimeout ensures the error doesn't get swallowed (this can be a problem with promises...)
 * @param  {Object} err
 */
function ractiveLoadCatch(err) {
    setTimeout(function () {
        throw err;
    });
}

exports.ractiveLoadCatch = ractiveLoadCatch;

},{}],16:[function(require,module,exports){
'use strict'

exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

function init () {
  var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
  for (var i = 0, len = code.length; i < len; ++i) {
    lookup[i] = code[i]
    revLookup[code.charCodeAt(i)] = i
  }

  revLookup['-'.charCodeAt(0)] = 62
  revLookup['_'.charCodeAt(0)] = 63
}

init()

function toByteArray (b64) {
  var i, j, l, tmp, placeHolders, arr
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  placeHolders = b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0

  // base64 is 4/3 + up to two characters of the original data
  arr = new Arr(len * 3 / 4 - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}

},{}],17:[function(require,module,exports){

},{}],18:[function(require,module,exports){
(function (global){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('isarray')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.foo = function () { return 42 }
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; i++) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  that.write(string, encoding)
  return that
}

function fromArrayLike (that, array) {
  var length = checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; i++) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'binary':
      // Deprecated
      case 'raw':
      case 'raws':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'binary':
        return binarySlice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

function arrayIndexOf (arr, val, byteOffset, encoding) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var foundIndex = -1
  for (var i = 0; byteOffset + i < arrLength; i++) {
    if (read(arr, byteOffset + i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
      if (foundIndex === -1) foundIndex = i
      if (i - foundIndex + 1 === valLength) return (byteOffset + foundIndex) * indexSize
    } else {
      if (foundIndex !== -1) i -= i - foundIndex
      foundIndex = -1
    }
  }
  return -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset >>= 0

  if (this.length === 0) return -1
  if (byteOffset >= this.length) return -1

  // Negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = Math.max(this.length + byteOffset, 0)

  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  if (Buffer.isBuffer(val)) {
    // special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(this, val, byteOffset, encoding)
  }
  if (typeof val === 'number') {
    if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === 'function') {
      return Uint8Array.prototype.indexOf.call(this, val, byteOffset)
    }
    return arrayIndexOf(this, [ val ], byteOffset, encoding)
  }

  throw new TypeError('val must be string, number or Buffer')
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new Error('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function binaryWrite (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'binary':
        return binaryWrite(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function binarySlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; i--) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; i++) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; i++) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; i++) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; i++) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"base64-js":16,"ieee754":19,"isarray":20}],19:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],20:[function(require,module,exports){
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}],21:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it don't break things.
var cachedSetTimeout = setTimeout;
var cachedClearTimeout = clearTimeout;

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = cachedSetTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    cachedClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        cachedSetTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[1]);

//# sourceMappingURL=app.js.map
