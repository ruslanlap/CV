import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: 'swap',
  preload: true,
});

export const metadata = {
  title: "Ruslan Lapiniak — Full Stack & DevOps Engineer",
  description: "Senior Full Stack Developer & DevOps Engineer. Expert in React, Next.js, Python, and Automation. Creator of popular open-source tools.",
  keywords: ["Ruslan Lapiniak", "Full Stack", "DevOps", "React", "Next.js", "Python", "CV", "Resume", "Lviv"],
  authors: [{ name: "Ruslan Lapiniak", url: "https://github.com/ruslanlap" }],
  creator: "Ruslan Lapiniak",
  metadataBase: new URL("https://ruslan-lapiniak-cv.vercel.app"),
  alternates: {
    languages: {
      'en-US': '/en',
      'uk-UA': '/ua',
    },
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Ruslan Lapiniak — Full Stack & DevOps Engineer",
    description: "Senior Full Stack Developer & DevOps Engineer. View my projects, skills, and experience.",
    siteName: "Ruslan Lapiniak CV",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ruslan Lapiniak — Full Stack & DevOps Engineer",
    description: "Check out my interactive CV built with Next.js and AI.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen antialiased`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-base2 focus:font-bold focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
        >
          Skip to main content
        </a>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
