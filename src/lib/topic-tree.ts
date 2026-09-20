import { matchCardsToTopics, type NoteCardData } from "./card-topic-match";
import type { Chapter, Question, Topic } from "./types";

export interface TopicNode {
  topic: Topic;
  children: TopicNode[];
  questions: Question[];
  cards: NoteCardData[];
  /** 含所有子孫的累計數量，用於標題旁的計數與「是否整個隱藏」判斷 */
  totalQuestions: number;
  totalCards: number;
}

export interface ChapterContent {
  tree: TopicNode[];
  /** 比對不到 topic 的筆記卡，渲染在章節層 */
  orphanCards: NoteCardData[];
  questionTotal: number;
}

/**
 * 用 parent_topic_id 把 topics 建成真正的樹，並把題目與筆記卡掛上去。
 *
 * 原本的章節頁只靠 level === 2 二分、parent_topic_id 完全沒用到，所以
 * level 3 只是縮排的文字，沒有真正包在 level 2 底下。閱讀頁的巢狀內容與
 * 左側大綱吃的是同一棵樹，所以這裡只建一次。
 */
export function buildChapterContent(
  chapter: Chapter,
  topics: Topic[],
  questions: Question[],
  cards: NoteCardData[],
): ChapterContent {
  const questionsByTopic = new Map<number, Question[]>();
  for (const q of questions) {
    if (q.topic_id == null) continue;
    const list = questionsByTopic.get(q.topic_id) ?? [];
    list.push(q);
    questionsByTopic.set(q.topic_id, list);
  }

  const { byTopic: cardsByTopic, orphans } = matchCardsToTopics(chapter, topics, cards);

  const nodeById = new Map<number, TopicNode>();
  for (const topic of topics) {
    nodeById.set(topic.id, {
      topic,
      children: [],
      questions: questionsByTopic.get(topic.id) ?? [],
      cards: cardsByTopic.get(topic.id) ?? [],
      totalQuestions: 0,
      totalCards: 0,
    });
  }

  const roots: TopicNode[] = [];
  for (const topic of topics) {
    const node = nodeById.get(topic.id)!;
    const parent = topic.parent_topic_id != null ? nodeById.get(topic.parent_topic_id) : undefined;
    // parent_topic_id 指到別章(理論上不會發生)時當成根節點，不要整個掉掉
    if (parent) parent.children.push(node);
    else roots.push(node);
  }

  const byOrder = (a: TopicNode, b: TopicNode) =>
    a.topic.order_index - b.topic.order_index;

  // 後序累計，子孫的數量要往上加
  const rollUp = (node: TopicNode): void => {
    node.children.sort(byOrder);
    node.totalQuestions = node.questions.length;
    node.totalCards = node.cards.length;
    for (const child of node.children) {
      rollUp(child);
      node.totalQuestions += child.totalQuestions;
      node.totalCards += child.totalCards;
    }
  };
  roots.sort(byOrder);
  roots.forEach(rollUp);

  return { tree: roots, orphanCards: orphans, questionTotal: questions.length };
}

/** 有題目或有筆記才值得顯示。原本只看題目數，會讓「只有筆記」的主題整個消失。 */
export function hasContent(node: TopicNode): boolean {
  return node.totalQuestions > 0 || node.totalCards > 0;
}

/** 供 <details id> 與大綱的 anchor 共用，兩邊一定要一致 */
export function topicAnchorId(topicId: number): string {
  return `topic-${topicId}`;
}
