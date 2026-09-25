import { buildTreeNodesFromRefs, type TreeNode } from "./reading-nav";
import { createClient } from "./supabase-server";
import type { ErrorReport, ReportStatus } from "./report-fields";
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
 * 各章節的題數，用於科目頁的章節卡與閱讀頁側邊欄的 Ch 列表。
 *
 * 走 chapter_question_counts view(migration 0008)。原本是「一題抓一列」再用
 * JS 數，但 PostgREST 預設一次最多回 1000 列(全庫 8960 題)，題目多的科目會被
 * 靜默截斷、數字是錯的。view 在資料庫端 group by，一章只回一列。
 *
 * view 本身刻意透過 topic_id 內聯 topics 來數，而不是用 questions.
 * primary_chapter_id——因為章節閱讀頁與測驗頁都是以 topic_id 取題(見
 * getQuestionsByTopicIds)，用 primary_chapter_id 數出來的數字會跟使用者
 * 實際看到的題數不一致。
 */
export async function getQuestionCountsByChapter(
  chapterIds: number[],
): Promise<Map<number, number>> {
  if (chapterIds.length === 0) return new Map();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("chapter_question_counts")
    .select("chapter_id, question_count")
    .in("chapter_id", chapterIds);
  if (error) throw error;

  const counts = new Map<number, number>();
  for (const row of (data ?? []) as { chapter_id: number; question_count: number }[]) {
    counts.set(row.chapter_id, row.question_count);
  }
  return counts;
}

/**
 * 各章節的筆記數，用於側邊欄 Ch 列表。走 chapter_card_counts view(0008)。
 *
 * 只有「整章」的數字。單一主題底下的筆記數要靠 card-topic-match 的路徑比對，
 * 算不出 SQL，所以側邊欄只有展開中的那一章才有 per-topic 筆記數。
 */
export async function getCardCountsByChapter(
  chapterIds: number[],
): Promise<Map<number, number>> {
  if (chapterIds.length === 0) return new Map();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("chapter_card_counts")
    .select("chapter_id, card_count")
    .in("chapter_id", chapterIds);
  if (error) throw error;

  const counts = new Map<number, number>();
  for (const row of (data ?? []) as { chapter_id: number; card_count: number }[]) {
    counts.set(row.chapter_id, row.card_count);
  }
  return counts;
}

/**
 * 全站所有章節的題數 / 筆記數。
 *
 * 閱讀頁的側邊欄已經提到 chapters/layout.tsx(不含動態參數的共用段,換章不重繪),
 * 那一層拿不到 chapterId,所以無法先算出「這一科有哪些章」再去查計數 ——
 * 乾脆一次把全站的計數撈回來,由 client 端依 pathname 取用。
 *
 * 走 0008 的兩支 view,一章一列(全站 162 章),遠低於 PostgREST 的 1000 列上限。
 */
export async function getAllChapterQuestionCounts(): Promise<Map<number, number>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("chapter_question_counts")
    .select("chapter_id, question_count");
  if (error) throw error;

  const counts = new Map<number, number>();
  for (const row of (data ?? []) as { chapter_id: number; question_count: number }[]) {
    counts.set(row.chapter_id, row.question_count);
  }
  return counts;
}

