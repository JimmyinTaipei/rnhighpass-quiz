"use client";

import { useEffect } from "react";
import { recordLastVisit } from "@/lib/last-visit-actions";

/** 不渲染任何東西：開啟知識頁時記一筆「上次開啟」(登入者才會真的寫入) */
export function TrackVisit({ slug }: { slug: string }) {
  useEffect(() => {
    void recordLastVisit(slug);
  }, [slug]);
  return null;
}
