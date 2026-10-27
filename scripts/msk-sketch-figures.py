#!/usr/bin/env python3
"""肌骨皮膚 8 張簡易示意圖(AI 底圖的暫代版)

底圖只有線條、不寫字；中文標籤另存 labels JSON(同 ::figure 的做法)。
使用者之後換成 AI 底圖時，labels 沿用、只調座標。清單見 docs/sources/musculoskeletal-skin-images.md

用法：python3 scripts/msk-sketch-figures.py   # 寫入 public/knowledge-images/msk-*.svg 與 labels/msk-*.json
"""
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
IMG = ROOT / "public" / "knowledge-images"
W, H = 800, 450

SKIN = "#7f8c99"      # 身體線條
FILL = "#e9edf1"      # 頭與軀幹
BED = "#c9d3dc"
ACCENT = "#e07a5f"    # 輔具、牽引
BLUE = "#3d7ab8"      # 箭頭
OK = "#2e7d32"
NG = "#c62828"


def svg(body, title):
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">'
        f"<title>{title}</title>"
        f'<rect width="{W}" height="{H}" fill="#ffffff"/>'
        '<defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" '
        f'orient="auto"><path d="M0,0L10,5L0,10z" fill="{BLUE}"/></marker></defs>'
        f"{body}</svg>\n"
    )


def limb(*pts, w=13, c=SKIN):
    d = "M" + " L".join(f"{x},{y}" for x, y in pts)
    return f'<path d="{d}" fill="none" stroke="{c}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round"/>'


def head(x, y, r=17):
    return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{FILL}" stroke="{SKIN}" stroke-width="3"/>'


def trunk(*pts, w=30):
    return limb(*pts, w=w, c="#9aa7b4")


def rect(x, y, w, h, fill=BED, rx=4, stroke="none"):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="2"/>'


def line(x1, y1, x2, y2, c="#555", w=2, dash=""):
    da = f' stroke-dasharray="{dash}"' if dash else ""
    return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{c}" stroke-width="{w}"{da}/>'


def arrow(d):
    return f'<path d="{d}" fill="none" stroke="{BLUE}" stroke-width="3" marker-end="url(#ar)"/>'


def mark(x, y, ok):
    """空心圓標記：綠＝正確，紅＝禁止(文字在標籤裡)"""
    c = OK if ok else NG
    return f'<circle cx="{x}" cy="{y}" r="11" fill="none" stroke="{c}" stroke-width="3"/>'


def divider(x):
    return line(x, 20, x, H - 20, c="#dde3e8", w=2)


def full(s):
    """標籤與圖說裡的括號內都是中文，用全形"""
    return s.replace("(", "（").replace(")", "）")


def lab(i, zh, en, x, y, tx, ty, align=None):
    d = {"id": i, "zh": full(zh), "en": en, "x": round(x / W * 100, 1), "y": round(y / H * 100, 1),
         "tx": round(tx / W * 100, 1), "ty": round(ty / H * 100, 1)}
    if align:
        d["align"] = align
    return d


FIGS = {}

# AI-1 全髖關節置換術後(後側入路)防脫位：3 個禁止＋1 個正確
b = [divider(200), divider(400), divider(600)]
# 1 矮椅彎腰：髖屈曲 > 90 度
b += [rect(30, 352, 70, 14, fill="#b0bec5"), rect(30, 366, 8, 34, fill="#b0bec5"), rect(92, 366, 8, 34, fill="#b0bec5"),
      line(10, 402, 190, 402, c="#cfd8dc", w=3),
      limb((70, 350), (125, 318), (128, 398), (150, 398)),
      trunk((70, 350), (128, 296)), head(150, 300),
      limb((122, 300), (150, 345), (160, 392))]
# 2 坐姿蹺腳(正面)：內收越過中線
b += [rect(245, 330, 110, 14, fill="#b0bec5"), rect(250, 344, 8, 56, fill="#b0bec5"), rect(342, 344, 8, 56, fill="#b0bec5"),
      line(210, 402, 390, 402, c="#cfd8dc", w=3),
      trunk((300, 320), (300, 222)), head(300, 196),
      limb((282, 232), (262, 290), (268, 330)), limb((318, 232), (338, 290), (332, 330)),
      limb((312, 324), (314, 362), (316, 398)),
      limb((288, 324), (322, 344), (342, 384), w=14)]
