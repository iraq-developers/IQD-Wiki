import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkRehype from "remark-rehype";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";

const contentDirectory = path.join(process.cwd(), "content");

export interface WikiPage {
  slug: string[];
  title: string;
  description?: string;
  content: string;
  htmlContent?: string;
}

export interface WikiPageMeta {
  slug: string[];
  title: string;
  description?: string;
}

function getSlugFromPath(filePath: string): string[] {
  const relativePath = path.relative(contentDirectory, filePath);
  const slug = relativePath
    .replace(/\.md$/, "")
    .split(path.sep)
    .filter((part) => part !== "index");
  return slug.length === 0 ? [] : slug;
}

export function getAllPages(dir: string = contentDirectory): WikiPageMeta[] {
  if (!fs.existsSync(dir)) {
    return [];
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const pages: WikiPageMeta[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      pages.push(...getAllPages(fullPath));
    } else if (entry.name.endsWith(".md")) {
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);
      const slug = getSlugFromPath(fullPath);
      pages.push({
        slug,
        title: data.title || slug[slug.length - 1] || "Home",
        description: data.description,
      });
    }
  }

  return pages;
}

export async function getPageBySlug(
  slug: string[]
): Promise<WikiPage | null> {
  const decodedSlug = slug.map((s) => decodeURIComponent(s));
  const possiblePaths = [
    path.join(contentDirectory, ...decodedSlug, "index.md"),
    path.join(contentDirectory, ...decodedSlug) + ".md",
  ];

  if (slug.length === 0) {
    possiblePaths.unshift(path.join(contentDirectory, "index.md"));
  }

  for (const filePath of possiblePaths) {
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(fileContents);
      const processedContent = await remark()
        .use(remarkRehype)
        .use(rehypeHighlight)
        .use(rehypeStringify)
        .process(content);
      const htmlContent = processedContent.toString();

      return {
        slug: decodedSlug,
        title: data.title || decodedSlug[decodedSlug.length - 1] || "Home",
        description: data.description,
        content,
        htmlContent,
      };
    }
  }

  return null;
}

export function generateStaticParams(): { slug: string[] }[] {
  const pages = getAllPages();
  return pages.map((page) => ({
    slug: page.slug.length === 0 ? [] : page.slug,
  }));
}
