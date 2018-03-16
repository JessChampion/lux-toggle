/*
 *  Toggle function
 *
 *  TOGGLES
 *  Toggles are specified by adding a data attribute 'config.attributes.target' to an html element.
 *  The value of the 'config.attributes.target' should ID the idea of the target.
 *  When the toggle is clicked both the toggle and target will have opening,
 *  open and closing classes applied as appropriate, with delays to allow css
 *  animations to be applied.
 *
 *  TOGGLE GROUPS
 *  Groups can be defined by adding the 'config.attributes.group' to the toggle element.
 *  The value of the 'config.attributes.group' should be the group name.
 *  When toggling a toggle in the group, it will check if any of the siblings are open
 *  and if so, delay the open event to allow the sibling to close.
 *
 *  CLOSE BUTTON
 *  You can set any element inside the toggle target to act as a close button.
 *  Set the ID of the close button as the value for the the 'config.attributes.close'
 *  data attribute on the toggle element.
 *
 *  CLOSE MODE
 *  A close mode can be configured by 'config.attributes.mode'
 *  Options are 'manual', 'group' or 'outside'
 *  'manual':   close only when clicking toggle, by keyboard or close area. (DEFAULT)
 *  'group':    close siblings when another in the same group is opened.
 *  'outside':  always close on click outside
 *
 *  'config.attributes.target', 'config.attributes.group' and 'config.attributes.close',
 *  as well as the toggle classes and animation delays are set as config variables below.
 */

// ----------------------------------
// Constants and config
// ----------------------------------

export const KEYS = {
  enter: 13,
  escape: 27,
  space: 32,
  down: 40,
  up: 38
};

export const CLOSE_MODE = {
  manual: 'manual',
  group: 'group',
  outside: 'outside'
};

const DEFAULT_CLOSE_MODE = CLOSE_MODE.manual;

