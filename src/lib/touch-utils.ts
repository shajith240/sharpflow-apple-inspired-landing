/**
 * Touch utilities for handling touch events and coordinate conversion
 * Provides reusable touch handling functionality for interactive components
 */

export interface TouchPosition {
  x: number;
  y: number;
  isActive: boolean;
  inputType: 'mouse' | 'touch';
  timestamp: number;
}

export interface TouchState {
  isActive: boolean;
  position: { x: number; y: number };
  startPosition: { x: number; y: number };
  timestamp: number;
  identifier: number;
}

export interface TouchConfig {
  enableTouch: boolean;
  touchSensitivity: number;
  preventDefaultBehavior: boolean;
  throttleInterval: number;
}

/**
 * Default touch configuration
 */
export const DEFAULT_TOUCH_CONFIG: TouchConfig = {
  enableTouch: true,
  touchSensitivity: 1.0,
  preventDefaultBehavior: true,
  throttleInterval: 16, // ~60fps
};

/**
 * Get touch position relative to an element
 */
export function getTouchPosition(
  touch: Touch,
  element: HTMLElement
): { x: number; y: number } {
  const rect = element.getBoundingClientRect();
  return {
    x: touch.clientX - rect.left,
    y: touch.clientY - rect.top,
  };
}

/**
 * Get normalized touch position (-1 to 1 range)
 */
export function getNormalizedTouchPosition(
  touch: Touch,
  element: HTMLElement
): { x: number; y: number } {
  const rect = element.getBoundingClientRect();
  const x = (touch.clientX - rect.left) / rect.width;
  const y = (touch.clientY - rect.top) / rect.height;
  
  return {
    x: (x * 2) - 1, // Convert to -1 to 1 range
    y: -((y * 2) - 1), // Convert to -1 to 1 range, flip Y axis
  };
}

/**
 * Get the primary touch from a TouchList (first touch)
 */
export function getPrimaryTouch(touches: TouchList): Touch | null {
  return touches.length > 0 ? touches[0] : null;
}

/**
 * Create a touch state object
 */
export function createTouchState(
  touch: Touch,
  element: HTMLElement
): TouchState {
  const position = getTouchPosition(touch, element);
  
  return {
    isActive: true,
    position,
    startPosition: { ...position },
    timestamp: Date.now(),
    identifier: touch.identifier,
  };
}

/**
 * Update touch state with new touch data
 */
export function updateTouchState(
  state: TouchState,
  touch: Touch,
  element: HTMLElement
): TouchState {
  const position = getTouchPosition(touch, element);
  
  return {
    ...state,
    position,
    timestamp: Date.now(),
  };
}

/**
 * Check if touch events are supported
 */
export function isTouchSupported(): boolean {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * Throttle function for touch events
 */
export function createTouchThrottle<T extends any[]>(
  fn: (...args: T) => void,
  interval: number
): (...args: T) => void {
  let lastCall = 0;
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: T) => {
    const now = Date.now();
    
    if (now - lastCall >= interval) {
      lastCall = now;
      fn(...args);
    } else {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        lastCall = Date.now();
        fn(...args);
      }, interval - (now - lastCall));
    }
  };
}

/**
 * Prevent default touch behaviors that interfere with component interaction
 */
export function preventTouchDefaults(event: TouchEvent): void {
  // Prevent scrolling, zooming, and other default touch behaviors
  event.preventDefault();
  
  // Stop event propagation to prevent interference with other components
  event.stopPropagation();
}

/**
 * Touch event handler manager for components
 */
export class TouchManager {
  private element: HTMLElement;
  private config: TouchConfig;
  private touchState: TouchState | null = null;
  private throttledHandlers: Map<string, Function> = new Map();

  constructor(element: HTMLElement, config: Partial<TouchConfig> = {}) {
    this.element = element;
    this.config = { ...DEFAULT_TOUCH_CONFIG, ...config };
  }

  /**
   * Add touch event listeners
   */
  addTouchListeners(handlers: {
    onTouchStart?: (state: TouchState, event: TouchEvent) => void;
    onTouchMove?: (state: TouchState, event: TouchEvent) => void;
    onTouchEnd?: (state: TouchState | null, event: TouchEvent) => void;
    onTouchCancel?: (state: TouchState | null, event: TouchEvent) => void;
  }): void {
    if (!this.config.enableTouch || !isTouchSupported()) {
      return;
    }

    // Create throttled handlers
    const throttledMove = handlers.onTouchMove 
      ? createTouchThrottle(handlers.onTouchMove, this.config.throttleInterval)
      : null;

    const handleTouchStart = (event: TouchEvent) => {
      if (this.config.preventDefaultBehavior) {
        preventTouchDefaults(event);
      }

      const primaryTouch = getPrimaryTouch(event.touches);
      if (primaryTouch) {
        this.touchState = createTouchState(primaryTouch, this.element);
        handlers.onTouchStart?.(this.touchState, event);
      }
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (this.config.preventDefaultBehavior) {
        preventTouchDefaults(event);
      }

      if (this.touchState) {
        const primaryTouch = getPrimaryTouch(event.touches);
        if (primaryTouch && primaryTouch.identifier === this.touchState.identifier) {
          this.touchState = updateTouchState(this.touchState, primaryTouch, this.element);
          throttledMove?.(this.touchState, event);
        }
      }
    };

    const handleTouchEnd = (event: TouchEvent) => {
      if (this.config.preventDefaultBehavior) {
        preventTouchDefaults(event);
      }

      handlers.onTouchEnd?.(this.touchState, event);
      this.touchState = null;
    };

    const handleTouchCancel = (event: TouchEvent) => {
      if (this.config.preventDefaultBehavior) {
        preventTouchDefaults(event);
      }

      handlers.onTouchCancel?.(this.touchState, event);
      this.touchState = null;
    };

    // Store handlers for cleanup
    this.throttledHandlers.set('touchstart', handleTouchStart);
    this.throttledHandlers.set('touchmove', handleTouchMove);
    this.throttledHandlers.set('touchend', handleTouchEnd);
    this.throttledHandlers.set('touchcancel', handleTouchCancel);

    // Add event listeners with passive option where appropriate
    this.element.addEventListener('touchstart', handleTouchStart, { passive: !this.config.preventDefaultBehavior });
    this.element.addEventListener('touchmove', handleTouchMove, { passive: !this.config.preventDefaultBehavior });
    this.element.addEventListener('touchend', handleTouchEnd, { passive: !this.config.preventDefaultBehavior });
    this.element.addEventListener('touchcancel', handleTouchCancel, { passive: !this.config.preventDefaultBehavior });
  }

  /**
   * Remove touch event listeners and cleanup
   */
  cleanup(): void {
    const touchstart = this.throttledHandlers.get('touchstart') as EventListener;
    const touchmove = this.throttledHandlers.get('touchmove') as EventListener;
    const touchend = this.throttledHandlers.get('touchend') as EventListener;
    const touchcancel = this.throttledHandlers.get('touchcancel') as EventListener;

    if (touchstart) this.element.removeEventListener('touchstart', touchstart);
    if (touchmove) this.element.removeEventListener('touchmove', touchmove);
    if (touchend) this.element.removeEventListener('touchend', touchend);
    if (touchcancel) this.element.removeEventListener('touchcancel', touchcancel);

    this.throttledHandlers.clear();
    this.touchState = null;
  }

  /**
   * Get current touch state
   */
  getTouchState(): TouchState | null {
    return this.touchState;
  }

  /**
   * Check if touch is currently active
   */
  isTouchActive(): boolean {
    return this.touchState?.isActive ?? false;
  }
}