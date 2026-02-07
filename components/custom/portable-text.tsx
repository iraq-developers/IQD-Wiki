import {
  PortableText as PortableTextReact,
  PortableTextComponents,
} from "next-sanity";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

const components: PortableTextComponents = {
  block: {
    h1: ({ children }) => (
      <h1 className="text-3xl font-bold mt-8 mb-4 scroll-m-20 tracking-tight text-foreground">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-semibold mt-8 mb-4 scroll-m-20 tracking-tight text-foreground border-b pb-2">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-semibold mt-6 mb-3 scroll-m-20 tracking-tight text-foreground">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-lg font-semibold mt-6 mb-3 scroll-m-20 tracking-tight text-foreground">
        {children}
      </h4>
    ),
    normal: ({ children }) => (
      <p className="leading-7 [&:not(:first-child)]:mt-6 text-foreground/90">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="mt-6 border-r-4 border-primary pl-6 italic text-muted-foreground pr-4 py-2 bg-muted/30 rounded-r-md">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="my-6 mr-6 list-disc [&>li]:mt-2">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="my-6 mr-6 list-decimal [&>li]:mt-2">{children}</ol>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      const rel = !value.href.startsWith("/")
        ? "noreferrer noopener"
        : undefined;
      return (
        <a
          href={value.href}
          rel={rel}
          className="font-medium text-primary underline underline-offset-4 hover:no-underline transition-colors"
        >
          {children}
        </a>
      );
    },
    code: ({ children }) => (
      <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-foreground">
        {children}
      </code>
    ),
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) {
        return null;
      }
      return (
        <div className="my-8 relative rounded-lg overflow-hidden border border-border bg-muted/50">
          <Image
            src={urlFor(value).url()}
            alt={value.alt || "Post image"}
            width={800}
            height={500}
            className="w-full h-auto object-cover"
            priority={false}
          />
          {value.caption && (
            <div className="absolute bottom-0 w-full bg-black/60 p-2 text-center text-xs text-white">
              {value.caption}
            </div>
          )}
        </div>
      );
    },
  },
};

export function PortableText({ value }: { value: any }) {
  return (
    <div className="prose dark:prose-invert max-w-none text-right" dir="rtl">
      <PortableTextReact value={value} components={components} />
    </div>
  );
}
