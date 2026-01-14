/**
 * Rate Limiting Utility
 * Uses Vercel KV (Upstash Redis) to implement rate limiting for contact form
 */

import { kv } from "@vercel/kv";
import { Ratelimit } from "@upstash/ratelimit";

/**
 * Rate limiter instance
 * Configured for 3 requests per hour per IP address
 */
export const ratelimit = new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(3, "1 h"),
    analytics: true,
    prefix: "ratelimit:contact",
});

/**
 * Check if an IP address has exceeded the rate limit
 * @param identifier - Usually the IP address or user identifier
 * @returns Object with success status and limit info
 */
export async function checkRateLimit(identifier: string) {
    try {
        const { success, limit, reset, remaining } = await ratelimit.limit(identifier);

        return {
            success,
            limit,
            reset,
            remaining,
        };
    } catch (error) {
        console.error("Rate limit check failed:", error);
        // On error, allow the request but log the issue
        return {
            success: true,
            limit: 3,
            reset: Date.now() + 3600000, // 1 hour from now
            remaining: 3,
        };
    }
}

/**
 * Get the client IP address from request headers
 * @param request - Next.js request object
 * @returns IP address string
 */
export function getClientIP(request: Request): string {
    // Try to get IP from various headers (Vercel, Cloudflare, etc.)
    const forwarded = request.headers.get("x-forwarded-for");
    const realIP = request.headers.get("x-real-ip");
    const cfConnectingIP = request.headers.get("cf-connecting-ip");

    if (forwarded) {
        // x-forwarded-for can contain multiple IPs, take the first one
        return forwarded.split(",")[0].trim();
    }

    if (realIP) {
        return realIP;
    }

    if (cfConnectingIP) {
        return cfConnectingIP;
    }

    // Fallback to a default identifier
    return "unknown";
}
