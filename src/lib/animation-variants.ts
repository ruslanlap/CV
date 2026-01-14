/**
 * Animation Variants Library
 * Framer Motion animation variants for scroll-triggered animations
 */

import { Variants } from "framer-motion";

/**
 * Fade in from bottom with upward motion
 * Used for cards and content blocks
 */
export const fadeInUp: Variants = {
    hidden: {
        opacity: 0,
        y: 20,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut",
        },
    },
};

/**
 * Simple fade in
 * Used for section headers and simple elements
 */
export const fadeIn: Variants = {
    hidden: {
        opacity: 0,
    },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.4,
            ease: "easeOut",
        },
    },
};

/**
 * Scale in with fade
 * Used for badges and small interactive elements
 */
export const scaleIn: Variants = {
    hidden: {
        opacity: 0,
        scale: 0.95,
    },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.4,
            ease: "easeOut",
        },
    },
};

/**
 * Container for staggered children animations
 * Used for lists and grids
 */
export const staggerContainer: Variants = {
    hidden: {
        opacity: 0,
    },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

/**
 * Slide down animation
 * Used for navigation and headers
 */
export const slideDown: Variants = {
    hidden: {
        opacity: 0,
        y: -20,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: "easeOut",
        },
    },
};

/**
 * Slide in from left
 * Used for side elements
 */
export const slideInLeft: Variants = {
    hidden: {
        opacity: 0,
        x: -20,
    },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut",
        },
    },
};

/**
 * Slide in from right
 * Used for side elements
 */
export const slideInRight: Variants = {
    hidden: {
        opacity: 0,
        x: 20,
    },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut",
        },
    },
};

/**
 * Get animation variants based on reduced motion preference
 * @param variants - The animation variants to use
 * @param prefersReducedMotion - Whether user prefers reduced motion
 * @returns Variants with or without animation
 */
export function getAnimationVariants(
    variants: Variants,
    prefersReducedMotion: boolean
): Variants {
    if (prefersReducedMotion) {
        // Return variants with no animation (instant transition)
        return {
            hidden: {},
            visible: {},
        };
    }
    return variants;
}

/**
 * Animation timing constants
 */
export const ANIMATION_TIMING = {
    fast: 0.2,
    normal: 0.4,
    slow: 0.6,
    stagger: 0.1,
    delay: 0.2,
};

/**
 * Animation easing presets
 */
export const ANIMATION_EASING = {
    easeOut: "easeOut",
    easeIn: "easeIn",
    easeInOut: "easeInOut",
    spring: { type: "spring", stiffness: 100, damping: 15 },
};
