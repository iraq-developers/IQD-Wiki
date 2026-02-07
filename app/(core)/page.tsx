import { sanityFetch } from "@/sanity/lib/live";
import { CategoryCard } from "@/components/ui/category-card";
import { defineQuery } from "next-sanity";

const CATEGORIES_QUERY =
  defineQuery(`*[_type == "category" && !defined(parent)] | order(title asc) {
  _id,
  title,
  description,
  "slug": slug.current,
  "postCount": count(*[_type == "post" && references(^._id)])
}`);

interface Category {
  _id: string;
  title: string;
  description?: string;
  slug: string;
  postCount: number;
}

export default async function Page() {
  const { data: categories } = await sanityFetch({
    query: CATEGORIES_QUERY,
  });

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">قاعدة المعرفة</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          تصفح الفئات للعثور على المعلومات التي تحتاجها.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {(categories as Category[]).map((category) => (
          <CategoryCard
            key={category._id}
            title={category.title}
            description={category.description}
            slug={category.slug}
            postCount={category.postCount}
          />
        ))}
      </div>
    </div>
  );
}
