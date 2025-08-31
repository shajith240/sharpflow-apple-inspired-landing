/**
 * Performance utilities for device detection and performance profiling
 * Optimizes interactive components based on device capabilities
 */

export interface DeviceCapabilities {
  isMobile: boolean;
  isLowEnd: boolean;
  memoryGB: number;
  cores: number;
  pixelRatio: number;
  maxTextureSize: number;
  supportsWebGL: boolean;
  batteryLevel?: number;
  isIOS: boolean;
  isAndroid: boolean;
}

export interface PerformanceProfile {
  tier: "high" | "medium" | "low";
  maxParticles: number;
  maxSpheres: number;
  targetFPS: number;
  enableShadows: boolean;
  enableGlow: boolean;
  renderScale: number;
  physicsSteps: number;
}

export interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsage: number;
  isThrottling: boolean;
  timestamp: number;
}

export interface AdaptiveComponentConfig {
  audioVisualizer: {
    particleCount: number;
    updateFrequency: number;
    enableGlow: boolean;
    renderScale: number;
  };
}

// Performance tier configurations optimized for desktop gaming PCs
export const PERFORMANCE_PROFILES: Record<
  PerformanceProfile["tier"],
  PerformanceProfile
> = {
  high: {
    tier: "high",
    maxParticles: 1500, // Increased for better visuals
    maxSpheres: 200,
    targetFPS: 60,
    enableShadows: true,
    enableGlow: true,
    renderScale: 1.0,
    physicsSteps: 12,
  },
  medium: {
    tier: "medium",
    maxParticles: 800, // Increased default
    maxSpheres: 100,
    targetFPS: 60, // Target 60fps for smooth experience
    enableShadows: false,
    enableGlow: true,
    renderScale: 1.0, // Full resolution
    physicsSteps: 8,
  },
  low: {
    tier: "low",
    maxParticles: 400, // Still increased from original
    maxSpheres: 60,
    targetFPS: 30,
    enableShadows: false,
    enableGlow: false,
    renderScale: 0.8,
    physicsSteps: 5,
  },
};

/**
 * Detect if the device is mobile
 */
export function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false;

  const userAgent = navigator.userAgent.toLowerCase();
  const mobileKeywords = [
    "mobile",
    "android",
    "iphone",
    "ipad",
    "ipod",
    "blackberry",
    "windows phone",
  ];

  return (
    mobileKeywords.some((keyword) => userAgent.includes(keyword)) ||
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0
  );
}

/**
 * Detect iOS devices
 */
export function isIOSDevice(): boolean {
  if (typeof window === "undefined") return false;

  const userAgent = navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent);
}

/**
 * Detect Android devices
 */
export function isAndroidDevice(): boolean {
  if (typeof window === "undefined") return false;

  const userAgent = navigator.userAgent.toLowerCase();
  return /android/.test(userAgent);
}

/**
 * Get device memory in GB (approximate)
 */
export function getDeviceMemory(): number {
  if (typeof window === "undefined") return 4; // Default fallback

  // Use Device Memory API if available
  if ("deviceMemory" in navigator) {
    return (navigator as any).deviceMemory;
  }

  // Fallback estimation based on user agent and other factors
  const isMobile = isMobileDevice();
  const isLowEnd = isLowEndDevice();

  if (isLowEnd) return 1;
  if (isMobile) return 2;
  return 4; // Desktop default
}

/**
 * Get number of CPU cores
 */
export function getCPUCores(): number {
  if (typeof window === "undefined") return 4;

  return navigator.hardwareConcurrency || 4;
}

/**
 * Check WebGL support
 */
export function supportsWebGL(): boolean {
  if (typeof window === "undefined") return false;

  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    return !!gl;
  } catch (e) {
    return false;
  }
}

/**
 * Get maximum texture size for WebGL
 */
export function getMaxTextureSize(): number {
  if (typeof window === "undefined") return 2048;

  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (gl) {
      return gl.getParameter(gl.MAX_TEXTURE_SIZE);
    }
  } catch (e) {
    // Fallback
  }

  return 2048; // Safe fallback
}

/**
 * Detect low-end devices based on various factors
 */
export function isLowEndDevice(): boolean {
  if (typeof window === "undefined") return false;

  const memory = getDeviceMemory();
  const cores = getCPUCores();
  const isMobile = isMobileDevice();

  // Low-end criteria
  if (memory <= 1) return true;
  if (cores <= 2 && isMobile) return true;

  // Check for specific low-end device indicators
  const userAgent = navigator.userAgent.toLowerCase();
  const lowEndKeywords = ["android 4", "android 5", "android 6", "android 7"];

  return lowEndKeywords.some((keyword) => userAgent.includes(keyword));
}

/**
 * Get battery level if available
 */
export async function getBatteryLevel(): Promise<number | undefined> {
  if (typeof window === "undefined") return undefined;

  try {
    if ("getBattery" in navigator) {
      const battery = await (navigator as any).getBattery();
      return battery.level;
    }
  } catch (e) {
    // Battery API not supported
  }

  return undefined;
}

/**
 * Get comprehensive device capabilities
 */
export async function getDeviceCapabilities(): Promise<DeviceCapabilities> {
  const batteryLevel = await getBatteryLevel();

  return {
    isMobile: isMobileDevice(),
    isLowEnd: isLowEndDevice(),
    memoryGB: getDeviceMemory(),
    cores: getCPUCores(),
    pixelRatio:
      typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1,
    maxTextureSize: getMaxTextureSize(),
    supportsWebGL: supportsWebGL(),
    batteryLevel,
    isIOS: isIOSDevice(),
    isAndroid: isAndroidDevice(),
  };
}

