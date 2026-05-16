import { parse } from "node-html-parser";
import type { TocEntry } from "./types.js";

export function extractToc(html: string): TocEntry[] {
  if (!html) return [];
  let root;
  try { root = parse(html); } catch { return []; }
  const entries: TocEntry[] = [];
  const seen = new Map<string, number>();
  root.querySelectorAll("h2, h3").forEach((el) => {
    const text = el.text.trim();
    if (!text) return;
    const base = `h-${text}`;
    const count = (seen.get(base) ?? 0) + 1;
    seen.set(base, count);
    const id = count === 1 ? base : `${base}-${count}`;
    entries.push({ id, text, level: el.tagName === "H2" ? 2 : 3 });
  });
  return entries;
}
