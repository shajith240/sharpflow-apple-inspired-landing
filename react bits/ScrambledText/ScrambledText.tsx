import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

export interface ScrambledTextProps {
  radius?: number;
  duration?: number;
  speed?: number;
  scrambleChars?: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

const ScrambledText: React.FC<ScrambledTextProps> = ({
  radius = 100,
  duration = 1.2,
  speed = 0.5,
  scrambleChars = ".:",
  className = "",
  style = {},
  children,
}) => {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!rootRef.current) return;

    const split = SplitText.create(rootRef.current.querySelector("p"), {
      type: "chars",
      charsClass: "inline-block will-change-transform",
    });

    // Pre-calculate character positions for performance
    const charData = split.chars.map((el) => {
      const c = el as HTMLElement;
      const originalWidth = c.offsetWidth;
      const originalHeight = c.offsetHeight;
      const rect = c.getBoundingClientRect();

      gsap.set(c, {
        attr: { "data-content": c.innerHTML },
        display: "inline-block",
        position: "relative",
        width: Math.max(originalWidth, 8) + "px",
        height: originalHeight + "px",
        textAlign: "center",
        verticalAlign: "baseline",
        overflow: "hidden"
      });

      return {
        element: c,
        originalText: c.innerHTML,
        centerX: rect.left + rect.width / 2,
        centerY: rect.top + rect.height / 2,
        isScrambled: false,
        scrambleFrame: 0
      };
    });

    let animationFrame: number;
    let mouseX = 0;
    let mouseY = 0;
    let isMouseOverComponent = false;

    const updateScramble = () => {
      charData.forEach((char) => {
        // Only apply scramble effect if mouse is actually over the component
        if (!isMouseOverComponent) {
          // Reset character if mouse is not over component
          if (char.isScrambled || char.element.innerHTML !== char.originalText) {
            char.isScrambled = false;
            char.element.innerHTML = char.originalText;
            char.scrambleFrame = 0;
          }
          return;
        }

        // Update character position in real-time for accuracy
        const rect = char.element.getBoundingClientRect();
        const currentCenterX = rect.left + rect.width / 2;
        const currentCenterY = rect.top + rect.height / 2;

        const dx = mouseX - currentCenterX;
        const dy = mouseY - currentCenterY;
        const dist = Math.hypot(dx, dy);

        if (dist < radius) {
          // Character should be scrambled
          if (!char.isScrambled) {
            char.isScrambled = true;
            char.scrambleFrame = 0;
          }

          // Update scramble character based on distance
          const intensity = 1 - (dist / radius);
          const scrambleSpeed = Math.max(1, Math.floor(intensity * 8));

          if (char.scrambleFrame % scrambleSpeed === 0) {
            const randomChar = scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
            char.element.innerHTML = randomChar;
          }
          char.scrambleFrame++;
        } else {
          // Character should return to original - ensure it always resets
          if (char.isScrambled || char.element.innerHTML !== char.originalText) {
            char.isScrambled = false;
            char.element.innerHTML = char.originalText;
            char.scrambleFrame = 0;
          }
        }
      });

      animationFrame = requestAnimationFrame(updateScramble);
    };

    const handleMove = (e: PointerEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      isMouseOverComponent = true;
    };

    const handleEnter = () => {
      isMouseOverComponent = true;
    };

    const handleLeave = () => {
      isMouseOverComponent = false;
      // Reset all characters when mouse leaves the component
      charData.forEach((char) => {
        if (char.isScrambled || char.element.innerHTML !== char.originalText) {
          char.isScrambled = false;
          char.element.innerHTML = char.originalText;
          char.scrambleFrame = 0;
        }
      });
    };

    // Throttle position updates for better performance
    let ticking = false;
    const updatePositions = () => {
      charData.forEach((char) => {
        const rect = char.element.getBoundingClientRect();
        char.centerX = rect.left + rect.width / 2;
        char.centerY = rect.top + rect.height / 2;
      });
      ticking = false;
    };

    const handleResize = () => {
      if (!ticking) {
        requestAnimationFrame(updatePositions);
        ticking = true;
      }
    };

    const el = rootRef.current;
    el.addEventListener("pointermove", handleMove, { passive: true });
    el.addEventListener("pointerenter", handleEnter, { passive: true });
    el.addEventListener("pointerleave", handleLeave, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    // Start the animation loop
    updateScramble();

    return () => {
      el.removeEventListener("pointermove", handleMove);
      el.removeEventListener("pointerenter", handleEnter);
      el.removeEventListener("pointerleave", handleLeave);
      window.removeEventListener("resize", handleResize);
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      // Ensure all characters are reset on cleanup
      charData.forEach((char) => {
        char.element.innerHTML = char.originalText;
      });
      split.revert();
    };
  }, [radius, duration, speed, scrambleChars]);

  return (
    <div
      ref={rootRef}
      className={`mx-auto px-4 sm:px-6 lg:px-8 font-mono text-[clamp(14px,4vw,32px)] text-white ${className}`}
      style={style}
    >
      <p style={{
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        lineHeight: "1.4",
        hyphens: "auto"
      }}>{children}</p>
    </div>
  );
};

export default ScrambledText;
