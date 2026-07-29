import Link from "next/link";
import { Globe } from "lucide-react";
import { Github } from "@/components/custom/icons";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const communityLinks = [
  {
    title: "المساهمون",
    href: "https://github.com/iraq-developers",
    icon: Github,
    description: "ساهم في تطوير المشروع على GitHub",
  },
  {
    title: "مجتمع Reddit",
    href: "https://www.reddit.com/r/iraq_developers/",
    icon: Globe,
    description: "انضم للنقاشات في مجتمعنا على Reddit",
  },
];

export async function RightSidebar() {
  return (
    <aside className="hidden xl:block w-64 shrink-0 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto py-6 pl-6 pr-2 border-l">
      <div className="flex flex-col gap-4">
        <h3 className="font-semibold text-lg px-2">المجتمع</h3>
        <nav className="flex flex-col gap-1">
          {communityLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "justify-start gap-2 px-2 text-right font-normal h-auto py-2 hover:bg-muted/50 whitespace-normal",
              )}
            >
              <link.icon className="h-4 w-4 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                <span className="font-medium">{link.title}</span>
                <span className="text-xs text-muted-foreground line-clamp-2">
                  {link.description}
                </span>
              </div>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
