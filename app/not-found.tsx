import Link from "next/link";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center p-4 text-center">
      <div className="mb-8 rounded-full bg-muted p-8">
        <FileQuestion className="size-16 text-muted-foreground" />
      </div>
      <h1 className="mb-4 text-4xl font-bold tracking-tight lg:text-5xl">
        404 - الصفحة غير موجودة
      </h1>
      <p className="mb-8 text-xl text-muted-foreground max-w-[500px]">
        عذراً، يبدو أن الصفحة التي تبحث عنها قد تم نقلها أو حذفها أو أنها لم تكن
        موجودة من الأساس.
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
      >
        العودة للرئيسية
      </Link>
    </div>
  );
}
