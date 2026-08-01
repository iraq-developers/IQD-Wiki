"use client";

import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
    Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger,
} from "@/components/ui/drawer";

/* A dialog on desktop, a bottom sheet on phones — the same
   content either way, so callers never branch on viewport. */
export function ResponsiveDialog({
    open,
    onOpenChange,
    trigger,
    title,
    description,
    children,
    className,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    trigger?: React.ReactNode;
    title: string;
    description?: string;
    children: React.ReactNode;
    className?: string;
}) {
    const isMobile = useIsMobile();

    if (isMobile) {
        return (
            <Drawer open={open} onOpenChange={onOpenChange} repositionInputs={false}>
                {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
                <DrawerContent className="data-[vaul-drawer-direction=bottom]:max-h-[92dvh]">
                    <DrawerHeader className="text-start">
                        <DrawerTitle>{title}</DrawerTitle>
                        {description && <DrawerDescription>{description}</DrawerDescription>}
                    </DrawerHeader>
                    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                        {children}
                    </div>
                </DrawerContent>
            </Drawer>
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent className={className ?? "max-h-[88vh] overflow-y-auto sm:max-w-[640px]"}>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {description && <DialogDescription>{description}</DialogDescription>}
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    );
}
