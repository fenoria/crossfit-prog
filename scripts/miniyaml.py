#!/usr/bin/env python3
"""Parseur YAML minimal, sans dépendance externe.

Le repo n'installe volontairement aucune dépendance Python (lint-prog.py lit
déjà ses fichiers à la main). Ce module couvre le sous-ensemble utilisé par
knowledge/ et athletes/ :

- mappings imbriqués par indentation
- listes de scalaires et listes de mappings (« - clé: valeur »)
- flow inline : {a: 1, b: x} et [a, b]
- scalaires bloc : > et | (avec chomping - / +)
- commentaires de ligne et commentaires de fin de ligne hors guillemets
- scalaires typés : int, float, bool, null

Limite connue : un « # » à l'intérieur d'un scalaire bloc est traité comme un
commentaire. Ne pas en mettre dans les fichiers du corpus.
"""

from __future__ import annotations

import re
from pathlib import Path
from typing import Any

_KEY = re.compile(r'^((?:"[^"]*")|(?:\'[^\']*\')|(?:[^:]+?)):(?:\s+(.*))?$')
_BLOCK = re.compile(r"^[|>][-+]?$")


def _strip_comment(line: str) -> str:
    out: list[str] = []
    quote: str | None = None
    prev = ""
    for ch in line:
        if quote:
            out.append(ch)
            if ch == quote:
                quote = None
        elif ch in "\"'":
            quote = ch
            out.append(ch)
        elif ch == "#" and (prev in ("", " ", "\t")):
            break
        else:
            out.append(ch)
        prev = ch
    return "".join(out).rstrip()


def _scalar(raw: str) -> Any:
    text = raw.strip()
    if not text:
        return None
    if len(text) >= 2 and text[0] == text[-1] and text[0] in "\"'":
        return text[1:-1]
    low = text.lower()
    if low in ("null", "~"):
        return None
    if low == "true":
        return True
    if low == "false":
        return False
    if re.fullmatch(r"[-+]?\d+", text):
        return int(text)
    if re.fullmatch(r"[-+]?\d*\.\d+", text):
        return float(text)
    return text


def _split_flow(body: str) -> list[str]:
    parts: list[str] = []
    depth = 0
    quote: str | None = None
    current: list[str] = []
    for ch in body:
        if quote:
            current.append(ch)
            if ch == quote:
                quote = None
            continue
        if ch in "\"'":
            quote = ch
            current.append(ch)
        elif ch in "{[":
            depth += 1
            current.append(ch)
        elif ch in "}]":
            depth -= 1
            current.append(ch)
        elif ch == "," and depth == 0:
            parts.append("".join(current))
            current = []
        else:
            current.append(ch)
    if current:
        parts.append("".join(current))
    return [p.strip() for p in parts if p.strip()]


def _flow(text: str) -> Any:
    text = text.strip()
    if text.startswith("{"):
        result: dict[str, Any] = {}
        for item in _split_flow(text[1:-1]):
            m = _KEY.match(item)
            if m:
                result[_scalar(m.group(1))] = _flow(m.group(2) or "")
            else:
                result[_scalar(item)] = None
        return result
    if text.startswith("["):
        return [_flow(item) for item in _split_flow(text[1:-1])]
    return _scalar(text)


class _Reader:
    def __init__(self, text: str) -> None:
        self.raw = text.splitlines()
        self.lines: list[tuple[int, str, int]] = []  # (indent, content, raw index)
        for idx, line in enumerate(self.raw):
            stripped = _strip_comment(line)
            if not stripped.strip() or stripped.strip() in ("---", "..."):
                continue
            indent = len(stripped) - len(stripped.lstrip(" "))
            self.lines.append((indent, stripped.strip(), idx))
        self.pos = 0

    def peek(self) -> tuple[int, str, int] | None:
        return self.lines[self.pos] if self.pos < len(self.lines) else None

    def block_scalar(self, raw_index: int, indent: int, fold: bool) -> str:
        chunks: list[str] = []
        i = raw_index + 1
        while i < len(self.raw):
            line = self.raw[i]
            if line.strip():
                line_indent = len(line) - len(line.lstrip(" "))
                if line_indent <= indent:
                    break
                chunks.append(line.strip())
            else:
                chunks.append("")
            i += 1
        # avancer le curseur logique au-delà des lignes consommées
        while self.pos < len(self.lines) and self.lines[self.pos][2] < i:
            self.pos += 1
        if fold:
            folded: list[str] = []
            for chunk in chunks:
                if not chunk:
                    folded.append("\n")
                elif folded and folded[-1] not in ("", "\n"):
                    folded[-1] = folded[-1] + " " + chunk
                else:
                    folded.append(chunk)
            return " ".join(part for part in folded if part.strip()).strip()
        return "\n".join(chunks).strip()

    def parse(self, indent: int) -> Any:
        head = self.peek()
        if head is None or head[0] < indent:
            return None
        if head[1].startswith("- "):
            return self._parse_list(indent)
        return self._parse_map(indent)

    def _parse_list(self, indent: int) -> list[Any]:
        items: list[Any] = []
        while True:
            head = self.peek()
            if head is None or head[0] != indent or not head[1].startswith("- "):
                break
            _, content, raw_index = head
            self.pos += 1
            body = content[2:].strip()
            match = _KEY.match(body)
            if match and not body.startswith(("{", "[")):
                item: dict[str, Any] = {}
                key = _scalar(match.group(1))
                value = (match.group(2) or "").strip()
                item[key] = self._value(value, indent + 2, raw_index)
                nested = self.peek()
                if nested and nested[0] > indent:
                    more = self._parse_map(nested[0])
                    if isinstance(more, dict):
                        item.update(more)
                items.append(item)
            else:
                items.append(self._value(body, indent + 2, raw_index))
        return items

    def _parse_map(self, indent: int) -> Any:
        result: dict[str, Any] = {}
        while True:
            head = self.peek()
            if head is None or head[0] < indent:
                break
            if head[0] > indent:  # indentation inattendue : on ignore la ligne
                self.pos += 1
                continue
            _, content, raw_index = head
            if content.startswith("- "):
                break
            match = _KEY.match(content)
            if not match:
                self.pos += 1
                continue
            self.pos += 1
            key = _scalar(match.group(1))
            value = (match.group(2) or "").strip()
            result[key] = self._value(value, indent, raw_index)
        return result

    def _value(self, value: str, indent: int, raw_index: int) -> Any:
        if _BLOCK.match(value):
            return self.block_scalar(raw_index, indent, fold=value[0] == ">")
        if value.startswith(("{", "[")):
            return _flow(value)
        if value:
            return _scalar(value)
        nested = self.peek()
        if nested and nested[0] > indent:
            return self.parse(nested[0])
        return None


def loads(text: str) -> Any:
    return _Reader(text).parse(0)


def load(path: str | Path) -> Any:
    return loads(Path(path).read_text(encoding="utf-8"))


if __name__ == "__main__":
    import json
    import sys

    for target in sys.argv[1:]:
        print(f"--- {target}")
        print(json.dumps(load(target), ensure_ascii=False, indent=2))
