import { createClient } from "./supabase-server";
import type {
  CardBullet,
  Chapter,
  ComparisonTable,
  KnowledgeCard,
  Question,
  QuestionTag,
  Subject,
  Topic,
  UserAnswer,
} from "./types";

export async function getSubjects(): Promise<Subject[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("subjects")
    .select("*")
    .order("order_index");
  if (error) throw error;
  return data ?? [];
}

export async function getSubject(subjectId: string): Promise<Subject | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("subjects")
    .select("*")
    .eq("id", subjectId)
    .maybeSingle();
  return data;
}

export async function getChapters(subjectId: string): Promise<Chapter[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("chapters")
    .select("*")
    .eq("subject_id", subjectId)
    .order("order_index");
  if (error) throw error;
  return data ?? [];
}

export async function getAllChapters(): Promise<Chapter[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("chapters")
    .select("*")
    .order("subject_id")
    .order("order_index");
  if (error) throw error;
  return data ?? [];
}

/**
 * 各章節的題數，用於科目頁的章節卡。
 *
 * 刻意透過 topic_id 內聯 topics 來數，而不是用 questions.primary_chapter_id——
 * 因為章節閱讀頁與測驗頁都是以 topic_id 取題(見 getQuestionsByTopicIds)，
 * 用 primary_chapter_id 數出來的數字會跟使用者實際看到的題數不一致。
 */
export async function getQuestionCountsByChapter(
  chapterIds: number[],
): Promise<Map<number, number>> {
  if (chapterIds.length === 0) return new Map();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("questions")
    .select("id, topics!inner(chapter_id)")
    .in("topics.chapter_id", chapterIds);
  if (error) throw error;

  const counts = new Map<number, number>();
  for (const row of data ?? []) {
    // 內聯的 topics 在型別上是 object|array，取值前先收斂
    const topic = (row as { topics?: { chapter_id: number } | { chapter_id: number }[] }).topics;
    const chapterId = Array.isArray(topic) ? topic[0]?.chapter_id : topic?.chapter_id;
    if (chapterId == null) continue;
    counts.set(chapterId, (counts.get(chapterId) ?? 0) + 1);
  }
  return counts;
}

export async function getChapter(chapterId: number): Promise<Chapter | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("chapters")
    .select("*")
    .eq("id", chapterId)
    .maybeSingle();
  return data;
}

export async function getTopics(chapterId: number): Promise<Topic[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("topics")
    .select("*")
    .eq("chapter_id", chapterId)
    .order("order_index");
  if (error) throw error;
  return data ?? [];
}

export async function getQuestionsByTopicIds(
  topicIds: number[],
): Promise<Question[]> {
  if (topicIds.length === 0) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .in("topic_id", topicIds)
    .order("id");
  if (error) throw error;
  return data ?? [];
}

export async function getTagsForQuestions(
  questionIds: string[],
): Promise<QuestionTag[]> {
  if (questionIds.length === 0) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("question_tags")
    .select("*")
    .in("question_id", questionIds);
  if (error) throw error;
  return data ?? [];
}

export async function getCardsByChapter(
  chapterId: number,
): Promise<(KnowledgeCard & { bullets: string[] })[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("knowledge_cards")
    .select("*, card_bullets(*)")
    .eq("chapter_id", chapterId)
    // 沒有排序的話筆記卡順序由 Postgres 決定，每次重新整理可能不一樣。
    // node_id 是路徑式主鍵，照它排即可讓同一個主題的卡片相鄰且穩定。
    .order("node_id");
  if (error) throw error;
  return (data ?? []).map((c) => {
    const bullets = ((c.card_bullets as CardBullet[] | null) ?? [])
      .slice()
      .sort((a, b) => a.ordinal - b.ordinal)
      .map((b) => b.bullet_text);
    return {
      node_id: c.node_id,
      subject_id: c.subject_id,
      chapter_id: c.chapter_id,
      card_title: c.card_title,
      card_subtitle: c.card_subtitle,
      status: c.status,
      bullets,
    };
  });
}

