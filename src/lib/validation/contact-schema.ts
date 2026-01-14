/**
 * Contact Form Validation Schema
 * Zod schema for validating contact form submissions
 */

import { z } from "zod";

/**
 * Contact form validation schema
 * - name: 2-100 characters
 * - email: valid email format
 * - subject: 3-200 characters
 * - message: 10-2000 characters
 */
export const contactFormSchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name must not exceed 100 characters")
        .trim(),

    email: z
        .string()
        .email("Please enter a valid email address")
        .trim()
        .toLowerCase(),

    subject: z
        .string()
        .min(3, "Subject must be at least 3 characters")
        .max(200, "Subject must not exceed 200 characters")
        .trim(),

    message: z
        .string()
        .min(10, "Message must be at least 10 characters")
        .max(2000, "Message must not exceed 2000 characters")
        .trim(),

    language: z.enum(["en", "ua"]).optional(),
});

/**
 * Inferred TypeScript type from the schema
 */
export type ContactFormInput = z.infer<typeof contactFormSchema>;

/**
 * API request schema (includes language as required)
 */
export const contactAPISchema = contactFormSchema.extend({
    language: z.enum(["en", "ua"]),
});

export type ContactAPIInput = z.infer<typeof contactAPISchema>;
