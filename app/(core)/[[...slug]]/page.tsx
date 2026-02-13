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

  return {
    title: page.title,
    description: page.description || `Read about ${page.title} on IQD Wiki`,
    alternates: {
      canonical: `/${slug.join("/")}`,
    },
    openGraph: {
      title: page.title,
      description: page.description || `Read about ${page.title} on IQD Wiki`,
      type: "article",
      url: `/${slug.join("/")}`,
    },
  };
}

export default async function WikiPage({ params }: PageProps) {
  const { slug = [] } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.title,
    description: page.description || `Read about ${page.title} on IQD Wiki`,
    author: {
      "@type": "Organization",
      name: "IQD Community",
    },
    publisher: {
      "@type": "Organization",
      name: "IQD Community",
      logo: {
        "@type": "ImageObject",
        url: "https://iraq-developers.netlify.app/favicon.ico",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://iraq-developers.netlify.app/${slug.join("/")}`,
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-4xl mx-auto px-6 md:py-12 py-0">
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
            <PageActionsDropdown />
          </div>
        )}

        <article className="prose prose-neutral dark:prose-invert max-w-none">
          <MarkdownContent htmlContent={page.htmlContent || ""} />
        </article>

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