export async function getCurrentUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function getUserAnswers(): Promise<UserAnswer[]> {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return [];
  const { data, error } = await supabase
    .from("user_answers")
    .select("*")
    .eq("user_id", userData.user.id)
    .order("answered_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getQuestionsByIds(ids: string[]): Promise<Question[]> {
  if (ids.length === 0) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .in("id", ids);
  if (error) throw error;
  return data ?? [];
}

// ===== 比較表 (tables_) =====

/**
 * 取得每一題對應的比較表。
 *
 * 只吃 questionIds 而不是 chapterId：章節頁本來就已經把該章題目全部查出來了，
 * 直接沿用可以省一次查詢，也避開 question_chapters 缺 (chapter_id, …) 索引的問題
 * (它的 PK 是 (question_id, chapter_id)，反向查詢會全表掃)。
 */
export async function getTablesForQuestions(
  questionIds: string[],
): Promise<Map<string, ComparisonTable[]>> {
  const result = new Map<string, ComparisonTable[]>();
  if (questionIds.length === 0) return result;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("question_tables")
    .select("question_id, tables_(*)")
    .in("question_id", questionIds);
  if (error) throw error;

  for (const row of data ?? []) {
    const raw = (row as { tables_?: ComparisonTable | ComparisonTable[] }).tables_;
    const table = Array.isArray(raw) ? raw[0] : raw;
    if (!table) continue;
    const list = result.get(row.question_id) ?? [];
    list.push(table);
    result.set(row.question_id, list);
  }
  return result;
}

/** 把每題的比較表攤平去重，給章節頁的「本章相關比較表」匯總區用 */
export function dedupeTables(byQuestion: Map<string, ComparisonTable[]>): ComparisonTable[] {
  const seen = new Map<string, ComparisonTable>();
  for (const tables of byQuestion.values()) {
    for (const t of tables) if (!seen.has(t.id)) seen.set(t.id, t);
  }
  return [...seen.values()].sort((a, b) => a.title.localeCompare(b.title, "zh-Hant"));
}

export async function getTable(tableId: string): Promise<ComparisonTable | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("tables_")
    .select("*")
    .eq("id", tableId)
    .maybeSingle();
  return data;
}

export async function getAllTables(): Promise<ComparisonTable[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tables_")
    .select("*")
    .order("scope")
    .order("subject_id")
    .order("title");
  if (error) throw error;
  return data ?? [];
}

/**
 * 某張比較表被哪些題目引用(給 /tables/[tableId] 顯示)。
 * 這是反向查詢，question_tables 的 PK 是 (question_id, table_id)，
 * 所以需要 migration 0006 補的 idx_question_tables_table 才不會全表掃。
 */
export async function getQuestionsForTable(tableId: string): Promise<Question[]> {
  const supabase = await createClient();
  const { data: links, error: linkError } = await supabase
    .from("question_tables")
    .select("question_id")
    .eq("table_id", tableId);
  if (linkError) throw linkError;

  const ids = (links ?? []).map((l) => l.question_id);
  if (ids.length === 0) return [];
  return getQuestionsByIds(ids);
}

// ===== 跨章節關聯 (question_chapters) =====

/** 「也出現在」要顯示的章節資訊 */
export interface ChapterRef {
  id: number;
  chapter_no: string;
  title: string;
  subjectName: string;
}

/**
 * 每一題「除了當前章節以外」還出現在哪些章節。
 *
 * 資料來源是 question_chapters，它等於來源 markdown 的 `chap:` ∪ `xchap:`
 * (parser 會在 xchap 沒包含 chap 時自動補上，見 parse_chapters.py)。
 * 所以不管現在是從 chap 還是某個 xchap 章節進來看這題，
 * 扣掉當前章節後剩下的就是「其他章節」——正好是使用者要的語意。
 *
 * 全站約 35% 的題目(3109/8960)跨多章，單章題目會拿到空陣列、不顯示這一區。
 */
export async function getOtherChaptersForQuestions(
  questionIds: string[],
  excludeChapterId: number,
): Promise<Map<string, ChapterRef[]>> {
  const result = new Map<string, ChapterRef[]>();
  if (questionIds.length === 0) return result;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("question_chapters")
    .select("question_id, chapters(id, chapter_no, title, subjects(name))")
    .in("question_id", questionIds)
    .neq("chapter_id", excludeChapterId);
  if (error) throw error;

  // PostgREST 的巢狀關聯在型別推斷上是陣列，實際上這裡是 to-one，
  // 兩種形狀都收斂掉比較安全
  type ChapterJoin = {
    id: number;
    chapter_no: string;
    title: string;
    subjects?: { name: string } | { name: string }[] | null;
  };
  type Row = {
    question_id: string;
    chapters?: ChapterJoin | ChapterJoin[] | null;
  };

  for (const row of (data ?? []) as unknown as Row[]) {
    const ch = Array.isArray(row.chapters) ? row.chapters[0] : row.chapters;
    if (!ch) continue;
    const subj = Array.isArray(ch.subjects) ? ch.subjects[0] : ch.subjects;
    const list = result.get(row.question_id) ?? [];
    list.push({
      id: ch.id,
      chapter_no: ch.chapter_no,
      title: ch.title,
      subjectName: subj?.name ?? "",
    });
    result.set(row.question_id, list);
  }

  // 同科相鄰比較好讀
  for (const list of result.values()) {
    list.sort(
      (a, b) =>
        a.subjectName.localeCompare(b.subjectName, "zh-Hant") ||
        a.chapter_no.localeCompare(b.chapter_no),
    );
  }
  return result;
}

