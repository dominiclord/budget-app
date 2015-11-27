/*global define*/
'use strict';

define([
    'jquery',
    'materialize'
], function ($, materialize) {
    $.fn.serializeObject = function() {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function() {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };

    // @todo figure out why this doesn't work automatically
    Waves.displayEffect();

    return {
        ENTER_KEY: 13,
        ESCAPE_KEY: 27
    };
});