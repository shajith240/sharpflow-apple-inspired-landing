/**
 * Mobile scroll performance test utility
 * This utility helps test and monitor scroll performance on mobile devices
 */

export interface ScrollPerformanceMetrics {
  averageFrameTime: number;
  droppedFrames: number;
  scrollDuration: number;
  isScrolling: boolean;
}

class MobileScrollTester {
  private frameCount = 0;
  private totalFrameTime = 0;
  private droppedFrames = 0;
  private scrollStartTime = 0;
  private isScrolling = false;
  private lastFrameTime = 0;
  private animationFrame: number | null = null;

  constructor() {
    this.bindEvents();
  }

  private bindEvents() {
    let scrollTimeout: number;

    const handleScroll = () => {
      if (!this.isScrolling) {
        this.isScrolling = true;
        this.scrollStartTime = performance.now();
        this.startMonitoring();
      }

      clearTimeout(scrollTimeout);
      scrollTimeout = window.setTimeout(() => {
        this.isScrolling = false;
        this.stopMonitoring();
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  private startMonitoring() {
    this.frameCount = 0;
    this.totalFrameTime = 0;
    this.droppedFrames = 0;
    this.lastFrameTime = performance.now();
    this.monitor();
  }

  private monitor() {
    if (!this.isScrolling) return;

    const currentTime = performance.now();
    const frameTime = currentTime - this.lastFrameTime;
    
    this.frameCount++;
    this.totalFrameTime += frameTime;
    
    // Consider frame dropped if it takes longer than 16.67ms (60fps)
    if (frameTime > 16.67) {
      this.droppedFrames++;
    }
    
    this.lastFrameTime = currentTime;
    this.animationFrame = requestAnimationFrame(() => this.monitor());
  }

  private stopMonitoring() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  public getMetrics(): ScrollPerformanceMetrics {
    return {
      averageFrameTime: this.frameCount > 0 ? this.totalFrameTime / this.frameCount : 0,
      droppedFrames: this.droppedFrames,
      scrollDuration: this.isScrolling ? performance.now() - this.scrollStartTime : 0,
      isScrolling: this.isScrolling,
    };
  }

  public logMetrics() {
    const metrics = this.getMetrics();
    console.log('Mobile Scroll Performance Metrics:', {
      'Average Frame Time': `${metrics.averageFrameTime.toFixed(2)}ms`,
      'Dropped Frames': metrics.droppedFrames,
      'Scroll Duration': `${metrics.scrollDuration.toFixed(2)}ms`,
      'Is Scrolling': metrics.isScrolling,
      'Estimated FPS': metrics.averageFrameTime > 0 ? Math.round(1000 / metrics.averageFrameTime) : 0,
    });
  }
}

// Export singleton instance
export const mobileScrollTester = new MobileScrollTester();

// Helper function to test scroll performance
export const testMobileScrollPerformance = () => {
  if (typeof window === 'undefined') return;
  
  const isMobile = window.innerWidth <= 768 || 'ontouchstart' in window;
  
  if (isMobile) {
    console.log('🔍 Mobile scroll performance testing enabled');
    
    // Log metrics every 5 seconds
    setInterval(() => {
      mobileScrollTester.logMetrics();
    }, 5000);
  }
};
