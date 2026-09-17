"use server";

import { createClient } from "./supabase-server";

export async function submitAnswer(
  questionId: string,
  selectedOption: string,
  isCorrect: boolean,
  quizMode: string,
): Promise<{ ok: boolean; reason?: string }> {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return { ok: false, reason: "not_logged_in" };
  }

  const { error } = await supabase.from("user_answers").insert({
    user_id: userData.user.id,
    question_id: questionId,
    selected_option: selectedOption,
    is_correct: isCorrect,
    quiz_mode: quizMode,
  });

  if (error) {
    return { ok: false, reason: error.message };
  }
  return { ok: true };
}