/**
 * 每題的疾病標籤(tag_type='dz')。
 *
 * 只取 dz：它有 1636 種疾病名，關聯精準。刻意不用 block——那只有 10 種
 * (神經/心血管/…)，單一標籤動輒上千題，拿來當「相關」太廣沒有意義。
 */
export async function getDiseaseTagsForQuestions(
  questionIds: string[],
): Promise<Map<string, string[]>> {
  const tags = await getTagsForQuestions(questionIds);
  const result = new Map<string, string[]>();
  for (const t of tags) {
    if (t.tag_type !== "dz") continue;
    const list = result.get(t.question_id) ?? [];
    list.push(t.tag_value);
    result.set(t.question_id, list);
  }
  return result;
}

// ===== 搜尋 =====

export interface QuestionHit {
  question: Question;
  chapter: Chapter | null;
  subjectName: string;
}

export interface CardHit {
  node_id: string;
  card_title: string;
  chapter: Chapter | null;
  subjectName: string;
  /** 命中的那一條 bullet(若是標題命中則為 null) */
  matchedBullet: string | null;
}

export interface SearchResult {
  questions: QuestionHit[];
  cards: CardHit[];
  truncated: boolean;
}

const SEARCH_LIMIT = 50;

/** 把使用者輸入轉成安全的 ILIKE pattern：% 與 _ 是通用字元，要轉義 */
function toLikePattern(raw: string): string {
  const escaped = raw.replace(/[\\%_]/g, (m) => `\\${m}`);
  return `%${escaped}%`;
}

/**
 * 搜尋題幹、考點與筆記卡。
 *
 * 用 ILIKE 而不是全文檢索：Postgres 內建的 to_tsvector 不會切中文詞。
 * migration 0006 的 pg_trgm GIN 索引就是為了讓這些 ILIKE 走得動
 * (沒有索引也能跑，只是 8960 題會慢)。
 */
export async function searchContent(query: string): Promise<SearchResult> {
  const q = query.trim();
  if (q.length === 0) return { questions: [], cards: [], truncated: false };

  const supabase = await createClient();
  const pattern = toLikePattern(q);

  const [stemRes, keyPointRes, cardRes, bulletRes] = await Promise.all([
    // 題幹與考點刻意拆成兩個查詢再合併，不用 .or()。
    // PostgREST 的 or 參數是「逗號分隔的條件清單」，把使用者輸入直接內插進去，
    // 只要搜尋詞含逗號或括號就會壞掉(實測會回 PGRST100 failed to parse logic tree)。
    supabase.from("questions").select("*").ilike("stem", pattern).limit(SEARCH_LIMIT),
    supabase.from("questions").select("*").ilike("key_point", pattern).limit(SEARCH_LIMIT),
    supabase
      .from("knowledge_cards")
      .select("node_id, card_title, chapter_id")
      .ilike("card_title", pattern)
      .limit(SEARCH_LIMIT),
    supabase
      .from("card_bullets")
      .select("card_node_id, bullet_text, knowledge_cards(node_id, card_title, chapter_id)")
      .ilike("bullet_text", pattern)
      .limit(SEARCH_LIMIT),
  ]);

  if (stemRes.error) throw stemRes.error;
  if (keyPointRes.error) throw keyPointRes.error;
  if (cardRes.error) throw cardRes.error;
  if (bulletRes.error) throw bulletRes.error;

  const [chapters, subjects] = await Promise.all([getAllChapters(), getSubjects()]);
  const chapterById = new Map(chapters.map((c) => [c.id, c]));
  const subjectName = (subjectId: string | undefined) =>
    subjects.find((s) => s.id === subjectId)?.name ?? "";

  // 兩個查詢的結果合併去重(同一題可能題幹與考點都命中)
  const questionById = new Map<string, Question>();
  for (const qq of [...(stemRes.data ?? []), ...(keyPointRes.data ?? [])]) {
    if (!questionById.has(qq.id)) questionById.set(qq.id, qq);
  }

  const questions: QuestionHit[] = [...questionById.values()].map((qq) => {
    const chapter = qq.primary_chapter_id != null
      ? chapterById.get(qq.primary_chapter_id) ?? null
      : null;
    return { question: qq, chapter, subjectName: subjectName(chapter?.subject_id) };
  });

  // 標題命中與 bullet 命中合併，同一張卡只留一筆(標題命中優先)
  const cardMap = new Map<string, CardHit>();
  for (const c of cardRes.data ?? []) {
    const chapter = c.chapter_id != null ? chapterById.get(c.chapter_id) ?? null : null;
    cardMap.set(c.node_id, {
      node_id: c.node_id,
      card_title: c.card_title,
      chapter,
      subjectName: subjectName(chapter?.subject_id),
      matchedBullet: null,
    });
  }
  type BulletRow = {
    bullet_text: string;
    knowledge_cards?:
      | { node_id: string; card_title: string; chapter_id: number | null }
      | { node_id: string; card_title: string; chapter_id: number | null }[]
      | null;
  };
  for (const b of (bulletRes.data ?? []) as unknown as BulletRow[]) {
    const card = Array.isArray(b.knowledge_cards) ? b.knowledge_cards[0] : b.knowledge_cards;
    if (!card || cardMap.has(card.node_id)) continue;
    const chapter = card.chapter_id != null ? chapterById.get(card.chapter_id) ?? null : null;
    cardMap.set(card.node_id, {
      node_id: card.node_id,
      card_title: card.card_title,
      chapter,
      subjectName: subjectName(chapter?.subject_id),
      matchedBullet: b.bullet_text,
    });
  }

  const cards = [...cardMap.values()];
  return {
    questions,
    cards,
    truncated: questions.length >= SEARCH_LIMIT || cards.length >= SEARCH_LIMIT,
  };
}

