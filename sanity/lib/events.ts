import { defineQuery } from "next-sanity";
import { client } from "./client";
import type { EventType } from "../constants";

export interface EventItem {
  _id: string;
  title: string;
  slug: string;
  eventType: EventType;
  description?: string;
  startDate: string;
  endDate?: string;
  city: string;
  venue?: string;
  organizer?: string;
  registrationUrl?: string;
  isFree?: boolean;
  prizes?: string;
  coverImage?: { asset?: { _ref: string }; alt?: string };
}

const EVENTS_QUERY = defineQuery(`*[_type == "event" && defined(slug.current)]
  | order(startDate asc) {
    _id,
    title,
    "slug": slug.current,
    eventType,
    description,
    startDate,
    endDate,
    city,
    venue,
    organizer,
    registrationUrl,
    isFree,
    prizes,
    coverImage
  }`);

export async function getEvents(): Promise<EventItem[]> {
  if (!client) return [];
  try {
    return await client.fetch<EventItem[]>(
      EVENTS_QUERY,
      {},
      { next: { revalidate: 300, tags: ["event"] } },
    );
  } catch (error) {
    console.error("Failed to fetch events from Sanity:", error);
    return [];
  }
}

export async function getEventsByStatus() {
  const events = await getEvents();
  const now = Date.now();
  const isPast = (e: EventItem) =>
    new Date(e.endDate ?? e.startDate).getTime() < now;

  return {
    upcoming: events.filter((e) => !isPast(e)),
    // Most recent past events first.
    past: events.filter(isPast).reverse(),
  };
}
