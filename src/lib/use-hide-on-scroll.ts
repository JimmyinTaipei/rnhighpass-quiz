"use client";

import { useEffect, useState } from "react";

/**
 * 浮動按鈕用：往下捲(在讀內文)時回傳 true，把按鈕收起來不擋字；往上捲(想找東西)、
 * 回到頂端附近或捲到頁尾時回傳 false。小於 threshold 的位移累積起來才算，手指微動不會閃。
 */
export function useHideOnScrollDown(threshold = 12) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const nearEdge =
        y < 80 || window.innerHeight + y >= document.documentElement.scrollHeight - 80;
      if (nearEdge) {
        setHidden(false);
        lastY = y;
      } else if (y - lastY > threshold) {
        setHidden(true);
        lastY = y;
      } else if (lastY - y > threshold) {
        setHidden(false);
        lastY = y;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return hidden;
}