# 3 站立：右腳腳尖向內(內旋)
b += [line(410, 402, 590, 402, c="#cfd8dc", w=3),
      trunk((500, 300), (500, 192)), head(500, 166),
      limb((482, 202), (466, 256), (462, 300)), limb((518, 202), (534, 256), (538, 300)),
      limb((488, 300), (478, 350), (478, 396), (500, 400), w=14),
      limb((512, 300), (520, 350), (522, 396), (542, 396), w=14),
      arrow("M455,350 C450,330 470,318 482,330")]
# 4 仰臥(由上往下看)：兩腿外展、中間放外展枕
b += [rect(615, 150, 170, 270, fill=BED, rx=10),
      head(700, 182), trunk((700, 208), (700, 300)),
      limb((684, 214), (662, 262), (656, 300)), limb((716, 214), (738, 262), (744, 300)),
      limb((690, 302), (668, 360), (656, 404)), limb((710, 302), (732, 360), (744, 404)),
      '<path d="M700,318 L668,398 L732,398 Z" fill="#ffe0b2" stroke="#e0a060" stroke-width="2"/>',
      ]
FIGS["msk-tha-precautions"] = (
    svg("".join(b), "全髖關節置換術後防脫位姿勢示意"),
    "全髖關節置換術後(後側入路)防脫位：坐矮椅彎腰、蹺腳內收、腳尖向內是禁止動作；平躺時兩腿外展、中間放外展枕",
    [
        lab("flexion", "✕ 髖屈曲 > 90 度", "Hip flexion > 90°", 72, 348, 100, 70),
        lab("low-chair", "坐矮椅、彎腰撿東西", "Low chair, bending", 128, 300, 100, 110),
        lab("adduction", "✕ 內收：蹺腳", "Adduction", 312, 340, 300, 70),
        lab("rotation", "✕ 內旋：腳尖向內", "Internal rotation", 480, 398, 500, 70),
        lab("abduction", "✓ 外展、腳尖朝上", "Abduction, neutral", 724, 345, 700, 70),
        lab("pillow", "外展枕", "Abduction pillow", 700, 380, 700, 120),
    ],
)

# AI-2 燒傷抗攣縮擺位(仰臥，由上往下看)
b = [rect(150, 40, 500, 380, fill=BED, rx=14),
     rect(330, 96, 140, 16, fill="#ffe0b2", rx=8),            # 肩下毛巾捲
     head(400, 74, 22), trunk((400, 104), (400, 250), w=56),
     rect(150, 104, 112, 26, fill="#d7ccc8", rx=6), rect(538, 104, 112, 26, fill="#d7ccc8", rx=6),   # 臂板
     limb((372, 116), (300, 117), (210, 117)), limb((428, 116), (500, 117), (590, 117)),
     rect(176, 108, 34, 18, fill=ACCENT, rx=4), rect(590, 108, 34, 18, fill=ACCENT, rx=4),           # 腕副木
     limb((386, 252), (370, 330), (362, 398), w=16), limb((414, 252), (430, 330), (438, 398), w=16),
     rect(356, 300, 28, 50, fill=ACCENT, rx=4), rect(416, 300, 28, 50, fill=ACCENT, rx=4),           # 膝副木
     rect(346, 396, 34, 12, fill=ACCENT, rx=3), rect(420, 396, 34, 12, fill=ACCENT, rx=3)]          # 垂足板
