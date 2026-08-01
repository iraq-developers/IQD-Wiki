"use client";

import { useSyncExternalStore } from "react";

/* True only on the client, derived rather than set from an effect — so it
   costs no extra render and can't cascade. */
const noopSubscribe = () => () => {};

export function useMounted(): boolean {
    return useSyncExternalStore(noopSubscribe, () => true, () => false);
}
