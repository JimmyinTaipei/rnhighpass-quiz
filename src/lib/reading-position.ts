"use client";

import { useSyncExternalStore } from "react";

/**
 * 「上次讀到哪裡」。
 *
 * 目前存 localStorage。主站其他地方刻意不用 localStorage(見 ViewControls 的
 * 註解——狀態放 URL 才能 SSR、能分享)，但閱讀位置是「使用者私有、不該出現在
 * 分享連結裡」的東西，性質不同。
 *
 * 所有讀寫都收在這個檔，介面就是之後搬到帳號時的形狀。要搬的時候只改這裡 +
 * 新增一張 user_reading_position(user_id, subject_id, chapter_id, topic_id)
 * 表(一 user 一 subject 一列、upsert，RLS 同 user_answers)。
 *
 * 另有一條零 schema 改動的 fallback：登入者可以用 user_answers 最新一筆
 * answered_at -> question.topic_id -> chapter 推出位置。本次未實作。
 *
 * 讀取一律透過 useReadingStore(useSyncExternalStore)：它有 server snapshot，
 * SSR 拿到的是空 store，所以首次 client render 與伺服器輸出一致，不會
 * hydration mismatch，也不需要在 effect 裡 setState。
 */

const KEY = "reading:position";

export interface ReadingPosition {
  subjectId: string;
  chapterId: number;
  /** 章節內的節點。階段 1 先不寫入，等 scrollspy 接上。 */
  topicId?: number;
  /** 顯示用，例如「內外 Ch09 呼吸系統疾病」，避免「繼續上次」還要再查一次 DB */
  label: string;
}

export interface ReadingStore {
  bySubject: Record<string, ReadingPosition>;
  last?: ReadingPosition;
}

const EMPTY: ReadingStore = { bySubject: {} };

// useSyncExternalStore 要求 getSnapshot 回傳穩定的參考，否則會無限重繪。
// 這裡快取「上次讀到的原始字串 -> 解析結果」，字串沒變就回同一個物件。
let cachedRaw: string | null = null;
let cachedStore: ReadingStore = EMPTY;
const listeners = new Set<() => void>();

/** 隱私瀏覽、封鎖 site data 都可能讓 localStorage 直接 throw，一律吞掉 */
function rawValue(): string | null {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function snapshot(): ReadingStore {
  const raw = rawValue();
  if (raw === cachedRaw) return cachedStore;
  cachedRaw = raw;
  cachedStore = parse(raw);
  return cachedStore;
}

function parse(raw: string | null): ReadingStore {
  if (!raw) return EMPTY;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return EMPTY;
    const obj = parsed as Partial<ReadingStore>;
    return { bySubject: obj.bySubject ?? {}, last: obj.last };
  } catch {
    return EMPTY;
  }
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  // 另一個分頁寫入時同步更新
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

export function useReadingStore(): ReadingStore {
  return useSyncExternalStore(subscribe, snapshot, () => EMPTY);
}

export function writePosition(pos: ReadingPosition): void {
  if (typeof window === "undefined") return;
  try {
    const current = snapshot();
    const next: ReadingStore = {
      bySubject: { ...current.bySubject, [pos.subjectId]: pos },
      last: pos,
    };
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // 存不起來不影響閱讀，靜默略過
    return;
  }
  for (const listener of listeners) listener();
}

export function positionFor(
  store: ReadingStore,
  subjectId: string,
): ReadingPosition | null {
  return store.bySubject[subjectId] ?? null;
}

/** 最近一次寫入的位置，供科目頁的「繼續上次」使用 */
export function lastPosition(store: ReadingStore): ReadingPosition | null {
  const last = store.last;
  if (!last) return null;
  // last 只是指標，真正的值仍以該科的紀錄為準
  return store.bySubject[last.subjectId] ?? last;
}

export function chapterHref(pos: ReadingPosition): string {
  return pos.topicId
    ? `/chapters/${pos.chapterId}#topic-${pos.topicId}`
    : `/chapters/${pos.chapterId}`;
}

/**
 * 該科的進入點。有紀錄就回上次的 Ch，沒有就回 /subjects/<id>——
 * 那個路由是 server redirect，會自己導到第一個 Ch。
 */
export function entryHref(store: ReadingStore, subjectId: string): string {
  const pos = positionFor(store, subjectId);
  return pos ? chapterHref(pos) : `/subjects/${encodeURIComponent(subjectId)}`;
}
