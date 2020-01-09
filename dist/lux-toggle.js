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
 *  MENU MODE
 *  A close mode can be configured by 'config.attr.menuMode'
 *  Options are 'true', or 'false'
 *  'false':   The target of this toggle IS NOT a menu, aria-haspopup WILL NOT be set (DEFAULT)
 *  'true':    The target of this toggle IS a menu, aria-haspopup WILL be set
 *
 *  'config.attr.target', 'config.attr.toggleGroup' and 'config.attr.closeButton',
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
  up: 38,
  tab: 9
};

export const CLOSE_MODE = {
  manual: 'manual',
  group: 'group',
  outside: 'outside'
};

const DEFAULT_CLOSE_MODE = CLOSE_MODE.manual;
const DEFAULT_MENU_MODE = false;

export const config = {
  animations: {
    openDelay: 2,
    closeDuration: 300,
    siblingOpenDelay: 300
  },
  attr: {
    target: 'data-lux-toggle',
    toggleGroup: 'data-lux-toggle-group',
    closeButton: 'data-lux-toggle-close',
    closeMode: 'data-lux-toggle-mode',
    menuMode: 'data-lux-toggle-menu',
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
const setTabIndex = (target, indexValue = 0) => target.setAttribute('tabindex', indexValue);
const setTabIndexIfUnset = (target) => {
  if (target.hasAttribute('tabindex')) {
    return target;
  }
  return setTabIndex(target);
};

const initAriaAttributesToggle = (toggleButton, isMenu = false) => {
  setAriaExpanded(toggleButton, false);
  const targetID = toggleButton.getAttribute(config.attr.target);
  toggleButton.setAttribute('aria-controls', targetID);
  setTabIndexIfUnset(toggleButton);
  if (isMenu) {
    toggleButton.setAttribute('aria-haspopup', 'true');
  }
};

// ----------------------------------
// Event handling functions
// ----------------------------------

const attachListeners = (element, action, targetEvents = config.events.click) => {
  targetEvents.forEach((event) => {
    element.addEventListener(event, action);
  });
};

const attachListenersInNextTick = (element, action, targetEvents = config.events.click) => {
  setTimeout(() => attachListeners(element, action, targetEvents), 1);
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

const getToggleElements = () => Array.from(document.querySelectorAll(`[${config.attr.target}]`));

const getTargetElement = (toggle) => {
  const targetID = toggle.getAttribute(config.attr.target);
  const target = document.getElementById(targetID);
  if (!target) {
    throw new DOMException(`Toggle Error: unable to find an element with ID '${targetID}'`);
  }
  return target;
};

const getSiblingsWithState = (stateClass, toggleGroupName) => Array.from(document.querySelectorAll(`[${config.attr.toggleGroup}='${toggleGroupName}'].${stateClass}`));

const getActiveSiblingsToggles = (toggleGroupName) => {
  const openSiblings = getSiblingsWithState(config.classes.open, toggleGroupName);
  const openingSiblings = getSiblingsWithState(config.classes.opening, toggleGroupName);
  return [...openSiblings, ...openingSiblings];
};

const hasActiveSiblingsToggles = groupName => getActiveSiblingsToggles(groupName).length > 0;

const findCloseArea = (element) => {
  const closeAreaID = element.getAttribute(config.attr.closeButton);
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

const getGroupName = target => target.getAttribute(config.attr.toggleGroup) || null;

const getCloseMode = target => target.getAttribute(config.attr.closeMode) || DEFAULT_CLOSE_MODE;

const getMenuMode = target => target.getAttribute(config.attr.menuMode) || DEFAULT_MENU_MODE;

// ----------------------------------
// Handler creators
// ----------------------------------

const getCloseHandler = (toggle, target) => () => {
  toggle.close();
  target.close();
};

// ----------------------------------
// Object model creators
// ----------------------------------

const mountTarget = (element, closeMode) => ({
  open() {
    setOpeningClasses(element);

    // accessibility actions
    element.focus();
  },

  close() {
    setClosingClasses(element);
  },

  bindEvents() {
    if (closeMode === CLOSE_MODE.outside) {
      const onClickTarget = (event) => {
        event.stopPropagation();
      }; // eat the event - nom nom
      attachListeners(element, onClickTarget);
      attachListeners(
        element,
        getKeypressHandler([KEYS.space, KEYS.enter], onClickTarget),
        config.events.key
      );
    }
  }
});


const mountToggle = (element, target, closeMode, closeArea = null, isMenu = false) => {
  const groupName = getGroupName(element);

  initAriaAttributesToggle(element, isMenu);
  if (closeArea) {
    initAriaAttributesToggle(closeArea, isMenu); // treat close button as another toggle
  }

  return {
    element,
    open() {
      setOpeningClasses(element);
      target.open();

      // bind close events
      if (closeMode !== CLOSE_MODE.manual) {
        // needs to happen after event propagation
        attachListenersInNextTick(document.body, this.closeHandler);
        attachListenersInNextTick(
          document.body,
          this.keyboardCloseOutsideHandler,
          config.events.key
        );
      }
      attachListeners(document.body, this.keyboardCloseHandler, config.events.key);

      // accessibility actions
      setAriaExpanded(element, true);
      if (closeArea) {
        setAriaExpanded(closeArea, true);
      }
    },

    // methods
    close() {
      setClosingClasses(element);
      target.close();

      // unbind close events
      removeListeners(document.body, this.closeHandler);
      removeListeners(document.body, this.keyboardCloseHandler, config.events.key);
      removeListeners(document.body, this.keyboardCloseOutsideHandler, config.events.key);

      // accessibility actions
      setAriaExpanded(element, false);
      if (closeArea) {
        setAriaExpanded(closeArea, false);
      }
    },

    onToggle() {
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

    bindEvents(closeHandler) {
      this.closeHandler = closeHandler;
      this.keyboardCloseHandler = getKeypressHandler([KEYS.escape], () => {
        closeHandler();
        element.focus();
      });
      this.keyboardCloseOutsideHandler = getKeypressHandler([KEYS.enter, KEYS.space], () => {
        closeHandler();
        element.focus();
      });
      attachListeners(element, this.onToggle.bind(this));
      attachKeyListeners(
        element,
        [KEYS.enter, KEYS.space, KEYS.down, KEYS.up],
        this.onToggle.bind(this)
      );

      target.bindEvents(closeHandler);

      if (closeArea) {
        const closeButtonHandler = () => {
          this.close();
          click(element.parentElement); // continue event propagation
        };

        attachListeners(closeArea, closeButtonHandler);

        attachKeyListeners(
          closeArea,
          [KEYS.enter, KEYS.space, KEYS.escape],
          closeButtonHandler
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
  const closeArea = findCloseArea(element);
  const closeMode = getCloseMode(element);
  const menuMode = getMenuMode(element);

  const target = mountTarget(targetElement, closeMode);
  const toggle = mountToggle(element, target, closeMode, closeArea, menuMode);
  const closeHandler = getCloseHandler(toggle, target);

  toggle.bindEvents(closeHandler);

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
