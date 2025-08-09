"use client";

import { useEffect, useRef, useCallback } from "react";
import { useTheme } from "next-themes";

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

interface Mouse {
  x: number | null;
  y: number | null;
  radius: number;
}

const SphereAudioVisualizer = () => {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef<Mouse>({ x: null, y: null, radius: 100 });
  const rotationRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  const numParticles = 1200;
  const sphereRadiusRef = useRef(150);

  const createParticle = useCallback((x: number, y: number, z: number): Particle => ({
    homeX: x,
    homeY: y,
    homeZ: z,
    x,
    y,
    z,
    vx: 0,
    vy: 0,
    vz: 0,
    color: theme === 'light' ? `rgba(0, 0, 0, 0.8)` : `rgba(173, 216, 230, 0.8)` // Pure black in light theme, light blue in dark theme
  }), [theme]);

  const projectParticle = useCallback((particle: Particle, width: number, height: number) => {
    const fov = width * 1.2;
    const projectionScale = fov / (fov + particle.z + 200); // Added offset to prevent zoom out
    const projX = (particle.x * projectionScale) + width / 2;
    const projY = (particle.y * projectionScale) + height / 2;
    const size = Math.max(1, 2.5 * projectionScale); // Larger minimum size
    return { x: projX, y: projY, size };
  }, []);

  const updateParticle = useCallback((particle: Particle, avgAudio: number = 0) => {
    // Force to return to home position
    const homeForceX = (particle.homeX - particle.x) * 0.01;
    const homeForceY = (particle.homeY - particle.y) * 0.01;
    const homeForceZ = (particle.homeZ - particle.z) * 0.01;

    // Mouse repulsion force
    let mouseForceX = 0, mouseForceY = 0;
    const mouse = mouseRef.current;
    if (mouse.x !== null && mouse.y !== null && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const dx = particle.x - (mouse.x - rect.width / 2);
      const dy = particle.y - (mouse.y - rect.height / 2);
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < mouse.radius) {
        const force = (mouse.radius - distance) / mouse.radius;
        mouseForceX = (dx / distance) * force * 2;
        mouseForceY = (dy / distance) * force * 2;
      }
    }

    // Gentle pulsing effect (simulating audio) - only outward expansion
    const time = Date.now() * 0.001;
    const audioForce = Math.max(0, (Math.sin(time * 2) + Math.sin(time * 3.7) + Math.sin(time * 5.1)) * 0.15);
    const angleToCenter = Math.atan2(particle.homeY, particle.homeX);
    const audioForceX = Math.cos(angleToCenter) * audioForce;
    const audioForceY = Math.sin(angleToCenter) * audioForce;

    // Combine forces and apply velocity
    particle.vx += homeForceX + mouseForceX + audioForceX;
    particle.vy += homeForceY + mouseForceY + audioForceY;
    particle.vz += homeForceZ;

    // Apply damping/friction
    particle.vx *= 0.92;
    particle.vy *= 0.92;
    particle.vz *= 0.92;

    // Update position
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.z += particle.vz;
  }, []);

  const createParticles = useCallback((containerWidth: number, containerHeight: number) => {
    // Calculate responsive sphere radius based on container size
    // Use 40% of the smaller dimension to ensure it fits with expansion
    const maxRadius = Math.min(containerWidth, containerHeight) * 0.40;
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

      particles.push(createParticle(
        x * sphereRadiusRef.current,
        y * sphereRadiusRef.current,
        z * sphereRadiusRef.current
      ));
    }

    particlesRef.current = particles;
  }, [createParticle]);

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
    }

    // Recreate particles with new container dimensions
    createParticles(rect.width, rect.height);
  }, [createParticles]);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    // Clear canvas completely for transparent background
    ctx.clearRect(0, 0, width, height);

    const rotation = rotationRef.current;

    // Smoothly interpolate rotation towards the target
    rotation.x += (rotation.targetX - rotation.x) * 0.05;
    rotation.y += (rotation.targetY - rotation.y) * 0.05;

    // Add gentle auto-rotation when mouse is not active
    if (mouseRef.current.x === null) {
      const time = Date.now() * 0.0005;
      rotation.targetX = Math.sin(time) * 0.2;
      rotation.targetY = Math.cos(time * 0.7) * 0.3;
    }

    particlesRef.current.forEach(particle => {
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

      // Update and draw
      updateParticle(particle);
      const proj = projectParticle(rotatedParticle, width, height);

      // Only draw particles that are in front
      if (z2 > -sphereRadiusRef.current * 0.8) {
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, proj.size, 0, Math.PI * 2);

        // Create gradient effect based on depth with better visibility
        const alpha = Math.max(0.3, Math.min(0.9, (z2 + sphereRadiusRef.current) / (sphereRadiusRef.current * 1.5)));
        const particleColor = theme === 'light' ? `rgba(0, 0, 0, ${alpha})` : `rgba(173, 216, 230, ${alpha})`;
        ctx.fillStyle = particleColor;
        ctx.fill();

        // Add subtle glow effect
        const glowColor = theme === 'light' ? `rgba(0, 0, 0, 0.2)` : `rgba(173, 216, 230, 0.3)`;
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = 2;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    });

    animationRef.current = requestAnimationFrame(animate);
  }, [createParticle, updateParticle, projectParticle, theme]);

  useEffect(() => {
    setupCanvas();
    animate();

    const handleResize = () => setupCanvas();
    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;

      const rotation = rotationRef.current;
      rotation.targetY = (mouseRef.current.x - rect.width / 2) * 0.001;
      rotation.targetX = (mouseRef.current.y - rect.height / 2) * 0.001;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = null;
      mouseRef.current.y = null;
      const rotation = rotationRef.current;
      rotation.targetX = 0;
      rotation.targetY = 0;
    };

    window.addEventListener('resize', handleResize);

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
      if (canvas) {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [setupCanvas, createParticles, animate]);

  return (
    <div className="relative w-full h-64 md:h-80 flex items-center justify-center">
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full cursor-pointer"
        style={{ background: 'transparent' }}
      />
    </div>
  );
};

export default SphereAudioVisualizer;