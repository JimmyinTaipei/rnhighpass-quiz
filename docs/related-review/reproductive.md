# related 建議:生殖系統(含產科)

由 scripts/suggest-related.mjs 產生,只是候選,請審閱後再寫進 frontmatter。

## 周產期感染(perinatal-infections)

**藥物**
- antifungals 抗黴菌藥物  _(link×1、dz)_
- protein-synthesis-inhibitors 四環黴素、巨環類與其他蛋白質合成抑制劑  _(link×1)_

**病原體**
- herpesviruses 疱疹病毒  _(link×1)_
- protozoa 原蟲  _(link×1)_
- streptococci 鏈球菌  _(link×1)_
- candida 念珠菌  _(dz)_
- staphylococcus-aureus 金黃色葡萄球菌  _(dz)_

```yaml
related:
  drug: [antifungals, protein-synthesis-inhibitors]
  pathogen: [herpesviruses, protozoa, streptococci, candida, staphylococcus-aureus]
```

## 性傳染病(sexually-transmitted-infections)

**藥物**
- antiparasitics 抗寄生蟲藥物  _(link×1)_

**病原體**
- human-papillomavirus 人類乳突病毒  _(link×2、dz)_
- atypical-bacteria 特殊病原菌  _(link×1、dz)_
- candida 念珠菌  _(link×1)_
- herpesviruses 疱疹病毒  _(link×1)_
- protozoa 原蟲  _(link×1)_

```yaml
related:
  drug: [antiparasitics]
  pathogen: [human-papillomavirus, atypical-bacteria, candida, herpesviruses, protozoa]
```

