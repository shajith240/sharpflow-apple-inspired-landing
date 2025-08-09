/**
 * Unit tests for touch utilities
 */

import {
  getTouchPosition,
  getNormalizedTouchPosition,
  getPrimaryTouch,
  createTouchState,
  updateTouchState,
  isTouchSupported,
  createTouchThrottle,
  preventTouchDefaults,
  TouchManager,
  DEFAULT_TOUCH_CONFIG,
} from '../touch-utils';

// Mock DOM elements and touch events
const createMockElement = (rect: DOMRect): HTMLElement => {
  const element = document.createElement('div');
  jest.spyOn(element, 'getBoundingClientRect').mockReturnValue(rect);
  return element;
};

const createMockTouch = (clientX: number, clientY: number, identifier: number = 0): Touch => ({
  clientX,
  clientY,
  identifier,
  pageX: clientX,
  pageY: clientY,
  screenX: clientX,
  screenY: clientY,
  radiusX: 1,
  radiusY: 1,
  rotationAngle: 0,
  force: 1,
  target: document.createElement('div'),
});

const createMockTouchList = (touches: Touch[]): TouchList => {
  const touchList = {
    length: touches.length,
    item: (index: number) => touches[index] || null,
    [Symbol.iterator]: function* () {
      for (let i = 0; i < touches.length; i++) {
        yield touches[i];
      }
    },
  };
  
  // Add indexed access
  touches.forEach((touch, index) => {
    (touchList as any)[index] = touch;
  });
  
  return touchList as TouchList;
};

describe('Touch Utilities', () => {
  describe('getTouchPosition', () => {
    it('should calculate correct touch position relative to element', () => {
      const element = createMockElement(new DOMRect(100, 50, 200, 150));
      const touch = createMockTouch(150, 100);
      
      const position = getTouchPosition(touch, element);
      
      expect(position).toEqual({ x: 50, y: 50 });
    });

    it('should handle touch at element origin', () => {
      const element = createMockElement(new DOMRect(0, 0, 100, 100));
      const touch = createMockTouch(0, 0);
      
      const position = getTouchPosition(touch, element);
      
      expect(position).toEqual({ x: 0, y: 0 });
    });
  });

  describe('getNormalizedTouchPosition', () => {
    it('should normalize touch position to -1 to 1 range', () => {
      const element = createMockElement(new DOMRect(0, 0, 200, 100));
      const touch = createMockTouch(100, 50); // Center of element
      
      const position = getNormalizedTouchPosition(touch, element);
      
      expect(position).toEqual({ x: 0, y: 0 });
    });

    it('should handle touch at corners', () => {
      const element = createMockElement(new DOMRect(0, 0, 100, 100));
      
      // Top-left corner
      const topLeft = getNormalizedTouchPosition(createMockTouch(0, 0), element);
      expect(topLeft).toEqual({ x: -1, y: 1 });
      
      // Bottom-right corner
      const bottomRight = getNormalizedTouchPosition(createMockTouch(100, 100), element);
      expect(bottomRight).toEqual({ x: 1, y: -1 });
    });
  });

  describe('getPrimaryTouch', () => {
    it('should return first touch from TouchList', () => {
      const touch1 = createMockTouch(10, 20, 1);
      const touch2 = createMockTouch(30, 40, 2);
      const touchList = createMockTouchList([touch1, touch2]);
      
      const primaryTouch = getPrimaryTouch(touchList);
      
      expect(primaryTouch).toBe(touch1);
    });

    it('should return null for empty TouchList', () => {
      const touchList = createMockTouchList([]);
      
      const primaryTouch = getPrimaryTouch(touchList);
      
      expect(primaryTouch).toBeNull();
    });
  });

  describe('createTouchState', () => {
    it('should create touch state with correct properties', () => {
      const element = createMockElement(new DOMRect(0, 0, 100, 100));
      const touch = createMockTouch(50, 25, 1);
      
      const state = createTouchState(touch, element);
      
      expect(state).toMatchObject({
        isActive: true,
        position: { x: 50, y: 25 },
        startPosition: { x: 50, y: 25 },
        identifier: 1,
      });
      expect(state.timestamp).toBeCloseTo(Date.now(), -2);
    });
  });

  describe('updateTouchState', () => {
    it('should update touch state with new position', () => {
      const element = createMockElement(new DOMRect(0, 0, 100, 100));
      const initialTouch = createMockTouch(25, 25, 1);
      const initialState = createTouchState(initialTouch, element);
      
      const newTouch = createMockTouch(75, 75, 1);
      const updatedState = updateTouchState(initialState, newTouch, element);
      
      expect(updatedState).toMatchObject({
        isActive: true,
        position: { x: 75, y: 75 },
        startPosition: { x: 25, y: 25 }, // Should remain unchanged
        identifier: 1,
      });
      expect(updatedState.timestamp).toBeGreaterThan(initialState.timestamp);
    });
  });

  describe('createTouchThrottle', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should throttle function calls', () => {
      const mockFn = jest.fn();
      const throttledFn = createTouchThrottle(mockFn, 100);
      
      throttledFn('arg1');
      throttledFn('arg2');
      throttledFn('arg3');
      
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('arg1');
      
      jest.advanceTimersByTime(100);
      
      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenLastCalledWith('arg3');
    });

    it('should call function immediately if enough time has passed', () => {
      const mockFn = jest.fn();
      const throttledFn = createTouchThrottle(mockFn, 100);
      
      throttledFn('arg1');
      jest.advanceTimersByTime(100);
      throttledFn('arg2');
      
      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenNthCalledWith(1, 'arg1');
      expect(mockFn).toHaveBeenNthCalledWith(2, 'arg2');
    });
  });

  describe('TouchManager', () => {
    let element: HTMLElement;
    let touchManager: TouchManager;

    beforeEach(() => {
      element = createMockElement(new DOMRect(0, 0, 100, 100));
      touchManager = new TouchManager(element);
    });

    afterEach(() => {
      touchManager.cleanup();
    });

    it('should initialize with default config', () => {
      expect(touchManager.isTouchActive()).toBe(false);
      expect(touchManager.getTouchState()).toBeNull();
    });

    it('should handle touch start event', () => {
      const onTouchStart = jest.fn();
      touchManager.addTouchListeners({ onTouchStart });

      const touch = createMockTouch(50, 50, 1);
      const touchEvent = new TouchEvent('touchstart', {
        touches: createMockTouchList([touch]),
      });

      element.dispatchEvent(touchEvent);

      expect(onTouchStart).toHaveBeenCalledTimes(1);
      expect(touchManager.isTouchActive()).toBe(true);
    });

    it('should cleanup event listeners', () => {
      const onTouchStart = jest.fn();
      touchManager.addTouchListeners({ onTouchStart });

      const removeEventListenerSpy = jest.spyOn(element, 'removeEventListener');
      
      touchManager.cleanup();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('touchstart', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('touchmove', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('touchend', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('touchcancel', expect.any(Function));
    });
  });

  describe('preventTouchDefaults', () => {
    it('should prevent default and stop propagation', () => {
      const mockEvent = {
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
      } as unknown as TouchEvent;

      preventTouchDefaults(mockEvent);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockEvent.stopPropagation).toHaveBeenCalled();
    });
  });
});