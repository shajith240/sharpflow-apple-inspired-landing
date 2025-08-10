"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ScrollRevealProps {
    children: ReactNode;
    delay?: number;
    duration?: number;
    y?: number;
    className?: string;
}

export const ScrollReveal = ({
    children,
    delay = 0,
    duration = 0.6,
    y = 30,
    className = ""
}: ScrollRevealProps) => {
    return (
        <motion.div
            initial={{
                opacity: 0,
                y: y,
                scale: 0.95
            }}
            whileInView={{
                opacity: 1,
                y: 0,
                scale: 1
            }}
            viewport={{
                once: true,
                margin: "-100px"
            }}
            transition={{
                duration: duration,
                delay: delay,
                ease: [0.16, 1, 0.3, 1], // Apple's signature easing curve
                scale: {
                    duration: duration * 1.2,
                    ease: [0.16, 1, 0.3, 1]
                }
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

// Staggered children animation for lists/grids
export const ScrollRevealContainer = ({
    children,
    className = "",
    staggerDelay = 0.1
}: {
    children: ReactNode;
    className?: string;
    staggerDelay?: number;
}) => {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
                hidden: {},
                visible: {
                    transition: {
                        staggerChildren: staggerDelay,
                    },
                },
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export const ScrollRevealItem = ({
    children,
    className = "",
    y = 20
}: {
    children: ReactNode;
    className?: string;
    y?: number;
}) => {
    return (
        <motion.div
            variants={{
                hidden: {
                    opacity: 0,
                    y: y,
                    scale: 0.95
                },
                visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                        duration: 0.5,
                        ease: [0.16, 1, 0.3, 1],
                    }
                },
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
};