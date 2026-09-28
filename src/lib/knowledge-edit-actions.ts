"use server";

import { refresh } from "next/cache";
import { getDevMode } from "./dev-mode";
import {
  readMeta,
  readSection,
  writeMeta,
  writeSectionBody,
  writeSectionTitle,
  type ArticleMetaSource,
  type SectionSource,
} from "./knowledge-source";

type Fail = { ok: false; reason: string };

/**
 * dev mode 編輯知識庫的 server actions。
 *
 * 只在本機 `next dev` 生效：知識庫的唯一來源是 repo 裡的 .md，正式站無法也不該改檔。
 * 兩道檢查缺一不可——Server Action 是公開的 POST 端點，不能只靠「沒渲染按鈕」：
 *  1. NODE_ENV 必須是 development(正式建置時這個分支整段是死碼)
 *  2. getDevMode()：admin 且開啟 dev mode
 */
async function guard(): Promise<Fail | null> {
  if (process.env.NODE_ENV !== "development") return { ok: false, reason: "只能在本機開發環境編輯知識庫" };
  if (!(await getDevMode())) return { ok: false, reason: "需要 admin 並開啟 dev mode" };
  return null;
}

async function fsModule() {
  return import("./knowledge-edit-fs");
}

export async function getSectionSource(slug: string, id: string): Promise<{ ok: true; value: SectionSource } | Fail> {
  const denied = await guard();
  if (denied) return denied;
  const md = await (await fsModule()).readArticleSource(slug);
  if (md === null) return { ok: false, reason: `找不到 ${slug}.md` };
  return readSection(md, id);
}

export async function getMetaSource(slug: string): Promise<{ ok: true; value: ArticleMetaSource } | Fail> {
  const denied = await guard();
  if (denied) return denied;
  const md = await (await fsModule()).readArticleSource(slug);
  if (md === null) return { ok: false, reason: `找不到 ${slug}.md` };
  return readMeta(md);
}

type Edit =
  | { kind: "title"; id: string; title: string }
  | { kind: "body"; id: string; body: string }
  | { kind: "meta"; title: string; subtitle: string };

export async function saveKnowledgeEdit(slug: string, edit: Edit): Promise<{ ok: true } | Fail> {
  const denied = await guard();
  if (denied) return denied;
  if (!edit || typeof edit !== "object") return { ok: false, reason: "格式錯誤" };

  const fsm = await fsModule();
  const md = await fsm.readArticleSource(slug);
  if (md === null) return { ok: false, reason: `找不到 ${slug}.md` };

  const str = (v: unknown) => (typeof v === "string" ? v : "");
  const next =
    edit.kind === "title"
      ? writeSectionTitle(md, str(edit.id), str(edit.title))
      : edit.kind === "body"
        ? writeSectionBody(md, str(edit.id), str(edit.body))
        : edit.kind === "meta"
          ? writeMeta(md, { title: str(edit.title), subtitle: str(edit.subtitle) })
          : ({ ok: false, reason: "未知的編輯類型" } as const);
  if (!next.ok) return next;

  const result = await fsm.writeArticleAndRebuild(slug, next.value);
  if (!result.ok) return result;
  refresh();
  return { ok: true };
}
