/*global define*/
define([
    'jquery',
    'underscore',
    'backbone',
    'mustache',
    'common'
], function ($, _, Backbone, Mustache, Common) {
    'use strict';

    // Our overall **AppView** is the top-level piece of UI.
    var AppView = Backbone.View.extend({

        // Instead of generating a new element, bind to the existing skeleton of
        // the App already present in the HTML.
        el: '#todoapp',

        // Compile our stats template
        // template: _.template(statsTemplate),

        // Delegated events for creating new items, and clearing completed ones.
        events: {
        },

        // At initialization we bind to the relevant events on the `Todos`
        // collection, when items are added or changed. Kick things off by
        // loading any preexisting todos that might be saved in *localStorage*.
        initialize: function () {
        },

        // Re-rendering the App just means refreshing the statistics -- the rest
        // of the app doesn't change.
        render: function () {
        },

        // Add a single todo item to the list by creating a view for it, and
        // appending its element to the `<ul>`.
        addOne: function (todo) {
        },

        // Add all items in the **Todos** collection at once.
        addAll: function () {
        },

        filterOne: function (todo) {
        },

        filterAll: function () {
        },

        // Generate the attributes for a new Todo item.
        newAttributes: function () {
        },

        // If you hit return in the main input field, create new **Todo** model,
        // persisting it to *localStorage*.
        createOnEnter: function (e) {
        },

        // Clear all completed todo items, destroying their models.
        clearCompleted: function () {
        },

        toggleAllComplete: function () {
        }
    });

    return AppView;
});