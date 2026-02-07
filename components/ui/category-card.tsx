import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tag } from "lucide-react";

interface CategoryCardProps {
  title: string;
  description?: string;
  slug: string;
  postCount?: number;
}

export function CategoryCard({
  title,
  description,
  slug,
  postCount,
}: CategoryCardProps) {
  return (
    <Link href={`/${slug}`} className="block transition-all hover:scale-[1.02]">
      <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer border-2 hover:border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 w-fit rounded-md bg-primary/10 text-primary">
              <Tag className="w-5 h-5" />
            </div>
            {postCount !== undefined && (
              <span className="text-xs text-muted-foreground font-medium bg-secondary px-2 py-1 rounded-full">
                {postCount} posts
              </span>
            )}
          </div>
          <CardTitle className="text-xl mb-2">{title}</CardTitle>
          {description && (
            <CardDescription className="line-clamp-3">
              {description}
            </CardDescription>
          )}
        </CardHeader>
      </Card>
    </Link>
  );
}
