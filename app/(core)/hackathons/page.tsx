import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { EventsList } from "@/components/custom/events/events-list";
import { getEventsByStatus } from "@/sanity/lib/events";
import { cn } from "@/lib/utils";

export const revalidate = 300;

const title = "الهاكاثونات وفعاليات المطورين في العراق";
const description =
  "تابع أحدث الهاكاثونات، لقاءات المطورين، ورش العمل والمؤتمرات التقنية في جميع مدن العراق.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/hackathons" },
  openGraph: {
    title,
    description,
    url: "/hackathons",
    siteName: "IQD Wiki",
    locale: "ar_IQ",
    type: "website",
  },
};

const SUBMIT_EVENT_URL =
  "https://github.com/iraq-developers/IQD-Wiki/issues/new?title=" +
  encodeURIComponent("فعالية جديدة: ");

export default async function HackathonsPage() {
  const { upcoming, past } = await getEventsByStatus();

  const submitButton = (
    <a
      href={SUBMIT_EVENT_URL}
      target="_blank"
      rel="noreferrer"
      className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-2")}
    >
      <Plus className="size-4" />
      <span>أضف فعاليتك</span>
    </a>
  );

  return (
    <div className="max-w-4xl mx-auto px-6 md:py-12 py-6 flex flex-col gap-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            الهاكاثونات والفعاليات
          </h1>
          <p className="text-muted-foreground max-w-2xl">{description}</p>
        </div>
        {submitButton}
      </header>

      <EventsList upcoming={upcoming} past={past}>
        {submitButton}
      </EventsList>
    </div>
  );
}