// ===== 測驗出題範圍 =====

export interface QuizScope {
  chapterIds: number[];
  /** exam_sitting 下界，如 '105-1'；未指定則不限 */
  sittingFrom?: string;
  sittingTo?: string;
  /** 題數上限；未指定或 0 代表全部 */
  limit?: number;
  order: "random" | "original";
}

/**
 * 依測驗設定取題。
 *
 * 取題方式與章節閱讀頁一致(透過 topics.chapter_id 內聯，而非 primary_chapter_id)，
 * 這樣「章節卡上顯示 35 題」與「實際考到 35 題」才會對得上。
 */
export async function getQuestionsForScope(scope: QuizScope): Promise<Question[]> {
  if (scope.chapterIds.length === 0) return [];
  const supabase = await createClient();

  let query = supabase
    .from("questions")
    .select("*, topics!inner(chapter_id)")
    .in("topics.chapter_id", scope.chapterIds);

  // exam_sitting 是固定寬度的 'NNN-N'(實際資料是 105-1 ~ 115-2)，
  // 所以字串比較剛好等於年份/梯次的大小比較。
  // 前提是格式不變——哪天年份變四位數或梯次變兩位數，這裡就要改成拆開比數字。
  if (scope.sittingFrom) query = query.gte("exam_sitting", scope.sittingFrom);
  if (scope.sittingTo) query = query.lte("exam_sitting", scope.sittingTo);

  const { data, error } = await query.order("id");
  if (error) throw error;

  let questions = (data ?? []) as Question[];

  if (scope.order === "random") {
    // 一定要「先洗牌再截斷」。反過來(先 limit 再洗)只會在前 N 題裡打亂順序，
    // 永遠抽不到後面的題目。
    questions = [...questions];
    for (let i = questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questions[i], questions[j]] = [questions[j], questions[i]];
    }
  }

  if (scope.limit && scope.limit > 0) questions = questions.slice(0, scope.limit);
  return questions;
}

/**
 * 題庫涵蓋的民國年範圍，給年份區間選單用。
 *
 * 刻意只取 min/max 兩列，而不是撈全部 exam_sitting 再去重：
 * PostgREST 預設一次最多回 1000 列，配上 .order('exam_sitting') 會只拿到最早的
 * 1000 題，去重後的清單會缺掉後面的年份(本專案有 8960 題)。
 */
export async function getExamYearRange(): Promise<{ minYear: number; maxYear: number }> {
  const supabase = await createClient();
  const [minRes, maxRes] = await Promise.all([
    supabase.from("questions").select("exam_sitting").order("exam_sitting").limit(1),
    supabase
      .from("questions")
      .select("exam_sitting")
      .order("exam_sitting", { ascending: false })
      .limit(1),
  ]);
  if (minRes.error) throw minRes.error;
  if (maxRes.error) throw maxRes.error;

  const yearOf = (sitting: string | undefined, fallback: number) => {
    const n = Number(sitting?.split("-")[0]);
    return Number.isFinite(n) ? n : fallback;
  };
  return {
    minYear: yearOf(minRes.data?.[0]?.exam_sitting, 105),
    maxYear: yearOf(maxRes.data?.[0]?.exam_sitting, 115),
  };
}

/**
 * 把「民國年」轉成 exam_sitting 的邊界字串。
 * 上界用 '-9' 是因為梯次只有 1~3，'115-9' 能涵蓋 115 年所有梯次
 * (字串比較下 '115-3' < '115-9')。
 */
export function yearToSittingBounds(fromYear: number, toYear: number) {
  return { sittingFrom: `${fromYear}-1`, sittingTo: `${toYear}-9` };
}
