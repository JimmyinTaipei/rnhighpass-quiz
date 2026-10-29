"""依 scores.json 把頁尾考題搬進段落：目標段落自己的內文最後加 ::questions{ids=...}，
頁尾 ids 清單移除、question-map 頁尾欄位加 excluded，頁尾標題改「綜合考題」"""
import json, re, sys, glob, os, collections
ROOT = sys.argv[1]; S = sys.argv[2]  # 工作目錄(放 questions.json 與 scores.json，用完可刪)
sc = json.load(open(f'{S}/scores.json'))
qmap_p = f'{ROOT}/src/data/knowledge/question-map.json'
qmap = json.load(open(qmap_p))
slots = json.load(open(f'{ROOT}/src/data/knowledge/question-slots.json'))
def ids_for(k):
    v = qmap.get(k, {}); s = next((x for x in slots if x['qkey'] == k), {})
    out = list(dict.fromkeys((s.get('ids') or []) + v.get('pinned', []) + v.get('auto', [])))
    ex = set(v.get('excluded', [])); return [i for i in out if i not in ex]
files = {os.path.splitext(os.path.basename(p))[0]: p for p in glob.glob(f'{ROOT}/content/knowledge/*/*.md')}
HEAD = re.compile(r'^(#{2,3})\s+(.*?)\s*\{#([^}]+)\}\s*$')

# 段落已有的題目(不要重複放)
existing = collections.defaultdict(set)  # 頁內任一段落已有的題目
for k in set(qmap) | {x['qkey'] for x in slots}:
    slug, sec = k.split('#'); sec = sec.split('~')[0]
    if sec != 'questions': existing[slug] |= set(ids_for(k))

by_slug = collections.defaultdict(lambda: collections.defaultdict(list))
moved = collections.defaultdict(set)
for k, d in sc.items():
    slug = k.split('#')[0]
    for qid, v in d.items():
        if not v['target']: continue
        moved[slug].add(qid)
        if qid in existing[slug]: continue
        if qid not in by_slug[slug][v['target']]: by_slug[slug][v['target']].append(qid)

stats = collections.Counter(); emptied = []
for slug in sorted(moved):
    p = files[slug]; lines = open(p).read().split('\n')
    # 1. 插入：從後往前，避免行號位移
    heads = [(i, HEAD.match(l)) for i, l in enumerate(lines) if HEAD.match(l)]
    inserts = []
    for idx, (i, m) in enumerate(heads):
        sid = m.group(3)
        if sid in by_slug[slug]:
            end = heads[idx + 1][0] if idx + 1 < len(heads) else len(lines)
            # 往前跳過空行
            j = end
            while j > i + 1 and lines[j - 1].strip() == '': j -= 1
            inserts.append((j, by_slug[slug][sid]))
    for j, qids in sorted(inserts, reverse=True):
        lines[j:j] = ['', f'::questions{{ids="{",".join(qids)}"}}']
        stats['inserted_q'] += len(qids); stats['inserted_blocks'] += 1
    # 2. 頁尾：改標題、ids 清單移除
    text = '\n'.join(lines)
    text = re.sub(r'^## 相關考題 \{#questions\}', '## 綜合考題 {#questions}', text, flags=re.M)
    qi = text.index('{#questions}')
    tail = text[qi:]
    def fix(mo):
        ids = [x for x in mo.group(2).split(',') if x and x not in moved[slug]]
        rest = (mo.group(1) + mo.group(3)).strip()
        if not ids and not re.search(r'\b(tag|adm|keyword|drug|group)=', rest):
            return '\x00'  # 沒有其他規則：整行刪除
        return f'::questions{{{mo.group(1)}ids="{",".join(ids)}"{mo.group(3)}}}' if ids else f'::questions{{{(mo.group(1)+mo.group(3)).strip()}}}'
    tail = re.sub(r'::questions\{([^}]*?)ids="([^"]*)"([^}]*)\}', fix, tail)
    tail = re.sub(r'\n*\x00\n?', '\n', tail)
    text = text[:qi] + tail
    open(p, 'w').write(text)
    # 3. question-map 頁尾欄位 excluded
    for k in qmap:
        if k.split('#')[0] == slug and k.split('#')[1].split('~')[0] == 'questions':
            ex = qmap[k].get('excluded', [])
            add = [q for q in ids_for(k) if q in moved[slug]]
            if add: qmap[k]['excluded'] = ex + [q for q in add if q not in ex]
            stats['excluded'] += len(add)
json.dump(qmap, open(qmap_p, 'w'), ensure_ascii=False, indent=2); open(qmap_p, 'a').write('\n')
print(dict(stats), len(moved), 'pages')
