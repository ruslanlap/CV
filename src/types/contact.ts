/**
 * Contact Form Types
 * Types for the contact form feature including form data, validation, and API responses
 */

export interface ContactFormData {
    name: string;          // 2-100 characters
    email: string;         // Valid email format
    subject: string;       // 3-200 characters
    message: string;       // 10-2000 characters
    timestamp?: Date;      // Submission time
    language?: "en" | "ua"; // Form language
}

export interface ContactFormErrors {
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
    general?: string;
}

export interface ContactFormState {
    data: ContactFormData;
    errors: ContactFormErrors;
    isSubmitting: boolean;
    isSuccess: boolean;
}

export interface ContactAPIRequest {
    name: string;
    email: string;
    subject: string;
    message: string;
    language: "en" | "ua";
}

export interface ContactAPIResponse {
    success: boolean;
    message: string;
    error?: string;
}

export interface EmailData {
    from: string;          // Sender email
    to: string;            // Recipient (CV owner)
    subject: string;       // Email subject
    replyTo: string;       // Visitor's email
    html: string;          // HTML email body
    text: string;          // Plain text fallback
}
