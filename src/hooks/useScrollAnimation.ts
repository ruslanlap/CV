/**
 * useScrollAnimation Hook
 * Detects when elements enter the viewport using Intersection Observer
 */

import { useEffect, useRef, useState, RefObject } from "react";
import { UseScrollAnimationOptions, UseScrollAnimationReturn } from "@/types/animation";

/**
 * Hook to trigger animations when elements enter viewport
 * 
 * @param options - Configuration options
 * @param options.threshold - Percentage of element that must be visible (0-1)
 * @param options.rootMargin - Margin around the viewport
 * @param options.triggerOnce - Whether to trigger animation only once
 * @returns Object with ref, isInView, and hasBeenInView
 */
export function useScrollAnimation(
    options: UseScrollAnimationOptions = {}
): UseScrollAnimationReturn {
    const {
        threshold = 0.1,
        rootMargin = "0px",
        triggerOnce = true,
    } = options;

    const ref = useRef<HTMLElement | null>(null);
    const [isInView, setIsInView] = useState(false);
    const [hasBeenInView, setHasBeenInView] = useState(false);

    useEffect(() => {
        const element = ref.current;

        // Check if element exists and IntersectionObserver is supported
        if (!element || typeof IntersectionObserver === "undefined") {
            // Fallback: show element immediately if no support
            setIsInView(true);
            setHasBeenInView(true);
            return;
        }

        // Create observer
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const inView = entry.isIntersecting;

                    setIsInView(inView);

                    if (inView && !hasBeenInView) {
                        setHasBeenInView(true);
                    }

                    // If triggerOnce is true and element has been in view, disconnect
                    if (triggerOnce && inView) {
                        observer.disconnect();
                    }
                });
            },
            {
                threshold,
                rootMargin,
            }
        );

        // Start observing
        observer.observe(element);

        // Cleanup
        return () => {
            observer.disconnect();
        };
    }, [threshold, rootMargin, triggerOnce, hasBeenInView]);

    return {
        ref: ref as RefObject<HTMLElement>,
        isInView,
        hasBeenInView,
    };
}
