"use client";

import { useState, useCallback } from "react";
import { contactFormSchema, type ContactFormInput } from "@/lib/validation/contact-schema";
import { ContactFormErrors } from "@/types/contact";
import SpotlightCard from "@/components/SpotlightCard";

interface ContactFormProps {
    lang: "en" | "ua";
}

interface FormState {
    data: ContactFormInput;
    errors: ContactFormErrors;
    isSubmitting: boolean;
    isSuccess: boolean;
}

const translations = {
    en: {
        title: "Get in Touch",
        subtitle: "Have a question or want to work together? Send me a message!",
        name: "Name",
        namePlaceholder: "Your name",
        email: "Email",
        emailPlaceholder: "your.email@example.com",
        subject: "Subject",
        subjectPlaceholder: "What's this about?",
        message: "Message",
        messagePlaceholder: "Your message...",
        submit: "Send Message",
        submitting: "Sending...",
        successTitle: "Message Sent!",
        successMessage: "Thank you for reaching out. I'll get back to you soon.",
        errorTitle: "Something went wrong",
        errorMessage: "Please try again or contact me directly via email.",
    },
    ua: {
        title: "Зв'яжіться зі мною",
        subtitle: "Маєте питання або хочете співпрацювати? Надішліть мені повідомлення!",
        name: "Ім'я",
        namePlaceholder: "Ваше ім'я",
        email: "Email",
        emailPlaceholder: "your.email@example.com",
        subject: "Тема",
        subjectPlaceholder: "Про що йдеться?",
        message: "Повідомлення",
        messagePlaceholder: "Ваше повідомлення...",
        submit: "Надіслати",
        submitting: "Надсилання...",
        successTitle: "Повідомлення надіслано!",
        successMessage: "Дякую за звернення. Я зв'яжуся з вами найближчим часом.",
        errorTitle: "Щось пішло не так",
        errorMessage: "Спробуйте ще раз або зв'яжіться зі мною безпосередньо через email.",
    },
};

