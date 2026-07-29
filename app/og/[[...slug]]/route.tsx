import { getPageBySlug, getAllPages } from "@/lib/markdown";
import { renderOgImage } from "@/lib/og";

export async function generateStaticParams() {
  const pages = getAllPages();
  return pages.map((page) => ({
    slug: page.slug,
  }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug?: string[] }> },
) {
  const { slug = [] } = await params;
  const page = await getPageBySlug(slug);

  return renderOgImage(page?.title || "IQD Wiki", page?.description);
}
