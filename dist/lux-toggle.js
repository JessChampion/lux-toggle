/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(2);


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KEYS", function() { return KEYS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CLOSE_MODE", function() { return CLOSE_MODE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "config", function() { return config; });
function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/*
 *  Toggle function
 *
 *  TOGGLES
 *  Toggles are specified by adding a data attribute 'config.attr.target' to an html element.
 *  The value of the 'config.attr.target' should ID the idea of the target.
 *  When the toggle is clicked both the toggle and target will have opening,
 *  open and closing classes applied as appropriate, with delays to allow css
 *  animations to be applied.
 *
 *  TOGGLE GROUPS
 *  Groups can be defined by adding the 'config.attr.toggleGroup' to the toggle element.
 *  The value of the 'config.attr.toggleGroup' should be the group name.
 *  When toggling a toggle in the group, it will check if any of the siblings are open
 *  and if so, delay the open event to allow the sibling to close.
 *
 *  CLOSE BUTTON
 *  You can set any element inside the toggle target to act as a close button.
 *  Set the ID of the close button as the value for the the 'config.attr.closeButton'
 *  data attribute on the toggle element.
 *
 *  CLOSE MODE
 *  A close mode can be configured by 'config.attr.closeMode'
 *  Options are 'manual', 'group' or 'outside'
 *  'manual':   close only when clicking toggle, by keyboard or close area. (DEFAULT)
 *  'group':    close siblings when another in the same group is opened.
 *  'outside':  always close on click outside
 *
 *  'config.attr.target', 'config.attr.toggleGroup' and 'config.attr.closeButton',
 *  as well as the toggle classes and animation delays are set as config variables below.
 */

// ----------------------------------
// Constants and config
// ----------------------------------

var KEYS = {
  enter: 13,
  escape: 27,
  space: 32,
  down: 40,
  up: 38
};

var CLOSE_MODE = {
  manual: 'manual',
  group: 'group',
  outside: 'outside'
};

var DEFAULT_CLOSE_MODE = CLOSE_MODE.manual;

var config = {
  animations: {
    openDelay: 2,
    closeDuration: 300,
    siblingOpenDelay: 350
  },
  attr: {
    target: 'data-lux-toggle',
    toggleGroup: 'data-lux-toggle-group',
    closeButton: 'data-lux-toggle-close',
    closeMode: 'data-lux-toggle-mode'
  },
  classes: {
    open: 'toggle--open',
    opening: 'toggle--opening',
    closing: 'toggle--closing'
  },
  events: {
    click: ['mouseup'],
    key: ['keyup']
  }
};

// ----------------------------------
// Class and animation functions
// ----------------------------------

var isOpen = function isOpen(target) {
  return target.classList.contains(config.classes.open);
};

var animate = function animate(action, animationDelay) {
  return setTimeout(function () {
    return action();
  }, animationDelay);
};

var setOpeningClasses = function setOpeningClasses(element) {
  element.classList.add(config.classes.opening);
  animate(function () {
    element.classList.add(config.classes.open);
    element.classList.remove(config.classes.opening);
  }, config.animations.openDelay);
};

var setClosingClasses = function setClosingClasses(element) {
  element.classList.add(config.classes.closing);
  element.classList.remove(config.classes.open);
  animate(function () {
    return element.classList.remove(config.classes.closing);
  }, config.animations.closeDuration);
};

// ----------------------------------
// Accessibility functions
// ----------------------------------

var setAriaExpanded = function setAriaExpanded(target, expandedState) {
  return target.setAttribute('aria-expanded', expandedState);
};

var initAriaAttributes = function initAriaAttributes(toggle) {
  setAriaExpanded(toggle, false);
  var targetID = toggle.getAttribute(config.attr.target);
  toggle.setAttribute('aria-controls', targetID);
};

// ----------------------------------
// Event handling functions
// ----------------------------------

var attachListeners = function attachListeners(element, action) {
  var targetEvents = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : config.events.click;

  targetEvents.forEach(function (event) {
    element.addEventListener(event, action);
  });
};

var attachListenersInNextTick = function attachListenersInNextTick(element, action) {
  var targetEvents = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : config.events.click;

  setTimeout(function () {
    return attachListeners(element, action, targetEvents);
  }, 1);
};

var removeListeners = function removeListeners(element, action) {
  var targetEvents = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : config.events.click;

  targetEvents.forEach(function (event) {
    element.removeEventListener(event, action);
  });
};

var keyPressIsOneOf = function keyPressIsOneOf(targetKeys, event) {
  var code = event.keyCode || event.which;
  return targetKeys.includes(code);
};

var getKeypressHandler = function getKeypressHandler(targetKeys, action) {
  return function (event) {
    if (keyPressIsOneOf(targetKeys, event)) {
      action(event);
    }
  };
};

var attachKeyListeners = function attachKeyListeners(element, targetKeys, action) {
  var targetEvents = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : config.events.key;

  attachListeners(element, getKeypressHandler(targetKeys, action), targetEvents);
};

// ----------------------------------
// DOM functions
// ----------------------------------

var getToggleElements = function getToggleElements() {
  return Array.from(document.querySelectorAll('[' + config.attr.target + ']'));
};

var getTargetElement = function getTargetElement(toggle) {
  var targetID = toggle.getAttribute(config.attr.target);
  var target = document.getElementById(targetID);
  if (!target) {
    throw new DOMException('Toggle Error: unable to find an element with ID \'' + targetID + '\'');
  }
  return target;
};