FIGS["msk-burn-positioning"] = (
    svg("".join(b), "燒傷抗攣縮姿位示意"),
    "燒傷抗攣縮姿位(仰臥由上往下看)：頸部伸展不睡枕頭、肩外展、肘與膝伸直、腕與膝用副木、踝背屈",
    [
        lab("neck", "頸部伸展、不睡枕頭(肩下毛巾捲)", "Neck extension", 400, 104, 470, 30, "start"),
        lab("shoulder", "肩外展 90–110°", "Shoulder abduction", 300, 117, 230, 170, "end"),
        lab("elbow", "肘伸直", "Elbow extension", 520, 117, 560, 170, "start"),
        lab("wrist", "腕伸展(副木)", "Wrist splint", 607, 117, 660, 70, "start"),
        lab("hip", "髖伸直、中立(屈曲 0 度)", "Hip extension", 386, 262, 250, 262, "end"),
        lab("knee", "膝伸直、膝下不墊枕(膝副木)", "Knee splint", 430, 325, 560, 320, "start"),
        lab("ankle", "踝背屈(垂足板)、足跟不受壓", "Ankle dorsiflexion", 437, 402, 560, 400, "start"),
    ],
)

# AI-3 勃克式牽引(側面)
b = [rect(40, 268, 600, 24, fill=BED, rx=4), rect(40, 292, 10, 110, fill="#b0bec5"), rect(630, 292, 10, 110, fill="#b0bec5"),
     rect(646, 150, 10, 252, fill="#b0bec5"),                               # 床尾架
     line(20, 404, 780, 404, c="#cfd8dc", w=3),
     head(90, 246, 20), trunk((112, 252), (300, 254), w=34),
     limb((150, 250), (230, 238)),                                          # 手臂
     limb((300, 256), (420, 260), (548, 250)),                              # 患側下肢(腳跟離床)
     limb((300, 262), (430, 264), (540, 264), c="#a9b4bf"),                # 健側平放
     rect(440, 238, 104, 22, fill="#90caf9", rx=6),                        # 泡棉腿套
     line(552, 232, 552, 268, c="#455a64", w=5),                            # 撐板
     line(552, 250, 651, 250, c="#6d4c41", w=3),                            # 繩
     '<circle cx="651" cy="250" r="12" fill="#ffffff" stroke="#455a64" stroke-width="4"/>',
     line(663, 250, 663, 330, c="#6d4c41", w=3),
     rect(651, 330, 24, 40, fill="#616161", rx=3),                          # 重錘
     arrow("M470,222 H600")]
FIGS["msk-bucks-traction"] = (
    svg("".join(b), "勃克式牽引示意"),
    "勃克式牽引(側面)：泡棉腿套包住小腿，繩子經床尾滑輪、拉力與骨長軸平行，重錘懸空",
    [
        lab("boot", "泡棉腿套(皮膚牽引)", "Foam boot (skin traction)", 490, 238, 440, 190, "end"),
        lab("direction", "拉力方向與骨長軸平行", "Pull along the bone axis", 600, 222, 600, 150),
        lab("pulley", "滑輪：繩子在溝內", "Pulley", 651, 250, 780, 110, "end"),
        lab("weight", "重錘懸空、不碰地不碰床", "Weight hangs free", 663, 350, 600, 430, "end"),
        lab("heel", "腳跟懸空防壓傷", "Heel off the bed", 548, 256, 520, 330, "end"),
        lab("counter", "體重形成反牽引", "Counter-traction", 200, 262, 200, 330),
    ],
)

# AI-4 九法則(成人正面、背面)
def figure(cx, front):
    t = "#ffcc80" if front else "#a5d6a7"
    return "".join([
        f'<circle cx="{cx}" cy="70" r="30" fill="#90caf9" stroke="#607d8b" stroke-width="2"/>',
        rect(cx - 12, 96, 24, 14, fill="#90caf9", rx=2),
        rect(cx - 52, 110, 104, 150, fill=t, rx=12, stroke="#607d8b"),
        rect(cx - 86, 114, 30, 150, fill="#ce93d8", rx=14, stroke="#607d8b"),
        rect(cx + 56, 114, 30, 150, fill="#ce93d8", rx=14, stroke="#607d8b"),
        rect(cx - 50, 262, 46, 160, fill="#80cbc4", rx=16, stroke="#607d8b"),
        rect(cx + 4, 262, 46, 160, fill="#80cbc4", rx=16, stroke="#607d8b"),
        f'<circle cx="{cx}" cy="266" r="7" fill="#ef9a9a" stroke="#607d8b" stroke-width="1.5"/>' if front else "",
    ])


