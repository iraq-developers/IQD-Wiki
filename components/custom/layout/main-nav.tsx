import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function MainNav() {
  return (
    <nav className="flex w-full sticky top-0 z-50 justify-between items-center p-4 bg-background/80 backdrop-blur-md border-b">
      <Link href="/">
        <Image
          src="/logo.webp"
          alt="IQD Wiki Logo"
          width={40}
          height={40}
          className="rounded-full"
        />
      </Link>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>المجتمع</SheetTitle>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium">روابط خارجية</h3>
              <a
                href="https://www.reddit.com/r/iraq_developers/"
                target="_blank"
                rel="noreferrer"
                className="text-sm text-muted-foreground hover:text-primary transition-colors hover:underline"
              >
                r/iraq_developers
              </a>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
}
