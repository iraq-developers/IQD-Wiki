import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
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

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function processYouTubeEmbeds(markdown: string): string {
  return markdown.replace(
    /^::youtube\[(.+?)\]\s*$/gm,
    (_match: string, url: string) => {
      const videoId = extractYouTubeId(url.trim());
      if (!videoId) return _match;
      return `<div class="youtube-embed"><iframe src="https://www.youtube.com/embed/${videoId}" title="YouTube video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy"></iframe></div>`;
    },
  );
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

export async function getPageBySlug(slug: string[]): Promise<WikiPage | null> {
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
      const processed = processYouTubeEmbeds(content);
      const processedContent = await remark()
        .use(remarkGfm)
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeRaw)
        .use(rehypeHighlight)
        .use(rehypeStringify)
        .process(processed);
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
