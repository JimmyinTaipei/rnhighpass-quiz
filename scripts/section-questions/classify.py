"""把各頁頁尾「相關考題」的題目，依文字重疊打分，分配到該頁的段落(H2/H3)。
輸出 scores.json：{qkey: {qid: {"target": 段落 id 或 None(留在綜合考題), "reason", "t1", "t2", "cands"}}}"""
# 用法(在 rnhighpass-quiz/)：
#   1. database/.venv/bin/python scripts/section-questions/export_questions.py <工作目錄>
#   2. python3 scripts/section-questions/classify.py $PWD <工作目錄>   → scores.json(可先抽查)
#   3. python3 scripts/section-questions/apply.py $PWD <工作目錄>      → 改 content/knowledge 與 question-map.json
#   4. node scripts/build-knowledge.mjs
# 2026-10-29 第一次執行：6336 題中 4261 題分進段落(插入 3568 題，其餘段落原本就有)
import json, re, math, sys, glob, os, collections
ROOT = sys.argv[1]; S = sys.argv[2]  # 工作目錄(放 questions.json 與 scores.json，用完可刪)
Q = {q['id']: q for q in json.load(open(os.path.join(S, 'questions.json')))}
qmap = json.load(open(f'{ROOT}/src/data/knowledge/question-map.json'))
slots = {s['qkey']: s for s in json.load(open(f'{ROOT}/src/data/knowledge/question-slots.json'))}
def ids_for(k):
    v = qmap.get(k, {}); s = slots.get(k, {})
    out = list(dict.fromkeys((s.get('ids') or []) + v.get('pinned', []) + v.get('auto', [])))
    ex = set(v.get('excluded', [])); return [i for i in out if i not in ex]

HEAD = re.compile(r'^(#{2,3})\s+(.*?)\s*\{#([^}]+)\}\s*$')
SKIP = {'summary', 'exam-points', 'questions', 'references', 'see-also'}
def strip(t):
    t = re.sub(r'\(來源[:：][^)]*\)|（來源[:：][^）]*）', '', t)
    t = re.sub(r'https?://\S+', '', t)
    t = re.sub(r'\[\[([^\]|#]*)[^\]]*\]\]', r'\1', t)
    t = re.sub(r'::questions\{[^}]*\}', '', t)
    return t
def toks(t):
    t = t.lower()
    out = []
    for run in re.findall(r'[一-鿿]+', t):
        out += [run[i:i+2] for i in range(len(run)-1)]
    out += [w for w in re.findall(r'[a-z][a-z0-9\-]{1,}', t) if w not in {'the','and','of','in','to'}]
    return out

def sections(path):
    secs = []; cur = None; in_fm = False; lines = open(path).read().split('\n')
    # skip frontmatter
    i = 0
    if lines and lines[0] == '---':
        i = lines.index('---', 1) + 1
    for ln in lines[i:]:
        m = HEAD.match(ln)
        if m:
            cur = {'depth': len(m.group(1)), 'title': m.group(2), 'id': m.group(3), 'text': ''}
            secs.append(cur); continue
        if cur: cur['text'] += ln + '\n'
    return secs

files = {os.path.splitext(os.path.basename(p))[0]: p for p in glob.glob(f'{ROOT}/content/knowledge/*/*.md')}
result = {}; stats = collections.Counter()
for k in qmap:
    slug, sec = k.split('#'); 
    if sec.split('~')[0] != 'questions': continue
    path = files.get(slug)
    if not path: continue
    secs = [s for s in sections(path) if s['id'] not in SKIP and not re.search(r'常見錯誤|易混淆|相關(疾病|腫瘤|頁面)?$|^延伸|考題', s['title'])]
    if not secs: continue
    # 父段落：H3 的文字也算進 H2(H2 分數＝自身＋子段落)，但標題各算各的
    parent = {}; last2 = None
    for s in secs:
        if s['depth'] == 2: last2 = s
        else: parent[s['id']] = last2['id'] if last2 else None
    docs = {}
    for s in secs:
        body = toks(strip(s['text'])); title = toks(s['title'])
        docs[s['id']] = (collections.Counter(body), set(title))
    for s in secs:  # H2 加上子段落內文
        if s['depth'] == 2:
            for c in secs:
                if parent.get(c['id']) == s['id']:
                    docs[s['id']][0].update(docs[c['id']][0])
    N = len(docs)
    df = collections.Counter()
    for b, t in docs.values():
        for w in set(b) | t: df[w] += 1
    res = {}
    for qid in ids_for(k):
        q = Q.get(qid)
        if not q: continue
        def score(text):
            qtok = set(toks(strip(text))); scores = {}
            for sid, (b, t) in docs.items():
                sc = 0.0
                for w in qtok:
                    if df[w] == 0 or df[w] == N and N > 1: continue
                    idf = math.log((N + 1) / df[w])
                    if w in t: sc += 3 * idf
                    if b[w]: sc += idf * (1 + math.log(b[w])) * 0.5
                scores[sid] = sc
            return scores
        full = ' '.join(str(q[f] or '') for f in ['stem','option_a','option_b','option_c','option_d','key_point'])
        scores = score(full)
        ranked = sorted(scores.items(), key=lambda x: -x[1])
        top, t1 = ranked[0]
        # H2 勝出但子段落分數接近 → 放進子段落(較精確)
        kids = sorted([(c, scores[c]) for c, p in parent.items() if p == top], key=lambda x: -x[1])
        if kids and kids[0][1] >= 0.7 * t1: top = kids[0][0]
        group = lambda sid: parent.get(sid) or sid
        others = [v for sid, v in ranked if group(sid) != group(top)]
        t2 = others[0] if others else 0
        # 選項各自最像哪一段：分散到 3 個以上不同 H2 → 綜合
        optgroups = set()
        for f in ['option_a','option_b','option_c','option_d']:
            o = score(str(q[f] or ''))
            best = max(o.items(), key=lambda x: x[1])
            if best[1] >= 4: optgroups.add(group(best[0]))
        reason = None
        titlehit = bool(docs[top][1] & set(toks(strip(full))))
        if t1 < 12: reason = 'low'
        elif not titlehit and t1 < 25: reason = 'notitle'
        elif t1 - t2 < max(4, 0.25 * t1): reason = 'close'
        elif len(optgroups) >= 3: reason = 'spread'
        res[qid] = {'target': None if reason else top, 'reason': reason, 't1': round(t1,1), 't2': round(t2,1),
                    'cands': [(s, round(v, 1)) for s, v in ranked[:3]], 'opt': sorted(optgroups)}
    result[k] = res
json.dump(result, open(os.path.join(S, 'scores.json'), 'w'), ensure_ascii=False, indent=1)
print(len(result), sum(len(v) for v in result.values()))
