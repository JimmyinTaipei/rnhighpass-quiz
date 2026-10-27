# related 建議:感染

由 scripts/suggest-related.mjs 產生,只是候選,請審閱後再寫進 frontmatter。

## 兒童傳染病(childhood-infectious-diseases)

**藥物**
- antivirals 抗病毒藥物  _(dz)_

**病原體**
- herpesviruses 疱疹病毒  _(link×2、dz)_
- streptococci 鏈球菌  _(link×2、dz)_
- clostridium-botulinum-tetani 肉毒桿菌與破傷風桿菌  _(link×1)_
- dna-viruses DNA 病毒  _(link×1)_
- gram-negative-bacteria 革蘭氏陰性菌  _(link×1)_
- gram-positive-bacteria 革蘭氏陽性菌  _(link×1)_
- rna-viruses RNA 病毒  _(link×1)_

**生理機轉**
- microbial-pathogenesis 微生物總論與致病機轉  _(link×1)_

```yaml
related:
  drug: [antivirals]
  pathogen: [herpesviruses, streptococci, clostridium-botulinum-tetani, dna-viruses, gram-negative-bacteria, gram-positive-bacteria, rna-viruses]
  physiology: [microbial-pathogenesis]
```

## 愛滋病毒感染與愛滋病(hiv-aids)

**藥物**
- antifungals 抗黴菌藥物  _(link×1、dz)_
- antivirals 抗病毒藥物  _(link×2)_
- antiparasitics 抗寄生蟲藥物  _(link×1)_
- antituberculars 抗結核藥物  _(link×1)_
- fluoroquinolones-sulfonamides 奎諾酮類、磺胺類與其他抗菌藥  _(link×1)_

**病原體**
- fungi 真菌  _(dz)_

**生理機轉**
- microbial-pathogenesis 微生物總論與致病機轉  _(link×1)_

```yaml
related:
  drug: [antifungals, antivirals, antiparasitics, antituberculars, fluoroquinolones-sulfonamides]
  pathogen: [fungi]
  physiology: [microbial-pathogenesis]
```

## 感染性腹瀉與食物中毒(infectious-diarrhea)

**病原體**
- clostridium-botulinum-tetani 肉毒桿菌與破傷風桿菌  _(link×1、dz)_
- gram-negative-bacteria 革蘭氏陰性菌  _(link×1、dz)_
- anaerobes 厭氧菌  _(link×1)_
- protozoa 原蟲  _(link×1)_
- rna-viruses RNA 病毒  _(link×1)_
- staphylococcus-aureus 金黃色葡萄球菌  _(dz)_

```yaml
related:
  pathogen: [clostridium-botulinum-tetani, gram-negative-bacteria, anaerobes, protozoa, rna-viruses, staphylococcus-aureus]
```

## 呼吸道病毒感染(respiratory-viral-infections)

**藥物**
- antivirals 抗病毒藥物  _(link×3、dz)_

**病原體**
- dna-viruses DNA 病毒  _(link×1)_
- rna-viruses RNA 病毒  _(link×1)_

```yaml
related:
  drug: [antivirals]
  pathogen: [dna-viruses, rna-viruses]
```

## 敗血症與敗血性休克(sepsis)

**檢驗**
- culture-and-sensitivity 微生物培養與感受性試驗  _(link×2)_
- inflammatory-markers 發炎指標  _(link×2)_
- abg 動脈血氣分析  _(link×1)_

**藥物**
- antibiotics-overview 抗生素總論  _(link×1)_
- inotropes 強心劑與升壓劑  _(link×1)_

**病原體**
- gram-negative-bacteria 革蘭氏陰性菌  _(link×1)_
- staphylococcus-aureus 金黃色葡萄球菌  _(link×1)_

**生理機轉**
- microbial-pathogenesis 微生物總論與致病機轉  _(link×1)_

```yaml
related:
  lab: [culture-and-sensitivity, inflammatory-markers, abg]
  drug: [antibiotics-overview, inotropes]
  pathogen: [gram-negative-bacteria, staphylococcus-aureus]
  physiology: [microbial-pathogenesis]
```

## 病媒傳染病與人畜共通傳染病(vector-borne-zoonotic)

**病原體**
- atypical-bacteria 特殊病原菌  _(link×1)_
- gram-negative-bacteria 革蘭氏陰性菌  _(link×1)_
- gram-positive-bacteria 革蘭氏陽性菌  _(link×1)_
- helminths-ectoparasites 蠕蟲與體外寄生蟲  _(link×1)_
- protozoa 原蟲  _(link×1)_
- rna-viruses RNA 病毒  _(link×1)_

```yaml
related:
  pathogen: [atypical-bacteria, gram-negative-bacteria, gram-positive-bacteria, helminths-ectoparasites, protozoa, rna-viruses]
```