export default function ContactForm({ lang }: ContactFormProps) {
    const t = translations[lang];

    const [formState, setFormState] = useState<FormState>({
        data: {
            name: "",
            email: "",
            subject: "",
            message: "",
        },
        errors: {},
        isSubmitting: false,
        isSuccess: false,
    });

    // Debounced validation
    const [validationTimeout, setValidationTimeout] = useState<NodeJS.Timeout | null>(null);

    const validateField = useCallback((field: keyof ContactFormInput, value: string) => {
        try {
            contactFormSchema.shape[field].parse(value);
            setFormState((prev) => ({
                ...prev,
                errors: { ...prev.errors, [field]: undefined },
            }));
        } catch (error: any) {
            const errorMessage = error.errors?.[0]?.message || "Invalid input";
            setFormState((prev) => ({
                ...prev,
                errors: { ...prev.errors, [field]: errorMessage },
            }));
        }
    }, []);

    const handleInputChange = (
        field: keyof ContactFormInput,
        value: string
    ) => {
        setFormState((prev) => ({
            ...prev,
            data: { ...prev.data, [field]: value },
        }));

        // Clear existing timeout
        if (validationTimeout) {
            clearTimeout(validationTimeout);
        }

        // Set new timeout for debounced validation (300ms)
        const timeout = setTimeout(() => {
            validateField(field, value);
        }, 300);

        setValidationTimeout(timeout);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate all fields
        const result = contactFormSchema.safeParse(formState.data);

        if (!result.success) {
            const errors: ContactFormErrors = {};
            result.error.issues.forEach((err: any) => {
                const field = err.path[0] as keyof ContactFormErrors;
                errors[field] = err.message;
            });
            setFormState((prev) => ({ ...prev, errors }));
            return;
        }

        setFormState((prev) => ({ ...prev, isSubmitting: true, errors: {} }));

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formState.data,
                    language: lang,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Handle specific error cases
                if (response.status === 429) {
                    // Rate limit exceeded
                    setFormState((prev) => ({
                        ...prev,
                        isSubmitting: false,
                        errors: {
                            general: lang === "ua"
                                ? `Забагато запитів. Спробуйте ще раз через ${Math.ceil((new Date(data.reset).getTime() - Date.now()) / 60000)} хвилин.`
                                : data.message,
                        },
                    }));
                } else {
                    // Other errors
                    setFormState((prev) => ({
                        ...prev,
                        isSubmitting: false,
                        errors: {
                            general: data.message || (lang === "ua"
                                ? "Щось пішло не так. Спробуйте ще раз."
                                : "Something went wrong. Please try again."),
                        },
                    }));
                }
                return;
            }

            // Success!
            setFormState({
                data: { name: "", email: "", subject: "", message: "" },
                errors: {},
                isSubmitting: false,
                isSuccess: true,
            });

            // Reset success message after 5 seconds
            setTimeout(() => {
                setFormState((prev) => ({ ...prev, isSuccess: false }));
            }, 5000);

        } catch (error) {
            console.error("Form submission error:", error);
            setFormState((prev) => ({
                ...prev,
                isSubmitting: false,
                errors: {
                    general: lang === "ua"
                        ? "Помилка мережі. Перевірте підключення до інтернету."
                        : "Network error. Please check your internet connection.",
                },
            }));
        }
    };

    return (
        <SpotlightCard className="rounded-2xl border border-border bg-mantle p-6 transition-all hover:border-accent/30 dark:hover:shadow-lg dark:hover:shadow-accent/5">
            <div className="mb-6">
                <h3 className="text-2xl font-bold tracking-tight text-text">{t.title}</h3>
                <p className="mt-2 text-sm text-subtext">{t.subtitle}</p>
            </div>

            {formState.isSuccess && (
                <div className="mb-6 rounded-lg border border-green/30 bg-green/10 p-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <p className="font-semibold text-green">{t.successTitle}</p>
                    <p className="mt-1 text-sm text-green/80">{t.successMessage}</p>
                </div>
            )}

            {formState.errors.general && (
                <div className="mb-6 rounded-lg border border-red/30 bg-red/10 p-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <p className="font-semibold text-red">{t.errorTitle}</p>
                    <p className="mt-1 text-sm text-red/80">{formState.errors.general}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Field */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-text mb-1.5">
                        {t.name}
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={formState.data.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder={t.namePlaceholder}
                        disabled={formState.isSubmitting}
                        className={`w-full rounded-lg border px-4 py-2.5 text-sm transition-colors
              bg-surface text-text placeholder:text-subtext/50
              focus:outline-none focus:ring-2 focus:ring-accent/50
              disabled:opacity-50 disabled:cursor-not-allowed
              ${formState.errors.name ? "border-red" : "border-border hover:border-accent/30"}
            `}
                        aria-invalid={!!formState.errors.name}
                        aria-describedby={formState.errors.name ? "name-error" : undefined}
                    />
                    {formState.errors.name && (
                        <p id="name-error" className="mt-1.5 text-xs text-red" role="alert">
                            {formState.errors.name}
                        </p>
                    )}
                </div>

                {/* Email Field */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-text mb-1.5">
                        {t.email}
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={formState.data.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder={t.emailPlaceholder}
                        disabled={formState.isSubmitting}
                        className={`w-full rounded-lg border px-4 py-2.5 text-sm transition-colors
              bg-surface text-text placeholder:text-subtext/50
              focus:outline-none focus:ring-2 focus:ring-accent/50
              disabled:opacity-50 disabled:cursor-not-allowed
              ${formState.errors.email ? "border-red" : "border-border hover:border-accent/30"}
            `}
                        aria-invalid={!!formState.errors.email}
                        aria-describedby={formState.errors.email ? "email-error" : undefined}
                    />
                    {formState.errors.email && (
                        <p id="email-error" className="mt-1.5 text-xs text-red" role="alert">
                            {formState.errors.email}
                        </p>
                    )}
                </div>

                {/* Subject Field */}
                <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-text mb-1.5">
                        {t.subject}
                    </label>
                    <input
                        type="text"
                        id="subject"
                        value={formState.data.subject}
                        onChange={(e) => handleInputChange("subject", e.target.value)}
                        placeholder={t.subjectPlaceholder}
                        disabled={formState.isSubmitting}
                        className={`w-full rounded-lg border px-4 py-2.5 text-sm transition-colors
              bg-surface text-text placeholder:text-subtext/50
              focus:outline-none focus:ring-2 focus:ring-accent/50
              disabled:opacity-50 disabled:cursor-not-allowed
              ${formState.errors.subject ? "border-red" : "border-border hover:border-accent/30"}
            `}
                        aria-invalid={!!formState.errors.subject}
                        aria-describedby={formState.errors.subject ? "subject-error" : undefined}
                    />
                    {formState.errors.subject && (
                        <p id="subject-error" className="mt-1.5 text-xs text-red" role="alert">
                            {formState.errors.subject}
                        </p>
                    )}
                </div>

                {/* Message Field */}
                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-text mb-1.5">
                        {t.message}
                    </label>
                    <textarea
                        id="message"
                        value={formState.data.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        placeholder={t.messagePlaceholder}
                        disabled={formState.isSubmitting}
                        rows={5}
                        className={`w-full rounded-lg border px-4 py-2.5 text-sm transition-colors resize-y
              bg-surface text-text placeholder:text-subtext/50
              focus:outline-none focus:ring-2 focus:ring-accent/50
              disabled:opacity-50 disabled:cursor-not-allowed
              ${formState.errors.message ? "border-red" : "border-border hover:border-accent/30"}
            `}
                        aria-invalid={!!formState.errors.message}
                        aria-describedby={formState.errors.message ? "message-error" : undefined}
                    />
                    {formState.errors.message && (
                        <p id="message-error" className="mt-1.5 text-xs text-red" role="alert">
                            {formState.errors.message}
                        </p>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={formState.isSubmitting}
                    className="w-full rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-base
            transition-all hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/20
            focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-base
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-accent disabled:hover:shadow-none
            active:scale-[0.98]
          "
                >
                    {formState.isSubmitting ? t.submitting : t.submit}
                </button>
            </form>
        </SpotlightCard>
    );
}
