/* global describe, expect, it, jest, beforeAll, afterAll */
/* eslint-disable react/no-unknown-property */

import { mouseUp, hasClass, keyPress } from './_utils';
import initToggles, { config, CLOSE_MODE, KEYS } from '../src/lux-toggle';

const createToggles = (targetId, options) => {
  const groupAttr = options.groupName ? `${config.attr.toggleGroup}="${options.groupName}"` : '';
  const closeAttr = options.withCloseButtons || options.withBrokenCloseButtons ? `${config.attr.closeButton}="close-${targetId}"` : '';
  const closeModeAttr = options.mode ? `${config.attr.closeMode}="${options.mode}"` : '';
  return `<span ${config.attr.target}="${targetId}" ${groupAttr} ${closeAttr} ${closeModeAttr}>toggle</span>`;
};

const createTarget = (targetId, options) => {
  if (options.noTarget) {
    return '';
  }
  const closebtn = options.withCloseButtons ? `<div id="close-${targetId}">X</div>` : '';
  return `<div id="${targetId}">target ${closebtn}</div>`;
};

const createTestDom = (targetId, options = {}) => ([
  '<div>',
  `<div>${createToggles(targetId, options)}</div>`,
  `<div>${createTarget(targetId, options)}</div>`,
  '</div>'
]).join('');

const getToggles = () => Array.from(document.querySelectorAll(`[${config.attr.target}]`));

const getToggleWithTargetId = targetId => Array.from(document.querySelectorAll(`[${config.attr.target}='${targetId}']`));

const setup = (targetsConfig) => {
  const targets = targetsConfig.map(targetConfig => createTestDom(...targetConfig));
  document.documentElement.innerHTML = targets.join('');
  initToggles();
  return getToggles();
};

const assertOpening = (element) => {
  expect(hasClass(config.classes.opening, element)).toBeTruthy();
  expect(hasClass(config.classes.open, element)).toBeFalsy();
  expect(hasClass(config.classes.closing, element)).toBeFalsy();
};
const assertOpen = (element) => {
  expect(hasClass(config.classes.opening, element)).toBeFalsy();
  expect(hasClass(config.classes.open, element)).toBeTruthy();
  expect(hasClass(config.classes.closing, element)).toBeFalsy();
};
const assertClosing = (element) => {
  expect(hasClass(config.classes.opening, element)).toBeFalsy();
  expect(hasClass(config.classes.open, element)).toBeFalsy();
  expect(hasClass(config.classes.closing, element)).toBeTruthy();
};
const assertClosed = (element) => {
  expect(hasClass(config.classes.opening, element)).toBeFalsy();
  expect(hasClass(config.classes.open, element)).toBeFalsy();
  expect(hasClass(config.classes.closing, element)).toBeFalsy();
};