b = [figure(230, True), figure(570, False), divider(400)]
FIGS["msk-rule-of-nines"] = (
    svg("".join(b), "成人九法則示意"),
    "成人九法則(左正面、右背面)：頭頸 9%、單側上肢 9%、軀幹前面 18%、軀幹後面 18%、單側下肢 18%、會陰 1%",
    [
        lab("head", "頭頸 9%", "Head and neck 9%", 230, 70, 130, 40, "end"),
        lab("arm", "單側上肢 9%", "Each arm 9%", 159, 190, 125, 140, "end"),
        lab("front", "軀幹前面 18%", "Anterior trunk 18%", 230, 180, 310, 40, "start"),
        lab("perineum", "會陰 1%", "Perineum 1%", 230, 266, 330, 262, "start"),
        lab("leg", "單側下肢 18%", "Each leg 18%", 207, 360, 140, 410, "end"),
        lab("back", "軀幹後面 18%(含臀)", "Posterior trunk 18%", 570, 180, 640, 40, "start"),
        lab("hand", "手掌含手指約 1%", "Palm about 1%", 655, 260, 650, 330, "start"),
    ],
)

# AI-5 帕米利克吊帶(嬰兒仰臥，由上往下看)
b = [rect(200, 30, 400, 400, fill="#f5f7f9", rx=20),
     head(400, 90, 34), trunk((400, 124), (400, 250), w=70),
     limb((370, 150), (330, 200), (322, 240)), limb((430, 150), (470, 200), (478, 240)),
     rect(352, 252, 96, 30, fill="#ffffff", rx=10, stroke="#b0bec5"),                       # 尿布
     limb((380, 268), (300, 300), (330, 372), w=16), limb((420, 268), (500, 300), (470, 372), w=16),  # 蛙腿
     rect(354, 150, 92, 18, fill=ACCENT, rx=6),                                             # 胸帶
     line(372, 130, 366, 152, c=ACCENT, w=7), line(428, 130, 434, 152, c=ACCENT, w=7),     # 肩帶
     rect(312, 346, 34, 36, fill=ACCENT, rx=8), rect(454, 346, 34, 36, fill=ACCENT, rx=8),  # 腳蹬
     line(372, 166, 330, 348, c="#c06040", w=4), line(428, 166, 470, 348, c="#c06040", w=4),            # 前帶
     line(360, 166, 312, 370, c="#c06040", w=4, dash="8 6"), line(440, 166, 488, 370, c="#c06040", w=4, dash="8 6")]  # 後帶
FIGS["msk-pavlik-harness"] = (
    svg("".join(b), "帕米利克吊帶示意"),
    "帕米利克吊帶(嬰兒仰臥由上往下看)：胸帶、肩帶與腳蹬，前帶與後帶讓髖維持屈曲約 90–100 度並外展(蛙腿姿勢)",
    [
        lab("chest", "胸帶", "Chest strap", 446, 159, 560, 150, "start"),
        lab("shoulder", "肩帶", "Shoulder strap", 430, 138, 560, 100, "start"),
        lab("anterior", "前帶(實線)", "Anterior strap", 350, 255, 240, 230, "end"),
        lab("posterior", "後帶(虛線)", "Posterior strap", 476, 320, 560, 290, "start"),
        lab("stirrup", "腳蹬", "Stirrup", 329, 364, 240, 380, "end"),
        lab("position", "屈髖 90–100°＋外展", "Hip flexion 90–100° with abduction", 500, 300, 560, 410, "start"),
    ],
)

