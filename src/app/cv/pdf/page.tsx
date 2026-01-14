import PDFPageContent from "@/components/PDFPageContent";
import { cv as cvEn } from "@/data/cv.en";
import { cv as cvUa } from "@/data/cv.ua";

export const metadata = {
  title: "Ruslan_Lapiniak CV PDF",
  robots: { index: false, follow: false },
};

export default async function PDFPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang: langParam } = await searchParams;
  const lang = langParam === "ua" ? "ua" : "en";
  const cv = lang === "ua" ? cvUa : cvEn;

  return <PDFPageContent cv={cv} lang={lang} />;
}
