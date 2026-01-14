"use client";

import { Component, ReactNode, ErrorInfo } from "react";
import SpotlightCard from "@/components/SpotlightCard";

interface ContactFormErrorBoundaryProps {
    children: ReactNode;
    lang?: "en" | "ua";
}

interface ContactFormErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

const translations = {
    en: {
        title: "Contact Form Unavailable",
        message: "The contact form encountered an error. You can still reach me through:",
        email: "Email",
        telegram: "Telegram",
        retry: "Try Again",
    },
    ua: {
        title: "Форма контакту недоступна",
        message: "У формі контакту сталася помилка. Ви можете зв'язатися зі мною через:",
        email: "Email",
        telegram: "Telegram",
        retry: "Спробувати знову",
    },
};

/**
 * Specialized Error Boundary for Contact Form
 * Provides fallback contact methods when form fails
 */
export class ContactFormErrorBoundary extends Component<
    ContactFormErrorBoundaryProps,
    ContactFormErrorBoundaryState
> {
    constructor(props: ContactFormErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ContactFormErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error("ContactForm Error:", error, errorInfo);
    }

    handleRetry = (): void => {
        this.setState({ hasError: false, error: null });
    };

    render(): ReactNode {
        if (this.state.hasError) {
            const t = translations[this.props.lang || "en"];

            return (
                <SpotlightCard className="rounded-2xl border border-border bg-mantle p-6">
                    <div className="text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow/10">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-yellow"
                            >
                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                <line x1="12" x2="12" y1="9" y2="13" />
                                <line x1="12" x2="12.01" y1="17" y2="17" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-text">{t.title}</h3>
                        <p className="mt-2 text-sm text-subtext">{t.message}</p>

                        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center">
                            <a
                                href="mailto:ruslan.lapinyak@gmail.com"
                                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-text transition-colors hover:border-accent/30 hover:bg-surface/80"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <rect width="20" height="16" x="2" y="4" rx="2" />
                                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                </svg>
                                {t.email}
                            </a>
                            <a
                                href="https://t.me/ruslanlap"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-text transition-colors hover:border-accent/30 hover:bg-surface/80"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="m22 2-7 20-4-9-9-4Z" />
                                    <path d="M22 2 11 13" />
                                </svg>
                                {t.telegram}
                            </a>
                        </div>

                        <button
                            onClick={this.handleRetry}
                            className="mt-4 text-sm text-accent hover:underline"
                        >
                            {t.retry}
                        </button>
                    </div>
                </SpotlightCard>
            );
        }

        return this.props.children;
    }
}

export default ContactFormErrorBoundary;
