import { sanityFetch } from "@/sanity/lib/live";
import { defineQuery } from "next-sanity";
import { notFound } from "next/navigation";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { PortableText } from "@/components/custom/portable-text";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const POST_QUERY = defineQuery(`*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  mainImage,
  author->{name, image},
  body,
  categories[]->{title, slug}
}`);

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string; postSlug: string }>;
}) {
  const { postSlug, slug: categorySlug } = await params;

  const { data: post } = await sanityFetch({
    query: POST_QUERY,
    params: { slug: postSlug },
  });

  if (!post) {
    notFound();
  }

  return (
    <article className="container mx-auto py-10 px-4 max-w-4xl">
      {/* Breadcrumb-ish navigation */}
      <div className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
        <Link
          href="/"
          className="hover:text-foreground hover:underline transition-colors"
        >
          الرئيسية
        </Link>
        <ChevronRight className="h-4 w-4 rotate-180" /> {/* RTL rotate */}
        <Link
          href={`/${categorySlug}`}
          className="hover:text-foreground hover:underline transition-colors"
        >
          {post.categories?.[0]?.title || "القسم"}
        </Link>
      </div>

      <div className="space-y-6 mb-8 text-center sm:text-right">
        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
          {post.categories?.map((cat: any) => (
            <Badge
              key={cat.slug?.current}
              variant="secondary"
              className="text-sm font-normal"
            >
              {cat.title}
            </Badge>
          ))}
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center justify-center sm:justify-start gap-4 text-sm text-muted-foreground">
          {post.author && (
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={
                    post.author.image
                      ? urlFor(post.author.image).url()
                      : undefined
                  }
                />
                <AvatarFallback>{post.author.name?.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <span className="font-medium text-foreground">
                {post.author.name}
              </span>
            </div>
          )}
          {post.publishedAt && (
            <>
              <span>•</span>
              <time dateTime={post.publishedAt}>
                {format(new Date(post.publishedAt), "PPP", { locale: ar })}
              </time>
            </>
          )}
        </div>
      </div>

      {post.mainImage?.asset && (
        <div className="relative aspect-video w-full overflow-hidden rounded-xl border bg-muted mb-10 shadow-sm">
          <Image
            src={urlFor(post.mainImage).url()}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="bg-background rounded-xl">
        <PortableText value={post.body} />
      </div>
    </article>
  );
}
