/* global describe, expect, it, jest, beforeAll, afterAll */
/* eslint-disable react/no-unknown-property */

import { click, hasClass, keyPress } from './_utils';
import initToggles, { config, CLOSE_MODE, KEYS } from '../../components/toggle';

const createToggles = options => (targetId, index) => {
  const groupAttr = options.groupName ? `${config.attributes.group}="${options.groupName}"` : '';
  const closeAttr = options.withCloseButtons || options.withBrokenCloseButtons ? `${config.attributes.close}="close-${targetId}"` : '';
  const closeModeAttr = options.mode ? `${config.attributes.mode}="${options.mode}"` : '';
  return `<span ${config.attributes.target}="${targetId}" ${groupAttr} ${closeAttr} ${closeModeAttr}>toggle ${index}</span>`;
};

const createTarget = options => (targetId, index) => {
  if (options.noTarget) {
    return '';
  }
  const closebtn = options.withCloseButtons ? `<div id="close-${targetId}">X</div>` : '';
  return `<div id="${targetId}">target ${index} ${closebtn}</div>`;
};

const createTestDom = (targetIds, options) => ([
  '<div>',
  `<div>${targetIds.map(createToggles(options)).join('')}</div>`,
  `<div>${targetIds.map(createTarget(options)).join('')}</div>`,
  '</div>'
]).join('');

const getToggles = () => Array.from(document.querySelectorAll(`[${config.attributes.target}]`));

const setup = (targetIds, options = {}) => {
  document.documentElement.innerHTML = createTestDom(targetIds, options);
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
      const toggles = setup([targetId]);
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

      document.documentElement.innerHTML = createTestDom([targetId], {});
      toggles = getToggles();

      expect(toggles).toHaveLength(1);
    });

    it('throws an error if a target cannot be found for the specified target ID', () => {
      const targetId = ['target1'];
      let error = null;
      try {
        setup([targetId], { noTarget: true });
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
      const toggle = setup([targetId]).pop();
      const target = document.getElementById(targetId);

      assertClosed(toggle);
      assertClosed(target);

      click(toggle);

      assertOpening(toggle);
      assertOpening(target);

      jest.runAllTimers();

      assertOpen(toggle);
      assertOpen(target);

      click(toggle);

      assertClosing(toggle);
      assertClosing(target);

      jest.runAllTimers();
      assertClosed(toggle);
      assertClosed(target);
    });

    it('can be navigated by keyboard', () => {
      const toggle = setup(['target1']).pop();

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

      click(toggle);
      jest.runAllTimers();

      expect(toggle.getAttribute('aria-expanded')).toBe('true');

      click(toggle);
      jest.runAllTimers();

      expect(toggle.getAttribute('aria-expanded')).toBe('false');
    });

    it('stays open when clicked inside the target', () => {
      const targetId = 'target1';
      const toggle = setup([targetId]).pop();
      const target = document.getElementById(targetId);

      assertClosed(toggle);
      assertClosed(target);

      click(toggle);
      jest.runAllTimers();

      assertOpen(toggle);
      assertOpen(target);

      click(target); // click inside target
      jest.runAllTimers();

      assertOpen(toggle);
      assertOpen(target);
    });

    it('toggle closes when escape pressed while the target is open', () => {
      const targetId = 'target1';
      const toggle = setup([targetId]).pop();
      const target = document.getElementById(targetId);
      click(toggle);
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
      const toggle = setup([targetId], { withCloseButtons: true }).pop();
      const target = document.getElementById(targetId);
      const closeButton = document.getElementById(`close-${targetId}`);

      assertClosed(toggle);
      assertClosed(target);

      click(toggle);

      assertOpening(toggle);
      assertOpening(target);

      jest.runAllTimers();

      assertOpen(toggle);
      assertOpen(target);

      click(closeButton);

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
        setup(['target1'], { withBrokenCloseButtons: true });
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
        const toggle = setup([targetId]).pop();
        const target = document.getElementById(targetId);

        click(toggle);
        jest.runAllTimers();

        assertOpen(toggle);
        assertOpen(target);

        click(document.body); // click outside
        jest.runAllTimers();

        assertOpen(toggle);
        assertOpen(target);
      });

      it('stays open when siblings are clicked', () => {
        const targetIds = ['target1', 'target2'];
        const toggles = setup(targetIds, { groupName: 'testGroup' });
        const targets = targetIds.map(id => document.getElementById(id));

        assertClosed(toggles[0]);
        assertClosed(toggles[1]);

        click(toggles[0]);
        jest.runAllTimers();

        assertOpen(toggles[0]);
        assertOpen(targets[0]);
        assertClosed(toggles[1]);
        assertClosed(targets[1]);

        click(toggles[1]);
        jest.runAllTimers();

        assertOpen(toggles[0]);
        assertOpen(targets[0]);
        assertOpen(toggles[1]);
        assertOpen(targets[1]);

        click(toggles[0]);
        jest.runAllTimers();

        assertClosed(toggles[0]);
        assertClosed(targets[0]);
        assertOpen(toggles[1]);
        assertOpen(targets[1]);
      });
    });

    describe('group', () => {
      it('waits for siblings to animate closing before opening', () => {
        const targetIds = ['target1', 'target2'];
        const toggles = setup(targetIds, { groupName: 'testGroup', mode: CLOSE_MODE.group });
        const targets = targetIds.map(id => document.getElementById(id));

        assertClosed(toggles[0]);
        assertClosed(toggles[1]);

        click(toggles[0]);
        jest.runAllTimers();

        assertOpen(toggles[0]);
        assertOpen(targets[0]);
        assertClosed(toggles[1]);
        assertClosed(targets[1]);

        click(toggles[1]);
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
        const toggle = setup([targetId], { mode: CLOSE_MODE.outside }).pop();
        const target = document.getElementById(targetId);

        click(toggle);
        jest.runAllTimers();

        assertOpen(toggle);
        assertOpen(target);

        click(document.body); // click outside
        jest.runAllTimers();

        assertClosed(toggle);
        assertClosed(toggle);
        assertClosed(target);
      });
    });
  });
});
