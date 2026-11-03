import { createClient } from "./supabase-server";
import { getAllChapters, getSubjects, getTableChapterCounts } from "./data";
import { placeTables } from "./table-placement";
import { parseQuestionRef } from "./question-ref";
import { matchSnippet, pageOf, searchFilter, sittingSearchClause, type SearchState } from "./search";
import type { ComparisonTable, Question } from "./types";
import { cache } from "react";

/** Share metadata across result groups within one server render. */
export const getSearchContext = cache(async () => {
  const [chapters, subjects] = await Promise.all([getAllChapters(), getSubjects()]);
  return { chapters, subjects };
});

export interface TextSearchItem {
  id: string;
  title: string;
  href: string;
  location: string;
  snippet: ReturnType<typeof matchSnippet>;
}

export const QUESTION_SEARCH_FIELDS = [
  ["stem", "題幹"], ["option_a", "選項 A"], ["option_b", "選項 B"],
  ["option_c", "選項 C"], ["option_d", "選項 D"], ["key_point", "考點"],
  ["correct_reason", "正解原因"], ["wrong_options_reason", "其他選項說明"],
  ["extra_notes", "延伸提醒"], ["explanation_text", "詳解"],
] as const;

/** Filter the same topics relation used by chapter reading and quiz, before paging. */
export async function searchQuestionPage(state: SearchState, size: number) {
  const supabase = await createClient();
  const { chapters, subjects } = await getSearchContext();
  const chapterIds = chapters.filter((c) => (!state.subject || c.subject_id === state.subject) && (!state.chapter || String(c.id) === state.chapter)).map((c) => c.id);
  const sittingClause = sittingSearchClause(state.from, state.to);
  const constrained = !!(state.subject || state.chapter);
  const topicIds: number[] = [];
  if (constrained && chapterIds.length) {
    for (let offset = 0; ; offset += 500) {
      const topics = await supabase.from("topics").select("id").in("chapter_id", chapterIds).order("id").range(offset, offset + 499);
      if (topics.error) throw topics.error;
      topicIds.push(...(topics.data ?? []).map((t) => Number(t.id)));
      if ((topics.data?.length ?? 0) < 500) break;
    }
  }
  if (constrained && !topicIds.length && !sittingClause) return { items: [], total: 0, page: 1, pages: 1 };
  const ranges = [topicIds.length ? `topic_id.in.(${topicIds.join(",")})` : null, sittingClause].filter(Boolean);
  const rangeClause = ranges.length ? `or(${ranges.join(",")})` : null;
  const ref = parseQuestionRef(state.q);
  const buildQuery = () => {
    let query = supabase.from("questions").select("*, topics(chapter_id)", { count: "exact" });
    if (ref?.kind === "id") query = query.eq("id", ref.id);
    else if (ref?.kind === "paper") query = query.like("source_text", `${ref.prefix}%`);
    else {
      const textClause = searchFilter(QUESTION_SEARCH_FIELDS.map(([key]) => key), state.q);
      query = query.or(rangeClause ? `and(or(${textClause}),${rangeClause})` : textClause);
    }
    if (ref && rangeClause) query = query.or(ranges.join(","));
    return query.order("id");
  };
  // count comes from the DB union (one row per ID), never from field hit sums.
  let page = state.page ?? 1;
  let result = await buildQuery().range((page - 1) * size, page * size - 1);
  // PostgREST returns 416 instead of an empty page beyond the last row.
  if (result.error?.code === "PGRST103") result = await buildQuery().range(0, size - 1);
  if (result.error) throw result.error;
  const total = result.count ?? 0;
  const pages = Math.max(1, Math.ceil(total / size));
  if (page > pages) {
    page = pages;
    result = await buildQuery().range((page - 1) * size, page * size - 1);
    if (result.error) throw result.error;
  }
  const items = (result.data ?? []).map((row) => {
    const question = row as unknown as Question & { topics?: { chapter_id: number } };
    const chapterId = question.topics?.chapter_id ?? question.primary_chapter_id;
    const chapter = chapters.find((c) => c.id === chapterId);
    const match = ref ? undefined : QUESTION_SEARCH_FIELDS.find(([key]) => question[key]?.toLowerCase().includes(state.q.toLowerCase()));
    return {
      question,
      questionHref: chapter ? `/chapters/${chapter.id}?view=quiz#question-${question.id}` : undefined,
      chapterLabel: chapter ? `${subjects.find((s) => s.id === chapter.subject_id)?.name ?? ""} ${chapter.chapter_no} ${chapter.title}` : "",
      matchLabel: match?.[1],
      snippet: match ? matchSnippet(question[match[0]] ?? "", state.q) : null,
    };
  });
  return { items, total, page, pages };
}

