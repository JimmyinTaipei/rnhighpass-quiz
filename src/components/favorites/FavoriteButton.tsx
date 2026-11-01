"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { EASE_OUT } from "@/lib/motion";
import { useFavorites, type FavoriteKind } from "./FavoritesProvider";

interface FavoriteButtonProps {
  /** 題目 id、知識頁 "slug"／"slug#段落id"，或 kind="table" 的 kb- 表格 id */
  questionId: string;
  kind?: FavoriteKind;
  /** 螢幕閱讀器與滑過提示用的對象名稱，例如「這一題」「這一頁」「這一段」 */
  label?: string;
  size?: number;
  className?: string;
}

/** 收藏星號(題目卡右上角、知識頁標題與段落標題)。沒有 Provider 的地方(例如模擬考站)不渲染。 */
export function FavoriteButton({ questionId, kind = "question", label = "這一題", size = 18, className = "" }: FavoriteButtonProps) {
  const favorites = useFavorites();
  const [hint, setHint] = useState<string | null>(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!hint) return;
    const t = setTimeout(() => setHint(null), 2500);
    return () => clearTimeout(t);
  }, [hint]);
  if (!favorites) return null;

  const active = favorites.isFavorite(questionId, kind);

  const onClick = async () => {
    if (favorites.loggedIn === false) {
      setHint("登入後才能收藏");
      return;
    }
    setHint(null);
    const failure = await favorites.toggle(questionId, kind);
    if (failure === "not_logged_in") setHint("登入後才能收藏");
    else if (failure) setHint("收藏失敗，請再試一次");
  };

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        disabled={favorites.loggedIn === null || favorites.isPending(questionId, kind)}
        aria-label={active ? `取消收藏${label}` : `收藏${label}`}
        title={active ? `取消收藏${label}` : `收藏${label}`}
        className={`favorite-button relative rounded-btn p-1 transition-colors after:absolute after:-inset-2.5 after:content-[''] ${
          active ? "text-warning" : "text-muted hover:text-warning"
        } ${className}`}
        data-active={active || undefined}
      >
        <Star size={size} fill={active ? "currentColor" : "none"} />
      </button>
      {/* 提示淡入並往上 4px，消失時反過來 */}
      <AnimatePresence>
        {hint && (
          <motion.span
            key="hint"
            role="status"
            initial={{ opacity: 0, transform: reduce ? "none" : "translateY(4px)" }}
            animate={{ opacity: 1, transform: "translateY(0px)" }}
            exit={{ opacity: 0, transform: reduce ? "none" : "translateY(4px)" }}
            transition={{ duration: 0.15, ease: EASE_OUT }}
            className="absolute top-full right-0 z-10 mt-1 whitespace-nowrap rounded-btn bg-strong px-2 py-1 text-xs text-white shadow"
          >
            {hint}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
