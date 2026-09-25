"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { KnowledgePreview } from "@/lib/knowledge/types";
import { useArticle } from "./ArticleShell";

const OPEN_DELAY = 250;
const CLOSE_DELAY = 180;
const CARD_WIDTH = 320;

interface Position {
  left: number;
  top: number;
  placement: "below" | "above";
}

function place(anchor: DOMRect): Position {
  const margin = 12;
  const left = Math.min(
    Math.max(margin, anchor.left + anchor.width / 2 - CARD_WIDTH / 2),
    window.innerWidth - CARD_WIDTH - margin,
  );
  // 下方空間不夠(< 220px)就翻到上方
  const below = window.innerHeight - anchor.bottom > 220;
  return below
    ? { left, top: anchor.bottom + 8, placement: "below" }
    : { left, top: anchor.top - 8, placement: "above" };
}

export function PreviewCard({ preview, className = "" }: { preview: KnowledgePreview; className?: string }) {
  const crumbs = [preview.articleTitle, ...preview.path];
  const showCrumbs = preview.number !== null;
  return (
    <div className={className}>
      {showCrumbs && (
        <p className="mb-1 truncate text-xs text-muted">{crumbs.join(" › ")}</p>
      )}
      <p className="font-semibold text-deep">
        {preview.number && <span className="mr-1 tabular-nums">{preview.number}</span>}
        {preview.title}
      </p>
      {preview.summary && (
        <p className="mt-1.5 line-clamp-4 text-sm leading-relaxed text-body">{preview.summary}</p>
      )}
    </div>
  );
}

interface KnowledgeLinkProps {
  href: string;
  /** "slug" 或 "slug#id" */
  target: string;
  preview: KnowledgePreview | null;
  children: React.ReactNode;
}

/**
 * 行內知識點連結(仿 Amboss):滑過顯示預覽卡,不必離開目前頁面。
 *
 * 觸控裝置沒有 hover,所以第一下點擊只打開預覽卡,卡片上的「前往」才導航。
 * 同一頁內的段落不走路由,而是交給 ArticleShell 展開祖先再捲過去——
 * 目標可能正被收合著,單純改 hash 會捲到一個看不見的位置。
 */
export function KnowledgeLink({ href, target, preview, children }: KnowledgeLinkProps) {
  const ctx = useArticle();
  const anchorRef = useRef<HTMLAnchorElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [pos, setPos] = useState<Position | null>(null);
  const cardId = useId();

  const [slug, sectionId] = target.split("#");
  const samePage = ctx?.slug === slug;

  const clear = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };
  const open = useCallback(() => {
    if (anchorRef.current) setPos(place(anchorRef.current.getBoundingClientRect()));
  }, []);
  const close = useCallback(() => setPos(null), []);

  useEffect(() => {
    if (!pos) return;
    // 手機點擊常伴隨幾像素的捲動,不能一動就關;真的捲離一段距離才關
    const startY = window.scrollY;
    const onScroll = () => {
      if (Math.abs(window.scrollY - startY) > 48) close();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    const onDown = (e: PointerEvent) => {
      const card = document.getElementById(cardId);
      if (!anchorRef.current?.contains(e.target as Node) && !card?.contains(e.target as Node)) close();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [pos, close, cardId]);

  useEffect(() => clear, []);

  const navigate = (e: React.MouseEvent) => {
    if (samePage && sectionId && ctx) {
      e.preventDefault();
      close();
      ctx.reveal(sectionId, { push: true });
    }
  };

  const lastPointer = useRef<string>("mouse");

  return (
    <>
      <Link
        ref={anchorRef}
        href={href}
        className="kb-link"
        aria-describedby={pos ? cardId : undefined}
        onPointerDown={(e) => {
          lastPointer.current = e.pointerType;
        }}
        onPointerEnter={(e) => {
          if (e.pointerType !== "mouse" || !preview) return;
          clear();
          timer.current = setTimeout(open, OPEN_DELAY);
        }}
        onPointerLeave={(e) => {
          if (e.pointerType !== "mouse") return;
          clear();
          timer.current = setTimeout(close, CLOSE_DELAY);
        }}
        onFocus={(e) => {
          // 只有鍵盤聚焦才開;觸控時 focus 早於 click,若在這裡打開,click 會以為預覽已開而直接導航
          if (preview && e.currentTarget.matches(":focus-visible")) open();
        }}
        onBlur={() => {
          clear();
          timer.current = setTimeout(close, CLOSE_DELAY);
        }}
        onClick={(e) => {
          // 沒有 hover 能力的裝置(手機、平板)第一下只開預覽
          const touchLike =
            lastPointer.current !== "mouse" || window.matchMedia("(hover: none)").matches;
          if (touchLike && preview && !pos) {
            e.preventDefault();
            open();
            return;
          }
          navigate(e);
        }}
      >
        {children}
      </Link>
      {pos &&
        preview &&
        createPortal(
          <div
            id={cardId}
            role="tooltip"
            onPointerEnter={clear}
            onPointerLeave={() => {
              clear();
              timer.current = setTimeout(close, CLOSE_DELAY);
            }}
            style={{
              left: pos.left,
              top: pos.top,
              width: CARD_WIDTH,
              transform: pos.placement === "above" ? "translateY(-100%)" : undefined,
            }}
            className="fixed z-50 rounded-card border border-card-border bg-card p-3.5 shadow-lg"
          >
            <PreviewCard preview={preview} />
            <Link
              href={href}
              onClick={navigate}
              className="mt-2.5 inline-flex items-center gap-1 text-sm font-medium text-accent hover:text-deep"
            >
              前往 <ArrowRight size={14} />
            </Link>
          </div>,
          document.body,
        )}
    </>
  );
}
