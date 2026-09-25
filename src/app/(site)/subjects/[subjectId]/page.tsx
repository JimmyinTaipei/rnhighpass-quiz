import { notFound, redirect } from "next/navigation";
import { getChapters, getSubject } from "@/lib/data";

/**
 * 舊的「Ch 選單頁」。
 *
 * 閱讀流程已經改成「科目頁 -> 雙欄閱讀頁」，章節切換收進閱讀頁側邊欄了，
 * 所以這一層不再有自己的畫面。但舊網址(書籤、分享出去的連結)不能 404，
 * 這裡轉址到該科第一個章節。
 *
 * 「上次讀到的 Ch」讀不到——位置存在 localStorage，而這是 server render。
 * 科目頁的卡片會在 client 端把連結改寫成記住的章節(見 SubjectLink)，這裡
 * 只負責「直接打這個網址進來」時的預設落點。
 */
export default async function SubjectPage(props: PageProps<"/subjects/[subjectId]">) {
  const params = await props.params;
  // App Router 不會自動 decode 動態路由參數,科目 ID 含中文字,
  // 瀏覽器網址列會是 %E5%85%A7%E5%A4%96 這種編碼過的字串,要手動解碼才能查資料庫
  const subjectId = decodeURIComponent(params.subjectId);
  const subject = await getSubject(subjectId);
  if (!subject) notFound();

  const chapters = await getChapters(subjectId);
  if (chapters.length === 0) notFound();

  // redirect 靠 throw 中斷渲染，所以不能包在 try/catch 裡
  redirect(`/chapters/${chapters[0].id}`);
}
