#!/usr/bin/env python3
"""Génère les données des dashboards prog/analytics/ depuis le journal.

Entrées  : athletes/<id>/journal/S*.yaml (SoT du réalisé, schéma v3), profile.yaml,
           knowledge/instances/saison-*.yaml (calendrier), athletes/<id>/constats.yaml (texte).
Sortie   : .vitepress/theme/analytics/data.json (lu par les composants An*.vue).

Aucun chiffre n'est inventé : champ absent ou null = point absent du graphe.
Usage    : npm run build:analytics
"""

from __future__ import annotations

import json
import re
import sys
from datetime import date, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(Path(__file__).resolve().parent))
import miniyaml  # noqa: E402

OUT = ROOT / ".vitepress" / "theme" / "analytics" / "data.json"

MESO_LABELS = {
    "benchmarks": "Benchmarks",
    "ACC-GYM": "Accumulation gym",
    "REAL": "Expression Fire",
    "TRANS": "Transition",
    "ACC-STR": "Accumulation force",
    "TRA-POW": "Conversion puissance",
    "TRA-MIX": "Conversion mixed",
}
PHASES = [
    {"id": "m1", "label": "Macro 1 · Build → Fire", "color": "s1"},
    {"id": "m2", "label": "Macro 2 · Élévation", "color": "s2"},
    {"id": "m3", "label": "Macro 3 · Accumulation gym", "color": "s3"},
    {"id": "tr", "label": "Transition", "color": "s5"},
    {"id": "op", "label": "Prépa Open · Open", "color": "s4"},
]
MACRO_PHASE = {"macro_1_build": "m1", "macro_2_elevation": "m2", "macro_3_accumulation_gym": "m3"}

# Mouvements suivis : (id, libellé, clé du profil pour la référence pré-blessure ou None)
LIFTS = [
    ("back_squat", "Back squat", "back_squat"),
    ("front_squat", "Front squat", "front_squat"),
    ("deadlift", "Soulevé de terre", "deadlift"),
    ("romanian_deadlift", "Soulevé de terre roumain", None),
    ("strict_press", "Strict press", None),
    ("weighted_pullup", "Traction lestée", None),
    ("power_snatch", "Arraché puissance", None),
    ("power_clean", "Épaulé puissance", None),
    ("snatch_pull", "Tirage arraché", None),
]
VOLUMES = [
    ("force_lower_sets", "Force bas du corps", "séries dures", "force_lower"),
    ("force_upper_sets", "Force haut du corps", "séries dures", "force_upper"),
    ("oly_lifts", "Haltéro", "levées de qualité", "oly"),
    ("z2_min", "Zone 2", "minutes", "z2"),
]
SHORT = {"benchmarks": "TEST", "ACC-GYM": "GYM", "REAL": "FIRE", "TRANS": "TRANS",
         "ACC-STR": "FORCE", "TRA-POW": "PUISS", "TRA-MIX": "MIX"}

# Table RPE → %1RM (Tuchscherer) : % du 1RM pour n répétitions maximales (n = reps + reps en réserve).
RM_TABLE = {1: 1.0, 2: 0.955, 3: 0.922, 4: 0.892, 5: 0.863, 6: 0.837, 7: 0.811, 8: 0.786, 9: 0.762,
            10: 0.739, 11: 0.707, 12: 0.68}
PAUSE_FACTOR = 1.07  # un front squat pausé (2 s) se soulève ~5–10 % moins lourd : e1RM ramené au geste sans pause
BODYWEIGHT_LIFTS = {"weighted_pullup"}  # le % s'applique à (poids de corps + lest)

ZONES = [("epaule", "Épaule"), ("adducteur", "Adducteur"), ("mains", "Mains")]
GESTES = [("bmu", "BMU"), ("hsw", "HSW"), ("rmu", "RMU"), ("hspu", "HSPU")]


def pct_1rm(n: float) -> float:
    """% du 1RM pour n reps max (interpolé ; au-delà de 12 on plafonne, donc e1RM prudent)."""
    n = min(max(n, 1.0), 12.0)
    lo, hi = int(n), min(int(n) + 1, 12)
    return RM_TABLE[lo] + (RM_TABLE[hi] - RM_TABLE[lo]) * (n - lo)


