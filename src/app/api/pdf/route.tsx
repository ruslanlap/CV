import { NextRequest, NextResponse } from "next/server";
import { pdf } from "@react-pdf/renderer";
import PDFDocument from "@/components/PDFDocument";
import { cv as cvEn } from "@/data/cv.en";
import { cv as cvUa } from "@/data/cv.ua";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const lang = searchParams.get("lang") === "ua" ? "ua" : "en";
    const cv = lang === "ua" ? cvUa : cvEn;

    try {
        // Generate PDF blob
        const blob = await pdf(<PDFDocument cv={cv} lang={lang} />).toBlob();

        // Format filename
        const date = new Date().toISOString().split("T")[0];
        const filename = `${cv.name.replace(/\s+/g, "_")}_CV_${lang}_${date}.pdf`;
        const encodedFilename = encodeURIComponent(filename);

        // Return PDF as download
        return new NextResponse(blob, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename*=UTF-8''${encodedFilename}`,
            },
        });
    } catch (error) {
        console.error("PDF generation error:", error);
        return NextResponse.json(
            { error: "Failed to generate PDF" },
            { status: 500 }
        );
    }
}