describe('toggle', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    document.body.innerHTML = '<head></head><body></body>';
  });

  describe('initialisation', () => {
    it('initialises the toggle', () => {
      const targetId = 'target1';
      const toggles = setup([[targetId]]);
      expect(toggles).toHaveLength(1);
      toggles.forEach((toggleElement) => {
        expect(toggleElement.hasAttribute('aria-expanded')).toBeTruthy();
        expect(toggleElement.getAttribute('aria-expanded')).toEqual('false');
        expect(toggleElement.getAttribute('aria-controls')).toEqual(targetId);
      });
    });

    it('initialises on load if not immediately present', () => {
      const targetId = 'target1';
      initToggles();
      let toggles = getToggles();

      expect(toggles).toHaveLength(0);

      document.documentElement.innerHTML = createTestDom(targetId, {});
      toggles = getToggles();

      expect(toggles).toHaveLength(1);
    });

    it('throws an error if a target cannot be found for the specified target ID', () => {
      const targetId = 'target1';
      let error = null;
      try {
        setup([[targetId, { noTarget: true }]]);
      } catch (e) {
        error = e;
      }
      expect(error).not.toBeNull();
      expect(error.message).toContain(targetId);
    });
  });

  describe('toggling', () => {
    it('toggle opens and closes by applying appropriate classes', () => {
      const targetId = 'target1';
      const toggle = setup([[targetId]]).pop();
      const target = document.getElementById(targetId);

      assertClosed(toggle);
      assertClosed(target);

      mouseUp(toggle);

      assertOpening(toggle);
      assertOpening(target);

      jest.runAllTimers();

      assertOpen(toggle);
      assertOpen(target);

      mouseUp(toggle);

      assertClosing(toggle);
      assertClosing(target);

      jest.runAllTimers();
      assertClosed(toggle);
      assertClosed(target);
    });

    it('can be navigated by keyboard', () => {
      const toggle = setup([['target1']]).pop();

      assertClosed(toggle);

      keyPress(KEYS.enter, toggle);
      jest.runAllTimers();

      assertOpen(toggle);

      keyPress(KEYS.enter, toggle);
      jest.runAllTimers();

      assertClosed(toggle);
    });

    it('toggles the elements aria attributes appropriately', () => {
      const toggle = setup(['target1']).pop();

      expect(toggle.getAttribute('aria-expanded')).toBe('false');

      mouseUp(toggle);
      jest.runAllTimers();

      expect(toggle.getAttribute('aria-expanded')).toBe('true');

      mouseUp(toggle);
      jest.runAllTimers();

      expect(toggle.getAttribute('aria-expanded')).toBe('false');
    });

    it('stays open when clicked inside the target', () => {
      const targetId = 'target1';
      const toggle = setup([[targetId]]).pop();
      const target = document.getElementById(targetId);

      assertClosed(toggle);
      assertClosed(target);

      mouseUp(toggle);
      jest.runAllTimers();

      assertOpen(toggle);
      assertOpen(target);

      mouseUp(target); // mouseUp inside target
      jest.runAllTimers();

      assertOpen(toggle);
      assertOpen(target);
    });

    it('toggle closes when escape pressed while the target is open', () => {
      const targetId = 'target1';
      const toggle = setup([[targetId]]).pop();
      const target = document.getElementById(targetId);
      mouseUp(toggle);
      jest.runAllTimers();

      assertOpen(toggle);
      assertOpen(target);

      keyPress(KEYS.escape, document.body);
      jest.runAllTimers();

      assertClosed(toggle);
      assertClosed(target);
    });
  });

  describe('close area', () => {
    it('toggles closed when close button is pressed', () => {
      const targetId = 'target1';
      const toggle = setup([[targetId, { withCloseButtons: true }]]).pop();
      const target = document.getElementById(targetId);
      const closeButton = document.getElementById(`close-${targetId}`);

      assertClosed(toggle);
      assertClosed(target);

      mouseUp(toggle);

      assertOpening(toggle);
      assertOpening(target);

      jest.runAllTimers();

      assertOpen(toggle);
      assertOpen(target);

      mouseUp(closeButton);

      assertClosing(toggle);
      assertClosing(target);

      jest.runAllTimers();
      assertClosed(toggle);
      assertClosed(target);
    });

    it('throws an error if a close areas cannot be found for the specified ID', () => {
      const targetId = 'target1';
      let error = null;
      try {
        setup([['target1', { withBrokenCloseButtons: true }]]);
      } catch (e) {
        error = e;
      }
      expect(error).not.toBeNull();
      expect(error.message).toContain(targetId);
    });
  });

  describe('close mode', () => {
    describe('manual (default)', () => {
      it('Stays open when clicked outside', () => {
        const targetId = 'target1';
        const toggle = setup([[targetId]]).pop();
        const target = document.getElementById(targetId);

        mouseUp(toggle);
        jest.runAllTimers();

        assertOpen(toggle);
        assertOpen(target);

        mouseUp(document.body); // click outside
        jest.runAllTimers();

        assertOpen(toggle);
        assertOpen(target);
      });

      it('stays open when siblings are clicked', () => {
        const target1 = 'target1';
        const target2 = 'target2';
        const toggles = setup([[target1], [target2]], { groupName: 'testGroup' });
        const targets = [target1, target2].map(id => document.getElementById(id));

        assertClosed(toggles[0]);
        assertClosed(toggles[1]);

        mouseUp(toggles[0]);
        jest.runAllTimers();

        assertOpen(toggles[0]);
        assertOpen(targets[0]);
        assertClosed(toggles[1]);
        assertClosed(targets[1]);

        mouseUp(toggles[1]);
        jest.runAllTimers();

        assertOpen(toggles[0]);
        assertOpen(targets[0]);
        assertOpen(toggles[1]);
        assertOpen(targets[1]);

        mouseUp(toggles[0]);
        jest.runAllTimers();

        assertClosed(toggles[0]);
        assertClosed(targets[0]);
        assertOpen(toggles[1]);
        assertOpen(targets[1]);
      });
    });

    describe('group', () => {
      it('waits for siblings to animate closing before opening', () => {
        const target1 = 'target1';
        const target2 = 'target2';
        const groupConfig = { groupName: 'testGroup', mode: CLOSE_MODE.group };
        const toggles = setup([[target1, groupConfig], [target2, groupConfig]]);
        const targets = [target1, target2].map(id => document.getElementById(id));

        assertClosed(toggles[0]);
        assertClosed(toggles[1]);

        mouseUp(toggles[0]);
        jest.runAllTimers();

        assertOpen(toggles[0]);
        assertOpen(targets[0]);
        assertClosed(toggles[1]);
        assertClosed(targets[1]);

        mouseUp(toggles[1]);
        jest.advanceTimersByTime(config.animations.siblingOpenDelay / 2);

        assertClosing(toggles[0]);
        assertClosing(targets[0]);
        assertOpening(toggles[1]);
        assertClosed(targets[1]);

        jest.advanceTimersByTime(config.animations.siblingOpenDelay / 2);

        assertClosed(toggles[0]);
        assertClosed(targets[0]);
        assertOpening(toggles[1]);
        assertOpening(targets[1]);

        jest.runAllTimers();

        assertClosed(toggles[0]);
        assertClosed(targets[0]);
        assertOpen(toggles[1]);
        assertOpen(targets[1]);
      });
    });

    describe('outside', () => {
      it('toggle closes when a click is made outside of the toggle or target', () => {
        const targetId = 'target1';
        const toggle = setup([[targetId, { mode: CLOSE_MODE.outside }]]).pop();
        const target = document.getElementById(targetId);

        mouseUp(toggle);
        jest.runAllTimers();

        assertOpen(toggle);
        assertOpen(target);

        mouseUp(document.body); // click outside
        jest.runAllTimers();

        assertClosed(toggle);
        assertClosed(toggle);
        assertClosed(target);
      });

      it('toggle closes when a click is on a different toggle', () => {
        const targetIdManual = 'target1Manual';
        const targetIdAuto = 'target2Auto';

        setup([[targetIdManual], [targetIdAuto, { mode: CLOSE_MODE.outside }]]).pop();

        const targetManual = document.getElementById(targetIdManual);
        const toggleManual = getToggleWithTargetId(targetIdManual).pop();
        const targetAuto = document.getElementById(targetIdAuto);
        const toggleAuto = getToggleWithTargetId(targetIdAuto).pop();

        mouseUp(toggleManual);
        jest.runAllTimers();

        assertOpen(toggleManual);
        assertOpen(targetManual);
        assertClosed(toggleAuto);
        assertClosed(targetAuto);

        mouseUp(toggleAuto);
        jest.runAllTimers();

        assertOpen(toggleManual);
        assertOpen(targetManual);
        assertOpen(toggleAuto);
        assertOpen(targetAuto);

        mouseUp(toggleManual);
        jest.runAllTimers();

        assertClosed(toggleManual);
        assertClosed(targetManual);
        assertClosed(toggleAuto);
        assertClosed(targetAuto);
      });

      it('toggle closes when a click is on the open target of a different toggle', () => {
        const targetIdManual = 'target1Manual';
        const targetIdAuto = 'target2Auto';

        setup([[targetIdManual], [targetIdAuto, { mode: CLOSE_MODE.outside }]]).pop();

        const targetManual = document.getElementById(targetIdManual);
        const toggleManual = getToggleWithTargetId(targetIdManual).pop();
        const targetAuto = document.getElementById(targetIdAuto);
        const toggleAuto = getToggleWithTargetId(targetIdAuto).pop();

        mouseUp(toggleManual);
        jest.runAllTimers();

        assertOpen(toggleManual);
        assertOpen(targetManual);
        assertClosed(toggleAuto);
        assertClosed(targetAuto);

        mouseUp(toggleAuto);
        jest.runAllTimers();

        assertOpen(toggleManual);
        assertOpen(targetManual);
        assertOpen(toggleAuto);
        assertOpen(targetAuto);

        mouseUp(targetAuto);
        jest.runAllTimers();

        assertOpen(toggleManual);
        assertOpen(targetManual);
        assertOpen(toggleAuto);
        assertOpen(targetAuto);

        mouseUp(targetManual);
        jest.runAllTimers();

        assertOpen(toggleManual);
        assertOpen(targetManual);
        assertClosed(toggleAuto);
        assertClosed(targetAuto);
      });
    });
  });
});
