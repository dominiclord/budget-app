define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    'use strict';

    var Transaction = Backbone.Model.extend({

        defaults: {
            amount: '',
            category: '',
            timestamp: '',
            description: ''
        },

        validate: function (attrs, options) {
            var response = {
                status: 'OK',
                fields: []
            };

            if (attrs.amount.length === 0) {
                response.fields.push('amount');
                response.status = 'ERROR';
            }

            if (attrs.category.length === 0) {
                response.fields.push('category');
                response.status = 'ERROR';
            }

            if (attrs.timestamp.length === 0) {
                response.fields.push('timestamp');
                response.status = 'ERROR';
            }
            console.log(response);

            if (response.status !== 'OK') {
                return response;
            }
        }
    });

    return Transaction;
});