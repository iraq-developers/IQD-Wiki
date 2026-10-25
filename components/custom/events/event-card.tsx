import Image from "next/image";
import { Calendar, ExternalLink, MapPin, Trophy, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { cityTitle, eventTypeTitle } from "@/sanity/constants";
import type { EventItem } from "@/sanity/lib/events";
import { urlFor } from "@/sanity/lib/image";

const dateFormatter = new Intl.DateTimeFormat("ar-IQ-u-nu-latn", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Baghdad",
});

function formatDateRange(start: string, end?: string) {
  const startText = dateFormatter.format(new Date(start));
  if (!end) return startText;
  const endText = dateFormatter.format(new Date(end));
  return startText === endText ? startText : `${startText} - ${endText}`;
}

export function EventCard({
  event,
  isPast = false,
}: {
  event: EventItem;
  isPast?: boolean;
}) {
  return (
    <Card
      className={cn(
        "h-full overflow-hidden flex flex-col pt-0",
        isPast && "opacity-70",
      )}
    >
      {event.coverImage?.asset ? (
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          <Image
            src={urlFor(event.coverImage).width(800).height(450).fit("crop").url()}
            alt={event.coverImage.alt || event.title}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      ) : (
        <div className="aspect-video w-full bg-primary/10 flex items-center justify-center text-primary">
          <Trophy className="size-10" />
        </div>
      )}
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <Badge>{eventTypeTitle(event.eventType)}</Badge>
          {event.isFree !== undefined && (
            <Badge variant="outline">{event.isFree ? "مجانية" : "مدفوعة"}</Badge>
          )}
        </div>
        <CardTitle className="text-lg leading-tight">{event.title}</CardTitle>
        {event.description && (
          <CardDescription className="line-clamp-3">
            {event.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-2 text-sm text-muted-foreground flex-grow">
        <div className="flex items-center gap-2">
          <Calendar className="size-4 shrink-0" />
          <span>{formatDateRange(event.startDate, event.endDate)}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="size-4 shrink-0" />
          <span>
            {cityTitle(event.city)}
            {event.venue && ` - ${event.venue}`}
          </span>
        </div>
        {event.organizer && (
          <div className="flex items-center gap-2">
            <Users className="size-4 shrink-0" />
            <span>{event.organizer}</span>
          </div>
        )}
        {event.prizes && (
          <div className="flex items-center gap-2">
            <Trophy className="size-4 shrink-0" />
            <span>{event.prizes}</span>
          </div>
        )}
      </CardContent>
      {event.registrationUrl && !isPast && (
        <CardFooter>
          <a
            href={event.registrationUrl}
            target="_blank"
            rel="noreferrer"
            className={cn(buttonVariants({ size: "sm" }), "w-full gap-2")}
          >
            <span>سجّل الآن</span>
            <ExternalLink className="size-4" />
          </a>
        </CardFooter>
      )}
    </Card>
  );
}
