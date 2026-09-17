import { createClient } from "./supabase-server";
import type {
  CardBullet,
  Chapter,
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
    .eq("chapter_id", chapterId);
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
