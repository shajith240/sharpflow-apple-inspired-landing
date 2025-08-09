"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useTheme } from "next-themes";
import { TouchManager, TouchState, getTouchPosition } from "@/lib/touch-utils";
import {
  getDevicePerformanceProfile,
  getAdaptiveComponentConfig,
  PerformanceProfile,
} from "@/lib/performance-utils";

interface Particle {
  homeX: number;
  homeY: number;
  homeZ: number;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  color: string;
}

interface PointerState {
  x: number | null;
  y: number | null;
  radius: number;
  isTouch: boolean;
}

const SphereAudioVisualizer = () => {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  // Unified pointer state for both mouse and touch interactions
  const pointerRef = useRef<PointerState>({
    x: null,
    y: null,
    radius: 100,
    isTouch: false,
  });
  const touchManagerRef = useRef<TouchManager | null>(null);
  const rotationRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  // Performance-aware configuration
  const [performanceProfile, setPerformanceProfile] =
    useState<PerformanceProfile | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastFrameTime = useRef(0);
  const frameCount = useRef(0);
  const currentFPS = useRef(60);
  const scrollTimeoutRef = useRef<number>(0);
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Dynamic particle count based on device performance
  const numParticles = performanceProfile?.maxParticles || 300; // Default to low-end for safety
  const sphereRadiusRef = useRef(150);
  const renderScale = performanceProfile?.renderScale || 0.6;

  const createParticle = useCallback(
    (x: number, y: number, z: number): Particle => ({
      homeX: x,
      homeY: y,
      homeZ: z,
      x,
      y,
      z,
      vx: 0,
      vy: 0,
      vz: 0,
      color:
        theme === "light" ? `rgba(0, 0, 0, 0.8)` : `rgba(173, 216, 230, 0.8)`, // Pure black in light theme, light blue in dark theme
    }),
    [theme]
  );

  const projectParticle = useCallback(
    (particle: Particle, width: number, height: number) => {
      const fov = width * 1.2;
      const projectionScale = fov / (fov + particle.z + 200); // Added offset to prevent zoom out
      const projX = particle.x * projectionScale + width / 2;
      const projY = particle.y * projectionScale + height / 2;
      const size = Math.max(1, 2.5 * projectionScale); // Larger minimum size
      return { x: projX, y: projY, size };
    },
    []
  );

  const updateParticle = useCallback(
    (particle: Particle, avgAudio: number = 0) => {
      // Force to return to home position
      const homeForceX = (particle.homeX - particle.x) * 0.01;
      const homeForceY = (particle.homeY - particle.y) * 0.01;
      const homeForceZ = (particle.homeZ - particle.z) * 0.01;

      // Pointer (mouse/touch) repulsion force
      let pointerForceX = 0,
        pointerForceY = 0;
      const pointer = pointerRef.current;
      if (pointer.x !== null && pointer.y !== null && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const dx = particle.x - (pointer.x - rect.width / 2);
        const dy = particle.y - (pointer.y - rect.height / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < pointer.radius) {
          const force = (pointer.radius - distance) / pointer.radius;
          // Slightly stronger force for touch to compensate for finger size
          const forceMultiplier = pointer.isTouch ? 2.5 : 2;
          pointerForceX = (dx / distance) * force * forceMultiplier;
          pointerForceY = (dy / distance) * force * forceMultiplier;
        }
      }

      // Gentle pulsing effect (simulating audio) - only outward expansion
      const time = Date.now() * 0.001;
      const audioForce = Math.max(
        0,
        (Math.sin(time * 2) + Math.sin(time * 3.7) + Math.sin(time * 5.1)) *
          0.15
      );
      const angleToCenter = Math.atan2(particle.homeY, particle.homeX);
      const audioForceX = Math.cos(angleToCenter) * audioForce;
      const audioForceY = Math.sin(angleToCenter) * audioForce;

      // Combine forces and apply velocity
      particle.vx += homeForceX + pointerForceX + audioForceX;
      particle.vy += homeForceY + pointerForceY + audioForceY;
      particle.vz += homeForceZ;

      // Apply damping/friction
      particle.vx *= 0.92;
      particle.vy *= 0.92;
      particle.vz *= 0.92;

      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.z += particle.vz;
    },
    []
  );

  const createParticles = useCallback(
    (containerWidth: number, containerHeight: number) => {
      // Calculate responsive sphere radius based on container size
      // Use 40% of the smaller dimension to ensure it fits with expansion
      const maxRadius = Math.min(containerWidth, containerHeight) * 0.4;
      sphereRadiusRef.current = maxRadius;

      const particles: Particle[] = [];
      // Use Fibonacci sphere algorithm for even distribution
      const goldenAngle = Math.PI * (3 - Math.sqrt(5));

      for (let i = 0; i < numParticles; i++) {
        const y = 1 - (i / (numParticles - 1)) * 2; // y goes from 1 to -1
        const radiusAtY = Math.sqrt(1 - y * y);
        const theta = goldenAngle * i;
        const x = Math.cos(theta) * radiusAtY;
        const z = Math.sin(theta) * radiusAtY;

        particles.push(
          createParticle(
            x * sphereRadiusRef.current,
            y * sphereRadiusRef.current,
            z * sphereRadiusRef.current
          )
        );
      }

      particlesRef.current = particles;
    },
    [createParticle]
  );

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !performanceProfile) return;

    // Use adaptive pixel ratio based on performance
    const baseDPR = window.devicePixelRatio || 1;
    const adaptiveDPR = Math.min(
      baseDPR,
      performanceProfile.tier === "low" ? 1 : baseDPR
    );
    const dpr = adaptiveDPR * renderScale;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.scale(dpr, dpr);
      // Optimize canvas for performance
      ctx.imageSmoothingEnabled = performanceProfile.tier !== "low";
    }

    // Recreate particles with new container dimensions
    createParticles(rect.width, rect.height);
  }, [createParticles, performanceProfile, renderScale]);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !performanceProfile) return;

    // Completely pause animation when not visible (major performance boost)
    if (!isVisible) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }

    // Pause animation during mobile scrolling to prevent performance issues
    if (isMobile && isScrolling) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }

    // Performance monitoring and frame rate limiting
    const now = performance.now();
    const deltaTime = now - lastFrameTime.current;

    // More aggressive FPS limiting during scroll on mobile
    let targetFPS = performanceProfile.targetFPS;
    if (isMobile && isScrolling) {
      targetFPS = Math.min(targetFPS, 15); // Cap at 15fps during scroll
    } else if (isMobile) {
      targetFPS = Math.min(targetFPS, 24); // Cap at 24fps on mobile when not scrolling
    }

    const targetFrameTime = 1000 / targetFPS;

    // Skip frame if we're running too fast (frame rate limiting)
    if (deltaTime < targetFrameTime) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }

    lastFrameTime.current = now;
    frameCount.current++;

    // Calculate current FPS every 60 frames
    if (frameCount.current % 60 === 0) {
      currentFPS.current = Math.round(1000 / deltaTime);
    }

    const baseDPR = window.devicePixelRatio || 1;
    const adaptiveDPR = Math.min(
      baseDPR,
      performanceProfile.tier === "low" ? 1 : baseDPR
    );
    const dpr = adaptiveDPR * renderScale;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    // Clear canvas completely for transparent background
    ctx.clearRect(0, 0, width, height);

    const rotation = rotationRef.current;

    // Smoothly interpolate rotation towards the target
    const rotationSpeed = performanceProfile.tier === "low" ? 0.03 : 0.05;
    rotation.x += (rotation.targetX - rotation.x) * rotationSpeed;
    rotation.y += (rotation.targetY - rotation.y) * rotationSpeed;

    // Add gentle auto-rotation when pointer is not active
    if (pointerRef.current.x === null) {
      const time =
        Date.now() * (performanceProfile.tier === "low" ? 0.0003 : 0.0005);
      rotation.targetX = Math.sin(time) * 0.2;
      rotation.targetY = Math.cos(time * 0.7) * 0.3;
    }

    // Particle culling and rendering optimization
    let renderedParticles = 0;
    let maxRenderParticles = numParticles;
    let skipPattern = 1;

    // More aggressive culling during mobile scroll
    if (isMobile && isScrolling) {
      maxRenderParticles = Math.floor(numParticles * 0.3); // Only render 30% during scroll
      skipPattern = 3; // Skip 2 out of every 3 particles
    } else if (isMobile) {
      maxRenderParticles = Math.floor(numParticles * 0.6); // Render 60% on mobile
      skipPattern = 2; // Skip every other particle
    } else if (performanceProfile.tier === "low") {
      maxRenderParticles = Math.floor(numParticles * 0.7);
      skipPattern = 2;
    }

    particlesRef.current.forEach((particle, index) => {
      // Skip particles based on performance requirements
      if (skipPattern > 1 && index % skipPattern === 0) return;
      if (renderedParticles >= maxRenderParticles) return;

      // Apply rotation
      const cosX = Math.cos(rotation.x);
      const sinX = Math.sin(rotation.x);
      const cosY = Math.cos(rotation.y);
      const sinY = Math.sin(rotation.y);

      const y1 = particle.y * cosX - particle.z * sinX;
      const z1 = particle.y * sinX + particle.z * cosX;
      const x1 = particle.x * cosY - z1 * sinY;
      const z2 = particle.x * sinY + z1 * cosY;

      const rotatedParticle = createParticle(x1, y1, z2);

      // Update particle physics
      updateParticle(particle);
      const proj = projectParticle(rotatedParticle, width, height);

      // Frustum culling - only draw particles that are visible
      if (
        z2 > -sphereRadiusRef.current * 0.8 &&
        proj.x >= -10 &&
        proj.x <= width + 10 &&
        proj.y >= -10 &&
        proj.y <= height + 10
      ) {
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, proj.size, 0, Math.PI * 2);

        // Create gradient effect based on depth with better visibility
        const alpha = Math.max(
          0.3,
          Math.min(
            0.9,
            (z2 + sphereRadiusRef.current) / (sphereRadiusRef.current * 1.5)
          )
        );
        const particleColor =
          theme === "light"
            ? `rgba(0, 0, 0, ${alpha})`
            : `rgba(173, 216, 230, ${alpha})`;
        ctx.fillStyle = particleColor;
        ctx.fill();

        // Add subtle glow effect only on medium/high performance devices
        if (performanceProfile.enableGlow) {
          const glowColor =
            theme === "light"
              ? `rgba(0, 0, 0, 0.2)`
              : `rgba(173, 216, 230, 0.3)`;
          ctx.shadowColor = glowColor;
          ctx.shadowBlur = performanceProfile.tier === "high" ? 2 : 1;
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        renderedParticles++;
      }
    });

    animationRef.current = requestAnimationFrame(animate);
  }, [
    createParticle,
    updateParticle,
    projectParticle,
    theme,
    performanceProfile,
    renderScale,
    isMobile,
    isScrolling,
    isVisible,
  ]);

  // Setup IntersectionObserver for visibility detection
  useEffect(() => {
    if (!containerRef.current) return;

    intersectionObserverRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsVisible(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: "50px", // Start animating 50px before entering viewport
        threshold: 0.1, // Trigger when 10% visible
      }
    );

    intersectionObserverRef.current.observe(containerRef.current);

    return () => {
      if (intersectionObserverRef.current) {
        intersectionObserverRef.current.disconnect();
      }
    };
  }, []);

  // Detect mobile device and handle scroll optimization
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || "ontouchstart" in window);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Handle scroll events for mobile optimization
    const handleScroll = () => {
      if (isMobile) {
        setIsScrolling(true);

        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }

        scrollTimeoutRef.current = window.setTimeout(() => {
          setIsScrolling(false);
        }, 100); // Shorter timeout for quicker resume
      }
    };

    let scrollTicking = false;
    const throttledScrollHandler = () => {
      if (!scrollTicking) {
        requestAnimationFrame(() => {
          handleScroll();
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    };

    window.addEventListener("scroll", throttledScrollHandler, {
      passive: true,
    });

    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("scroll", throttledScrollHandler);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [isMobile]);

  // Initialize performance profile
  useEffect(() => {
    const initializePerformance = async () => {
      try {
        const profile = await getDevicePerformanceProfile();
        // Further reduce performance for mobile devices to prevent scroll issues
        if (window.innerWidth <= 768 || "ontouchstart" in window) {
          setPerformanceProfile({
            ...profile,
            tier: "low",
            maxParticles: Math.min(profile.maxParticles, 120), // Reduced from 200 to 120
            targetFPS: Math.min(profile.targetFPS, 24), // Reduced from 30 to 24
            renderScale: Math.min(profile.renderScale, 0.5), // Reduced from 0.7 to 0.5
            enableGlow: false,
          });
        } else {
          setPerformanceProfile(profile);
        }
        setIsInitialized(true);
      } catch (error) {
        console.warn(
          "Failed to get performance profile, using low-end defaults:",
          error
        );
        // Fallback to low-end profile for safety with even more aggressive mobile limits
        const isMobileDevice =
          window.innerWidth <= 768 || "ontouchstart" in window;
        setPerformanceProfile({
          tier: "low",
          maxParticles: isMobileDevice ? 100 : 300, // Reduced from 150 to 100 for mobile
          maxSpheres: 40,
          targetFPS: isMobileDevice ? 20 : 30, // Reduced from 24 to 20 for mobile
          enableShadows: false,
          enableGlow: false,
          renderScale: isMobileDevice ? 0.4 : 0.6, // Reduced from 0.5 to 0.4 for mobile
          physicsSteps: 3,
        });
        setIsInitialized(true);
      }
    };

    initializePerformance();
  }, []);

  useEffect(() => {
    if (!isInitialized || !performanceProfile) return;

    setupCanvas();
    animate();

    const handleResize = () => setupCanvas();

    // Update pointer position and rotation based on input
    const updatePointerAndRotation = (
      x: number,
      y: number,
      isTouch: boolean = false
    ) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      pointerRef.current.x = x;
      pointerRef.current.y = y;
      pointerRef.current.isTouch = isTouch;

      const rotation = rotationRef.current;
      rotation.targetY = (x - rect.width / 2) * 0.001;
      rotation.targetX = (y - rect.height / 2) * 0.001;
    };

    // Reset pointer state and rotation
    const resetPointerAndRotation = () => {
      pointerRef.current.x = null;
      pointerRef.current.y = null;
      pointerRef.current.isTouch = false;
      const rotation = rotationRef.current;
      rotation.targetX = 0;
      rotation.targetY = 0;
    };

    // Mouse event handlers
    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      updatePointerAndRotation(
        e.clientX - rect.left,
        e.clientY - rect.top,
        false
      );
    };

    const handleMouseLeave = () => {
      resetPointerAndRotation();
    };

    // Touch event handlers using TouchManager
    const canvas = canvasRef.current;
    if (canvas) {
      touchManagerRef.current = new TouchManager(canvas, {
        enableTouch: true,
        preventDefaultBehavior: true,
        touchSensitivity: 1.0,
        throttleInterval: 16, // 60fps
      });

      touchManagerRef.current.addTouchListeners({
        onTouchStart: (touchState: TouchState) => {
          updatePointerAndRotation(
            touchState.position.x,
            touchState.position.y,
            true
          );
        },
        onTouchMove: (touchState: TouchState) => {
          updatePointerAndRotation(
            touchState.position.x,
            touchState.position.y,
            true
          );
        },
        onTouchEnd: () => {
          resetPointerAndRotation();
        },
        onTouchCancel: () => {
          resetPointerAndRotation();
        },
      });

      // Add mouse event listeners
      canvas.addEventListener("mousemove", handleMouseMove);
      canvas.addEventListener("mouseleave", handleMouseLeave);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener("resize", handleResize);

      // Cleanup touch manager
      if (touchManagerRef.current) {
        touchManagerRef.current.cleanup();
        touchManagerRef.current = null;
      }

      // Cleanup mouse events
      if (canvas) {
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [
    setupCanvas,
    createParticles,
    animate,
    isInitialized,
    performanceProfile,
  ]);

  // Show loading state while performance profile is being determined
  if (!isInitialized || !performanceProfile) {
    return (
      <div className="relative w-full h-64 md:h-80 flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-64 md:h-80 flex items-center justify-center"
    >
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full cursor-pointer touch-none"
        style={{ background: "transparent" }}
      />
      {/* Performance indicator for debugging (remove in production) */}
      {process.env.NODE_ENV === "development" && (
        <div className="absolute top-2 left-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
          {performanceProfile.tier} | {numParticles}p | {currentFPS.current}fps
          | {isVisible ? "visible" : "hidden"}
        </div>
      )}
    </div>
  );
};

export default SphereAudioVisualizer;
