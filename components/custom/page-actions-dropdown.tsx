"use client";

import { useEffect, useState, useRef } from "react";
import {
  Bot,
  Sparkles,
  Brain,
  ChevronDown,
  Copy,
  Check,
  FileText,
  Hexagon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface PageActionsDropdownProps {
  url?: string;
}

export function PageActionsDropdown({ url }: PageActionsDropdownProps) {
  const [currentUrl, setCurrentUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (url) {
      setCurrentUrl(url);
    } else if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, [url]);

  const getSlugFromUrl = (): string | null => {
    try {
      const url = new URL(currentUrl);
      const pathname = url.pathname.replace(/^\//, "").replace(/\/$/, "");
      return pathname || null;
    } catch {
      return null;
    }
  };

  const copyPage = async () => {
    const slug = getSlugFromUrl();
    if (!slug) return;
    try {
      const res = await fetch(`/api/raw/${slug}`);
      if (!res.ok) throw new Error();
      const markdown = await res.text();
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
      toast("Markdown copied to clipboard");
    } catch {
      toast.error("Failed to copy page");
    }
  };

  const openInAi = (service: "chatgpt" | "gemini" | "claude" | "v0") => {
    if (!currentUrl) return;

    const prompt = `أنا أقرأ عن الموضوع اللي بهذي الصفحة: ${currentUrl}\n\nأجب باللغة العربية فقط. اشرحلي الموضوع نفسه بشكل مختصر ومفيد وواضح، مو بس محتوى الصفحة بل الموضوع بشكل عام. استخدم فقرات وابتعد عن القوائم والنقاط. خلي الشرح سلس ومترابط. بالنهاية حط ملخص سريع بسطرين، واسألني إذا عندي أي سؤال عن الموضوع.`;
    const encodedPrompt = encodeURIComponent(prompt);
    let targetUrl = "";

    switch (service) {
      case "chatgpt":
        targetUrl = `https://chatgpt.com/?q=${encodedPrompt}`;
        break;
      case "gemini":
        targetUrl = `https://gemini.google.com/app?q=${encodedPrompt}`;
        break;
      case "claude":
        targetUrl = `https://claude.ai/new?q=${encodedPrompt}`;
        break;
      case "v0":
        targetUrl = `https://v0.dev/chat?q=${encodedPrompt}`;
        break;
    }

    if (targetUrl) window.open(targetUrl, "_blank");
  };

  const viewMarkdown = () => {
    const slug = getSlugFromUrl();
    if (!slug) return;
    window.open(`/api/raw/${slug}`, "_blank");
  };

  return (
    <div className="flex flex-row-reverse items-center -space-x-[1px]">
      <Button
        variant="secondary"
        className="rounded-r-none h-8 px-3 gap-2 shadow-sm border border-input bg-background hover:bg-accent hover:text-accent-foreground z-10"
        onClick={copyPage}
      >
        <span className="relative size-4">
          <Copy
            className={`size-4 text-muted-foreground absolute inset-0 transition-all duration-300 ${copied ? "scale-0 opacity-0" : "scale-100 opacity-100"}`}
          />
          <Check
            className={`size-4 text-green-500 absolute inset-0 transition-all duration-300 ${copied ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}
          />
        </span>
        {copied ? "Copied!" : "Copy Page"}
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            className="rounded-l-none h-8 w-8 p-0 shadow-sm border border-input bg-background hover:bg-accent hover:text-accent-foreground"
          >
            <ChevronDown className="size-4 text-muted-foreground" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={() => openInAi("v0")}>
            <Hexagon className="mr-2 size-4 text-muted-foreground" />
            Open in v0
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => openInAi("chatgpt")}>
            <Bot className="mr-2 size-4 text-muted-foreground" />
            Open in ChatGPT
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => openInAi("claude")}>
            <Brain className="mr-2 size-4 text-muted-foreground" />
            Open in Claude
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => openInAi("gemini")}>
            <Sparkles className="mr-2 size-4 text-muted-foreground" />
            Open in Gemini
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={viewMarkdown}>
            <FileText className="mr-2 size-4 text-muted-foreground" />
            View as Markdown
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
