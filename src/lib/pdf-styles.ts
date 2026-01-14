/**
 * PDF Styles
 * StyleSheet for PDF generation matching Catppuccin theme
 */

import { StyleSheet, Font } from "@react-pdf/renderer";

// Register fonts (using system fonts for better compatibility)
// Note: For production, you may want to embed custom fonts

/**
 * PDF StyleSheet matching Catppuccin Mocha theme
 * Optimized for print with appropriate colors and contrast
 */
export const pdfStyles = StyleSheet.create({
    // Page layout
    page: {
        padding: "2.5cm",
        backgroundColor: "#ffffff",
        fontFamily: "Helvetica",
        fontSize: 10,
        lineHeight: 1.5,
        color: "#1e1e2e", // Catppuccin base (darker for print)
    },

    // Header section
    header: {
        marginBottom: 20,
        borderBottom: "2pt solid #8839ef", // Catppuccin mauve/accent
        paddingBottom: 15,
    },

    headerContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },

    headerLeft: {
        flex: 1,
    },

    headerRight: {
        width: 80,
        height: 80,
        marginLeft: 15,
    },

    profileImage: {
        width: "100%",
        height: "100%",
        borderRadius: 40,
        objectFit: "cover",
    },

    name: {
        fontSize: 24,
        fontFamily: "Helvetica-Bold",
        color: "#1e1e2e",
        marginBottom: 4,
    },

    role: {
        fontSize: 14,
        color: "#8839ef", // Catppuccin mauve/accent
        fontFamily: "Helvetica-Bold",
        marginBottom: 4,
    },

    location: {
        fontSize: 10,
        color: "#6c7086", // Catppuccin overlay2
        marginBottom: 8,
    },

    contactInfo: {
        fontSize: 9,
        color: "#45475a", // Catppuccin surface2
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },

    contactItem: {
        marginRight: 12,
    },

    link: {
        color: "#8839ef", // Catppuccin mauve/accent
        textDecoration: "underline",
    },

    // Section styles
    section: {
        marginTop: 16,
        marginBottom: 12,
    },

    sectionTitle: {
        fontSize: 14,
        fontFamily: "Helvetica-Bold",
        color: "#8839ef", // Catppuccin mauve/accent
        marginBottom: 8,
        borderBottom: "1pt solid #cdd6f4", // Catppuccin text (lighter)
        paddingBottom: 4,
    },

    // Summary section
    summary: {
        fontSize: 10,
        color: "#1e1e2e",
        lineHeight: 1.6,
        textAlign: "justify",
    },

    // Experience section
    experienceItem: {
        marginBottom: 12,
    },

    experienceHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "baseline",
        marginBottom: 4,
    },

    experienceTitle: {
        fontSize: 11,
        fontFamily: "Helvetica-Bold",
        color: "#1e1e2e",
    },

    experiencePeriod: {
        fontSize: 9,
        color: "#6c7086", // Catppuccin overlay2
        fontFamily: "Helvetica-Oblique",
    },

    experienceCompany: {
        fontSize: 10,
        color: "#45475a", // Catppuccin surface2
        marginBottom: 4,
    },

    bulletList: {
        marginLeft: 15,
        marginTop: 4,
    },

    bulletItem: {
        fontSize: 9,
        color: "#1e1e2e",
        marginBottom: 3,
        flexDirection: "row",
    },

    bulletPoint: {
        width: 8,
        marginRight: 6,
    },

    bulletText: {
        flex: 1,
    },

    // Skills section
    skillsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
    },

    skillGroup: {
        width: "48%",
        marginBottom: 8,
    },

    skillGroupTitle: {
        fontSize: 10,
        fontFamily: "Helvetica-Bold",
        color: "#8839ef", // Catppuccin mauve/accent
        marginBottom: 4,
    },

    skillItems: {
        fontSize: 9,
        color: "#1e1e2e",
        lineHeight: 1.4,
    },

    // Projects section
    projectItem: {
        marginBottom: 10,
    },

    projectName: {
        fontSize: 10,
        fontFamily: "Helvetica-Bold",
        color: "#1e1e2e",
        marginBottom: 2,
    },

    projectDescription: {
        fontSize: 9,
        color: "#45475a", // Catppuccin surface2
        marginBottom: 3,
        lineHeight: 1.4,
    },

    projectLink: {
        fontSize: 8,
        color: "#8839ef", // Catppuccin mauve/accent
        textDecoration: "underline",
        marginBottom: 3,
    },

    projectStack: {
        fontSize: 8,
        color: "#6c7086", // Catppuccin overlay2
        fontFamily: "Helvetica-Oblique",
    },

    // Education section
    educationGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
    },

    educationItem: {
        width: "48%",
        marginBottom: 8,
    },

    educationName: {
        fontSize: 10,
        fontFamily: "Helvetica-Bold",
        color: "#1e1e2e",
        marginBottom: 2,
    },

    educationDetails: {
        flexDirection: "row",
        justifyContent: "space-between",
        fontSize: 8,
        color: "#6c7086", // Catppuccin overlay2
    },

    // Languages section
    languagesContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },

    languageItem: {
        fontSize: 9,
        color: "#1e1e2e",
        marginRight: 12,
    },

    // Hobbies section
    hobbiesContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 6,
    },

    hobbyItem: {
        fontSize: 9,
        color: "#1e1e2e",
        marginRight: 10,
    },

    // Footer
    footer: {
        position: "absolute",
        bottom: 20,
        left: "2.5cm",
        right: "2.5cm",
        textAlign: "center",
        fontSize: 8,
        color: "#9399b2", // Catppuccin overlay1
        borderTop: "1pt solid #cdd6f4",
        paddingTop: 8,
    },
});

/**
 * Layout constants
 */
export const PDF_LAYOUT = {
    pageMargin: "2.5cm",
    sectionSpacing: 16,
    itemSpacing: 12,
    maxWidth: "100%",
};

/**
 * Color palette (Catppuccin Mocha - print optimized)
 */
export const PDF_COLORS = {
    primary: "#1e1e2e",      // base (darker for print)
    accent: "#8839ef",       // mauve
    text: "#1e1e2e",         // base
    subtext: "#45475a",      // surface2
    muted: "#6c7086",        // overlay2
    border: "#cdd6f4",       // text (lighter)
    background: "#ffffff",   // white for print
};
