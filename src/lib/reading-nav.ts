import { matchCardsToTopics, type NoteCardData } from "./card-topic-match";
import type { QuestionRef } from "./data";
import type { TopicNode } from "./topic-tree";
import type { Chapter, Topic } from "./types";

/**
 * 側邊欄最上方「切換軸」的一個項目。
 *
 * 目前只實作 kind === "subject"。疾病／藥物之後可能會變成跟科目平行的索引軸
 * (question_chapters 顯示約 3109/8960 題是跨章節的，所以它們比較像跨科的軸、
 * 不像每科內部的章節分法)，先把型別留好，屆時不用重寫 SubjectSwitcher。
 *
 * 注意：藥物目前在資料庫裡一筆都沒有(question_tags 的 tag_type 白名單寫死在
 * database/scripts/lib/parse_chapters.py，只收 block/dz/other)，要做得先回到
 * 來源 markdown 補標註。這裡純粹是型別層的預留。
 */
export type NavScope =
  | { kind: "subject"; id: string; label: string }
  | { kind: "disease" | "drug"; id: string; label: string };

/**
 * 側邊欄 Ch 列表的一個群組。
 *
 * label 省略時不渲染群組標題，整份列表看起來就是一層平的 Ch 清單 —— 也就是
 * 現在的樣子。之後若要在科目內再分群(疾病/藥物/護理技術/特殊主題)，只要讓
 * buildChapterGroups 回多個帶 label 的群組即可，元件不用動。
 */
export interface ChapterGroup {
  label?: string;
  chapters: Chapter[];
}

export function buildChapterGroups(chapters: Chapter[]): ChapterGroup[] {
  if (chapters.length === 0) return [];
  return [{ chapters }];
}

/**
 * 側邊樹用的精簡節點。
 *
 * 側邊欄是 client component，而 TopicNode 裡掛著整份 Question 物件(題幹、四個
 * 選項、詳解)。直接把 TopicNode 傳進去，等於整章的題目會被序列化兩份送到瀏覽器。
 * 這裡只留樹狀結構與計數，payload 就只有標題與數字。
 */
export interface TreeNode {
  id: number;
  label: string;
  questionCount: number;
  noteCount: number;
  children: TreeNode[];
}

/** TopicNode[] -> TreeNode[]，並丟掉沒有任何內容的分支(與內容區的 hasContent 一致) */
export function toTreeNodes(nodes: TopicNode[]): TreeNode[] {
  return nodes
    .filter((n) => n.totalQuestions > 0 || n.totalCards > 0)
    .map((n) => ({
      id: n.topic.id,
      label: n.topic.heading_text,
      questionCount: n.totalQuestions,
      noteCount: n.totalCards,
      children: toTreeNodes(n.children),
    }));
}

/**
 * 側邊欄 Ch 列表的一列。
 *
 * 跟 ChapterGroup 分開是因為 Map 與完整的 Chapter 物件都不適合直接餵給
 * client component：這裡只留渲染要用的欄位，且是純陣列。
 */
export interface SidebarChapter {
  id: number;
  chapterNo: string;
  title: string;
  questionCount: number;
  noteCount: number;
}

export interface SidebarChapterGroup {
  label?: string;
  chapters: SidebarChapter[];
}

export function buildSidebarChapters(
  groups: ChapterGroup[],
  questionCounts: Map<number, number>,
  cardCounts: Map<number, number>,
): SidebarChapterGroup[] {
  return groups.map((g) => ({
    label: g.label,
    chapters: g.chapters.map((c) => ({
      id: c.id,
      chapterNo: c.chapter_no,
      title: c.title,
      questionCount: questionCounts.get(c.id) ?? 0,
      noteCount: cardCounts.get(c.id) ?? 0,
    })),
  }));
}

/**
 * 直接從「題目 -> topic」的精簡參照建出側邊樹。
 *
 * 與 buildChapterContent + toTreeNodes 同一套規則(後序累計、只留有內容的分支)，
 * 差別只在不需要 Question 全文 —— 側邊樹是獨立的平行路由 slot，每次換章都會
 * 重跑，沒必要把整章的題幹與詳解再抓一遍。筆記數仍走 matchCardsToTopics，
 * 與內容區的掛法一致。
 */
export function buildTreeNodesFromRefs(
  chapter: Chapter,
  topics: Topic[],
  refs: QuestionRef[],
  cards: NoteCardData[],
): TreeNode[] {
  const questionCount = new Map<number, number>();
  for (const r of refs) {
    if (r.topic_id == null) continue;
    questionCount.set(r.topic_id, (questionCount.get(r.topic_id) ?? 0) + 1);
  }
  const { byTopic: cardsByTopic } = matchCardsToTopics(chapter, topics, cards);

  interface Draft {
    topic: Topic;
    children: Draft[];
  }
  const draftById = new Map<number, Draft>();
  for (const topic of topics) draftById.set(topic.id, { topic, children: [] });

  const roots: Draft[] = [];
  for (const topic of topics) {
    const draft = draftById.get(topic.id)!;
    const parent =
      topic.parent_topic_id != null ? draftById.get(topic.parent_topic_id) : undefined;
    // parent_topic_id 指到別章(理論上不會發生)時當成根節點，與 buildChapterContent 一致
    if (parent) parent.children.push(draft);
    else roots.push(draft);
  }

  const byOrder = (a: Draft, b: Draft) => a.topic.order_index - b.topic.order_index;

  const toNode = (draft: Draft): TreeNode => {
    draft.children.sort(byOrder);
    const children = draft.children.map(toNode);
    const own = questionCount.get(draft.topic.id) ?? 0;
    const ownCards = (cardsByTopic.get(draft.topic.id) ?? []).length;
    return {
      id: draft.topic.id,
      label: draft.topic.heading_text,
      questionCount: children.reduce((sum, c) => sum + c.questionCount, own),
      noteCount: children.reduce((sum, c) => sum + c.noteCount, ownCards),
      children,
    };
  };

  roots.sort(byOrder);
  return prune(roots.map(toNode));
}

/** 丟掉整支都沒有內容的分支，規則與 toTreeNodes / hasContent 相同 */
function prune(nodes: TreeNode[]): TreeNode[] {
  return nodes
    .filter((n) => n.questionCount > 0 || n.noteCount > 0)
    .map((n) => ({ ...n, children: prune(n.children) }));
}
