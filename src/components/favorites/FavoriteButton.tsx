"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { useFavorites } from "./FavoritesProvider";

/** 題目卡右上角的收藏星號。沒有 Provider 的地方(例如模擬考站)不渲染。 */
export function FavoriteButton({ questionId }: { questionId: string }) {
  const favorites = useFavorites();
  const [hint, setHint] = useState<string | null>(null);
  useEffect(() => {
    if (!hint) return;
    const t = setTimeout(() => setHint(null), 2500);
    return () => clearTimeout(t);
  }, [hint]);
  if (!favorites) return null;

  const active = favorites.isFavorite(questionId);

  const onClick = async () => {
    if (favorites.loggedIn === false) {
      setHint("登入後才能收藏");
      return;
    }
    setHint(null);
    const failure = await favorites.toggle(questionId);
    if (failure === "not_logged_in") setHint("登入後才能收藏");
    else if (failure) setHint("收藏失敗，請再試一次");
  };

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        aria-label={active ? "取消收藏" : "收藏這一題"}
        title={active ? "取消收藏" : "收藏這一題"}
        className={`rounded-btn p-1 transition-colors ${
          active ? "text-warning" : "text-muted hover:text-warning"
        }`}
      >
        <Star size={18} fill={active ? "currentColor" : "none"} />
      </button>
      {hint && (
        <span
          role="status"
          className="absolute top-full right-0 z-10 mt-1 whitespace-nowrap rounded-btn bg-strong px-2 py-1 text-xs text-white shadow"
        >
          {hint}
        </span>
      )}
    </span>
  );
}
