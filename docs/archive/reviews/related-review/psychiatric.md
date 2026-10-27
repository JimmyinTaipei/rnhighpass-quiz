# related 建議:精神疾病

由 scripts/suggest-related.mjs 產生,只是候選,請審閱後再寫進 frontmatter。

## 雙相情緒障礙症(bipolar-disorder)

**檢驗**
- lithium-level 血中鋰濃度  _(dz)_

**藥物**
- mood-stabilizers 情緒穩定劑  _(link×2、dz)_
- antipsychotics 抗精神病藥物  _(dz)_

**生理機轉**
- neurotransmitters-psychiatry 精神疾病的神經傳導物質與腦區  _(link×1、dz)_

```yaml
related:
  lab: [lithium-level]
  drug: [mood-stabilizers, antipsychotics]
  physiology: [neurotransmitters-psychiatry]
```

## 憂鬱症(depressive-disorder)

**藥物**
- antidepressants 抗憂鬱藥物  _(link×2、dz)_

**生理機轉**
- neurotransmitters-psychiatry 精神疾病的神經傳導物質與腦區  _(link×1、dz)_

```yaml
related:
  drug: [antidepressants]
  physiology: [neurotransmitters-psychiatry]
```

## 思覺失調症(schizophrenia)

**藥物**
- antipsychotics 抗精神病藥物  _(link×2、dz)_

**生理機轉**
- neurotransmitters-psychiatry 精神疾病的神經傳導物質與腦區  _(link×1、dz)_

```yaml
related:
  drug: [antipsychotics]
  physiology: [neurotransmitters-psychiatry]
```

