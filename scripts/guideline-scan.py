#!/usr/bin/env python3
"""指引追蹤掃描：列出每個指引被哪些知識頁引用、引用年份，配合 docs/guideline-watchlist.md 使用

用法(在 rnhighpass-quiz/)：python3 scripts/guideline-scan.py
"""
import collections
import pathlib
import re

CONTENT = pathlib.Path(__file__).resolve().parent.parent / "content" / "knowledge"
G={
"ADA Standards of Care":r"ADA\b|Standards of Care|糖尿病臨床照護指引|DAROC|糖尿病學會",
"高血糖危象 (DKA/HHS)":r"高血糖危象|Hyperglycemic Crises",
"GOLD COPD":r"GOLD",
"GINA 氣喘":r"GINA",
"AHA CPR/ECC (BLS/ACLS/PALS/NRP)":r"CPR|ECC|ACLS|PALS|NRP|ILCOR|心肺復甦",
"AHA/ACC 高血壓":r"高血壓指引|Blood Pressure|高血壓治療指引|ESH|台灣高血壓",
"急性冠心症 ACS":r"急性冠心症|Acute Coronary|STEMI|NSTE",
"心衰竭 (ESC/AHA/TSOC)":r"心衰竭指引|Heart Failure|heart failure|HFpEF|心衰竭藥物治療共識|心臟衰竭診斷",
"心房顫動":r"Atrial Fibrillation|心房顫動指引|ACCP/HRS",
"血脂":r"血脂異常治療指引|Cholesterol|Dyslipid|血脂指引",
"中風 AHA/ASA":r"AHA／ASA|AHA/ASA|Stroke|中風指引",
"KDIGO 腎臟":r"KDIGO|KDOQI",
"Surviving Sepsis":r"Surviving Sepsis|SSC\b|敗血症指引",
"ACOG/產科":r"ACOG|SMFM|FIGO|WHO recommendations",
"骨質疏鬆":r"骨質疏鬆症學會|骨質疏鬆症防治|BHOF|NOF\b|IOF\b",
"肝病 AASLD/EASL":r"AASLD|EASL|肝炎指引|肝癌指引",
"ACG 腸胃":r"ACG\b",
"壓傷 NPIAP":r"NPIAP|NPUAP|EPUAP",
"結核病診治指引":r"結核病診治指引",
"疾管署 預防接種時程":r"預防接種|疫苗接種時程|接種時程",
"疾管署 感染管制/法定傳染病":r"疾管署",
"國健署 篩檢/補助":r"國健署|癌症篩檢|成人預防保健",
"NCCN/癌症":r"NCCN|ASCO",
"ILAE 癲癇":r"ILAE",
"BTS 氧氣/胸膜":r"BTS\b",
"WHO 生長/其他":r"WHO",
"AAP 兒科":r"AAP\b",
"NICE":r"NICE\b",
"Beers 老人用藥":r"Beers",
"USPSTF":r"USPSTF",
"健保給付規定":r"健保給付|給付規定",
"長照 2.0":r"長照 ?2\.0|長期照顧",
"死因統計":r"死因統計|十大死因",
"DSM-5-TR":r"DSM",
"ATS/IDSA 肺炎":r"IDSA|CAP 指引|社區型肺炎指引",
"輸血":r"輸血指引|AABB",
}
pages=[p for p in CONTENT.rglob('*.md') if p.name!='README.md' and '_templates' not in p.parts]
for name,rx in G.items():
    hits=collections.Counter(); yrs=collections.Counter()
    for p in pages:
        t=p.read_text(encoding="utf-8")
        ms=list(re.finditer(rx,t))
        if ms:
            hits[p.stem]=len(ms)
            for m in ms:
                ctx=t[max(0,m.start()-30):m.end()+40]
                for y in re.findall(r"20[0-2]\d",ctx): yrs[y]+=1
    if hits:
        print(f"## {name}: {len(hits)} 篇；年份 {dict(sorted(yrs.items()))}")
        print("   ", " ".join(s for s,_ in hits.most_common(14)))
