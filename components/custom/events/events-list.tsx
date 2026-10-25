"use client";

import { useState } from "react";
import { CalendarX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { EVENT_TYPES, type EventType } from "@/sanity/constants";
import type { EventItem } from "@/sanity/lib/events";
import { EventCard } from "./event-card";

type Filter = "all" | EventType;

export function EventsList({
  upcoming,
  past,
  children,
}: {
  upcoming: EventItem[];
  past: EventItem[];
  children?: React.ReactNode;
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const matches = (event: EventItem) =>
    filter === "all" || event.eventType === filter;

  const filteredUpcoming = upcoming.filter(matches);
  const filteredPast = past.filter(matches);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
        >
          الكل
        </Button>
        {EVENT_TYPES.map((type) => (
          <Button
            key={type.value}
            size="sm"
            variant={filter === type.value ? "default" : "outline"}
            onClick={() => setFilter(type.value)}
          >
            {type.title}
          </Button>
        ))}
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">الفعاليات القادمة</h2>
        {filteredUpcoming.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredUpcoming.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        ) : (
          <Empty className="border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <CalendarX />
              </EmptyMedia>
              <EmptyTitle>لا توجد فعاليات قادمة حالياً</EmptyTitle>
              <EmptyDescription>
                تابعنا، سنضيف الفعاليات الجديدة فور الإعلان عنها.
              </EmptyDescription>
            </EmptyHeader>
            {children}
          </Empty>
        )}
      </section>

      {filteredPast.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold">فعاليات سابقة</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredPast.map((event) => (
              <EventCard key={event._id} event={event} isPast />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
