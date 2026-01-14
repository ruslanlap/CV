/**
 * Animation Types
 * Types for scroll-triggered animations and animation state management
 */

import { RefObject } from "react";
import { Variants } from "framer-motion";

export interface UseScrollAnimationOptions {
    threshold?: number;
    rootMargin?: string;
    triggerOnce?: boolean;
}

export interface UseScrollAnimationReturn {
    ref: RefObject<HTMLElement | null>;
    isInView: boolean;
    hasBeenInView: boolean;
}

export interface AnimationState {
    elementId: string;
    isInView: boolean;
    hasBeenInView: boolean;
    animationComplete: boolean;
}

export interface AnimationVariants {
    fadeInUp: Variants;
    fadeIn: Variants;
    scaleIn: Variants;
    staggerContainer: Variants;
}

export type AnimationVariantName = keyof AnimationVariants;
