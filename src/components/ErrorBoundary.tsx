"use client";

import { Component, ReactNode, ErrorInfo } from "react";

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
    lang?: "en" | "ua";
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

const translations = {
    en: {
        title: "Something went wrong",
        message: "We're sorry, but something unexpected happened. Please try refreshing the page.",
        retry: "Try Again",
        details: "Error details",
    },
    ua: {
        title: "Щось пішло не так",
        message: "Вибачте, сталася несподівана помилка. Спробуйте оновити сторінку.",
        retry: "Спробувати знову",
        details: "Деталі помилки",
    },
};

/**
 * Generic Error Boundary component for catching and handling React errors
 * Provides graceful degradation with user-friendly error messages
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        // Log error to console for debugging
        console.error("ErrorBoundary caught an error:", error, errorInfo);

        // Call optional error handler
        this.props.onError?.(error, errorInfo);
    }

    handleRetry = (): void => {
        this.setState({ hasError: false, error: null });
    };

    render(): ReactNode {
        if (this.state.hasError) {
            // Return custom fallback if provided
            if (this.props.fallback) {
                return this.props.fallback;
            }

            const t = translations[this.props.lang || "en"];

            // Default error UI
            return (
                <div className="rounded-2xl border border-red/30 bg-red/5 p-6 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red/10">
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
                            className="text-red"
                        >
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" x2="12" y1="8" y2="12" />
                            <line x1="12" x2="12.01" y1="16" y2="16" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-text">{t.title}</h3>
                    <p className="mt-2 text-sm text-subtext">{t.message}</p>
                    <button
                        onClick={this.handleRetry}
                        className="mt-4 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-base transition-colors hover:bg-accent/90"
                    >
                        {t.retry}
                    </button>
                    {process.env.NODE_ENV === "development" && this.state.error && (
                        <details className="mt-4 text-left">
                            <summary className="cursor-pointer text-xs text-subtext hover:text-text">
                                {t.details}
                            </summary>
                            <pre className="mt-2 overflow-auto rounded bg-surface p-2 text-xs text-red">
                                {this.state.error.message}
                                {"\n"}
                                {this.state.error.stack}
                            </pre>
                        </details>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
