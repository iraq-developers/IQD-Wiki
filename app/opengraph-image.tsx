import { renderOgImage, OG_SIZE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "IQD Wiki - المصدر الأول للمطورين في العراق";

export default async function Image() {
  return renderOgImage(
    "المصدر الأول للمطورين في العراق",
    "مقالات، دروس، ومصادر تعلم برمجية باللغة العربية",
  );
}