def parse_serie(serie: str) -> tuple[int, int] | None:
    """« 5×3 » → (5 séries, 3 reps) ; « 1 » → (1, 1)."""
    m = re.fullmatch(r"\s*(\d+)\s*[×x]\s*(\d+)\s*", serie or "")
    if m:
        return int(m.group(1)), int(m.group(2))
    return (1, int(serie)) if re.fullmatch(r"\s*\d+\s*", serie or "") else None


def e1rm(kg: float, reps: int | None, rpe: float | None, bodyweight: float = 0.0) -> float | None:
    if reps is None or rpe is None:
        return None
    total = kg + bodyweight
    return total / pct_1rm(reps + (10 - rpe)) - bodyweight


def d(s: str) -> date:
    return date.fromisoformat(str(s)[:10])


def num(v):
    return v if isinstance(v, (int, float)) and not isinstance(v, bool) else None


def active_athlete() -> str:
    return (miniyaml.load(ROOT / "athletes" / "current.yaml") or {}).get("id", "")


def load_instance() -> dict:
    for f in sorted((ROOT / "knowledge" / "instances").glob("saison-*.yaml")):
        data = miniyaml.load(f) or {}
        if data.get("status") == "active":
            return data
    raise SystemExit("aucune instance de saison active dans knowledge/instances/")


def build_weeks(instance: dict, journals: dict[int, dict], today: date) -> list[dict]:
    macros = instance.get("macrocycles") or {}
    start = d(macros["macro_1_build"]["fenetre"].split("→")[0].strip())
    trans_end = d(macros["transition"]["fenetre"].split("→")[1].strip())
    open_week = [d(w["fait_box"]) for w in instance["echeance_suivante"]["workouts"]]
    open_start = open_week[0] - timedelta(days=open_week[0].weekday())
    open_end = open_start + timedelta(weeks=len({x - timedelta(days=x.weekday()) for x in open_week}))

    meso_of: dict[str, tuple[str, str]] = {}
    for key, macro in macros.items():
        for code, sems in (macro.get("mesos") or {}).items():
            for s in sems:
                meso_of[s] = (key, code)

    n_weeks = ((open_end - start).days) // 7
    weeks = []
    for i in range(n_weeks):
        n = i + 1
        sid = f"S{n:02d}"
        monday = start + timedelta(weeks=i)
        if sid in meso_of:
            key, code = meso_of[sid]
            phase, meso = MACRO_PHASE.get(key, "tr"), MESO_LABELS.get(code, code)
            if key == "macro_1_build" and code == "TRANS":
                meso = "Transition mini"
            short = SHORT.get(code, code)
        elif monday <= trans_end:
            phase, meso, short = "tr", "Décharge fin d'année", "DECH"
        elif monday < open_start:
            phase, meso, short = "op", "Prépa Open", "OPEN"
        else:
            phase, meso, short = "op", "Open", "OPEN"
        j = journals.get(n, {})
        statut = j.get("statut")
        current = monday <= today < monday + timedelta(days=7)
        weeks.append({
            "n": n, "id": sid, "start": monday.isoformat(),
            "phase": phase, "meso": meso, "short": short,
            "phase_micro": j.get("phase_micro"),
            "done": statut == "close",
            "current": current,
        })
    return weeks


