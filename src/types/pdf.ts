/**
 * PDF Export Types
 * Types for PDF generation and export functionality
 */

import { CV } from "./cv";

export interface PDFData {
    cv: CV;                // Full CV data
    lang: "en" | "ua";     // Language selection
    generatedAt: Date;     // Generation timestamp
    metadata: PDFMetadata; // PDF metadata
}

export interface PDFMetadata {
    title: string;
    author: string;
    subject: string;
    keywords: string;
    creator: string;
    producer: string;
    creationDate: Date;
}

export interface PDFExportOptions {
    filename?: string;
    openInNewTab?: boolean;
}

export interface PDFGenerationState {
    isGenerating: boolean;
    progress: number;
    error?: string;
}
