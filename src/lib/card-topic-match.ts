import type { Chapter, KnowledgeCard, Topic } from "./types";

export type NoteCardData = KnowledgeCard & { bullets: string[] };

export interface CardMatchResult {
  /** topic id -> 掛在該 topic 底下的筆記卡 */
  byTopic: Map<number, NoteCardData[]>;
  /** 比對不到 topic 的卡，改掛在章節層，避免卡片消失 */
  orphans: NoteCardData[];
}

/**
 * 把筆記卡掛到對應的 topic 底下。
 *
 * 背景：knowledge_cards 沒有 topic_id，只有路徑式主鍵 node_id，形如
 *   "生解-Ch09消化系統-胃-解剖學與組織學"
 *    ^^^^^^^^^^^^^^^^^ = chapters.full_title      ^^^^^^^^^^^^^^^ = 標題路徑
 * 而 topics.natural_key 是用 '>' 串接的同一條路徑("胃>解剖學與組織學")。
 *
 * 兩個實作細節值得記著：
 *
 * 1. 先「剝掉 full_title 前綴」而不是直接用 '-' 切字串。full_title 本身就含
 *    '-'(科目-章節)，科目或章節名稱也可能再含 '-'，盲切會切錯。
 *
 * 2. 索引是從 topic 那一側反建的(把 natural_key 的 '>' 換成 '-')，而不是從
 *    node_id 切出來的段落去猜。這樣即使標題文字本身含 '-' 也不會比對失敗。
 *
 * 實測 1000 張卡：999 命中(191 完整路徑、808 命中 level 2 標題)，
 * 1 張因來源標題錯字("神制組織學")落到 orphans。
 *
 * 註：全站 162 章裡有 150 章只有 level 2 topics，沒有 level 3。這些章節的卡
 * 第二段(如「卵巢」、「乳房」)本來就沒有對應的 topic 可掛，掛在 level 2
 * 標題底下是正確結果，不是降級的退路。
 */
export function matchCardsToTopics(
  chapter: Chapter,
  topics: Topic[],
  cards: NoteCardData[],
): CardMatchResult {
  const byTopic = new Map<number, NoteCardData[]>();
  const orphans: NoteCardData[] = [];

  // natural_key("胃>解剖學與組織學") -> node_id 尾段("胃-解剖學與組織學")
  const byPath = new Map<string, Topic>();
  for (const t of topics) {
    byPath.set(t.natural_key.split(">").join("-"), t);
  }
  // 同名標題只取第一個(natural_key 才是唯一鍵，heading_text 可能重複)
  const byHeading = new Map<string, Topic>();
  for (const t of topics) {
    if (!byHeading.has(t.heading_text)) byHeading.set(t.heading_text, t);
  }

  const attach = (topicId: number, card: NoteCardData) => {
    const list = byTopic.get(topicId) ?? [];
    list.push(card);
    byTopic.set(topicId, list);
  };

  const prefix = `${chapter.full_title}-`;

  for (const card of cards) {
    if (!card.node_id.startsWith(prefix)) {
      orphans.push(card);
      continue;
    }
    const rest = card.node_id.slice(prefix.length);

    // (a) 完整路徑命中
    const exact = byPath.get(rest);
    if (exact) {
      attach(exact.id, card);
      continue;
    }

    // (b) 第一段命中某個標題(該章沒有更細的 topic 時的正常情形)
    const firstSegment = rest.split("-")[0];
    const byFirst = byHeading.get(firstSegment);
    if (byFirst) {
      attach(byFirst.id, card);
      continue;
    }

    // (c) 最長前綴：標題本身含 '-' 時的保險
    const segments = rest.split("-");
    let matched = false;
    for (let n = segments.length - 1; n >= 1; n--) {
      const candidate = byPath.get(segments.slice(0, n).join("-"));
      if (candidate) {
        attach(candidate.id, card);
        matched = true;
        break;
      }
    }
    if (matched) continue;

    // (d) 全部落空 —— 一定要接住，不能讓筆記卡消失
    orphans.push(card);
  }

  return { byTopic, orphans };
}
