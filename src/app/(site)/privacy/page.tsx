import { getCurrentUser } from "@/lib/data";
import { Panel } from "@/components/ui/Panel";
import { DeleteMyData } from "@/components/ui/DeleteMyData";

export const metadata = { title: "隱私說明 | 多保命" };

export default async function PrivacyPage() {
  const user = await getCurrentUser();
  const h2 = "mt-6 mb-2 text-lg font-bold text-deep";
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
      <Panel>
        <h1 className="mb-4 text-2xl font-bold text-deep">隱私說明</h1>
        <div className="space-y-2 text-sm leading-relaxed text-strong">
          <p>多保命題庫只收集提供功能所需的最少資料，不要求填寫生日、電話等個人資料。</p>

          <h2 className={h2}>我們收集什麼</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Google 帳號的名稱與 email：用來登入與辨識你的帳號。</li>
            <li>作答紀錄：用來產生錯題本、正確率與學習統計。</li>
            <li>收藏的題目。</li>
            <li>你送出的錯誤回報內容。</li>
          </ul>

          <h2 className={h2}>怎麼使用</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>你的作答紀錄與收藏只有你自己看得到，其他使用者無法讀取。</li>
            <li>
              站長只會看到<strong>全站彙總</strong>的統計（例如每天有多少人使用、哪些章節最常被練習），
              看不到個別使用者的帳號或 email，用途是調整網站內容與版面。
            </li>
            <li>資料不會提供或販售給任何第三方。</li>
          </ul>

          <h2 className={h2}>刪除資料</h2>
          <p>你可以隨時刪除自己的作答紀錄與收藏。錯誤回報屬於給站長的訊息，如需刪除請透過回報頁告知。</p>
          {user ? (
            <div className="pt-2">
              <DeleteMyData />
            </div>
          ) : (
            <p className="text-muted">登入後可以在這裡刪除自己的紀錄。</p>
          )}
        </div>
      </Panel>
    </main>
  );
}
