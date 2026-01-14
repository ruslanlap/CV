"use client";

/**
 * AnimatedSection Component
 * Wrapper component for scroll-triggered animations
 * Includes graceful degradation for animation errors
 */

import { motion, Variants } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { getAnimationVariants } from "@/lib/animation-variants";
import { ReactNode, useState, useEffect } from "react";

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
 * Gracefully degrades if animations fail
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
    const [animationError, setAnimationError] = useState(false);
    const { ref, isInView, hasBeenInView } = useScrollAnimation({
        threshold,
        rootMargin,
        triggerOnce,
    });

    const prefersReducedMotion = useReducedMotion();

    // Check for animation support and handle errors
    useEffect(() => {
        try {
            // Test if IntersectionObserver is available
            if (typeof IntersectionObserver === "undefined") {
                console.warn("IntersectionObserver not supported, disabling animations");
                setAnimationError(true);
            }
        } catch (error) {
            console.error("Animation initialization error:", error);
            setAnimationError(true);
        }
    }, []);

    // If animation fails or is not supported, render children without animation
    if (animationError) {
        return <div className={className}>{children}</div>;
    }

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
            onAnimationComplete={() => {
                // Animation completed successfully
            }}
        >
            {children}
        </motion.div>
    );
}
