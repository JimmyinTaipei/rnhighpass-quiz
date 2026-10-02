# related 建議:呼吸系統

由 scripts/suggest-related.mjs 產生,只是候選,請審閱後再寫進 frontmatter。

## 兒童呼吸道與耳鼻喉感染(pediatric-respiratory-infections)

**病原體**
- rna-viruses RNA 病毒  _(link×1、dz)_
- streptococci 鏈球菌  _(link×1、dz)_

```yaml
related:
  pathogen: [rna-viruses, streptococci]
```

## 肺炎(pneumonia)

**檢驗**
- culture-and-sensitivity 微生物培養與感受性試驗  _(link×1)_
- inflammatory-markers 發炎指標  _(link×1)_

**藥物**
- beta-lactams β-內醯胺類抗生素  _(link×1)_
- fluoroquinolones-sulfonamides 奎諾酮類、磺胺類與其他抗菌藥  _(link×1)_
- glycopeptides 醣胜肽類與其他抗 MRSA 藥物  _(link×1)_
- protein-synthesis-inhibitors 四環黴素、巨環類與其他蛋白質合成抑制劑  _(link×1)_

**病原體**
- streptococci 鏈球菌  _(link×1、dz)_
- atypical-bacteria 特殊病原菌  _(link×1)_
- fungi 真菌  _(link×1)_
- gram-negative-bacteria 革蘭氏陰性菌  _(link×1)_

```yaml
related:
  lab: [culture-and-sensitivity, inflammatory-markers]
  drug: [beta-lactams, fluoroquinolones-sulfonamides, glycopeptides, protein-synthesis-inhibitors]
  pathogen: [streptococci, atypical-bacteria, fungi, gram-negative-bacteria]
```

## 結核病(tuberculosis)

**檢驗**
- culture-and-sensitivity 微生物培養與感受性試驗  _(link×1)_

**藥物**
- antituberculars 抗結核藥物  _(link×1、dz)_

```yaml
related:
  lab: [culture-and-sensitivity]
  drug: [antituberculars]
```

