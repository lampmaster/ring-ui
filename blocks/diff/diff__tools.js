/**
 * @fileoverview Additional tools, which are used by {@link DiffTool}.
 * @author igor.alexeenko (Igor Alekseyenko)
 */

define(['jquery'], function($) {
  'use strict';

  /**
   * Namespace for DiffTool utility methods.
   */
  var diffTool = {};

  /**
   * Returns true if object is not undefined.
   * @param {*} obj
   * @return {boolean}
   */
  diffTool.isDef = function(obj) {
    return typeof obj !== 'undefined';
  };

  /**
   * @param {string} str
   * @return {boolean}
   */
  diffTool.isEmptyString = function(str) {
    return (/^\s*$/).test(str);
  };

  /**
   * Abstract method. Use link to this method for unimplemented methods in
   * base classes.
   * @throws {Error}
   */
  diffTool.abstractMethod = function() {
    throw new Error('This method is not implemented yet.');
  };

  /**
   * Null function. Use link to this method, where should not be an interaction.
   * For example in interfaces.
   */
  diffTool.nullFunction = function() {};

  /**
   * Takes even number of arguments and use them as key-value pairs to create
   * a new {@link Object}.
   * @param {...*} var_args
   * @return {Object}
   */
  diffTool.createObject = function(var_args) {
    if (var_args instanceof Array) {
      return diffTool.createObject.apply(null, var_args);
    }

    var args = Array.prototype.slice.call(arguments, 0);
    if (args.length % 2 !== 0) {
      throw new Error('Odd number of arguments.');
    }

    var obj = {};
    for (var i = 0, l = args.length; i < l; i += 2) {
      obj[args[i]] = args[i + 1];
    }

    return obj;
  };

  /**
   * Simply appends values of fields of mixin into target object.
   * @param {Object} target
   * @param {Object} mixin
   * @param {boolean=} opt_override
   * @return {Object}
   */
  diffTool.mixin = function(target, mixin, opt_override) {
    opt_override = diffTool.isDef(opt_override) ? opt_override : true;

    for (var arg in mixin) {
      if (mixin.hasOwnProperty(arg)) {
        if (target[arg] && !opt_override) {
          continue;
        }

        target[arg] = mixin[arg];
      }
    }

    return target;
  };

  /**
   * Clamps value within min and max values.
   * @param {number} value
   * @param {number} min
   * @param {number} max
   * @return {number}
   */
  diffTool.clamp = function(value, min, max) {
    return Math.min(Math.max(value, min), max);
  };

  // todo(igor.alexeenko): Make deletion by index.
  /**
   * Deletes element from array and returns array without this element. Does
   * not change initial array.
   * @param {Array} arr
   * @param {*} el
   * @return {Array}
   */
  diffTool.deleteFromArray = function(arr, el) {
    var elIndex = arr.indexOf(el);
    var result = arr;

    if (elIndex > -1) {
      var leftSide = arr.slice(0, elIndex);
      var rightSide = arr.slice(elIndex + 1, arr.length);

      result = leftSide.concat(rightSide);
    }

    return result;
  };

  /**
   * Whether two arrays has same elements.
   * @param {Array} arrA
   * @param {Array} arrB
   * @return {boolean}
   */
  diffTool.arraysAreEqual = function(arrA, arrB) {
    if (arrA.length !== arrB.length) {
      return false;
    }

    for (var i = 0, l = arrA.length; i < l; i++) {
      // todo(igor.alexeenko): this comparsion works only for simple data-types.
      // Make it work for objects, arrays, etc.
      if (arrA !== arrB) {
        return false;
      }
    }

    return true;
  };

  // todo(igor.alexeenko): Rename to inherits
  /**
   * Inheritance interface. Works through empty constructor, but unlike other
   * inheritance methods, also creates link to a parent class in a child, to
   * make child able to call methods of parent class from its own methods.
   * @param {Function} child
   * @param {Function} parent
   */
  diffTool.inherit = function(child, parent) {
    var EmptyConstructor = function() {};
    EmptyConstructor.prototype = parent.prototype;

    child.prototype = new EmptyConstructor();
    child.prototype.constructor = child;

    child.super_ = parent.prototype;
  };

  /**
   * Wrapper to make class a singleton. Adds static method {@code getInstance},
   * which always return the same instance.
   * @param {Function} Constructor
   */
  diffTool.addSingletonGetter = function(Constructor) {
    Constructor.getInstance = function() {
      if (!Constructor.instance_) {
        Constructor.instance_ = new Constructor();
      }

      return Constructor.instance_;
    };
  };

  /**
   * Returns function, which always called with certain context.
   * @param {function} fn
   * @param {*} ctx
   * @return {function}
   */
  diffTool.bindContext = function(fn, ctx) {
    return function() {
      return fn.apply(ctx, arguments);
    };
  };

  /**
   * @param {Element} el
   * @param {function} fn
   * @param {Object=} opt_context
   */
  diffTool.addAnimationCallback = function(el, fn, opt_context) {
    var animationEndHandler = function() {
      fn.call(opt_context);

      // todo(igor.alexeenko): Implement through diffTool.getAnimationEventType
      // as soon as it ready.
      $(el).off('animationend', animationEndHandler);
      $(el).off('MSAnimationEnd', animationEndHandler);
      $(el).off('oAnimationEnd', animationEndHandler);
      $(el).off('webkitAnimationEnd', animationEndHandler);
    };

    $(el).one('animationend', animationEndHandler);
    $(el).one('MSAnimationEnd', animationEndHandler);
    $(el).one('oAnimationEnd', animationEndHandler);
    $(el).one('webkitAnimationEnd', animationEndHandler);
  };

  /**
   * @return {string}
   */
  diffTool.getAnimationEventType = function() {
    return 'animationend';
  };

  // todo(o0): Time to split this file and move parts to global__utils.js.
  /**
   * Namespace.
   */
  diffTool.visibility = {};

  /**
   * @enum {string}
   */
  diffTool.visibility.VisibilityProperty = {
    COMMON: 'hidden',
    MOZILLA: 'mozHidden',
    MS: 'msHidden',
    WEBKIT: 'webkitHidden'
  };

  /**
   * @enum {string}
   */
  diffTool.visibility.VisibilityChangeEventType = {
    COMMON: 'visibilitychange',
    MOZILLA: 'mozvisibilitychange',
    MS: 'msvisibilitychange',
    WEBKIT: 'webkitvisibilitychange'
  };


  /**
   * @return {Object.<diffTool.visibility.VisibilityProperty,
   *     diffTool.visibility.VisibilityChangeEventType>}
   * @private
   */
  diffTool.visibility.getPropertyToEventType_ = function() {
    if (!diffTool.isDef(diffTool.visibility.propertyToEventType_)) {
      /**
       * Lookup table of visibility properties to eventTypes of changing them.
       * @type {Object.<diffTool.visibility.VisibilityProperty,
       *     diffTool.visibility.VisibilityChangeEventType>}
       * @private
       */
      diffTool.visibility.propertyToEventType_ = diffTool.createObject(
          diffTool.visibility.VisibilityProperty.COMMON,
              diffTool.visibility.VisibilityChangeEventType.COMMON,
          diffTool.visibility.VisibilityProperty.MOZILLA,
              diffTool.visibility.VisibilityChangeEventType.MOZILLA,
          diffTool.visibility.VisibilityProperty.MS,
              diffTool.visibility.VisibilityChangeEventType.MS,
          diffTool.visibility.VisibilityProperty.WEBKIT,
              diffTool.visibility.VisibilityChangeEventType.WEBKIT);
    }

    return diffTool.visibility.propertyToEventType_;
  };

  /**
   * @return {diffTool.visibility.VisibilityProperty}
   * @private
   */
  diffTool.visibility.getVisibilityProperty_ = function() {
    if (!diffTool.isDef(diffTool.visibility.visibilityProperty_)) {
      diffTool.visibility.visibilityProperty_ = null;

      for (var propertyID in diffTool.visibility.VisibilityProperty) {
        var currentProperty = diffTool.visibility.VisibilityProperty[
            propertyID];

        if (diffTool.isDef(document[currentProperty])) {
          diffTool.visibility.visibilityProperty_ = currentProperty;
          break;
        }
      }
    }

    return diffTool.visibility.visibilityProperty_;
  };

  /**
   * @return {diffTool.visibility.VisibilityChangeEventType}
   * @private
   */
  diffTool.visibility.getVisibilityChangeEventType_ = function() {
    if (!diffTool.isDef(diffTool.visibility.eventType_)) {
      var property = diffTool.visibility.getVisibilityProperty_();
      var propertyToEventType = diffTool.visibility.getPropertyToEventType_();

      diffTool.visibility.eventType_ = propertyToEventType[property];
    }


    return diffTool.visibility.eventType_;
  };

  /**
   * Whether document page is visible or hidden. If browser doesn't support
   * page visibility API, always returns true.
   * @return {boolean}
   */
  diffTool.isDocumentHidden = function() {
    var visibilityProperty = diffTool.visibility.getVisibilityProperty_();

    if (visibilityProperty === null) {
      return true;
    }

    return document[visibilityProperty];
  };

  /**
   * Adds event listener to event of changing page visibility accordingly to
   * current implementation of page visibility API.
   * @param {function} fn
   * @param {Object=} opt_ctx
   */
  diffTool.addDocumentVisibilityChangeCallback = function(fn, opt_ctx) {
    var eventType = diffTool.visibility.getVisibilityChangeEventType_();
    var callback = diffTool.bindContext(fn, opt_ctx);

    $(document).on(eventType, callback);
  };

  return diffTool;
});