# AI-6 脊柱側彎：站立背面、前彎試驗
b = [divider(400),
     # 站立背面
     head(200, 70, 26),
     '<path d="M140,112 Q200,100 268,104 L262,250 Q250,262 238,270 L250,300 L150,300 L162,272 Q148,256 140,240 Z" fill="#e9edf1" stroke="#7f8c99" stroke-width="3"/>',
     '<path d="M200,108 C226,150 228,175 200,205 C176,232 178,262 202,296" fill="none" stroke="#c06040" stroke-width="5" stroke-linecap="round"/>',
     '<path d="M212,128 Q244,124 248,160 Q236,178 214,168 Z" fill="#cfd8dc" stroke="#7f8c99" stroke-width="2"/>',  # 右肩胛突出
     line(138, 112, 270, 102, c=BLUE, w=2, dash="6 5"),
     line(150, 300, 250, 292, c=BLUE, w=2, dash="6 5"),
     limb((140, 116), (118, 210), (112, 286)), limb((268, 108), (286, 200), (292, 280)),
     limb((172, 300), (168, 420), w=18), limb((228, 296), (232, 420), w=18),
     # 前彎試驗(由背後看，上身前彎 90 度)
     '<path d="M470,250 C480,170 540,150 600,150 C660,150 720,170 730,250 Z" fill="#e9edf1" stroke="#7f8c99" stroke-width="3"/>',
     '<path d="M600,150 C640,124 690,150 712,200" fill="none" stroke="#c06040" stroke-width="5" stroke-linecap="round"/>',
     line(470, 196, 730, 196, c=BLUE, w=2, dash="6 5"),
     limb((520, 250), (514, 420), w=18), limb((680, 250), (686, 420), w=18),
     limb((560, 220), (590, 330)), limb((640, 220), (610, 330))]
FIGS["msk-scoliosis-adams"] = (
    svg("".join(b), "脊柱側彎與前彎試驗示意"),
    "脊柱側彎：左為站立背面(兩肩不等高、肩胛骨一側突出、腰線不對稱)，右為前彎試驗由背後看到單側肋骨隆起",
    [
        lab("shoulder", "兩肩不等高", "Uneven shoulders", 262, 104, 330, 60, "start"),
        lab("scapula", "肩胛骨一側突出", "Prominent scapula", 240, 150, 330, 140, "start"),
        lab("curve", "脊柱側彎合併旋轉", "Spinal curve", 222, 175, 330, 210, "start"),
        lab("waist", "腰線不對稱、骨盆傾斜", "Uneven waist and pelvis", 152, 270, 60, 330, "end"),
        lab("adams", "前彎 90 度：單側肋骨隆起", "Adams test: rib hump", 680, 160, 600, 60),
    ],
)

# AI-7 Barlow 與 Ortolani(由腳端看嬰兒，髖膝屈曲 90 度)
def hips(cx, inward):
    s = [rect(cx - 90, 250, 180, 70, fill="#e9edf1", rx=30, stroke=SKIN),          # 骨盆與臀部
         limb((cx - 50, 280), (cx - 60, 150), w=26), limb((cx + 50, 280), (cx + 60, 150), w=26),  # 屈曲的大腿(朝上)
         head(cx - 60, 140, 16), head(cx + 60, 140, 16),                              # 膝
         '<ellipse cx="%d" cy="210" rx="16" ry="26" fill="#ffccbc" stroke="#a1887f" stroke-width="2"/>' % (cx - 78),
         '<ellipse cx="%d" cy="210" rx="16" ry="26" fill="#ffccbc" stroke="#a1887f" stroke-width="2"/>' % (cx + 78)]
    if inward:
        s += [arrow(f"M{cx-110},190 H{cx-80}"), arrow(f"M{cx+110},190 H{cx+80}"),
              arrow(f"M{cx},170 V230")]
    else:
        s += [arrow(f"M{cx-70},190 H{cx-120}"), arrow(f"M{cx+70},190 H{cx+120}"),
              arrow(f"M{cx},240 V180")]
    return "".join(s)


