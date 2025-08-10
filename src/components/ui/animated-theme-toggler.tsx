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

        // Check if view transitions are supported
        if (!document.startViewTransition) {
            setTheme(newTheme);
            return;
        }

        await document.startViewTransition(() => {
            flushSync(() => {
                setTheme(newTheme);
            });
        }).ready;

        const { top, left, width, height } =
            buttonRef.current.getBoundingClientRect();
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
                duration: 700,
                easing: "ease-in-out",
                pseudoElement: "::view-transition-new(root)",
            }
        );
    };

    if (!mounted) {
        return null;
    }

    return (
        <button
            ref={buttonRef}
            onClick={changeTheme}
            className={cn(
                "w-10 h-10 rounded-lg bg-secondary hover:bg-secondary/80 transition-all duration-200 flex items-center justify-center border border-border",
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