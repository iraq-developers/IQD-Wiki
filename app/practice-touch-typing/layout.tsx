import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Practice Touch Typing | تدرّب على الكتابة السريعة",
    description:
        "Free online touch typing practice tool. Paste any English article and practice typing in a distraction-free environment. Track your WPM, accuracy, and progress over time. أداة مجانية للتدريب على الكتابة السريعة.",
    keywords: [
        "touch typing practice",
        "typing speed test",
        "WPM test",
        "typing practice online",
        "learn touch typing",
        "تدريب كتابة",
        "كتابة سريعة",
        "تدرب على الكتابة",
        "IQD Wiki",
        "typing tutor",
        "free typing practice",
    ],
    openGraph: {
        title: "Practice Touch Typing — IQD Wiki",
        description:
            "Free online touch typing practice. Paste any article and start typing. Track WPM, accuracy & progress.",
        url: "https://iraq-developers.netlify.app/practice-touch-typing",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Practice Touch Typing — IQD Wiki",
        description:
            "Free online touch typing practice. Paste any article and start typing. Track WPM, accuracy & progress.",
    },
    alternates: {
        canonical: "https://iraq-developers.netlify.app/practice-touch-typing",
    },
};

export default function PracticeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
