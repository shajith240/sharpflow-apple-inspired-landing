"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface AuroraEffectProps {
    className?: string;
    showRadialGradient?: boolean;
}

export const AuroraEffect = ({
    className,
    showRadialGradient = true,
}: AuroraEffectProps) => {
    return (
        <div className={cn("absolute inset-0 overflow-hidden", className)}>
            <div
                className={cn(
                    `[--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)]
          [--aurora:repeating-linear-gradient(100deg,var(--blue-500)_10%,var(--indigo-300)_15%,var(--blue-300)_20%,var(--violet-200)_25%,var(--blue-400)_30%)]
          [background-image:var(--white-gradient),var(--aurora)]
          [background-size:300%,_200%]
          [background-position:50%_50%,50%_50%]
          filter blur-[10px] invert
          after:content-[""] after:absolute after:inset-0 
          after:[background-image:var(--white-gradient),var(--aurora)] 
          after:[background-size:200%,_100%] 
          after:animate-aurora 
          after:[background-attachment:fixed] 
          after:mix-blend-difference
          pointer-events-none
          absolute -inset-[10px] opacity-30 will-change-transform`,
                    showRadialGradient &&
                    `[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_70%)]`
                )}
            ></div>
        </div>
    );
};