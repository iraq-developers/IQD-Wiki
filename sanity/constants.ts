// Shared by the Studio schema and the site, so keep this file free of `sanity` imports.

export const EVENT_TYPES = [
  { title: "هاكاثون", value: "hackathon" },
  { title: "لقاء مطورين", value: "meetup" },
  { title: "ورشة عمل", value: "workshop" },
  { title: "مؤتمر", value: "conference" },
] as const;

export const CITIES = [
  { title: "بغداد", value: "baghdad" },
  { title: "أربيل", value: "erbil" },
  { title: "البصرة", value: "basra" },
  { title: "الموصل", value: "mosul" },
  { title: "السليمانية", value: "sulaymaniyah" },
  { title: "النجف", value: "najaf" },
  { title: "كربلاء", value: "karbala" },
  { title: "كركوك", value: "kirkuk" },
  { title: "دهوك", value: "duhok" },
  { title: "الحلة", value: "hillah" },
  { title: "الناصرية", value: "nasiriyah" },
  { title: "الأنبار", value: "anbar" },
  { title: "أونلاين", value: "online" },
] as const;

export type EventType = (typeof EVENT_TYPES)[number]["value"];

export function eventTypeTitle(value: string) {
  return EVENT_TYPES.find((t) => t.value === value)?.title ?? value;
}

export function cityTitle(value: string) {
  return CITIES.find((c) => c.value === value)?.title ?? value;
}
