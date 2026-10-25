import { CalendarDays } from "lucide-react";
import { defineField, defineType } from "sanity";
import { CITIES, EVENT_TYPES } from "../constants";

export const event = defineType({
  name: "event",
  title: "الفعاليات",
  type: "document",
  icon: CalendarDays,
  fields: [
    defineField({
      name: "title",
      title: "العنوان",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "eventType",
      title: "نوع الفعالية",
      type: "string",
      options: { list: [...EVENT_TYPES], layout: "radio" },
      initialValue: "hackathon",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "الوصف",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "startDate",
      title: "تاريخ البداية",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "endDate",
      title: "تاريخ النهاية",
      type: "datetime",
      validation: (rule) =>
        rule.custom((endDate, context) => {
          const startDate = (context.document as { startDate?: string })
            ?.startDate;
          if (endDate && startDate && endDate < startDate) {
            return "تاريخ النهاية يجب أن يكون بعد تاريخ البداية";
          }
          return true;
        }),
    }),
    defineField({
      name: "city",
      title: "المدينة",
      type: "string",
      options: { list: [...CITIES] },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "venue",
      title: "المكان",
      type: "string",
      description: "اسم القاعة أو الجامعة أو العنوان",
    }),
    defineField({
      name: "organizer",
      title: "الجهة المنظمة",
      type: "string",
    }),
    defineField({
      name: "registrationUrl",
      title: "رابط التسجيل",
      type: "url",
    }),
    defineField({
      name: "isFree",
      title: "مجانية",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "prizes",
      title: "الجوائز",
      type: "string",
      description: "مثال: 5,000,000 دينار للمركز الأول",
      hidden: ({ document }) => document?.eventType !== "hackathon",
    }),
    defineField({
      name: "coverImage",
      title: "صورة الغلاف",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "نص بديل",
          type: "string",
        }),
      ],
    }),
  ],
  orderings: [
    {
      title: "الأقرب أولاً",
      name: "startDateAsc",
      by: [{ field: "startDate", direction: "asc" }],
    },
    {
      title: "الأحدث أولاً",
      name: "startDateDesc",
      by: [{ field: "startDate", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      startDate: "startDate",
      city: "city",
      media: "coverImage",
    },
    prepare({ title, startDate, city, media }) {
      const cityTitle = CITIES.find((c) => c.value === city)?.title;
      const date = startDate ? new Date(startDate).toLocaleDateString("ar-IQ") : "";
      return {
        title,
        subtitle: [cityTitle, date].filter(Boolean).join(" · "),
        media,
      };
    },
  },
});
