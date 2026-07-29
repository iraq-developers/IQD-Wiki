import { getPageBySlug, getAllPages } from "@/lib/markdown";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Home } from "lucide-react";
import "@/app/markdown.css";
import { MarkdownContent } from "@/components/markdown-content";
import { GitHubIssueForm } from "@/components/github-issue-form";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb";
import { PageActionsDropdown } from "@/components/custom/page-actions-dropdown";

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

export async function generateMetadata({ params }: PageProps) {
  const { slug = [] } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    return {
      title: "Page Not Found",
      description: "The page you are looking for does not exist.",
    };
  }

  const description =
    page.description || `اقرأ عن ${page.title} في موسوعة IQD Wiki`;
  const slugPath = slug.map(encodeURIComponent).join("/");
  const canonicalPath = slug.length === 0 ? "/" : `/${slugPath}`;
  const ogImage = slug.length === 0 ? "/opengraph-image" : `/og/${slugPath}`;

  return {
    title: page.title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: page.title,
      description,
      type: "article",
      url: canonicalPath,
      siteName: "IQD Wiki",
      locale: "ar_IQ",
      modifiedTime: page.lastModified?.toISOString(),
      images: [{ url: ogImage, width: 1200, height: 630, alt: page.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description,
      images: [ogImage],
    },
  };
}

export default async function WikiPage({ params }: PageProps) {
  const { slug = [] } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  const pageUrl = `https://iqdwiki.com/${slug.map(encodeURIComponent).join("/")}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.title,
    description:
      page.description || `اقرأ عن ${page.title} في موسوعة IQD Wiki`,
    inLanguage: "ar",
    dateModified: page.lastModified?.toISOString(),
    image: `https://iqdwiki.com/og/${slug.map(encodeURIComponent).join("/")}`,
    author: {
      "@type": "Organization",
      name: "IQD Community",
      url: "https://iqdwiki.com",
    },
    publisher: {
      "@type": "Organization",
      name: "IQD Community",
      logo: {
        "@type": "ImageObject",
        url: "https://iqdwiki.com/logo.webp",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
    },
  };

  const breadcrumbJsonLd =
    slug.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "الرئيسية",
              item: "https://iqdwiki.com",
            },
            ...slug.map((segment, index) => ({
              "@type": "ListItem",
              position: index + 2,
              name:
                index === slug.length - 1
                  ? page.title
                  : formatSegment(segment),
              item: `https://iqdwiki.com/${slug
                .slice(0, index + 1)
                .map(encodeURIComponent)
                .join("/")}`,
            })),
          ],
        }
      : null;

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {breadcrumbJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbJsonLd),
          }}
        />
      )}
      <div className="max-w-4xl mx-auto px-6 md:py-12 py-6">
        {slug.length > 0 && (
          <div className="flex items-center justify-between mb-6 gap-4">
            <Breadcrumb className="mb-0">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/">
                      <Home className="size-4" />
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {slug.length > 2 && (
                  <div
                    className={`flex items-center gap-1.5 ${slug.length > 4 ? "" : "md:hidden"}`}
                  >
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbEllipsis />
                    </BreadcrumbItem>
                  </div>
                )}
                {slug.map((segment, index) => {
                  const isLast = index === slug.length - 1;
                  const href = "/" + slug.slice(0, index + 1).join("/");

                  let visibility = "";
                  if (!isLast) {
                    if (index <= 1) {
                      visibility = slug.length > 2 ? "hidden md:flex" : "";
                    } else {
                      visibility =
                        slug.length > 4
                          ? "hidden"
                          : slug.length > 2
                            ? "hidden md:flex"
                            : "";
                    }
                  }

                  return (
                    <div
                      key={href}
                      className={`flex items-center gap-1.5 ${visibility}`}
                    >
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
            <PageActionsDropdown />
          </div>
        )}

        <article className="prose prose-neutral dark:prose-invert max-w-none">
          <MarkdownContent htmlContent={page.htmlContent || ""} />
        </article>

        {page.related && page.related.length > 0 && (
          <div className="mt-12 pt-6 border-t">
            <h3 className="text-lg font-semibold mb-4">Related Resources</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {page.related.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group block p-4 rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="font-medium group-hover:text-primary transition-colors">
                    {link.title}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <GitHubIssueForm articleTitle={page.title} />

        {slug.length === 0 && <PagesList />}
      </div>
    </div>
  );
}

async function PagesList() {
  const pages = getAllPages().filter((p) => p.slug.length > 0);

  if (pages.length === 0) return null;

  return <></>;
}
