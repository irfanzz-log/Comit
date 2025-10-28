"use client";

import { usePathname } from "next/navigation"

export default function useLastPath() {
    const pathname = usePathname();

    return pathname.split("/").filter(Boolean).pop();
}