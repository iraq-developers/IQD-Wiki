"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { TFunc } from "../i18n";

/* Losing a whole job or project is a big enough edit to be
   worth one tap of confirmation — smaller items just delete,
   since Cmd/Ctrl+Z brings them back. */
export function ConfirmDelete({
    onConfirm,
    label,
    t,
    trigger,
}: {
    onConfirm: () => void;
    label: string;
    t: TFunc;
    trigger?: React.ReactNode;
}) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {trigger ?? (
                    <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10">
                        <Trash2 className="size-3.5" /> {t("remove")}
                    </Button>
                )}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {t("remove")} — {label}
                    </AlertDialogTitle>
                    <AlertDialogDescription>{t("resetBody")}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm}>{t("remove")}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
