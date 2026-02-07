import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["200", "300", "400", "500", "700", "800", "900"],
  variable: "--font-tajawal",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://iraq-developers.netlify.app"),
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
  openGraph: {
    title: "IQD Wiki - المصدر الأول للمطورين في العراق",
    description:
      "موسوعة المطورين العراقيين الشاملة. مقالات، دروس، ومصادر تعلم برمجية باللغة العربية.",
    url: "https://iraq-developers.netlify.app",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${tajawal.variable} antialiased font-sans`}>
        {children}
      </body>
    </html>
  );
}
