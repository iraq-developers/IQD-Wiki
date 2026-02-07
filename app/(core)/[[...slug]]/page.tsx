import { getPageBySlug, getAllPages } from "@/lib/markdown";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Home } from "lucide-react";
import "@/app/markdown.css";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

function formatSegment(segment: string): string {
  const decoded = decodeURIComponent(segment);
  return decoded
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function generateStaticParams() {
  const pages = getAllPages();
  return pages.map((page) => ({
    slug: page.slug,
  }));
}

export default async function WikiPage({ params }: PageProps) {
  const { slug = [] } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {slug.length > 0 && (
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">
                    <Home className="size-4" />
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {slug.map((segment, index) => {
                const isLast = index === slug.length - 1;
                const href = "/" + slug.slice(0, index + 1).join("/");
                return (
                  <div key={href} className="flex items-center gap-1.5">
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      {isLast ? (
                        <BreadcrumbPage>
                          {formatSegment(segment)}
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link href={href}>{formatSegment(segment)}</Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </div>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        )}

        <article className="prose prose-neutral dark:prose-invert max-w-none">
          <div
            className="markdown-content"
            dangerouslySetInnerHTML={{ __html: page.htmlContent || "" }}
          />
        </article>

        {slug.length === 0 && <PagesList />}
      </div>
    </div>
  );
}

async function PagesList() {
  const pages = getAllPages().filter((p) => p.slug.length > 0);

  if (pages.length === 0) return null;

  return (
    <nav className="mt-12 pt-8 border-t border-border">
      <h2 className="text-lg font-semibold mb-4">All Pages</h2>
      <ul className="space-y-2">
        {pages.map((page) => (
          <li key={page.slug.join("/")}>
            <Link
              href={`/${page.slug.join("/")}`}
              className="text-primary hover:underline"
            >
              {page.title}
            </Link>
            {page.description && (
              <p className="text-sm text-muted-foreground">
                {page.description}
              </p>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
