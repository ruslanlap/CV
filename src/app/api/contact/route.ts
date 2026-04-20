/**
 * Contact Form API Route
 * Handles contact form submissions with rate limiting and email sending
 */

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { contactAPISchema } from "@/lib/validation/contact-schema";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";
import { generateHTMLEmail, generatePlainTextEmail } from "@/lib/email-templates";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const CONTACT_EMAIL_TO = process.env.CONTACT_EMAIL_TO || "ruslan.lapinyak@gmail.com";

export async function POST(request: NextRequest) {
    try {
        // Check if Resend is configured
        if (!resend) {
            return NextResponse.json(
                {
                    success: false,
                    error: "email_not_configured",
                    message: "Email service is not configured. Please add RESEND_API_KEY to environment variables.",
                },
                { status: 503 }
            );
        }

        // Get client IP for rate limiting
        const clientIP = getClientIP(request);

        // Check rate limit
        const rateLimitResult = await checkRateLimit(clientIP);

        if (!rateLimitResult.success) {
            const resetDate = new Date(rateLimitResult.reset);
            const minutesUntilReset = Math.ceil((rateLimitResult.reset - Date.now()) / 60000);

            return NextResponse.json(
                {
                    success: false,
                    error: "rate_limit_exceeded",
                    message: `Too many requests. Please try again in ${minutesUntilReset} minutes.`,
                    reset: resetDate.toISOString(),
                    remaining: rateLimitResult.remaining,
                },
                { status: 429 }
            );
        }

        // Parse and validate request body
        const body = await request.json();
        const validationResult = contactAPISchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: "validation_error",
                    message: "Invalid form data",
                    details: validationResult.error.issues,
                },
                { status: 400 }
            );
        }

        const { name, email, subject, message, language } = validationResult.data;

        // Generate email templates
        const htmlEmail = generateHTMLEmail({ name, email, subject, message, language });
        const textEmail = generatePlainTextEmail({ name, email, subject, message, language });

        // Send email using Resend
        const emailResult = await resend.emails.send({
            from: "CV Contact Form <onboarding@resend.dev>", // Use your verified domain
            to: CONTACT_EMAIL_TO,
            replyTo: email,
            subject: `[CV Contact] ${subject}`,
            html: htmlEmail,
            text: textEmail,
        });

        if (emailResult.error) {
            console.error("Email sending failed:", emailResult.error);
            const errMsg = (emailResult.error as { message?: string; name?: string })?.message
                || (emailResult.error as { name?: string })?.name
                || "Unknown error";
            const isDev = process.env.NODE_ENV !== "production";
            return NextResponse.json(
                {
                    success: false,
                    error: "email_send_failed",
                    message: isDev
                        ? `Failed to send email: ${errMsg}`
                        : "Failed to send email. Please try again later.",
                    ...(isDev ? { details: emailResult.error } : {}),
                },
                { status: 500 }
            );
        }

        // Success response
        return NextResponse.json(
            {
                success: true,
                message: language === "ua"
                    ? "Повідомлення успішно надіслано!"
                    : "Message sent successfully!",
                remaining: rateLimitResult.remaining - 1,
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Contact form error:", error);

        return NextResponse.json(
            {
                success: false,
                error: "internal_error",
                message: "An unexpected error occurred. Please try again later.",
            },
            { status: 500 }
        );
    }
}

// Handle unsupported methods
export async function GET() {
    return NextResponse.json(
        { error: "Method not allowed" },
        { status: 405 }
    );
}
