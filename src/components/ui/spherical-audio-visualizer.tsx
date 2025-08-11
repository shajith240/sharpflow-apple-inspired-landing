"use client";

import { useEffect, useRef, useCallback, useState, useMemo } from "react";
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
  const lastFrameTime = useRef(0);
  const frameCount = useRef(0);
  const currentFPS = useRef(60);

  // Dynamic particle count based on device performance
  const numParticles = performanceProfile?.maxParticles || 300; // Default to low-end for safety
  const sphereRadiusRef = useRef(150);
  const renderScale = performanceProfile?.renderScale || 0.6;

  // Read CSS HSL variables and convert to HSL numeric tuples for canvas colors
  const readCssHslVar = useCallback(
    (varName: string): { h: number; s: number; l: number } | null => {
      if (typeof window === "undefined") return null;
      const raw = getComputedStyle(document.documentElement)
        .getPropertyValue(varName)
        .trim();
      // Expecting format: "H S% L%" or "H S L" with percentages
      if (!raw) return null;
      const parts = raw.split(/\s+/);
      if (parts.length < 3) return null;
      const h = parseFloat(parts[0]);
      const s = parseFloat(parts[1]);
      const l = parseFloat(parts[2]);
      if (Number.isNaN(h) || Number.isNaN(s) || Number.isNaN(l)) return null;
      return { h, s, l };
    },
    []
  );

  const toHsla = (h: number, s: number, l: number, a: number) =>
    `hsla(${h}, ${s}%, ${l}%, ${a})`;

  // Single accent blue from theme (fallback to design token if missing)
  const accentHsl = useMemo(() => {
    const v = readCssHslVar("--accent");
    if (v) return v;
    // Fallbacks: light 211/100/50, dark 211/100/60 per index.css
    return { h: 211, s: 100, l: theme === "dark" ? 60 : 50 };
  }, [readCssHslVar, theme]);

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
        theme === "light"
          ? toHsla(accentHsl.h, accentHsl.s, accentHsl.l, 0.8)
          : `rgba(173, 216, 230, 0.8)`,
    }),
    [theme, accentHsl]
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

    // Performance monitoring and frame rate limiting
    const now = performance.now();
    const deltaTime = now - lastFrameTime.current;
    const targetFrameTime = 1000 / performanceProfile.targetFPS;

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
    const maxRenderParticles =
      performanceProfile.tier === "low" ? numParticles * 0.7 : numParticles;

    particlesRef.current.forEach((particle, index) => {
      // Skip some particles on low-end devices for better performance
      if (performanceProfile.tier === "low" && index % 2 === 0) return;
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
        if (theme === "light") {
          // Light theme: single accent blue
          ctx.fillStyle = toHsla(accentHsl.h, accentHsl.s, accentHsl.l, alpha);
        } else {
          // Dark theme: keep soft light blue for contrast
          ctx.fillStyle = `rgba(173, 216, 230, ${alpha})`;
        }
        ctx.fill();

        // Add subtle glow effect only on medium/high performance devices
        if (performanceProfile.enableGlow) {
          if (theme === "light") {
            ctx.shadowColor = toHsla(
              accentHsl.h,
              accentHsl.s,
              accentHsl.l,
              0.25
            );
          } else {
            ctx.shadowColor = `rgba(173, 216, 230, 0.3)`;
          }
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
  ]);

  // Initialize performance profile
  useEffect(() => {
    const initializePerformance = async () => {
      try {
        const profile = await getDevicePerformanceProfile();
        setPerformanceProfile(profile);
        setIsInitialized(true);
      } catch (error) {
        console.warn(
          "Failed to get performance profile, using low-end defaults:",
          error
        );
        // Fallback to low-end profile for safety
        setPerformanceProfile({
          tier: "low",
          maxParticles: 300,
          maxSpheres: 40,
          targetFPS: 24,
          enableShadows: false,
          enableGlow: false,
          renderScale: 0.6,
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
    <div className="relative w-full h-64 md:h-80 flex items-center justify-center">
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full cursor-pointer touch-none"
        style={{ background: "transparent" }}
      />
    </div>
  );
};

export default SphereAudioVisualizer;
