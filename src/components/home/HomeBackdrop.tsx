/* eslint-disable @next/next/no-img-element -- 純裝飾的小封面，不需要 next/image 的最佳化 */

/**
 * 首頁背景：比照社群圖(多保命/social)的御守主題——天空漸層、遠山、祥雲、青海波，
 * 再加幾本會輕輕漂浮的封面。全部是裝飾(aria-hidden)，動畫只動 transform，
 * prefers-reduced-motion 時停止(樣式見 globals.css 的「首頁背景」)。
 *
 * 父層需要 relative + isolate + overflow-hidden，這裡用 -z-10 墊在內容底下。
 */

const GOLD = "#E3B04B"; // 御守 logo 的金邊，跟社群圖同色
const MID = "#B6CCF0";
const PAPER = "#F4F7FC";
const SCALE_FILL = "#DCE6F6";

// 青海波：同心圓一列一列往下畫，後畫的列蓋住前一列，才有魚鱗疊壓的效果。
// 水平週期 = DX，動畫往左平移剛好一個週期，就能無縫循環。
const R = 60;
const DX = 120;
const DY = 30;
const WAVE_WIDTH = 3000; // 夠寬的超寬螢幕也蓋得住(再加一個週期給動畫)
const WAVE_ROWS = 8;

function Seigaiha() {
  const uses: React.ReactNode[] = [];
  for (let row = 0; row < WAVE_ROWS; row++) {
    const y = R * 0.6 + row * DY;
    const off = row % 2 ? DX / 2 : 0;
    for (let x = -DX + off; x < WAVE_WIDTH + DX; x += DX) {
      uses.push(<use key={`${row}-${x}`} href="#hb-scale" x={x} y={y} />);
    }
  }
  return (
    <svg className="hb-waves-svg" width={WAVE_WIDTH + DX} height={R * 0.6 + WAVE_ROWS * DY + R}>
      <defs>
        <g id="hb-scale">
          {[R, R * 0.78, R * 0.56, R * 0.34].map((r, i) => (
            <circle
              key={r}
              r={r}
              fill={i % 2 ? PAPER : SCALE_FILL}
              stroke={i === 0 ? GOLD : MID}
              strokeWidth={i === 0 ? 2.5 : 2}
            />
          ))}
        </g>
      </defs>
      {uses}
    </svg>
  );
}

// 祥雲：幾個圓組成雲身，先畫金色粗描邊再用白色蓋上同形狀，只留外輪廓金線，再加一個漩渦
const CLOUD_BODY = (
  <>
    <circle cx="62" cy="64" r="30" />
    <circle cx="104" cy="48" r="38" />
    <circle cx="148" cy="66" r="26" />
    <rect x="28" y="64" width="150" height="30" rx="15" />
  </>
);

function Cloud({ className }: { className: string }) {
  return (
    <svg className={`hb-cloud ${className}`} viewBox="0 0 200 110">
      <g fill="#fff" stroke={GOLD} strokeWidth="7">{CLOUD_BODY}</g>
      <g fill="#fff">{CLOUD_BODY}</g>
      <path
        d="M92 60 a13 13 0 1 1 13 13 a22 22 0 1 1 22 -22"
        fill="none"
        stroke={GOLD}
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

// 遠山：兩層山稜 + 一座富士山形的主峰(雪頂描金線)，再加一顆淡金色的日
function Mountains() {
  return (
    <svg className="hb-mountains" viewBox="0 0 1440 260" preserveAspectRatio="xMidYMax slice">
      <circle cx="1210" cy="62" r="40" fill="#FCEFC7" opacity="0.75" />
      <path
        d="M0 190 C160 150 300 120 470 150 S760 196 900 170 S1240 120 1440 160 V260 H0 Z"
        fill="#CCD9EE"
        opacity="0.6"
      />
      <path d="M800 260 C900 220 985 150 1036 104 L1094 104 C1145 150 1230 220 1330 260 Z" fill="#AFC4E6" opacity="0.8" />
      <path
        d="M1036 104 L1094 104 C1106 115 1117 125 1128 135 Q1114 128 1104 138 Q1093 126 1081 136 Q1069 124 1058 138 Q1047 126 1035 134 Q1021 128 1003 133 C1014 122 1025 113 1036 104 Z"
        fill="#fff"
        stroke={GOLD}
        strokeWidth="1.5"
        strokeLinejoin="round"
        opacity="0.9"
      />
      <path
        d="M0 236 C140 196 250 186 380 208 S600 246 740 236 S960 214 1080 240 V260 H0 Z"
        fill={MID}
        opacity="0.45"
      />
    </svg>
  );
}

// 封面：詳解、題本、考古題各挑幾本(從多保命主站 assets/images/covers 複製並縮到 239×340)。
// x/y/w/r：桌機位置、寬度、基本傾角；d/delay：漂浮週期與錯開。
// tier：md = 平板以上就顯示(左右各一本)，其餘只在 lg 以上顯示；peek = 手機版從海裡探出頭的兩本。
type Cover = {
  src: string;
  side: "left" | "right";
  x: string;
  y: string;
  w: number;
  r: number;
  d: number;
  delay: number;
  tier?: "md";
  peek?: "left" | "right";
};

const COVERS: Cover[] = [
  { src: "/home-covers/01_explanation.jpg", side: "left", x: "7%", y: "10%", w: 116, r: -8, d: 7, delay: 0, tier: "md" },
  { src: "/home-covers/03_workbook.jpg", side: "left", x: "15%", y: "38%", w: 100, r: 6, d: 8.5, delay: -3 },
  { src: "/home-covers/07_explanation.jpg", side: "left", x: "5%", y: "60%", w: 108, r: -4, d: 7.5, delay: -5, peek: "left" },
  { src: "/home-covers/08_explanation.jpg", side: "right", x: "8%", y: "14%", w: 112, r: 7, d: 8, delay: -2, tier: "md" },
  { src: "/home-covers/10_explanation.jpg", side: "right", x: "15%", y: "42%", w: 104, r: -6, d: 9, delay: -6 },
  { src: "/home-covers/past.jpg", side: "right", x: "5%", y: "62%", w: 108, r: 4, d: 7, delay: -1, peek: "right" },
];

export function HomeBackdrop() {
  return (
    <div className="home-backdrop" aria-hidden="true">
      <Mountains />
      <Cloud className="hb-cloud--a" />
      <Cloud className="hb-cloud--b" />
      <Cloud className="hb-cloud--c" />

      {COVERS.map((c) => (
        <div
          key={c.src}
          className="hb-cover"
          data-tier={c.tier}
          data-peek={c.peek}
          style={
            {
              [c.side]: c.x,
              top: c.y,
              width: c.w,
              "--r": `${c.r}deg`,
              "--d": `${c.d}s`,
              "--delay": `${c.delay}s`,
            } as React.CSSProperties
          }
        >
          <img src={c.src} alt="" width={239} height={340} loading="lazy" decoding="async" />
        </div>
      ))}

      <div className="hb-waves">
        <Seigaiha />
      </div>
    </div>
  );
}
