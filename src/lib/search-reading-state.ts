/** Reading state is local to this browser tab and keyed by the full search URL. */
export interface SearchReadingState {
  y: number;
  open: string[];
  restore: boolean;
}
const KEY = "search:reading:v1";
const LIMIT = 12;

export function searchReadingKey(href: string): string {
  const url = new URL(href, "http://search.local");
  const params = new URLSearchParams(url.search);
  if (params.has("q")) params.set("q", params.get("q")!.trim());
  for (const [key, value] of [...params]) {
    if (!value || (key === "scope" && value === "all") || (key === "result" && value === "all") || (key === "page" && value === "1")) params.delete(key);
  }
  params.sort();
  return `${url.pathname}${params.size ? `?${params}` : ""}`;
}

function read(storage: Pick<Storage, "getItem">): Record<string, SearchReadingState> {
  try {
    const parsed = JSON.parse(storage.getItem(KEY) ?? "{}");
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch { return {}; }
}

export function loadSearchReading(storage: Pick<Storage, "getItem">, href: string): SearchReadingState | null {
  const state = read(storage)[searchReadingKey(href)];
  return state && Number.isFinite(state.y) && state.y >= 0 && Array.isArray(state.open) && state.open.every((id) => typeof id === "string") && typeof state.restore === "boolean" ? state : null;
}

export function saveSearchReading(storage: Pick<Storage, "getItem" | "setItem">, href: string, state: SearchReadingState) {
  try {
    const all = read(storage);
    const key = searchReadingKey(href);
    delete all[key];
    all[key] = state;
    storage.setItem(KEY, JSON.stringify(Object.fromEntries(Object.entries(all).slice(-LIMIT))));
  } catch { /* A blocked/full session store must not prevent searching. */ }
}
