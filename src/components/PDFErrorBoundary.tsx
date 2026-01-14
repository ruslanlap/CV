"use client";

import { Component, ReactNode, ErrorInfo } from "react";

interface PDFErrorBoundaryProps {
    children: ReactNode;
    lang?: "en" | "ua";
    onFallbackAction?: () => void;
}

interface PDFErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

const translations = {
    en: {
        title: "PDF Generation Failed",
        message: "Unable to generate the PDF. You can try the browser's print function instead.",
        printButton: "Use Browser Print",
        retry: "Try Again",
    },
    ua: {
        title: "Помилка генерації PDF",
        message: "Не вдалося створити PDF. Ви можете скористатися функцією друку браузера.",
        printButton: "Друк через браузер",
        retry: "Спробувати знову",
    },
};

/**
 * Specialized Error Boundary for PDF Generation
 * Provides fallback to browser print when PDF generation fails
 */
export class PDFErrorBoundary extends Component<
    PDFErrorBoundaryProps,
    PDFErrorBoundaryState
> {
    constructor(props: PDFErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): PDFErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error("PDF Generation Error:", error, errorInfo);
    }

    handleRetry = (): void => {
        this.setState({ hasError: false, error: null });
    };

    handlePrint = (): void => {
        window.print();
    };

    render(): ReactNode {
        if (this.state.hasError) {
            const t = translations[this.props.lang || "en"];

            return (
                <div className="flex min-h-[400px] items-center justify-center p-8">
                    <div className="max-w-md text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red/10">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-red"
                            >
                                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                                <polyline points="14 2 14 8 20 8" />
                                <line x1="9" x2="15" y1="15" y2="15" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-text">{t.title}</h2>
                        <p className="mt-2 text-subtext">{t.message}</p>

                        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                            <button
                                onClick={this.handlePrint}
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-base transition-colors hover:bg-accent/90"
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
                                    <polyline points="6 9 6 2 18 2 18 9" />
                                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                                    <rect width="12" height="8" x="6" y="14" />
                                </svg>
                                {t.printButton}
                            </button>
                            <button
                                onClick={this.handleRetry}
                                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-text transition-colors hover:border-accent/30"
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
                                    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                                    <path d="M3 3v5h5" />
                                    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                                    <path d="M16 16h5v5" />
                                </svg>
                                {t.retry}
                            </button>
                        </div>

                        {process.env.NODE_ENV === "development" && this.state.error && (
                            <details className="mt-6 text-left">
                                <summary className="cursor-pointer text-xs text-subtext hover:text-text">
                                    Error details
                                </summary>
                                <pre className="mt-2 overflow-auto rounded bg-surface p-2 text-xs text-red">
                                    {this.state.error.message}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default PDFErrorBoundary;
