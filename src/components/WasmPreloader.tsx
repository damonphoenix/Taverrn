"use client";

import { useEffect } from "react";
import { FFMPEG_CORE_BASE_URL } from "@/lib/conversion/media";

let preloadStarted = false;

export function WasmPreloader() {
    useEffect(() => {
        if (preloadStarted) return;
        preloadStarted = true;

        const timer = setTimeout(async () => {
            try {
                await Promise.all([
                    fetch(`${FFMPEG_CORE_BASE_URL}/ffmpeg-core.js`, { cache: "force-cache" }),
                    fetch(`${FFMPEG_CORE_BASE_URL}/ffmpeg-core.wasm`, { cache: "force-cache" }),
                ]);
                console.log("WASM preloaded successfully in background");
            } catch (e) {
                console.error("Failed to preload WASM:", e);
            }
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    return null;
}
