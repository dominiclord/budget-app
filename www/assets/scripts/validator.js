(function() {
/**
 * @license almond 0.3.1 Copyright (c) 2011-2014, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*jslint sloppy: true */
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
    var main, req, makeMap, handlers,
        defined = {},
        waiting = {},
        config = {},
        defining = {},
        hasOwn = Object.prototype.hasOwnProperty,
        aps = [].slice,
        jsSuffixRegExp = /\.js$/;

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var nameParts, nameSegment, mapValue, foundMap, lastIndex,
            foundI, foundStarMap, starI, i, j, part,
            baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {};

        //Adjust any relative paths.
        if (name && name.charAt(0) === ".") {
            //If have a base name, try to normalize against it,
            //otherwise, assume it is a top-level require that will
            //be relative to baseUrl in the end.
            if (baseName) {
                name = name.split('/');
                lastIndex = name.length - 1;

                // Node .js allowance:
                if (config.nodeIdCompat && jsSuffixRegExp.test(name[lastIndex])) {
                    name[lastIndex] = name[lastIndex].replace(jsSuffixRegExp, '');
                }

                //Lop off the last part of baseParts, so that . matches the
                //"directory" and not name of the baseName's module. For instance,
                //baseName of "one/two/three", maps to "one/two/three.js", but we
                //want the directory, "one/two" for this normalization.
                name = baseParts.slice(0, baseParts.length - 1).concat(name);

                //start trimDots
                for (i = 0; i < name.length; i += 1) {
                    part = name[i];
                    if (part === ".") {
                        name.splice(i, 1);
                        i -= 1;
                    } else if (part === "..") {
                        if (i === 1 && (name[2] === '..' || name[0] === '..')) {
                            //End of the line. Keep at least one non-dot
                            //path segment at the front so it can be mapped
                            //correctly to disk. Otherwise, there is likely
                            //no path mapping for a path starting with '..'.
                            //This can still fail, but catches the most reasonable
                            //uses of ..
                            break;
                        } else if (i > 0) {
                            name.splice(i - 1, 2);
                            i -= 2;
                        }
                    }
                }
                //end trimDots

                name = name.join("/");
            } else if (name.indexOf('./') === 0) {
                // No baseName, so this is ID is resolved relative
                // to baseUrl, pull off the leading dot.
                name = name.substring(2);
            }
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has  config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                foundI = i;
                                break;
                            }
                        }
                    }
                }

                if (foundMap) {
                    break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                    foundStarMap = starMap[nameSegment];
                    starI = i;
                }
            }

            if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
            }

            if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            var args = aps.call(arguments, 0);

            //If first arg is not require('string'), and there is only
            //one arg, it is the array form without a callback. Insert
            //a null so that the following concat is correct.
            if (typeof args[0] !== 'string' && args.length === 1) {
                args.push(null);
            }
            return req.apply(undef, args.concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (hasProp(waiting, name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!hasProp(defined, name) && !hasProp(defining, name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    //Turns a plugin!resource to [plugin, resource]
    //with the plugin being undefined if the name
    //did not have a plugin prefix.
    function splitPrefix(name) {
        var prefix,
            index = name ? name.indexOf('!') : -1;
        if (index > -1) {
            prefix = name.substring(0, index);
            name = name.substring(index + 1, name.length);
        }
        return [prefix, name];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    makeMap = function (name, relName) {
        var plugin,
            parts = splitPrefix(name),
            prefix = parts[0];

        name = parts[1];

        if (prefix) {
            prefix = normalize(prefix, relName);
            plugin = callDep(prefix);
        }

        //Normalize according
        if (prefix) {
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relName));
            } else {
                name = normalize(name, relName);
            }
        } else {
            name = normalize(name, relName);
            parts = splitPrefix(name);
            prefix = parts[0];
            name = parts[1];
            if (prefix) {
                plugin = callDep(prefix);
            }
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            pr: prefix,
            p: plugin
        };
    };

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    handlers = {
        require: function (name) {
            return makeRequire(name);
        },
        exports: function (name) {
            var e = defined[name];
            if (typeof e !== 'undefined') {
                return e;
            } else {
                return (defined[name] = {});
            }
        },
        module: function (name) {
            return {
                id: name,
                uri: '',
                exports: defined[name],
                config: makeConfig(name)
            };
        }
    };

    main = function (name, deps, callback, relName) {
        var cjsModule, depName, ret, map, i,
            args = [],
            callbackType = typeof callback,
            usingExports;

        //Use name if no relName
        relName = relName || name;

        //Call the callback to define the module, if necessary.
        if (callbackType === 'undefined' || callbackType === 'function') {
            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relName);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = handlers.require(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = handlers.exports(name);
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = handlers.module(name);
                } else if (hasProp(defined, depName) ||
                           hasProp(waiting, depName) ||
                           hasProp(defining, depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback ? callback.apply(defined[name], args) : undefined;

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                        cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
        if (typeof deps === "string") {
            if (handlers[deps]) {
                //callback in this case is really relName
                return handlers[deps](callback);
            }
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, callback).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (config.deps) {
                req(config.deps, config.callback);
            }
            if (!callback) {
                return;
            }

            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support require(['a'])
        callback = callback || function () {};

        //If relName is a function, it is an errback handler,
        //so remove it.
        if (typeof relName === 'function') {
            relName = forceSync;
            forceSync = alt;
        }

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            //Using a non-zero value because of concern for what old browsers
            //do, and latest browsers "upgrade" to 4 if lower value is used:
            //http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout:
            //If want a value immediately, use require('id') instead -- something
            //that works in almond on the global level, but not guaranteed and
            //unlikely to work in other AMD implementations.
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 4);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function (cfg) {
        return req(cfg);
    };

    /**
     * Expose module registry for debugging and tooling
     */
    requirejs._defined = defined;

    define = function (name, deps, callback) {
        if (typeof name !== 'string') {
            throw new Error('See almond README: incorrect module build, no module name');
        }

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        if (!hasProp(defined, name) && !hasProp(waiting, name)) {
            waiting[name] = [name, deps, callback];
        }
    };

    define.amd = {
        jQuery: true
    };
}());

define("bower_components/almond/almond", function(){});

define('rv',{load: function(id){throw new Error("Dynamic load not allowed: " + id);}});

define("rv!lib/template",[],function(){return { v:3,
  t:[ { t:7,
      e:"div",
      a:{ "class":"ractive-validator-container" },
      f:[ { t:7,
          e:"style",
          f:[ ".",
            { t:2,
              r:"name" },
            ".ractive-validator {\n      width:",
            { t:2,
              r:"width" },
            "px;\n      top:",
            { t:2,
              r:"top" },
            "px;\n      left:",
            { t:2,
              r:"left" },
            "px;\n    }\n\n    .",
            { t:2,
              r:"name" },
            ".ractive-validator .rv-message {\n      min-height: ",
            { t:2,
              x:{ r:[ "height" ],
                s:"_0-10" } },
            "px;\n    }\n",
            { t:4,
              f:[ "      .",
                { t:2,
                  r:"name" },
                ".ractive-validator .rv-message:after,\n      .",
                { t:2,
                  r:"name" },
                ".ractive-validator .rv-message:before {\n        top: ",
                { t:2,
                  x:{ r:[ "height" ],
                    s:"_0/2" } },
                "px;\n      }\n" ],
              n:50,
              x:{ r:[ "options.orientation" ],
                s:"_0==\"left\"||_0==\"right\"" } },
            "    ",
            { t:4,
              f:[ "\n      .",
                { t:2,
                  r:"name" },
                ".ractive-validator .rv-message {\n        top: ",
                { t:2,
                  r:"height" },
                "px;\n      }\n" ],
              n:50,
              x:{ r:[ "options.orientation" ],
                s:"_0==\"bottom\"" } },
            "    .",
            { t:2,
              r:"name" },
            ".ractive-validator .rv-alert {\n      top: ",
            { t:2,
              x:{ r:[ "height" ],
                s:"_0/2" } },
            "px;\n      margin-top: -",
            { t:2,
              x:{ r:[ "alert.width" ],
                s:"_0/2" } },
            "px;\n      height: ",
            { t:2,
              r:"alert.width" },
            "px;\n      line-height: ",
            { t:2,
              r:"alert.width" },
            "px;\n      width: ",
            { t:2,
              r:"alert.width" },
            "px;\n    }" ] },
        " ",
        { t:7,
          e:"div",
          a:{ "class":[ { t:2,
                r:"name" },
              " ",
              { t:2,
                r:"options.class" },
              " rv-orient-",
              { t:2,
                r:"options.orientation" },
              " ractive-validator" ],
            style:[ "width:",
              { t:2,
                r:"width" },
              "px;top:",
              { t:2,
                r:"top" },
              "px;left:",
              { t:2,
                r:"left" },
              "px" ] },
          f:[ { t:4,
              f:[ { t:7,
                  e:"div",
                  a:{ "class":"rv-message",
                    style:[ "display:",
                      { t:2,
                        x:{ r:[ "active" ],
                          s:"_0?\"block\":\"none\"" } } ] },
                  f:[ { t:2,
                      r:"message" } ] },
                " ",
                { t:7,
                  e:"div",
                  a:{ "class":"rv-alert",
                    style:[ "display:",
                      { t:2,
                        x:{ r:[ "active" ],
                          s:"_0?\"none\":\"block\"" } } ] },
                  v:{ click:"alert-click" },
                  f:[ "!" ] } ],
              n:51,
              r:"valid" } ] } ] } ] };});
;
define('css',{load: function(id){throw new Error("Dynamic load not allowed: " + id);}});

define('css!lib/style',[],function(){});
// jscs:disable

define('lib/polyfills',[],function() {

// element.classList polyfill
/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js */
if("document" in self){if(!("classList" in document.createElement("_"))){(function(j){"use strict";if(!("Element" in j)){return}var a="classList",f="prototype",m=j.Element[f],b=Object,k=String[f].trim||function(){return this.replace(/^\s+|\s+$/g,"")},c=Array[f].indexOf||function(q){var p=0,o=this.length;for(;p<o;p++){if(p in this&&this[p]===q){return p}}return -1},n=function(o,p){this.name=o;this.code=DOMException[o];this.message=p},g=function(p,o){if(o===""){throw new n("SYNTAX_ERR","An invalid or illegal string was specified")}if(/\s/.test(o)){throw new n("INVALID_CHARACTER_ERR","String contains an invalid character")}return c.call(p,o)},d=function(s){var r=k.call(s.getAttribute("class")||""),q=r?r.split(/\s+/):[],p=0,o=q.length;for(;p<o;p++){this.push(q[p])}this._updateClassName=function(){s.setAttribute("class",this.toString())}},e=d[f]=[],i=function(){return new d(this)};n[f]=Error[f];e.item=function(o){return this[o]||null};e.contains=function(o){o+="";return g(this,o)!==-1};e.add=function(){var s=arguments,r=0,p=s.length,q,o=false;do{q=s[r]+"";if(g(this,q)===-1){this.push(q);o=true}}while(++r<p);if(o){this._updateClassName()}};e.remove=function(){var t=arguments,s=0,p=t.length,r,o=false,q;do{r=t[s]+"";q=g(this,r);while(q!==-1){this.splice(q,1);o=true;q=g(this,r)}}while(++s<p);if(o){this._updateClassName()}};e.toggle=function(p,q){p+="";var o=this.contains(p),r=o?q!==true&&"remove":q!==false&&"add";if(r){this[r](p)}if(q===true||q===false){return q}else{return !o}};e.toString=function(){return this.join(" ")};if(b.defineProperty){var l={get:i,enumerable:true,configurable:true};try{b.defineProperty(m,a,l)}catch(h){if(h.number===-2146823252){l.enumerable=false;b.defineProperty(m,a,l)}}}else{if(b[f].__defineGetter__){m.__defineGetter__(a,i)}}}(self))}else{(function(){var b=document.createElement("_");b.classList.add("c1","c2");if(!b.classList.contains("c2")){var c=function(e){var d=DOMTokenList.prototype[e];DOMTokenList.prototype[e]=function(h){var g,f=arguments.length;for(g=0;g<f;g++){h=arguments[g];d.call(this,h)}}};c("add");c("remove")}b.classList.toggle("c3",false);if(b.classList.contains("c3")){var a=DOMTokenList.prototype.toggle;DOMTokenList.prototype.toggle=function(d,e){if(1 in arguments&&!this.contains(d)===!e){return e}else{return a.call(this,d)}}}b=null}())}};

});

// jscs:enable
;
/**
 * @license ractive-validator Copyright (c) 2014, Uhray LLC
 * Available via the MIT license.
 * see: http://github.com/uhray for details
 */
define('lib/main',['rv!./template', 'css!./style', './polyfills'],
function(template) {
  var extension, MessageDiv, defaultOptions;

  // ========================== Default Options ============================= //

  defaultOptions = {
    _orientation: {
      _default: 'left',
      options: ['top', 'bottom', 'left', 'right']
    },
    _class: ''
  };

  // ========================== Create MessageDiv =========================== //

  MessageDiv = Ractive.extend({
    el: document.body,
    append: true,
    template: template,
    data: {
      orientation: 'top'
    },
    onrender: function() {
      var self = this,
          element = this.get('element'),
          parent = this.get('parent'),
          bound = element.getBoundingClientRect();

      this.set({
        width: bound.width,
        top: element.offsetTop,
        left: element.offsetLeft,
        height: bound.height,
        alert: {
          width: Math.min(bound.height - 4, 23)
        }
      });

      this.observe('valid', function(v) {
        var p = element.parentElement;
        if (v) {
          element.classList.remove('validator-invalid');
          p && p.classList && p.classList.remove('validator-child-invalid');
        } else {
          element.classList.add('validator-invalid');
          p && p.classList && p.classList.add('validator-child-invalid');
        }
      });

      element.addEventListener('focus', focus);
      element.addEventListener('blur', blur);
      element.addEventListener('keyup', change);
      element.addEventListener('change', change);

      this.on('alert-click', function() {
        element && element.focus && element.focus();
      });

      this.on('teardown', function() {
        element.removeEventListener('focus', focus);
        element.removeEventListener('blur', blur);
        element.removeEventListener('keyup', change);
        element.removeEventListener('change', change);
      });

      function focus() { self.set('active', true); }
      function blur() { self.set('active', false); }
      function change() { parent.validatorDo(element); }
    }
  });

  // ========================== Custom Events =============================== //

  Ractive.events.validatorSuccess = function(node, fire) {
    var self = this;

    node._fireValidatorSuccess = function(event, e) {
      fire({
        node: node,
        name: 'validator',
        target: self,
        original: event
      });
    }
  };

  Ractive.events.validatorFailure = function(node, fire) {
    var self = this;

    node._fireValidatorFailure = function(event, e) {
      fire({
        node: node,
        name: 'validator-failure',
        target: self,
        original: event
      });
    }
  };

  // ========================== Define Extension ============================ //

  extension = Ractive.extend({

    // Initialize on render ----------------------------------------------------
    onrender: function(options) {
      var self = this;

      this._super(options);

      this.on('validator', function(event) {
        var node = event.node,
            els = node.querySelectorAll('*[validator]'),
            valid = true;

        forEach(els, function(el) {
          var x = this.validatorDo(el);
          valid = !valid ? false : x;
        }, this);

        if (valid) {
          this.fire('validator-clear', node);
          node && node._fireValidatorSuccess &&
                  node._fireValidatorSuccess(event.original);
          this.fire('validatorSuccess', event.original);
        } else {
          node && node._fireValidatorFailure &&
                  node._fireValidatorFailure(event.original);
          this.fire('validatorFailure', event.original);
        }
      });

      this.on('validator-clear', function(form) {
        var els = form.querySelectorAll('*[validator]'),
            divs = this.validatorDivs;

        forEach(els, function(el) {
          var err = el._validatorError,
              idx = divs.indexOf(err);

          if (err) err.teardown();
          if (el && el._validatorError) delete el._validatorError;
          if (~idx) divs.slice(idx, 1);

          el && el.classList && el.classList.remove('validator-error');
        });
      });

      this.on('teardown', function() {
        this.validatorDivs.forEach(function(d) {
          var el = d.get('element');
          if (el && el._validatorError) delete el._validatorError;
          d.teardown();
          el && el.classList && el.classList.remove('validator-error');
        });
        this.set('validatorDivs', []);
      });

    },

    // Create default validators -----------------------------------------------

    validators: {
      string: function(val, min, max) {
        var min = min === undefined ? 0 : min,
            max = max === undefined ? Infinity : max,
            str = String(val),
            valid = val === undefined
                     ? false
                     : (val.length >= min && val.length <= max),
            msg;

        if (max == Infinity)
          msg = 'Value must be at least ' + min + ' characters.';
        else if (min == -Infinity)
          msg = 'Value cannot be more than ' + max + ' characters.';
        else
          msg = 'Value must be between ' + min + ' and ' + max + ' characters.';

        return { value: String(val), valid: valid, message: msg };
      },

      required: function(val) {
        var str = String(val);
        return { value: val, valid: !!str, message: 'Value is required.' };
      },

      email: function(val) {
        var str = String(val),
            re = /^([\w\-\.]+)@((\[([0-9]{1,3}\.){3}[0-9]{1,3}\])|(([\w\-]+\.)+)([a-zA-Z]{2,4}))$/;
        return { value: val, valid: re.test(str),
                 message: 'Not a valid email.' };
      },

      checked: function() {
        return { value: this.value, valid: this.checked,
                 message: 'Must be checked' };
      },

      url: function(val, http, required) {
        var str = String(val),
            re = new RegExp('^((http|https|ftp)\://)?[a-zA-Z0-9\-\.]+\.' +
                            '[a-zA-Z]{2,3}(:[a-zA-Z0-9]*)?/?' +
                            '([a-zA-Z0-9\-\._\?\,\'/\\\+&amp;%\$#\=~])*$'),
            re2 = new RegExp('((http|https|ftp)(\://)?)$'),
            t1 = re.test(str) && str.match(/\.[a-z]/i),
            t2 = re2.test(str);

        if (!str) {  // no value
          return { value: str, valid: !required, message: 'URL required.' };
        }

        if (http && t1 && !t2 &&
            !str.match(new RegExp('^(http|https|ftp)\://'))) {
          str = 'http://' + str;
        }

        return { value: str, valid: t1 && !t2, message: 'Not a valid url.' };
      },

      pattern: function(val, p) {
        var str = String(val),
            re = new RegExp(p);
        return { value: val, valid: re.test(str), message: 'Not a valid url.' };
      },

      samevalue: function(val, s) {
        var el = document.querySelector(s || '');

        if (!el)
          return { value: val, valid: false, message: 'Match not found.' };

        return {
          value: val,
          valid: val == el.value,
          message: 'Values must match'
        }
      }
    },

    // Handle Validation -------------------------------------------------------

    validatorDivs: [],
    validatorDo: function(el) {
      var value = el.value,
          args = (el && el.getAttribute('validator') || '').split(','),
          type = args.shift(),
          validator = this.validators[type],
          msg, res, evt;

      if (!validator) return console.warn('no validator found: %s', type);

      // Test Validity
      args.unshift(value);
      res = validator.apply(el, args);
      if (res.valid && el.value != res.value) {
        el.value = res.value;
        if ('createEvent' in document) {
          evt = document.createEvent('HTMLEvents');
          evt.initEvent('input', false, true);
          el.dispatchEvent(evt);
        } else el.fireEvent('oninput');
      }

      // Get message
      msg = el && el.getAttribute('validator-message') ||
            res.message || 'Invalid value: ' + type,

      // create div
      this.validatorCreateDiv(el, msg, res.valid);

      // return validity
      return res.valid;
    },

    validatorCreateDiv: function(el, msg, valid) {
      var div = el._validatorError,
          getParent, opts;

      // Already has a div
      if (div) {
        div.set('valid', valid);
        div.set('message', msg);
        return;
      }

      // need to create one
      opts = getOptions(el, defaultOptions);
      div = el._validatorError = new MessageDiv({
        el: opts.parent && document.querySelector(opts.parent) ||
            el.parentElement || document.body,
        data: {
          name: createName(),
          element: el,
          valid: valid,
          message: msg,
          parent: this,
          options: getOptions(el, defaultOptions)
        }
      });

      // Add to list
      this.validatorDivs.push(div);
    }
  });

  // ========================= Activate Extension =========================== //

  Ractive.prototype = extension.prototype;

  // ============================= Utility Fns ============================== //

  function forEach(arr, fn, ctx) {
    var k;

    if ('length' in arr) {
      for (k = 0; k < arr.length; k++) fn.call(ctx || this, arr[k], k);
    } else {
      for (k in arr) fn.call(ctx || this, arr[k], k);
    }
  }

  function createName() {
    return 'rv-' +
           Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1) +
           Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1)
  }

  function getOptions(element, defaults) {
    var opts = {};

    forEach(element.attributes, function(d) {
      var m = d.name.match(/^validator-(.*)/),
          val = d.value,
          name = m && m[1];

      if (!m) return;

      // no default
      if (!defaults[name]) {
        opts[name] = val;
      } else if (defaults[name] && defaults[name].options) {
        if (~defaults[name].options.indexOf(val)) opts[name] = val;
      } else {
        opts[name] = val;
      }
    });

    forEach(defaults, function(d, k) {
      k = k.replace(/^_/, '');
      if (!opts.hasOwnProperty(k)) {
        opts[k] = d && d._default ? d._default : d;
      }
    });

    return opts;
  }
});


