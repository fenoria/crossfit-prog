#!/usr/bin/env python3
"""Extract text from books/ into knowledge/raw/ for methodology analysis."""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BOOKS = ROOT / "books"
OUT = ROOT / "knowledge" / "raw"

KEYWORDS = re.compile(
    r"periodiz|mesocycle|microcycle|deload|volume|intensit|block|"
    r"hypertrophy|strength|power|olympic|snatch|clean|jerk|"
    r"gymnastic|muscle.?up|handstand|conditioning|aerobic|anaerobic|"
    r"VO2|alactic|glycolytic|recovery|taper|peaking|fatigue|RPE|"
    r"adductor|injury|transfer|special strength|landmine|MRV|MAV|"
    r"périodis|volume|intensité|récupér|force|puissance|haltéro|"
    r"gymnast|endurance|affûtage|surcharge|deload",
    re.I,
)


def slugify(name: str) -> str:
    s = Path(name).stem
    s = re.sub(r"[^\w\s\-]+", "", s, flags=re.U)
    s = re.sub(r"\s+", "-", s.strip()).lower()
    return s[:80] or "book"


def extract_pdf(path: Path) -> str:
    from pypdf import PdfReader

    reader = PdfReader(str(path))
    parts: list[str] = []
    for i, page in enumerate(reader.pages):
        try:
            text = page.extract_text() or ""
        except Exception:
            text = ""
        if text.strip():
            parts.append(f"\n\n--- PAGE {i + 1} ---\n{text}")
    return "\n".join(parts)


def extract_epub(path: Path) -> str:
    from ebooklib import epub, ITEM_DOCUMENT
    from bs4 import BeautifulSoup, XMLParsedAsHTMLWarning
    import warnings
    warnings.filterwarnings("ignore", category=XMLParsedAsHTMLWarning)

    book = epub.read_epub(str(path))
    parts: list[str] = []
    for i, item in enumerate(book.get_items_of_type(ITEM_DOCUMENT)):
        soup = BeautifulSoup(item.get_content(), "lxml")
        text = soup.get_text("\n", strip=True)
        if text.strip():
            parts.append(f"\n\n--- DOC {i + 1} ({item.get_name()}) ---\n{text}")
    return "\n".join(parts)


def extract_highlights(full: str, max_chars: int = 120_000) -> str:
    """Keep TOC-ish head + keyword-rich windows for analysis."""
    head = full[:40_000]
    windows: list[str] = []
    for m in KEYWORDS.finditer(full):
        start = max(0, m.start() - 400)
        end = min(len(full), m.end() + 800)
        windows.append(full[start:end])
        if sum(len(w) for w in windows) > max_chars:
            break
    # dedupe overlapping roughly
    merged = head + "\n\n===== KEYWORD HITS =====\n\n"
    seen = set()
    for w in windows:
        key = w[:120]
        if key in seen:
            continue
        seen.add(key)
        merged += w + "\n\n---\n\n"
        if len(merged) > max_chars:
            break
    return merged[:max_chars]


def main() -> int:
    OUT.mkdir(parents=True, exist_ok=True)
    files = sorted(
        [p for p in BOOKS.iterdir() if p.suffix.lower() in {".pdf", ".epub"}]
    )
    if not files:
        print("No books found", file=sys.stderr)
        return 1

    for path in files:
        slug = slugify(path.name)
        print(f"Extracting {path.name} -> {slug} ...")
        try:
            if path.suffix.lower() == ".pdf":
                full = extract_pdf(path)
            else:
                full = extract_epub(path)
        except Exception as e:
            print(f"  FAIL: {e}", file=sys.stderr)
            continue

        full_path = OUT / f"{slug}.full.txt"
        hi_path = OUT / f"{slug}.highlights.txt"
        full_path.write_text(full, encoding="utf-8", errors="replace")
        hi_path.write_text(extract_highlights(full), encoding="utf-8", errors="replace")
        print(f"  {len(full):,} chars full; highlights {hi_path.stat().st_size:,} bytes")

    print("Done.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