def main() -> int:
    athlete = active_athlete()
    adir = ROOT / "athletes" / athlete
    profile = miniyaml.load(adir / "profile.yaml") or {}
    instance = load_instance()
    today = date.today()

    journals: dict[int, dict] = {}
    for f in sorted((adir / "journal").glob("S*.yaml")):
        data = miniyaml.load(f) or {}
        try:
            journals[int(f.name[1:3])] = data
        except ValueError:
            continue

    weeks = build_weeks(instance, journals, today)
    # Index de la dernière semaine qui a un réalisé (fait ou en cours)
    with_data = [w["n"] for w in weeks if w["done"] or (w["current"] and journals.get(w["n"], {}).get("series"))]
    last = max(with_data) if with_data else 1

    # ── charges ────────────────────────────────────────────────
    pre = profile.get("prs_pre_injury_kg") or {}
    bodyweight = num(profile.get("weight_kg")) or 0.0
    lifts = []
    for mvt, label, pre_key in LIFTS:
        bw = bodyweight if mvt in BODYWEIGHT_LIFTS else 0.0
        points = []
        for n in sorted(journals):
            if n > last:
                continue
            for row in journals[n].get("series") or []:
                if row.get("mvt") != mvt or num(row.get("kg")) is None:
                    continue
                parsed = parse_serie(row.get("serie") or "")
                sets, reps = parsed if parsed else (None, None)
                rpe = num(row.get("rpe"))
                est = e1rm(row["kg"], reps, rpe, bw)
                pause = bool(row.get("pause"))
                if pause and est is not None:
                    est *= PAUSE_FACTOR
                points.append({
                    "w": n - 1, "kg": row["kg"], "rpe": rpe,
                    "type": row.get("type", "travail"), "serie": row.get("serie") or "",
                    "sets": sets, "reps": reps,
                    "e1rm": round(est, 1) if est is not None else None,
                    "tonnage": round(sets * reps * row["kg"]) if parsed else None,
                    "note": row.get("note") or "", "comble": row.get("comble") or [], "pause": pause,
                })
        if len({p["w"] for p in points}) < 2:
            continue
        # Un point par semaine : le meilleur e1RM (à défaut la charge la plus haute).
        best: dict[int, dict] = {}
        for p in points:
            key = p["e1rm"] if p["e1rm"] is not None else -1
            cur = best.get(p["w"])
            if cur is None or key > (cur["e1rm"] if cur["e1rm"] is not None else -1) or (
                key == -1 and p["kg"] > cur["kg"] and cur["e1rm"] is None
            ):
                best[p["w"]] = p
        first_test = next((p for p in points if p["type"] == "test"), None)
        lifts.append({
            "id": mvt, "label": label, "pre": num(pre.get(pre_key)) if pre_key else None,
            "bodyweight": bw or None,
            "weeks": [best[w] for w in sorted(best)],
            "first_test": {"w": first_test["w"], "kg": first_test["kg"], "serie": first_test["serie"]} if first_test else None,
        })

    # Bandes de bloc (meso consécutifs) sur la période couverte par les graphes
    blocks: list[dict] = []
    for w in weeks[:last]:
        j = journals.get(w["n"], {})
        if blocks and blocks[-1]["meso"] == w["meso"] and blocks[-1]["phase"] == w["phase"]:
            blocks[-1]["to"] = w["n"] - 1
        else:
            blocks.append({"from": w["n"] - 1, "to": w["n"] - 1, "meso": w["meso"], "short": w["short"], "phase": w["phase"]})
    deloads = [w["n"] - 1 for w in weeks[:last] if (journals.get(w["n"], {}) or {}).get("phase_micro") == "deload"]

    # ── volumes ────────────────────────────────────────────────
    vol_profile = profile.get("volumes") or {}
    volumes = []
    for field, label, unit, key in VOLUMES:
        lm = vol_profile.get(key) or {}
        values, notes = [], []
        for n in range(1, last + 1):
            r = (journals.get(n) or {}).get("realise") or {}
            values.append(num(r.get(field)))
            notes.append(r.get(field + "_note") or r.get("z2_note" if field == "z2_min" else "") or "")
        volumes.append({
            "id": field, "label": label, "unit": unit,
            "mev": num(lm.get("mev")), "mrv": num(lm.get("mrv")),
            "values": values, "notes": notes,
        })

    # ── écarts prescrit / réalisé ──────────────────────────────
    deviations = []
    for n in range(1, last + 1):
        up, down, other = [], [], []
        for e in (journals.get(n) or {}).get("ecarts_prescrit_vs_realise") or []:
            txt = f"{e.get('mouvement', '?')} : {e.get('realise', '?')} (prescrit {e.get('prescrit', '?')})"
            {"au_dessus": up, "en_dessous": down}.get(e.get("sens"), other).append(txt)
        deviations.append({"w": n - 1, "up": up, "down": down, "other": other})

    # ── signaux ────────────────────────────────────────────────
    signals = []
    for key, label in ZONES:
        levels, notes = [], []
        for n in range(1, last + 1):
            s = ((journals.get(n) or {}).get("signaux") or {}).get(key) or {}
            levels.append(num(s.get("niveau")))
            notes.append(s.get("note") or "")
        signals.append({"id": key, "label": label, "levels": levels, "notes": notes})

    # ── échelle gym ────────────────────────────────────────────
    ladder = []
    profile_ladder = profile.get("gym_ladder_level") or {}
    for key, label in GESTES:
        hist = []
        for n in sorted(journals):
            if n > last:
                continue
            c = (journals[n].get("crans") or {}).get(key)
            if isinstance(c, dict) and num(c.get("cran")) is not None:
                hist.append({"w": n - 1, "cran": c["cran"], "etat": c.get("etat", "actif"), "note": c.get("note") or ""})
        if not hist:
            continue
        now = hist[-1]
        if num(profile_ladder.get(key)) not in (None, now["cran"]):
            print(f"ATTENTION cran {key} : journal {now['cran']} ≠ profil {profile_ladder.get(key)}", file=sys.stderr)
        ladder.append({"id": key, "label": label, "base": hist[0]["cran"], "now": now["cran"],
                       "etat": now["etat"], "note": now["note"], "w": now["w"], "history": hist})

    # ── KPI ────────────────────────────────────────────────────
    closed = [n for n, j in journals.items() if j.get("statut") == "close"]
    z2_mev = num(((vol_profile.get("z2") or {}).get("mev"))) or 60
    z2_ok = [n for n in closed if (num(((journals[n].get("realise") or {}).get("z2_min"))) or 0) >= z2_mev]
    first_open = d(instance["echeance_suivante"]["workouts"][0]["fait_box"])
    comps = [c for c in instance.get("competitions") or [] if c.get("statut") == "fait"]
    comp = comps[-1] if comps else None
    cur = next((w for w in weeks if w["current"]), None)
    cur_j = journals.get(cur["n"], {}) if cur else {}

    # ── prochains points ───────────────────────────────────────
    nexts = []
    for pm in (instance.get("points_de_mesure") or {}).values():
        if not isinstance(pm, dict) or "semaine" not in pm:
            continue
        nexts.append({"when": pm["date"], "week": pm["semaine"], "text": pm["contenu"], "sort": pm["date"][:10]})
    nexts.append({
        "when": first_open.strftime("%d/%m/%Y"), "week": "",
        "text": f"CrossFit Open {instance['echeance_suivante']['workouts'][0]['id']} — annonce le jeudi, fait en box le vendredi.",
        "sort": first_open.isoformat(),
    })
    cur_start = cur["start"] if cur else today.isoformat()
    nexts = sorted((x for x in nexts if x["sort"] >= cur_start), key=lambda x: x["sort"])

    constats = miniyaml.load(adir / "constats.yaml") or {}

    data = {
        "generated": today.isoformat(),
        "athlete": athlete,
        "last": last - 1,  # index (0-based) de la dernière semaine avec réalisé
        "phases": PHASES,
        "weeks": weeks,
        "kpis": {
            "weeks_done": len(closed), "weeks_total": len(weeks),
            "days_to_open": (first_open - today).days, "open_label": f"{instance['echeance_suivante']['workouts'][0]['id']} ({first_open.strftime('%d/%m/%Y')})",
            "competition": f"{comp.get('resultat', '')} — {comp.get('nom', '')}" if comp else "",
            "z2_ok": len(z2_ok), "z2_of": len(closed), "z2_mev": z2_mev,
        },
        "current": {
            "id": cur["id"] if cur else None, "meso": cur["meso"] if cur else None,
            "phase_micro": cur_j.get("phase_micro"), "synthese": (cur_j.get("synthese") or "").strip(),
            "suite": (cur_j.get("suite") or "").strip(),
        },
        "lifts": lifts,
        "blocks": blocks,
        "deloads": deloads,
        "volumes": volumes,
        "deviations": deviations,
        "signals": signals,
        "ladder": ladder,
        "next": nexts,
        "constats": constats,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"analytics : {len(weeks)} semaines, {len(lifts)} mouvements, dernière semaine S{last:02d} → {OUT.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
