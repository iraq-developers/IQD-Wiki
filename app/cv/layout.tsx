import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";

/* Self-hosted and same-origin. The old remote @import inside a <style> tag
   meant html-to-image could rasterise before the font had settled, so exports
   sometimes came out in the fallback face. */
const inter = Inter({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
    variable: "--font-cv",
    display: "swap",
});

export const metadata: Metadata = {
    title: "CV Builder | صانع السيرة الذاتية",
    description:
        "Free online CV builder. Write it with AI, edit every detail, keep it to one page, and export a PDF or PNG. أداة مجانية لإنشاء السيرة الذاتية.",
    keywords: [
        "CV builder",
        "resume builder",
        "online CV",
        "free resume",
        "AI CV",
        "ATS resume",
        "سيرة ذاتية",
        "IQD Wiki",
        "cv maker",
    ],
    openGraph: {
        title: "CV Builder — IQD Wiki",
        description:
            "Free online CV builder. Write it with AI, edit, customise, and export your resume as PDF or PNG.",
        url: "https://iqdwiki.com/cv",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "CV Builder — IQD Wiki",
        description:
            "Free online CV builder. Write it with AI, edit, customise, and export your resume as PDF or PNG.",
    },
    alternates: {
        canonical: "https://iqdwiki.com/cv",
    },
};

/* `viewport-fit=cover` lets the mobile shell use env(safe-area-inset-*).
   `maximumScale` is left alone on purpose — pinch-zoom is an accessibility
   requirement, and our 16px inputs already stop iOS auto-zooming on focus. */
export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
};

export default function CVLayout({ children }: { children: React.ReactNode }) {
    return (
        <div dir="ltr" className={inter.variable}>
            {children}
            <Toaster position="top-center" richColors closeButton />
        </div>
    );
}