b = [hips(200, True), hips(600, False), divider(400)]
FIGS["msk-barlow-ortolani"] = (
    svg("".join(b), "Barlow 與 Ortolani 手法示意"),
    "發展性髖關節發育不良的新生兒檢查(由腳端看，髖膝屈曲 90 度)：左 Barlow 內收往後壓，右 Ortolani 外展並把大轉子往前抬",
    [
        lab("barlow", "Barlow：內收＋往後下壓", "Barlow: adduct and push back", 200, 190, 200, 50),
        lab("barlow-pos", "陽性：股骨頭滑出髖臼", "Positive: hip dislocates", 200, 300, 200, 400),
        lab("ortolani", "Ortolani：外展＋大轉子往前抬", "Ortolani: abduct and lift", 600, 190, 600, 50),
        lab("ortolani-pos", "陽性：喀嗒聲、股骨頭復位", "Positive: clunk, hip reduces", 600, 300, 600, 400),
        lab("hand", "手指在大轉子", "Fingers on greater trochanter", 678, 210, 700, 300, "start"),
    ],
)

# AI-8 骨科檢查四格
b = [divider(400), line(20, 225, 780, 225, c="#dde3e8", w=2)]
# Thomas：仰臥，一側膝抱胸，對側大腿抬離床面
b += [rect(30, 160, 340, 14, fill=BED, rx=3),
      head(60, 140), trunk((80, 146), (190, 150), w=26),
      limb((190, 148), (150, 100), (196, 110)),
      limb((110, 140), (160, 104)),
      limb((190, 152), (270, 134), (350, 150), w=14),
      arrow("M270,150 V132")]
# Phalen：兩手背相貼、腕屈曲、手指朝下
b += [limb((480, 60), (560, 96)), limb((720, 60), (640, 96)),
      '<path d="M560,92 Q598,96 598,130 L598,190 Q588,200 578,188 L570,128 Z" fill="#e9edf1" stroke="#7f8c99" stroke-width="3"/>',
      '<path d="M640,92 Q602,96 602,130 L602,190 Q612,200 622,188 L630,128 Z" fill="#e9edf1" stroke="#7f8c99" stroke-width="3"/>']
# Tinel：前臂掌面朝上，敲腕部正中神經
b += [limb((40, 340), (250, 340), w=34), '<ellipse cx="300" cy="340" rx="52" ry="30" fill="#e9edf1" stroke="#7f8c99" stroke-width="3"/>',
      line(80, 340, 300, 340, c="#ffb300", w=3, dash="7 5"),
      limb((236, 270), (240, 312), w=10, c="#a1887f"), arrow("M262,282 L246,312")]
# 前抽屜：仰臥屈膝 90 度、腳平放，把脛骨往前拉
b += [rect(420, 400, 350, 14, fill=BED, rx=3),
      trunk((440, 390), (560, 390), w=26),
      limb((560, 392), (640, 300), (700, 396), w=14),
      head(700, 400, 0) if False else "",
      '<ellipse cx="660" cy="320" rx="18" ry="13" fill="#ffccbc" stroke="#a1887f" stroke-width="2"/>',
      '<ellipse cx="680" cy="346" rx="18" ry="13" fill="#ffccbc" stroke="#a1887f" stroke-width="2"/>',
      arrow("M690,330 L740,312")]
FIGS["msk-exam-tests"] = (
    svg("".join(b), "骨科身體檢查四格示意"),
    "骨科身體檢查：左上 Thomas 試驗、右上 Phalen 試驗、左下 Tinel 徵象、右下前抽屜試驗",
    [
        lab("thomas", "Thomas：對側大腿抬離床面", "Thomas test", 270, 140, 200, 40),
        lab("phalen", "Phalen：手背相貼、腕屈曲 60 秒", "Phalen test", 600, 140, 600, 214),
        lab("tinel", "Tinel：敲腕部正中神經", "Tinel sign", 262, 330, 200, 420),
        lab("drawer", "前抽屜：屈膝 90 度往前拉脛骨", "Anterior drawer test", 700, 320, 590, 262),
    ],
)


def main():
    (IMG / "labels").mkdir(exist_ok=True)
    for name, (text, desc, labels) in FIGS.items():
        (IMG / f"{name}.svg").write_text(text, encoding="utf-8")
        data = {"image": f"{name}.svg", "_說明": f"{full(desc)}；簡易示意圖，之後換成 AI 底圖時沿用標籤、只調座標", "labels": labels}
        (IMG / "labels" / f"{name}.json").write_text(json.dumps(data, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
        print(name, len(labels))


if __name__ == "__main__":
    main()
