import type { Metadata } from "next";
import { Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { PostHogProvider } from "@/components/custom/layout/providers";

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-noto-sans-arabic",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://iqdwiki.com"),
  title: {
    default: "IQD Wiki - المصدر الأول للمطورين في العراق",
    template: "%s | IQD Wiki",
  },
  description:
    "موسوعة المطورين العراقيين الشاملة. مقالات، دروس، ومصادر تعلم برمجية باللغة العربية.",
  keywords: [
    "Iraqi Developers",
    "IQD",
    "Programming in Iraq",
    "Web Development",
    "برمجة",
    "تطوير ويب",
    "العراق",
    "مطورين",
  ],
  authors: [{ name: "IQD Community" }],
  creator: "IQD Community",
  publisher: "IQD Community",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "IQD Wiki - المصدر الأول للمطورين في العراق",
    description:
      "موسوعة المطورين العراقيين الشاملة. مقالات، دروس، ومصادر تعلم برمجية باللغة العربية.",
    url: "https://iqdwiki.com",
    siteName: "IQD Wiki",
    locale: "ar_IQ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "IQD Wiki - المصدر الأول للمطورين في العراق",
    description:
      "موسوعة المطورين العراقيين الشاملة. مقالات، دروس، ومصادر تعلم برمجية باللغة العربية.",
    creator: "@iraqdevs",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "IQD Wiki",
  alternateName: "موسوعة المطورين العراقيين",
  url: "https://iqdwiki.com",
  description:
    "موسوعة المطورين العراقيين الشاملة. مقالات، دروس، ومصادر تعلم برمجية باللغة العربية.",
  inLanguage: "ar",
  publisher: {
    "@type": "Organization",
    name: "IQD Community",
    url: "https://iqdwiki.com",
    logo: {
      "@type": "ImageObject",
      url: "https://iqdwiki.com/logo.webp",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${notoSansArabic.variable} antialiased font-sans`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PostHogProvider>{children}</PostHogProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
