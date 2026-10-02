# related 建議:心臟血管系統

由 scripts/suggest-related.mjs 產生,只是候選,請審閱後再寫進 frontmatter。

## 冠狀動脈疾病：心絞痛與心肌梗塞(coronary-artery-disease)

**檢驗**
- cardiac-catheterization 心導管檢查與治療  _(link×2、dz)_
- ecg 12 導程心電圖判讀  _(link×2、dz)_
- cardiac-biomarkers 心肌生化標記(心肌酵素)  _(link×1、dz)_
- echocardiography 心臟超音波  _(link×1、dz)_
- lipid-profile 血脂檢查  _(link×1、dz)_

**藥物**
- antiplatelets 抗血小板藥  _(link×2、dz)_
- calcium-channel-blockers 鈣離子通道阻斷劑  _(link×2、dz)_
- nitrates 硝酸鹽類  _(link×2、dz)_
- thrombolytics 血栓溶解劑  _(link×2、dz)_
- anticoagulants 抗凝血劑  _(link×1、dz)_
- beta-blockers β 阻斷劑  _(link×1、dz)_
- statins Statin 類降血脂藥  _(link×1、dz)_
- ace-inhibitors ACE 抑制劑  _(link×1)_
- arb 血管張力素 II 受體阻斷劑  _(link×1)_

**生理機轉**
- coronary-circulation 冠狀動脈循環與心肌氧供需  _(link×1)_

```yaml
related:
  lab: [cardiac-catheterization, ecg, cardiac-biomarkers, echocardiography, lipid-profile]
  drug: [antiplatelets, calcium-channel-blockers, nitrates, thrombolytics, anticoagulants, beta-blockers, statins, ace-inhibitors, arb]
  physiology: [coronary-circulation]
```

## 心衰竭(heart-failure)

**檢驗**
- echocardiography 心臟超音波  _(link×2、dz)_
- bnp B 型利鈉胜肽  _(link×1、dz)_
- abg 動脈血氣分析  _(link×1)_
- cardiac-biomarkers 心肌生化標記(心肌酵素)  _(link×1)_
- cardiac-catheterization 心導管檢查與治療  _(link×1)_
- ecg 12 導程心電圖判讀  _(link×1)_
- potassium 血清鉀  _(link×1)_

**藥物**
- digoxin 毛地黃  _(link×4、dz)_
- inotropes 強心劑與升壓劑  _(link×2、dz)_
- loop-diuretics 亨利氏環利尿劑  _(link×2、dz)_
- nitrates 硝酸鹽類  _(link×1、dz)_
- thiazide-diuretics Thiazide 類利尿劑  _(link×1、dz)_
- ace-inhibitors ACE 抑制劑  _(dz)_
- arb 血管張力素 II 受體阻斷劑  _(dz)_
- arni 血管收縮素受體-腦啡肽酶抑制劑  _(dz)_
- beta-blockers β 阻斷劑  _(dz)_
- direct-vasodilators 直接血管擴張劑  _(dz)_
- potassium-sparing-diuretics 保鉀利尿劑  _(dz)_
- sglt2-inhibitors SGLT2 抑制劑  _(dz)_

**生理機轉**
- cardiac-output 心臟功能與心輸出量  _(link×2)_

```yaml
related:
  lab: [echocardiography, bnp, abg, cardiac-biomarkers, cardiac-catheterization, ecg, potassium]
  drug: [digoxin, inotropes, loop-diuretics, nitrates, thiazide-diuretics, ace-inhibitors, arb, arni, beta-blockers, direct-vasodilators, potassium-sparing-diuretics, sglt2-inhibitors]
  physiology: [cardiac-output]
```

## 高血壓(hypertension)

**檢驗**
- uacr 尿液白蛋白/肌酸酐比值  _(link×3)_
- ecg 12 導程心電圖判讀  _(link×2)_
- echocardiography 心臟超音波  _(link×2)_
- hba1c 糖化血色素  _(link×2)_
- lipid-profile 血脂檢查  _(link×2)_
- potassium 血清鉀  _(link×2)_
- blood-glucose 血糖  _(link×1)_

**藥物**
- direct-vasodilators 直接血管擴張劑  _(link×2、dz)_
- ace-inhibitors ACE 抑制劑  _(link×1、dz)_
- alpha-blockers α1 阻斷劑  _(link×1、dz)_
- arb 血管張力素 II 受體阻斷劑  _(link×1、dz)_
- beta-blockers β 阻斷劑  _(link×1、dz)_
- calcium-channel-blockers 鈣離子通道阻斷劑  _(link×1、dz)_
- central-alpha2-agonists 中樞 α2 致效劑  _(link×1、dz)_
- potassium-sparing-diuretics 保鉀利尿劑  _(link×1、dz)_
- thiazide-diuretics Thiazide 類利尿劑  _(link×1、dz)_
- loop-diuretics 亨利氏環利尿劑  _(link×1)_

**生理機轉**
- blood-pressure-regulation 血壓的生理調控  _(link×2)_

```yaml
related:
  lab: [uacr, ecg, echocardiography, hba1c, lipid-profile, potassium, blood-glucose]
  drug: [direct-vasodilators, ace-inhibitors, alpha-blockers, arb, beta-blockers, calcium-channel-blockers, central-alpha2-agonists, potassium-sparing-diuretics, thiazide-diuretics, loop-diuretics]
  physiology: [blood-pressure-regulation]
```

## 低血壓(hypotension)

**藥物**
- inotropes 強心劑與升壓劑  _(link×1、dz)_
- ace-inhibitors ACE 抑制劑  _(link×1)_
- alpha-blockers α1 阻斷劑  _(link×1)_
- nitrates 硝酸鹽類  _(link×1)_

**生理機轉**
- blood-pressure-regulation 血壓的生理調控  _(link×1)_

```yaml
related:
  drug: [inotropes, ace-inhibitors, alpha-blockers, nitrates]
  physiology: [blood-pressure-regulation]
```

## 感染性心內膜炎與心臟發炎疾病(infective-endocarditis)

**檢驗**
- culture-and-sensitivity 微生物培養與感受性試驗  _(link×1)_
- echocardiography 心臟超音波  _(link×1)_

**藥物**
- digoxin 毛地黃  _(link×1)_
- glycopeptides 醣胜肽類與其他抗 MRSA 藥物  _(link×1)_
- nsaids-acetaminophen 非類固醇抗發炎藥與乙醯胺酚  _(link×1)_

**病原體**
- streptococci 鏈球菌  _(link×2、dz)_
- staphylococcus-aureus 金黃色葡萄球菌  _(link×1、dz)_
- gram-positive-bacteria 革蘭氏陽性菌  _(link×1)_

```yaml
related:
  lab: [culture-and-sensitivity, echocardiography]
  drug: [digoxin, glycopeptides, nsaids-acetaminophen]
  pathogen: [streptococci, staphylococcus-aureus, gram-positive-bacteria]
```