var getSiblingsWithState = function getSiblingsWithState(stateClass, toggleGroupName) {
  return Array.from(document.querySelectorAll('[' + config.attr.toggleGroup + '=\'' + toggleGroupName + '\'].' + stateClass));
};

var getActiveSiblingsToggles = function getActiveSiblingsToggles(toggleGroupName) {
  var openSiblings = getSiblingsWithState(config.classes.open, toggleGroupName);
  var openingSiblings = getSiblingsWithState(config.classes.opening, toggleGroupName);
  return [].concat(_toConsumableArray(openSiblings), _toConsumableArray(openingSiblings));
};

var hasActiveSiblingsToggles = function hasActiveSiblingsToggles(groupName) {
  return getActiveSiblingsToggles(groupName).length > 0;
};

var findCloseArea = function findCloseArea(element) {
  var closeAreaID = element.getAttribute(config.attr.closeButton);
  if (closeAreaID) {
    var closeArea = document.getElementById(closeAreaID);
    if (!closeArea) {
      throw new DOMException('Toggle Error: unable to find close element with ID \'' + closeAreaID + '\'');
    }
    return closeArea;
  }
  return null;
};

var click = function click(target) {
  var event = document.createEvent('Event');
  event.initEvent('mouseup', true, true);
  target.dispatchEvent(event);
};

var getGroupName = function getGroupName(target) {
  return target.getAttribute(config.attr.toggleGroup) || null;
};

var getCloseMode = function getCloseMode(target) {
  return target.getAttribute(config.attr.closeMode) || DEFAULT_CLOSE_MODE;
};

// ----------------------------------
// Handler creators
// ----------------------------------

var getCloseHandler = function getCloseHandler(toggle, target) {
  return function () {
    toggle.close();
    target.close();
  };
};

// ----------------------------------
// Object model creators
// ----------------------------------

var mountTarget = function mountTarget(element, closeMode) {
  return {
    open: function open() {
      setOpeningClasses(element);

      // accessibility actions
      element.focus();
    },
    close: function close() {
      setClosingClasses(element);
    },
    bindEvents: function bindEvents() {
      if (closeMode === CLOSE_MODE.outside) {
        var onClickTarget = function onClickTarget(event) {
          return event.stopPropagation();
        }; // eat the event - nom nom
        attachListeners(element, onClickTarget);
      }
    }
  };
};

var mountToggle = function mountToggle(element, target, closeMode) {
  var closeArea = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

  var groupName = getGroupName(element);

  initAriaAttributes(element);

  return {
    element: element,
    open: function open() {
      setOpeningClasses(element);
      target.open();

      // bind close events
      if (closeMode !== CLOSE_MODE.manual) {
        // needs to happen after event propagation
        attachListenersInNextTick(document.body, this.closeHandler);
      }
      attachListeners(document.body, this.keyboardCloseHandler, config.events.key);

      // accessibility actions
      setAriaExpanded(element, true);
    },


    // methods
    close: function close() {
      setClosingClasses(element);
      target.close();

      // unbind close events
      removeListeners(document.body, this.closeHandler);
      removeListeners(document.body, this.keyboardCloseHandler, config.events.key);

      // accessibility actions
      setAriaExpanded(element, false);
    },
    onToggle: function onToggle() {
      if (isOpen(element)) {
        this.close();
        return;
      }
      if (closeMode === CLOSE_MODE.group && hasActiveSiblingsToggles(groupName)) {
        // apply opening classes to toggle straight away so it looks like somethings happening
        element.classList.add(config.classes.opening);
        click(element.parentElement); // continue event propagation
        // open in a bit to let siblings close
        setTimeout(this.open.bind(this), config.animations.siblingOpenDelay);
        return;
      }
      this.open();
    },
    bindEvents: function bindEvents(closeHandler) {
      var _this = this;

      this.closeHandler = closeHandler;
      this.keyboardCloseHandler = getKeypressHandler([KEYS.escape], function () {
        closeHandler();
        element.focus();
      });
      attachListeners(element, this.onToggle.bind(this));
      attachKeyListeners(element, [KEYS.enter, KEYS.space, KEYS.down, KEYS.up], this.onToggle.bind(this));

      target.bindEvents();

      if (closeArea) {
        var closeButtonHandler = function closeButtonHandler() {
          _this.close();
          click(element.parentElement); // continue event propagation
        };

        attachListeners(closeArea, closeButtonHandler);

        attachKeyListeners(closeArea, [KEYS.enter, KEYS.space, KEYS.escape], closeButtonHandler);
      }
    }
  };
};

// ----------------------------------
// Set up functions
// ----------------------------------

var createToggle = function createToggle(element) {
  // get sub components
  var targetElement = getTargetElement(element);
  var closeArea = findCloseArea(element);
  var closeMode = getCloseMode(element);

  var target = mountTarget(targetElement, closeMode);
  var toggle = mountToggle(element, target, closeMode, closeArea);
  var closeHandler = getCloseHandler(toggle, target);

  toggle.bindEvents(closeHandler);

  return toggle;
};

var attachToggles = function attachToggles() {
  var toggles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : getToggleElements();

  if (toggles.length > 0) {
    toggles.map(createToggle);
  }
};

// ----------------------------------
// PUBLIC INTERFACE
// ----------------------------------

/* harmony default export */ __webpack_exports__["default"] = (function () {
  var toggles = getToggleElements();
  if (toggles.length > 0) {
    attachToggles(toggles); // attach toggle now
    return;
  }
  // attach toggle on load
  document.addEventListener('DOMContentLoaded', attachToggles);
});

/***/ }),
/* 2 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })
/******/ ]);