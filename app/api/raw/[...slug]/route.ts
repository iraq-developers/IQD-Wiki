import { getPageBySlug } from "@/lib/markdown";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return new NextResponse(page.content, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
}
