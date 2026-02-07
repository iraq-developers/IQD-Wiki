import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { format } from "date-fns";
import { Calendar, User } from "lucide-react";
import Image from "next/image";

interface PostCardProps {
  title: string;
  slug: string;
  excerpt?: string; // Using body first block or similar
  author?: {
    name: string;
    image?: any;
  };
  publishedAt?: string;
  mainImage?: any; // Sanity image
}

export function PostCard({
  title,
  slug,
  excerpt,
  author,
  publishedAt,
  mainImage,
}: PostCardProps) {
  return (
    <Link href={`${slug}`} className="block transition-all hover:scale-[1.02]">
      <Card className="h-full overflow-hidden hover:bg-muted/50 transition-colors cursor-pointer border-2 hover:border-primary/20 flex flex-col">
        {mainImage && (
          <div className="relative aspect-video w-full overflow-hidden bg-muted">
            {/*  Placeholder for now, implementation depends on Sanity image builder usage in project which I need to check */}
            {/* <Image src={urlFor(mainImage).url()} alt={title} fill className="object-cover" /> */}
            <div className="absolute inset-0 bg-secondary/30 flex items-center justify-center text-muted-foreground">
              Image Placeholder
            </div>
          </div>
        )}
        <CardHeader>
          <CardTitle className="line-clamp-2 leading-tight">{title}</CardTitle>
          {publishedAt && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
              <Calendar className="w-3 h-3" />
              <span>{format(new Date(publishedAt), "MMMM d, yyyy")}</span>
            </div>
          )}
        </CardHeader>
        <CardContent className="flex-grow">
          {excerpt && (
            <p className="text-sm text-muted-foreground line-clamp-3">
              {excerpt}
            </p>
          )}
        </CardContent>
        {author && (
          <CardFooter className="pt-2 pb-4">
            <div className="flex items-center gap-2 text-sm text-foreground/80">
              <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center">
                <User className="w-3 h-3" />
              </div>
              <span>{author.name}</span>
            </div>
          </CardFooter>
        )}
      </Card>
    </Link>
  );
}
