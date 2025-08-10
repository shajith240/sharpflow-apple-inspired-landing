"use client";

import { Moon, SunDim } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { flushSync } from "react-dom";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

type props = {
    className?: string;
};

export const AnimatedThemeToggler = ({ className }: props) => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const buttonRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const changeTheme = async () => {
        if (!buttonRef.current || !mounted) return;

        const newTheme = theme === 'dark' ? 'light' : 'dark';

        // Detect if we're on mobile or if view transitions aren't supported
        const isMobile = window.innerWidth <= 768 || 'ontouchstart' in window;
        const supportsViewTransitions = !!document.startViewTransition;

        // Mobile-optimized smooth transition
        if (isMobile || !supportsViewTransitions) {
            // Add smooth transition class to body with Apple-like timing
            document.documentElement.style.transition = 'background-color 0.6s cubic-bezier(0.16, 1, 0.3, 1), color 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
            document.body.style.transition = 'background-color 0.6s cubic-bezier(0.16, 1, 0.3, 1), color 0.6s cubic-bezier(0.16, 1, 0.3, 1)';

            // Change theme
            setTheme(newTheme);

            // Clean up transition styles after animation
            setTimeout(() => {
                document.documentElement.style.transition = '';
                document.body.style.transition = '';
            }, 600);

            return;
        }

        // Desktop: Use view transitions with optimized animation
        try {
            await document.startViewTransition(() => {
                flushSync(() => {
                    setTheme(newTheme);
                });
            }).ready;

            const { top, left, width, height } = buttonRef.current.getBoundingClientRect();
            const y = top + height / 2;
            const x = left + width / 2;
            const right = window.innerWidth - left;
            const bottom = window.innerHeight - top;
            const maxRad = Math.hypot(Math.max(left, right), Math.max(top, bottom));

            document.documentElement.animate(
                {
                    clipPath: [
                        `circle(0px at ${x}px ${y}px)`,
                        `circle(${maxRad}px at ${x}px ${y}px)`,
                    ],
                },
                {
                    duration: 800, // Slower for buttery smooth Apple feel
                    easing: "cubic-bezier(0.16, 1, 0.3, 1)", // Apple's signature easing
                    pseudoElement: "::view-transition-new(root)",
                }
            );
        } catch (error) {
            // Fallback if view transition fails
            console.warn('View transition failed, using fallback:', error);
            setTheme(newTheme);
        }
    };

    if (!mounted) {
        return null;
    }

    return (
        <button
            ref={buttonRef}
            onClick={changeTheme}
            className={cn(
                "w-10 h-10 rounded-lg bg-secondary hover:bg-secondary/80 transition-all duration-200 flex items-center justify-center border border-border theme-toggle-mobile",
                className
            )}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
            {theme === 'dark' ? (
                <SunDim className="w-5 h-5 text-text-secondary" />
            ) : (
                <Moon className="w-5 h-5 text-text-secondary" />
            )}
        </button>
    );
};