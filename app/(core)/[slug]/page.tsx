import { sanityFetch } from "@/sanity/lib/live";
import { CategoryCard } from "@/components/ui/category-card";
import { PostCard } from "@/components/ui/post-card";
import { defineQuery } from "next-sanity";
import { notFound } from "next/navigation";

const CATEGORY_QUERY =
  defineQuery(`*[_type == "category" && slug.current == $slug][0] {
  _id,
  title,
  description
}`);

const SUB_CATEGORIES_QUERY =
  defineQuery(`*[_type == "category" && parent._ref == $categoryId] | order(title asc) {
  _id,
  title,
  description,
  "slug": slug.current,
  "postCount": count(*[_type == "post" && references(^._id)])
}`);

const POSTS_QUERY =
  defineQuery(`*[_type == "post" && references($categoryId)] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  mainImage,
  author->{name, image},
  body
}`);

interface Category {
  _id: string;
  title: string;
  description?: string;
  slug: string;
  postCount: number;
}

interface Post {
  _id: string;
  title: string;
  slug: string;
  publishedAt?: string;
  mainImage?: any;
  author?: {
    name: string;
    image?: any;
  };
  body?: any;
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data: category } = await sanityFetch({
    query: CATEGORY_QUERY,
    params: { slug },
  });

  if (!category) {
    notFound();
  }

  const { data: subCategories } = await sanityFetch({
    query: SUB_CATEGORIES_QUERY,
    params: { categoryId: category._id },
  });

  const { data: posts } = await sanityFetch({
    query: POSTS_QUERY,
    params: { categoryId: category._id },
  });

  // Helper to extract text from block content for excerpt
  const getExcerpt = (body: any) => {
    if (!body || !Array.isArray(body)) return undefined;
    const block = body.find((b: any) => b._type === "block" && b.children);
    if (!block) return undefined;
    return block.children.map((c: any) => c.text).join(" ");
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          {category.title}
        </h1>
        {category.description && (
          <p className="text-muted-foreground text-lg max-w-3xl">
            {category.description}
          </p>
        )}
      </div>

      {(subCategories as Category[]).length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Sub Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {(subCategories as Category[]).map((sub) => (
              <CategoryCard
                key={sub._id}
                title={sub.title}
                description={sub.description}
                slug={sub.slug}
                postCount={sub.postCount}
              />
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-semibold mb-6">Posts</h2>
        {(posts as Post[]).length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(posts as Post[]).map((post) => (
              <PostCard
                key={post._id}
                title={post.title}
                slug={`${slug}/${post.slug}`}
                publishedAt={post.publishedAt}
                mainImage={post.mainImage}
                author={post.author}
                excerpt={getExcerpt(post.body)}
              />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">
            No posts found in this category.
          </p>
        )}
      </div>
    </div>
  );
}
