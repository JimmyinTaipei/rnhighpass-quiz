// 由 scripts/build-knowledge.mjs 產生,請勿手改。
import type { KnowledgeArticle } from "@/lib/knowledge/types";

export const ARTICLE_LOADERS: Record<string, () => Promise<KnowledgeArticle>> = {
  "diabetes": () => import("./articles/diabetes.json").then((m) => m.default as unknown as KnowledgeArticle),
  "alpha-glucosidase-inhibitors": () => import("./articles/alpha-glucosidase-inhibitors.json").then((m) => m.default as unknown as KnowledgeArticle),
  "dpp4-inhibitors": () => import("./articles/dpp4-inhibitors.json").then((m) => m.default as unknown as KnowledgeArticle),
  "glp1-receptor-agonists": () => import("./articles/glp1-receptor-agonists.json").then((m) => m.default as unknown as KnowledgeArticle),
  "insulin": () => import("./articles/insulin.json").then((m) => m.default as unknown as KnowledgeArticle),
  "meglitinides": () => import("./articles/meglitinides.json").then((m) => m.default as unknown as KnowledgeArticle),
  "metformin": () => import("./articles/metformin.json").then((m) => m.default as unknown as KnowledgeArticle),
  "sglt2-inhibitors": () => import("./articles/sglt2-inhibitors.json").then((m) => m.default as unknown as KnowledgeArticle),
  "sulfonylureas": () => import("./articles/sulfonylureas.json").then((m) => m.default as unknown as KnowledgeArticle),
  "tzd": () => import("./articles/tzd.json").then((m) => m.default as unknown as KnowledgeArticle),
  "abg": () => import("./articles/abg.json").then((m) => m.default as unknown as KnowledgeArticle),
  "blood-glucose": () => import("./articles/blood-glucose.json").then((m) => m.default as unknown as KnowledgeArticle),
  "hba1c": () => import("./articles/hba1c.json").then((m) => m.default as unknown as KnowledgeArticle),
  "ketones": () => import("./articles/ketones.json").then((m) => m.default as unknown as KnowledgeArticle),
  "ogtt": () => import("./articles/ogtt.json").then((m) => m.default as unknown as KnowledgeArticle),
  "uacr": () => import("./articles/uacr.json").then((m) => m.default as unknown as KnowledgeArticle),
  "glucose-homeostasis": () => import("./articles/glucose-homeostasis.json").then((m) => m.default as unknown as KnowledgeArticle),
};
