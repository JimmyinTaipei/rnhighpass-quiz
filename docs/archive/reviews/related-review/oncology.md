# related 建議:腫瘤

由 scripts/suggest-related.mjs 產生,只是候選,請審閱後再寫進 frontmatter。

## 乳癌(breast-cancer)

**檢驗**
- tumor-markers 腫瘤標記  _(link×1)_

**藥物**
- antineoplastics 抗腫瘤藥物  _(link×1)_

**生理機轉**
- neoplasia 腫瘤概論  _(link×1)_

```yaml
related:
  lab: [tumor-markers]
  drug: [antineoplastics]
  physiology: [neoplasia]
```

## 癌症總論與癌症護理(cancer)

**檢驗**
- tumor-markers 腫瘤標記  _(link×1)_

**藥物**
- antineoplastics 抗腫瘤藥物  _(link×2)_

**生理機轉**
- neoplasia 腫瘤概論  _(link×3、dz)_

```yaml
related:
  lab: [tumor-markers]
  drug: [antineoplastics]
  physiology: [neoplasia]
```

## 大腸直腸癌與腸造口護理(colorectal-cancer)

**檢驗**
- tumor-markers 腫瘤標記  _(link×1)_

**藥物**
- antineoplastics 抗腫瘤藥物  _(link×1)_

```yaml
related:
  lab: [tumor-markers]
  drug: [antineoplastics]
```

## 婦科癌症(gynecologic-cancers)

**檢驗**
- tumor-markers 腫瘤標記  _(link×1)_

**藥物**
- antineoplastics 抗腫瘤藥物  _(link×1)_

**病原體**
- human-papillomavirus 人類乳突病毒  _(dz)_

**生理機轉**
- neoplasia 腫瘤概論  _(link×1)_

```yaml
related:
  lab: [tumor-markers]
  drug: [antineoplastics]
  pathogen: [human-papillomavirus]
  physiology: [neoplasia]
```

## 頭頸癌(head-neck-cancers)

**病原體**
- herpesviruses 疱疹病毒  _(dz)_

```yaml
related:
  pathogen: [herpesviruses]
```

## 白血病(leukemia)

**檢驗**
- complete-blood-count 全血球計數  _(link×1)_

```yaml
related:
  lab: [complete-blood-count]
```

## 肝癌(liver-cancer)

**檢驗**
- tumor-markers 腫瘤標記  _(link×1)_

**藥物**
- nsaids-acetaminophen 非類固醇抗發炎藥與乙醯胺酚  _(link×1)_

```yaml
related:
  lab: [tumor-markers]
  drug: [nsaids-acetaminophen]
```

## 肺癌(lung-cancer)

**藥物**
- antineoplastics 抗腫瘤藥物  _(link×1)_

```yaml
related:
  drug: [antineoplastics]
```

## 淋巴瘤與多發性骨髓瘤(lymphoma-myeloma)

**檢驗**
- tumor-markers 腫瘤標記  _(link×1)_

**生理機轉**
- neoplasia 腫瘤概論  _(link×1)_

```yaml
related:
  lab: [tumor-markers]
  physiology: [neoplasia]
```

## 兒童癌症(pediatric-cancers)

**生理機轉**
- neoplasia 腫瘤概論  _(link×1)_

```yaml
related:
  physiology: [neoplasia]
```