export async function getAllChapterCardCounts(): Promise<Map<number, number>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("chapter_card_counts")
    .select("chapter_id, card_count");
  if (error) throw error;

  const counts = new Map<number, number>();
  for (const row of (data ?? []) as { chapter_id: number; card_count: number }[]) {
    counts.set(row.chapter_id, row.card_count);
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

/**
 * 只拿「題目掛在哪個 topic」這件事,不含題幹與詳解。
 *
 * 側邊欄的節點樹只需要計數,而整章的 Question 全文(題幹 + 四個選項 + 詳解)
 * 動輒上百列的長文字。節點樹現在是獨立的平行路由 slot(chapters/@tree),
 * 每次換章都會重跑,用全文查詢等於把最重的那份資料抓兩遍。
 */
export interface QuestionRef {
  id: string;
  topic_id: number | null;
}

export async function getQuestionRefsByTopicIds(
  topicIds: number[],
): Promise<QuestionRef[]> {
  if (topicIds.length === 0) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("questions")
    .select("id, topic_id")
    .in("topic_id", topicIds)
    .order("id");
  if (error) throw error;
  return (data ?? []) as QuestionRef[];
}

export async function getTagsForQuestions(
  questionIds: string[],
): Promise<QuestionTag[]> {
  if (questionIds.length === 0) return [];
  const supabase = await createClient();
  const batches = await Promise.all(
    chunk([...new Set(questionIds)]).map(async (batch) => {
      const { data, error } = await supabase
        .from("question_tags")
        .select("*")
        .in("question_id", batch);
      if (error) throw error;
      return (data ?? []) as QuestionTag[];
    }),
  );
  return batches.flat();
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

/**
 * 使用者全部作答紀錄(新到舊)。
 *
 * PostgREST 預設一次最多回 1000 列，常用的使用者很快就會超過，
 * 所以用 .range() 分頁抓到底。沒分頁的話錯題本與統計會靜默少算。
 */
export async function getUserAnswers(): Promise<UserAnswer[]> {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return [];
  const PAGE = 1000;
  const all: UserAnswer[] = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabase
      .from("user_answers")
      .select("*")
      .eq("user_id", userData.user.id)
      // id 當第二排序鍵，確保分頁邊界上同一時間的紀錄不會重複或漏掉
      .order("answered_at", { ascending: false })
      .order("id", { ascending: false })
      .range(from, from + PAGE - 1);
    if (error) throw error;
    all.push(...(data ?? []));
    if (!data || data.length < PAGE) break;
  }
  return all;
}

/** .in() 的 id 清單會被放進 URL，太長會被拒絕，所以切批查詢 */
const IN_CHUNK = 200;

function chunk<T>(items: T[], size = IN_CHUNK): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

export async function getQuestionsByIds(ids: string[]): Promise<Question[]> {
  if (ids.length === 0) return [];
  const supabase = await createClient();
  const batches = await Promise.all(
    chunk([...new Set(ids)]).map(async (batch) => {
      const { data, error } = await supabase.from("questions").select("*").in("id", batch);
      if (error) throw error;
      return (data ?? []) as Question[];
    }),
  );
  return batches.flat();
}

/** 統計/儀表板只需要的題目欄位，避免把整題(含詳解)全部抓回來 */
export type QuestionMeta = Pick<
  Question,
  "id" | "primary_chapter_id" | "topic_id" | "source_text" | "stem"
>;

export async function getQuestionMetaByIds(ids: string[]): Promise<QuestionMeta[]> {
  if (ids.length === 0) return [];
  const supabase = await createClient();
  const batches = await Promise.all(
    chunk([...new Set(ids)]).map(async (batch) => {
      const { data, error } = await supabase
        .from("questions")
        .select("id, primary_chapter_id, topic_id, source_text, stem")
        .in("id", batch);
      if (error) throw error;
      return (data ?? []) as QuestionMeta[];
    }),
  );
  return batches.flat();
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
  /** 要扣掉的章節。疾病標籤頁沒有「當前章節」可扣，傳 null 代表全列 */
  excludeChapterId: number | null,
): Promise<Map<string, ChapterRef[]>> {
  const result = new Map<string, ChapterRef[]>();
  if (questionIds.length === 0) return result;

  const supabase = await createClient();
  let query = supabase
    .from("question_chapters")
    .select("question_id, chapters(id, chapter_no, title, subjects(name))")
    .in("question_id", questionIds);
  if (excludeChapterId !== null) query = query.neq("chapter_id", excludeChapterId);

  const { data, error } = await query;
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

// ===== 疾病標籤(demo) =====

export interface DiseaseTagSummary {
  tag: string;
  questionCount: number;
}

/**
 * 疾病標籤的「示範清單」。
 *
 * 刻意不是全庫精確結果:question_tags 的 dz 列遠超過 PostgREST 一次能回的
 * 1000 列,這裡抓到的是前 1000 列的樣本,聚合出來的次數只夠拿來排序與展示。
 * 要做成正式的索引軸(全部 1636 種疾病 + 正確題數)時,照 0007/0008 的作法加一支
 *   create view disease_tag_counts as
 *     select tag_value, count(*) from question_tags where tag_type='dz' group by 1;
 * 再把這支函式改成查 view 即可,呼叫端不用動。
 */
export async function getDiseaseTagSample(limit = 30): Promise<DiseaseTagSummary[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("question_tags")
    .select("tag_value")
    .eq("tag_type", "dz")
    .limit(1000);
  if (error) throw error;

  const counts = new Map<string, number>();
  for (const row of (data ?? []) as { tag_value: string }[]) {
    counts.set(row.tag_value, (counts.get(row.tag_value) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([tag, questionCount]) => ({ tag, questionCount }))
    .sort((a, b) => b.questionCount - a.questionCount || a.tag.localeCompare(b.tag, "zh-Hant"))
    .slice(0, limit);
}

/**
 * 某個疾病標籤底下的題目。
 *
 * max 是給 demo 用的天花板:熱門標籤(如「糖尿病」)題數可能上百,一頁塞不下
 * 也沒人會一路讀完。正式版應該改成分頁。
 */
export async function getQuestionsByDiseaseTag(
  tag: string,
  max = 60,
): Promise<Question[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("question_tags")
    .select("question_id")
    .eq("tag_type", "dz")
    .eq("tag_value", tag)
    .limit(max);
  if (error) throw error;

  const ids = (data ?? []).map((r) => (r as { question_id: string }).question_id);
  return getQuestionsByIds(ids);
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

/**
 * 章節的側邊樹節點。
 *
 * 側邊欄的 @tree slot 與 /api/chapters/[chapterId]/tree 共用這一支 —— 前者給
 * 當前章節(server render、可 stream)，後者給「同時展開的其他章節」按需抓。
 * 兩邊走同一個函式，樹的組法才不會漂移。
 *
 * 只查 topic 參照不查題目全文：側邊樹只需要標題與計數，用 select('*')
 * 等於把整章最重的那份資料再抓一遍。
 */
export async function getChapterTreeNodes(
  chapterId: number,
): Promise<TreeNode[] | null> {
  const chapter = await getChapter(chapterId);
  if (!chapter) return null;

  const [topics, cards] = await Promise.all([
    getTopics(chapterId),
    getCardsByChapter(chapterId),
  ]);
  const refs = await getQuestionRefsByTopicIds(topics.map((t) => t.id));
  return buildTreeNodesFromRefs(chapter, topics, refs, cards);
}

// ===== 錯誤回報(migration 0011) =====

/** 目前使用者自己的回報(RLS 只會回自己的列；多加 user_id 條件是為了 admin 也只看自己的) */
export async function getMyReports(): Promise<ErrorReport[]> {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return [];
  const { data, error } = await supabase
    .from("error_reports")
    .select("id, question_id, table_id, category, message, page_path, status, admin_note, resolved_at, created_at")
    .eq("user_id", userData.user.id)
    .order("created_at", { ascending: false })
    .limit(100);
  // migration 還沒套用時不要讓頁面掛掉
  if (error) return [];
  return (data ?? []) as ErrorReport[];
}

/** admin：全部回報(非 admin 呼叫時 RLS 只會回他自己的，呼叫端另外有 dev mode 門檻) */
export async function getAllReports(status?: ReportStatus): Promise<ErrorReport[]> {
  const supabase = await createClient();
  let query = supabase
    .from("error_reports")
    .select("id, question_id, table_id, category, message, page_path, status, admin_note, resolved_at, created_at")
    .order("created_at", { ascending: false })
    .limit(300);
  if (status) query = query.eq("status", status);
  const { data, error } = await query;
  if (error) return [];
  return (data ?? []) as ErrorReport[];
}

// ===== 收藏(migration 0009) =====

export interface FavoriteRow {
  question_id: string;
  created_at: string;
}

/** 目前使用者的收藏(新到舊)。migration 還沒套用時回空陣列 */
export async function getFavorites(): Promise<FavoriteRow[]> {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return [];
  const { data, error } = await supabase
    .from("user_favorites")
    .select("question_id, created_at")
    .eq("user_id", userData.user.id)
    .order("created_at", { ascending: false })
    .limit(5000);
  if (error) return [];
  return data ?? [];
}

/** topic_id -> chapter_id。統計頁的章節歸屬要和 chapter_question_counts 一樣走 topics */
export async function getTopicChapterMap(topicIds: number[]): Promise<Map<number, number>> {
  const map = new Map<number, number>();
  if (topicIds.length === 0) return map;
  const supabase = await createClient();
  const batches = await Promise.all(
    chunk([...new Set(topicIds)]).map(async (batch) => {
      const { data, error } = await supabase.from("topics").select("id, chapter_id").in("id", batch);
      if (error) throw error;
      return data ?? [];
    }),
  );
  for (const row of batches.flat()) map.set(row.id, row.chapter_id);
  return map;
}

// ===== 站長匿名統計(migration 0012) =====
// 這些 RPC 在資料庫端先驗 admin，只回彙總數字、不含任何使用者身分。

export interface SiteTotals {
  registered_users: number;
  users_with_answers: number;
  total_answers: number;
  active_users_7d: number;
  active_users_30d: number;
  answers_7d: number;
}
export interface UsageDay {
  day: string;
  active_users: number;
  answers: number;
  new_users: number;
}
export interface ChapterHeat {
  chapter_id: number;
  answers: number;
  users: number;
  accuracy: number;
}
export interface AnonUserSummary {
  user_no: number;
  answers: number;
  accuracy: number;
  active_days: number;
  top_subject: string | null;
  first_active: string;
  last_active: string;
}
export interface HardQuestion {
  question_id: string;
  users: number;
  wrong_users: number;
  wrong_rate: number;
}

export async function getAdminAnalytics(days: number) {
  const supabase = await createClient();
  const [totals, usage, heat, users, hardest] = await Promise.all([
    supabase.rpc("admin_site_totals"),
    supabase.rpc("admin_usage_daily", { days }),
    supabase.rpc("admin_content_heat", { days }),
    supabase.rpc("admin_user_summary"),
    supabase.rpc("admin_hardest_questions", { min_users: 5, lim: 30 }),
  ]);
  const error = totals.error ?? usage.error ?? heat.error ?? users.error ?? hardest.error;
  return {
    error: error ? error.message : null,
    totals: ((totals.data ?? [])[0] ?? null) as SiteTotals | null,
    usage: (usage.data ?? []) as UsageDay[],
    heat: (heat.data ?? []) as ChapterHeat[],
    users: (users.data ?? []) as AnonUserSummary[],
    hardest: (hardest.data ?? []) as HardQuestion[],
  };
}

/**
 * 每張比較表在各章節被引用幾次(migration 0010 的 table_chapter_counts view)。
 * 一列 = (表, 章)；全站幾百張表 × 少數章節，可能超過 1000 列，所以分頁抓。
 */
export async function getTableChapterCounts(): Promise<
  { table_id: string; chapter_id: number; question_count: number }[]
> {
  const supabase = await createClient();
  const PAGE = 1000;
  const all: { table_id: string; chapter_id: number; question_count: number }[] = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabase
      .from("table_chapter_counts")
      .select("table_id, chapter_id, question_count")
      .order("table_id")
      .order("chapter_id")
      .range(from, from + PAGE - 1);
    // migration 0010 還沒套用時退回空結果(比較表頁會改用科目分組)
    if (error) return [];
    all.push(...(data ?? []));
    if (!data || data.length < PAGE) break;
  }
  return all;
}