/** Only matching rows are collected; paging each query avoids the DB 1,000-row cap. */
export async function searchNotePage(state: SearchState, size: number) {
  const supabase = await createClient();
  const { chapters, subjects } = await getSearchContext();
  const pattern = `%${state.q.replace(/[\\%_]/g, (s) => `\\${s}`)}%`;
  const found = new Map<string, TextSearchItem>();
  type Card = { node_id: string; card_title: string; chapter_id: number | null; subject_id: string };
  const add = (card: Card, text: string) => {
    if (found.has(card.node_id) || card.chapter_id == null) return;
    const chapter = chapters.find((c) => c.id === card.chapter_id);
    found.set(card.node_id, {
      id: card.node_id, title: card.card_title, href: `/chapters/${card.chapter_id}?view=quiz#note-${encodeURIComponent(card.node_id)}`,
      location: `${subjects.find((s) => s.id === card.subject_id)?.name ?? ""} ${chapter?.chapter_no ?? ""} ${chapter?.title ?? ""}`,
      snippet: matchSnippet(text, state.q),
    });
  };
  for (const kind of ["title", "bullet"] as const) {
    for (let offset = 0; ; offset += 500) {
      if (kind === "title") {
        let query = supabase.from("knowledge_cards").select("node_id,card_title,chapter_id,subject_id").ilike("card_title", pattern).order("node_id");
        if (state.subject) query = query.eq("subject_id", state.subject);
        if (state.chapter) query = query.eq("chapter_id", Number(state.chapter));
        const result = await query.range(offset, offset + 499);
        if (result.error) throw result.error;
        for (const row of result.data ?? []) add(row, row.card_title);
        if ((result.data?.length ?? 0) < 500) break;
      } else {
        let query = supabase.from("card_bullets").select("bullet_text,knowledge_cards!inner(node_id,card_title,chapter_id,subject_id)").ilike("bullet_text", pattern).order("card_node_id").order("ordinal");
        if (state.subject) query = query.eq("knowledge_cards.subject_id", state.subject);
        if (state.chapter) query = query.eq("knowledge_cards.chapter_id", Number(state.chapter));
        const result = await query.range(offset, offset + 499);
        if (result.error) throw result.error;
        for (const row of result.data ?? []) {
          const card = (Array.isArray(row.knowledge_cards) ? row.knowledge_cards[0] : row.knowledge_cards) as unknown as Card;
          if (card) add(card, row.bullet_text);
        }
        if ((result.data?.length ?? 0) < 500) break;
      }
    }
  }
  return pageOf([...found.values()].sort((a, b) => a.title.localeCompare(b.title, "zh-Hant") || a.id.localeCompare(b.id)), state.page ?? 1, size);
}

export async function searchLegacyTableItems(state: SearchState): Promise<TextSearchItem[]> {
  const loadTables = async () => {
    const supabase = await createClient();
    const tables: ComparisonTable[] = [];
    for (let offset = 0; ; offset += 500) {
      const result = await supabase.from("tables_").select("*").order("id").range(offset, offset + 499);
      if (result.error) throw result.error;
      tables.push(...(result.data ?? []));
      if ((result.data?.length ?? 0) < 500) return tables;
    }
  };
  const [tables, { chapters, subjects }, counts] = await Promise.all([loadTables(), getSearchContext(), getTableChapterCounts()]);
  const placed = new Map(placeTables(tables, counts, chapters, subjects).map((t) => [t.id, t]));
  return tables.flatMap((table) => {
    const placement = placed.get(table.id)!;
    const chapterIds = [placement.primaryChapterId, ...placement.secondaryChapterIds];
    // Match the primary and related table cards visible in the subject browser.
    if (state.subject && placement.subjectId !== state.subject && !chapters.some((c) => c.subject_id === state.subject && chapterIds.includes(c.id))) return [];
    if (state.chapter && !chapterIds.includes(Number(state.chapter))) return [];
    const text = [table.title, table.reason, ...table.headers, ...table.rows.flat()].filter(Boolean).join(" · ");
    if (!text.toLowerCase().includes(state.q.toLowerCase())) return [];
    return [{ id: table.id, title: table.title, href: `/tables/${encodeURIComponent(table.id)}`, location: `${subjects.find((s) => s.id === placement.subjectId)?.name ?? "跨科共用"} · 比較表`, snippet: matchSnippet(text, state.q) }];
  }).sort((a, b) => a.title.localeCompare(b.title, "zh-Hant") || a.id.localeCompare(b.id));
}
