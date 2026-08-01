import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";

const typingMono = JetBrains_Mono({
    subsets: ["latin"],
    weight: ["400", "500"],
    display: "swap",
    variable: "--font-mono-typing",
});

export const metadata: Metadata = {
    title: "Practice Touch Typing | تدرّب على الكتابة السريعة",
    description:
        "A calm, distraction-free place to practice typing. Pick a story worth reading and type it — no score, no timer, no test. أداة مجانية وهادئة للتدريب على الكتابة السريعة.",
    keywords: [
        "touch typing practice",
        "typing practice online",
        "learn touch typing",
        "typing trainer",
        "distraction free typing",
        "تدريب كتابة",
        "كتابة سريعة",
        "تدرب على الكتابة",
        "IQD Wiki",
        "free typing practice",
    ],
    openGraph: {
        title: "Practice Touch Typing — IQD Wiki",
        description:
            "Pick a story worth reading and type it. No score, no timer, no test — just you and the keyboard.",
        url: "https://iqdwiki.com/practice-touch-typing",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Practice Touch Typing — IQD Wiki",
        description:
            "Pick a story worth reading and type it. No score, no timer, no test — just you and the keyboard.",
    },
    alternates: {
        canonical: "https://iqdwiki.com/practice-touch-typing",
    },
};

export default function PracticeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <div className={typingMono.variable}>{children}</div>;
}
