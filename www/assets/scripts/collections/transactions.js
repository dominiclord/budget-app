/*global define */
define([
    'underscore',
    'backbone',
    'models/transaction'
], function (_, Backbone, transaction) {
    'use strict';

    var Transactions = Backbone.Collection.extend({
        model: transaction,

        parse: function(resp, options) {
            return resp.results;
        },

        url: function () {
            return '/api/v1/transactions';
        }
    });

    return new Transactions();
});