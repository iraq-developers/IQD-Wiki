"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RowActions, AddButton, fieldCls } from "./shared";
import { move, removeAt, updateById } from "../list-utils";
import { makeBullet, makeLink, type Bullet, type Link } from "../types";
import type { TFunc } from "../i18n";

/* ══════════════════════════════════════════════════════
   REUSABLE LIST EDITORS — bullets and links
   Used by jobs, projects and the contact block alike.
══════════════════════════════════════════════════════ */

export function BulletListEditor({
    bullets,
    onChange,
    t,
}: {
    bullets: Bullet[];
    onChange: (b: Bullet[]) => void;
    t: TFunc;
}) {
    return (
        <div className="space-y-2">
            {bullets.map((b, i) => (
                <div key={b.id} className="flex items-start gap-1.5">
                    <span className="mt-2.5 w-4 shrink-0 text-xs tabular-nums text-muted-foreground">{i + 1}.</span>
                    <Textarea
                        value={b.text}
                        onChange={e => onChange(updateById(bullets, b.id, { text: e.target.value }))}
                        rows={2}
                        className={`min-h-16 flex-1 resize-y ${fieldCls}`}
                        placeholder={t("addBullet")}
                    />
                    <RowActions
                        index={i}
                        count={bullets.length}
                        onMove={to => onChange(move(bullets, i, to))}
                        onRemove={() => onChange(removeAt(bullets, i))}
                        t={t}
                        orientation="vertical"
                        className="mt-0.5"
                    />
                </div>
            ))}
            <AddButton label={t("addBullet")} onClick={() => onChange([...bullets, makeBullet("")])} />
        </div>
    );
}

export function LinkListEditor({
    links,
    onChange,
    t,
}: {
    links: Link[];
    onChange: (l: Link[]) => void;
    t: TFunc;
}) {
    return (
        <div className="space-y-2">
            {links.map((l, i) => (
                <div key={l.id} className="flex flex-wrap items-center gap-1.5 rounded-lg border p-2 sm:flex-nowrap sm:border-0 sm:p-0">
                    <Input
                        value={l.label}
                        onChange={e => onChange(updateById(links, l.id, { label: e.target.value }))}
                        className={`w-full shrink-0 sm:w-28 ${fieldCls}`}
                        placeholder={t("label")}
                        aria-label={t("label")}
                    />
                    <Input
                        value={l.href}
                        onChange={e => onChange(updateById(links, l.id, { href: e.target.value }))}
                        className={`min-w-0 flex-1 ${fieldCls}`}
                        placeholder="https://…"
                        aria-label={t("url")}
                        inputMode="url"
                        autoCapitalize="off"
                        autoCorrect="off"
                        spellCheck={false}
                    />
                    <RowActions
                        index={i}
                        count={links.length}
                        onMove={to => onChange(move(links, i, to))}
                        onRemove={() => onChange(removeAt(links, i))}
                        t={t}
                        className="ms-auto"
                    />
                </div>
            ))}
            <AddButton label={t("addLink")} onClick={() => onChange([...links, makeLink("", "https://")])} />
        </div>
    );
}
