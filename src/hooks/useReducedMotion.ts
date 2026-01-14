/**
 * useReducedMotion Hook
 * Detects user's motion preference for accessibility
 */

import { useEffect, useState } from "react";

/**
 * Hook to detect if user prefers reduced motion
 * Respects the prefers-reduced-motion media query
 * 
 * @returns boolean - true if user prefers reduced motion
 */
export function useReducedMotion(): boolean {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        // Check if window is available (SSR safety)
        if (typeof window === "undefined") {
            return;
        }

        // Create media query
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

        // Set initial value
        setPrefersReducedMotion(mediaQuery.matches);

        // Create event listener for changes
        const handleChange = (event: MediaQueryListEvent) => {
            setPrefersReducedMotion(event.matches);
        };

        // Add listener (use addEventListener for better browser support)
        mediaQuery.addEventListener("change", handleChange);

        // Cleanup
        return () => {
            mediaQuery.removeEventListener("change", handleChange);
        };
    }, []);

    return prefersReducedMotion;
}
