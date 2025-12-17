import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";

export const metadata = {
  title: "Ruslan Lapiniak — Full Stack & DevOps Engineer",
  description: "Senior Full Stack Developer & DevOps Engineer. Expert in React, Next.js, Python, and Automation. Creator of popular open-source tools.",
  keywords: ["Ruslan Lapiniak", "Full Stack", "DevOps", "React", "Next.js", "Python", "CV", "Resume", "Lviv"],
  authors: [{ name: "Ruslan Lapiniak", url: "https://github.com/ruslanlap" }],
  creator: "Ruslan Lapiniak",
  metadataBase: process.env.VERCEL_URL
    ? new URL(`https://${process.env.VERCEL_URL}`)
    : new URL("http://localhost:3000"),
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
      <body className="min-h-screen">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
