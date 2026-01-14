"use client";

/**
 * AnimatedSection Component
 * Wrapper component for scroll-triggered animations
 */

import { motion, Variants } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { getAnimationVariants } from "@/lib/animation-variants";
import { ReactNode } from "react";

interface AnimatedSectionProps {
    children: ReactNode;
    variants?: Variants;
    className?: string;
    threshold?: number;
    rootMargin?: string;
    triggerOnce?: boolean;
    delay?: number;
}

/**
 * Animated section wrapper that triggers animations on scroll
 * Respects user's reduced motion preference
 */
export default function AnimatedSection({
    children,
    variants,
    className = "",
    threshold = 0.1,
    rootMargin = "0px",
    triggerOnce = true,
    delay = 0,
}: AnimatedSectionProps) {
    const { ref, isInView, hasBeenInView } = useScrollAnimation({
        threshold,
        rootMargin,
        triggerOnce,
    });

    const prefersReducedMotion = useReducedMotion();

    // Get animation variants (respecting reduced motion)
    const animationVariants = variants
        ? getAnimationVariants(variants, prefersReducedMotion)
        : undefined;

    // Determine animation state
    const animate = triggerOnce
        ? hasBeenInView
            ? "visible"
            : "hidden"
        : isInView
            ? "visible"
            : "hidden";

    return (
        <motion.div
            ref={ref as any}
            initial="hidden"
            animate={animate}
            variants={animationVariants}
            className={className}
            transition={delay ? { delay } : undefined}
        >
            {children}
        </motion.div>
    );
}