export const config = {
  animations: {
    openDelay: 2,
    closeDuration: 300,
    siblingOpenDelay: 350
  },
  attributes: {
    target: 'data-lux-toggle',
    group: 'data-lux-toggle-group',
    close: 'data-lux-toggle-close',
    mode: 'data-lux-toggle-mode',
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

const isOpen = target => target.classList.contains(config.classes.open);

const animate = (action, animationDelay) => setTimeout(() => action(), animationDelay);

const setOpeningClasses = (element) => {
  element.classList.add(config.classes.opening);
  animate(
    () => {
      element.classList.add(config.classes.open);
      element.classList.remove(config.classes.opening);
    },
    config.animations.openDelay
  );
};

const setClosingClasses = (element) => {
  element.classList.add(config.classes.closing);
  element.classList.remove(config.classes.open);
  animate(
    () => element.classList.remove(config.classes.closing),
    config.animations.closeDuration
  );
};

// ----------------------------------
// Accessibility functions
// ----------------------------------

const setAriaExpanded = (target, expandedState) => target.setAttribute('aria-expanded', expandedState);

const initAriaAttributes = (toggle) => {
  setAriaExpanded(toggle, false);
  const targetID = toggle.getAttribute(config.attributes.target);
  toggle.setAttribute('aria-controls', targetID);
};

// ----------------------------------
// Event handling functions
// ----------------------------------

const attachListeners = (element, action, targetEvents = config.events.click) => {
  targetEvents.forEach((event) => {
    element.addEventListener(event, action);
  });
};

const removeListeners = (element, action, targetEvents = config.events.click) => {
  targetEvents.forEach((event) => {
    element.removeEventListener(event, action);
  });
};

const keyPressIsOneOf = (targetKeys, event) => {
  const code = event.keyCode || event.which;
  return targetKeys.includes(code);
};

const getKeypressHandler = (targetKeys, action) => (event) => {
  if (keyPressIsOneOf(targetKeys, event)) {
    action(event);
  }
};

const attachKeyListeners = (element, targetKeys, action, targetEvents = config.events.key) => {
  attachListeners(element, getKeypressHandler(targetKeys, action), targetEvents);
};

// ----------------------------------
// DOM functions
// ----------------------------------

const getToggleElements = () => Array.from(document.querySelectorAll(`[${config.attributes.target}]`));

const getTargetElement = (toggle) => {
  const targetID = toggle.getAttribute(config.attributes.target);
  const target = document.getElementById(targetID);
  if (!target) {
    throw new DOMException(`Toggle Error: unable to find an element with ID '${targetID}'`);
  }
  return target;
};

const getSiblingsWithState = (stateClass, toggleGroupName) => Array.from(document.querySelectorAll(`[${config.attributes.group}='${toggleGroupName}'].${stateClass}`));

const getActiveSiblingsToggles = (toggleGroupName) => {
  const openSiblings = getSiblingsWithState(config.classes.open, toggleGroupName);
  const openingSiblings = getSiblingsWithState(config.classes.opening, toggleGroupName);
  return [...openSiblings, ...openingSiblings];
};

const hasActiveSiblingsToggles = groupName => getActiveSiblingsToggles(groupName).length > 0;

const findCloseArea = (element) => {
  const closeAreaID = element.getAttribute(config.attributes.close);
  if (closeAreaID) {
    const closeArea = document.getElementById(closeAreaID);
    if (!closeArea) {
      throw new DOMException(`Toggle Error: unable to find close element with ID '${closeAreaID}'`);
    }
    return closeArea;
  }
  return null;
};

const click = (target) => {
  const event = document.createEvent('Event');
  event.initEvent('mouseup', true, true);
  target.dispatchEvent(event);
};

const getGroupName = target => target.getAttribute(config.attributes.group) || null;

const getCloseMode = target => target.getAttribute(config.attributes.mode) || DEFAULT_CLOSE_MODE;

// ----------------------------------
// Handler creators
// ----------------------------------

const getClickOutsideHandler = (toggle, target) => () => {
  toggle.close();
  target.close();
};

// ----------------------------------
// Object model creators
// ----------------------------------

const mountTarget = (element) => {
  const onClick = event => event.stopPropagation(); // eat the event - nom nom

  return {
    open() {
      setOpeningClasses(element);

      // accessibility actions
      element.focus();
    },

    close() {
      setClosingClasses(element);
    },

    bindEvents() {
      attachListeners(element, onClick);
    }
  };
};

const mountToggle = (element, target, closeArea = null) => {
  const groupName = getGroupName(element);
  const closeMode = getCloseMode(element);

  initAriaAttributes(element);

  return {
    element,
    open() {
      setOpeningClasses(element);
      target.open();

      // bind close events
      console.log(closeMode);
      if (closeMode !== CLOSE_MODE.manual) {
        attachListeners(document.body, this.clickOutsideHandler);
      }
      attachListeners(document.body, this.keyboardCloseHandler, config.events.key);

      // accessibility actions
      setAriaExpanded(element, true);
    },

    // methods
    close() {
      setClosingClasses(element);
      target.close();

      // unbind close events
      removeListeners(document.body, this.clickOutsideHandler);
      removeListeners(document.body, this.keyboardCloseHandler, config.events.key);

      // accessibility actions
      setAriaExpanded(element, false);
    },

    onToggle(event) {
      event.stopPropagation();
      if (isOpen(element)) {
        this.close();
        return;
      }
      if (closeMode === CLOSE_MODE.group && hasActiveSiblingsToggles(groupName)) {
        console.log('here');
        // apply opening classes to toggle straight away so it looks like somethings happening
        element.classList.add(config.classes.opening);
        click(element.parentElement);
        // open in a bit to let siblings close
        setTimeout(this.open.bind(this), config.animations.siblingOpenDelay);
        return;
      }
      this.open();
    },

    bindEvents(clickOutsideHandler) {
      this.clickOutsideHandler = clickOutsideHandler;
      this.keyboardCloseHandler = getKeypressHandler([KEYS.escape], () => {
        clickOutsideHandler();
        element.focus();
      });
      attachListeners(element, this.onToggle.bind(this));
      attachKeyListeners(
        element,
        [KEYS.enter, KEYS.space, KEYS.down, KEYS.up],
        this.onToggle.bind(this)
      );

      target.bindEvents();

      if (closeArea) {
        const closeHandler = (event) => {
          event.stopPropagation();
          this.close();
        };

        attachListeners(closeArea, closeHandler);

        attachKeyListeners(
          closeArea,
          [KEYS.enter, KEYS.space, KEYS.escape],
          closeHandler
        );
      }
    }
  };
};

// ----------------------------------
// Set up functions
// ----------------------------------

const createToggle = (element) => {
  // get sub components
  const targetElement = getTargetElement(element);
  const target = mountTarget(targetElement);
  const closeArea = findCloseArea(element);

  const toggle = mountToggle(element, target, closeArea);
  const clickOutsideHandler = getClickOutsideHandler(toggle, target);

  toggle.bindEvents(clickOutsideHandler);

  return toggle;
};

const attachToggles = (toggles = getToggleElements()) => {
  if (toggles.length > 0) {
    toggles.map(createToggle);
  }
};

// ----------------------------------
// PUBLIC INTERFACE
// ----------------------------------

export default function () {
  const toggles = getToggleElements();
  if (toggles.length > 0) {
    attachToggles(toggles); // attach toggle now
    return;
  }
  // attach toggle on load
  document.addEventListener('DOMContentLoaded', attachToggles);
}
