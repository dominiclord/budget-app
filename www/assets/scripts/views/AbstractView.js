/*global define*/
define([
    'jquery',
    'underscore',
    'backbone',
    'common',
    'mustache',
    'text!../../templates/partial.header.mustache'
], function ($, _, Backbone, Common, Mustache, PartialHeader) {
    'use strict';

    var AbstractView = Backbone.View.extend({

        //el: '#app',
        //model: null,
        //template: null,
        //applyTemplatePlugins: true,
        //partials: {
        //    header: PartialHeader
        //},

        //render: function() {
        //    return this.renderView();
        //},

        /**
         * Abstracting default render to add support for partials
         * @see    https://gist.github.com/c4urself/1891974
         */
        renderView: function(el, template, model, partials) {
            el = el || this.el;
            template = template || this.template;
            model = model || this.model;
            partials = $.extend({}, this.partials, partials);

            if (!el) {
                throw new Error('el must be defined in view or as parameter');
            }
            if (!template) {
                throw new Error('template must be defined in view or as parameter');
            }

            if (model instanceof Backbone.Model || model instanceof Backbone.Collection) {
                model = model.toJSON();
            }

            //this.addTemplateHelperFunctions(model);
            $(el).html(Mustache.render(template, model, partials));
            //this.applyTemplatePluginsToView();

            return this;
        }
    });

    return AbstractView;
});