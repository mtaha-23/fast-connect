#!/usr/bin/env python3
"""Generate test-backend/data/topics.json from question bank JSON files."""

from __future__ import annotations

import json
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
QUESTION_BANK_DIR = BASE_DIR / "data" / "question_bank"
OUT_PATH = BASE_DIR / "data" / "topics.json"

SECTIONS_META = {
    "advanced_maths": {
        "label": "Advanced Mathematics",
        "questions": 50,
        "durationMin": 50,
        "maxMarks": 50,
    },
    "basic_maths": {
        "label": "Basic Mathematics",
        "questions": 20,
        "durationMin": 20,
        "maxMarks": 20,
    },
    "iq": {
        "label": "IQ & Analytical",
        "questions": 20,
        "durationMin": 20,
        "maxMarks": 20,
    },
    "english": {
        "label": "English",
        "questions": 30,
        "durationMin": 30,
        "maxMarks": 10,
    },
}

IQ_QUESTION_TYPES = [
    {"type": "number_series", "topic": "number_series", "label": "Number Series", "format": "plain"},
    {"type": "letter_series", "topic": "letter_series", "label": "Letter Series", "format": "plain"},
    {"type": "verbal_analogies", "topic": "verbal_analogies", "label": "Verbal Analogies", "format": "plain"},
    {"type": "logical_reasoning", "topic": "logical_reasoning", "label": "Logical Reasoning", "format": "plain"},
    {"type": "odd_one_out", "topic": "odd_one_out", "label": "Odd One Out", "format": "plain"},
    {"type": "number_matrix", "topic": "number_matrix", "label": "Number/Letter Matrix", "format": "formatted"},
    {"type": "ascii_patterns", "topic": "ascii_patterns", "label": "ASCII Art Patterns", "format": "formatted"},
]

IQ_TYPE_BY_TOPIC = {row["topic"]: row for row in IQ_QUESTION_TYPES}


def build_section(section: str) -> dict:
    rows = json.loads((QUESTION_BANK_DIR / f"{section}.json").read_text(encoding="utf-8"))
    topic_map: dict[str, dict] = defaultdict(lambda: {"subtopics": set(), "count": 0})

    for question in rows:
        if question.get("status") != "approved":
            continue
        topic = str(question.get("topic", "")).strip()
        subtopic = str(question.get("subtopic", "")).strip()
        if not topic:
            continue
        topic_map[topic]["count"] += 1
        if subtopic:
            topic_map[topic]["subtopics"].add(subtopic)

    topics = []
    for topic in sorted(topic_map.keys(), key=str.lower):
        entry = {
            "topic": topic,
            "subtopics": sorted(topic_map[topic]["subtopics"]),
            "questionCount": topic_map[topic]["count"],
        }
        if section == "iq":
            iq_meta = IQ_TYPE_BY_TOPIC.get(topic)
            if iq_meta:
                entry["questionType"] = iq_meta["type"]
                entry["format"] = iq_meta["format"]
        topics.append(entry)

    meta = SECTIONS_META[section]
    return {
        **meta,
        "topics": topics,
        "totalApprovedQuestions": sum(item["questionCount"] for item in topics),
    }


def main() -> None:
    sections = {section: build_section(section) for section in SECTIONS_META}
    payload = {
        "version": "1.0",
        "description": (
            "FAST test topic taxonomy for topic-based question sampling. "
            "Use the exact topic string when querying questionBank."
        ),
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "sections": sections,
        "iqQuestionTypes": IQ_QUESTION_TYPES,
    }
    OUT_PATH.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    total = sum(section["totalApprovedQuestions"] for section in sections.values())
    print(f"Wrote {OUT_PATH} ({total} approved questions indexed)")


if __name__ == "__main__":
    main()