/**
 * Determine performance tier based on device capabilities - optimized for desktop gaming PCs
 */
export function getPerformanceTier(
  capabilities: DeviceCapabilities
): PerformanceProfile["tier"] {
  // Desktop gaming PC criteria - more generous for high-end classification
  if (
    !capabilities.isMobile &&
    capabilities.memoryGB >= 8 &&
    capabilities.cores >= 6
  ) {
    return "high";
  }

  // Modern desktop criteria
  if (
    !capabilities.isMobile &&
    capabilities.memoryGB >= 4 &&
    capabilities.cores >= 4
  ) {
    return "high";
  }

  // Desktop with decent specs
  if (
    !capabilities.isMobile &&
    capabilities.memoryGB >= 2 &&
    capabilities.cores >= 2
  ) {
    return "medium";
  }

  // Low-end criteria (mostly for very old hardware)
  if (capabilities.isLowEnd || capabilities.memoryGB <= 1) {
    return "low";
  }

  // Default to medium for desktop systems
  return "medium";
}

/**
 * Get performance profile for device
 */
export async function getDevicePerformanceProfile(): Promise<PerformanceProfile> {
  const capabilities = await getDeviceCapabilities();
  const tier = getPerformanceTier(capabilities);

  return PERFORMANCE_PROFILES[tier];
}

/**
 * Get adaptive component configuration based on performance profile
 */
export function getAdaptiveComponentConfig(
  profile: PerformanceProfile
): AdaptiveComponentConfig {
  return {
    audioVisualizer: {
      particleCount: profile.maxParticles,
      updateFrequency: profile.targetFPS,
      enableGlow: profile.enableGlow,
      renderScale: profile.renderScale,
    },
  };
}

/**
 * Performance Monitor Class
 */
export class PerformanceMonitor {
  private isMonitoring = false;
  private frameCount = 0;
  private lastTime = 0;
  private fps = 0;
  private frameTime = 0;
  private callbacks: Array<(metrics: PerformanceMetrics) => void> = [];
  private animationFrameId?: number;

  constructor() {
    this.updateMetrics = this.updateMetrics.bind(this);
  }

  /**
   * Start monitoring performance
   */
  startMonitoring(): void {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    this.lastTime = performance.now();
    this.frameCount = 0;
    this.updateMetrics();
  }

  /**
   * Stop monitoring performance
   */
  stopMonitoring(): void {
    this.isMonitoring = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  /**
   * Get current performance metrics
   */
  getMetrics(): PerformanceMetrics {
    return {
      fps: this.fps,
      frameTime: this.frameTime,
      memoryUsage: this.getMemoryUsage(),
      isThrottling: this.fps < 20, // Consider throttling if FPS drops below 20
      timestamp: Date.now(),
    };
  }

  /**
   * Add callback for performance drop events
   */
  onPerformanceDrop(callback: (metrics: PerformanceMetrics) => void): void {
    this.callbacks.push(callback);
  }

  /**
   * Remove performance drop callback
   */
  removeCallback(callback: (metrics: PerformanceMetrics) => void): void {
    const index = this.callbacks.indexOf(callback);
    if (index > -1) {
      this.callbacks.splice(index, 1);
    }
  }

  /**
   * Update performance metrics
   */
  private updateMetrics(): void {
    if (!this.isMonitoring) return;

    const currentTime = performance.now();
    this.frameTime = currentTime - this.lastTime;
    this.frameCount++;

    // Calculate FPS every second
    if (currentTime - this.lastTime >= 1000) {
      this.fps = Math.round(
        (this.frameCount * 1000) / (currentTime - this.lastTime)
      );
      this.frameCount = 0;
      this.lastTime = currentTime;

      // Check for performance issues
      const metrics = this.getMetrics();
      if (metrics.fps < 20 || metrics.frameTime > 50) {
        this.callbacks.forEach((callback) => callback(metrics));
      }
    }

    this.animationFrameId = requestAnimationFrame(this.updateMetrics);
  }

  /**
   * Get memory usage (if available)
   */
  private getMemoryUsage(): number {
    if (typeof window === "undefined") return 0;

    try {
      if ("memory" in performance) {
        const memory = (performance as any).memory;
        return memory.usedJSHeapSize / memory.jsHeapSizeLimit;
      }
    } catch (e) {
      // Memory API not available
    }

    return 0;
  }
}

/**
 * Global performance monitor instance
 */
export const globalPerformanceMonitor = new PerformanceMonitor();

/**
 * Utility to run a performance benchmark
 */
export function runPerformanceBenchmark(): Promise<number> {
  return new Promise((resolve) => {
    const startTime = performance.now();
    let iterations = 0;
    const maxTime = 100; // Run for 100ms

    function benchmark() {
      const currentTime = performance.now();
      if (currentTime - startTime < maxTime) {
        // Simple computational task
        for (let i = 0; i < 1000; i++) {
          Math.sqrt(Math.random() * 1000);
        }
        iterations++;
        requestAnimationFrame(benchmark);
      } else {
        const score = iterations * 10; // Arbitrary scoring
        resolve(score);
      }
    }

    requestAnimationFrame(benchmark);
  });
}