(function(c){var d=document,a='appendChild',i='styleSheet',s=d.createElement('style');s.type='text/css';d.getElementsByTagName('head')[0][a](s);s[i]?s[i].cssText=c:s[a](d.createTextNode(c));})
('.ractive-validator {\n  position: absolute;\n  height: 0;\n  font-family: sans-serif;\n}\n\n.ractive-validator .rv-message {\n  position: absolute;\n  padding: 5px;\n  border: solid 1px #8B0300;\n  background: #B94A48;\n  color: #FFF;\n  font-size: 12px;\n  font-weight: bold;\n  text-align: left;\n}\n\n.ractive-validator .rv-message:after,\n.ractive-validator .rv-message:before {\n  border: solid transparent;\n  content: \" \";\n  height: 0;\n  width: 0;\n  position: absolute;\n  pointer-events: none;\n}\n\n.ractive-validator .rv-message:after {\n  border-color: rgba(185, 74, 72, 0);\n  border-width: 8px;\n}\n.ractive-validator .rv-message:before {\n  border-color: rgba(139, 3, 0, 0);\n  border-width: 9px;\n}\n\n/* Orient Left */\n\n.ractive-validator.rv-orient-left .rv-message {\n  top: 0;\n  right: 100%;\n  width: 150px;\n  margin-right: 20px;\n}\n\n.ractive-validator.rv-orient-left .rv-message:after,\n.ractive-validator.rv-orient-left .rv-message:before {\n  left: 100%;\n}\n\n.ractive-validator.rv-orient-left .rv-message:after {\n  border-left-color: #B94A48;\n  margin-top: -8px;\n}\n.ractive-validator.rv-orient-left .rv-message:before {\n  border-left-color: #8b0300;\n  margin-top: -9px;\n}\n\n/* Orient Bottom */\n\n.ractive-validator.rv-orient-bottom .rv-message {\n  left: 0px;\n  width: 150px;\n  margin-top: 10px;\n}\n\n.ractive-validator.rv-orient-bottom .rv-message:after,\n.ractive-validator.rv-orient-bottom .rv-message:before {\n  bottom: 100%;\n  left: 15px;\n}\n\n.ractive-validator.rv-orient-bottom .rv-message:after {\n  border-bottom-color: #B94A48;\n  margin-left: -8px;\n}\n.ractive-validator.rv-orient-bottom .rv-message:before {\n  border-bottom-color: #8b0300;\n  margin-left: -9px;\n}\n\n/* Orient Top */\n\n.ractive-validator.rv-orient-top .rv-message {\n  top: -10px;\n  left: 0px;\n  transform: translateY(-100%);\n  width: 150px;\n}\n\n.ractive-validator.rv-orient-top .rv-message:after,\n.ractive-validator.rv-orient-top .rv-message:before {\n  top: 100%;\n  left: 15px;\n}\n\n.ractive-validator.rv-orient-top .rv-message:after {\n  border-top-color: #B94A48;\n  margin-left: -8px;\n}\n.ractive-validator.rv-orient-top .rv-message:before {\n  border-top-color: #8b0300;\n  margin-left: -9px;\n}\n\n/* Orient Right */\n\n.ractive-validator.rv-orient-right .rv-message {\n  top: 0;\n  left: 100%;\n  width: 150px;\n  margin-left: 20px;\n}\n\n.ractive-validator.rv-orient-right .rv-message:after,\n.ractive-validator.rv-orient-right .rv-message:before {\n  right: 100%;\n}\n\n.ractive-validator.rv-orient-right .rv-message:after {\n  border-right-color: #B94A48;\n  margin-top: -8px;\n}\n.ractive-validator.rv-orient-right .rv-message:before {\n  border-right-color: #8b0300;\n  margin-top: -9px;\n}\n\n/* Alert */\n\n.ractive-validator .rv-alert {\n  position: absolute;\n  right: 5px;\n  border-radius: 50%;\n  background: #B94A48;\n  text-align: center;\n  color: #FFF;\n  vertical-align: middle;\n  font-size: 15px;\n  font-family: sans-serif;\n  font-weight: bold;\n}\n');
    require('lib/main');
}());
