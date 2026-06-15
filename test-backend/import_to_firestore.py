#!/usr/bin/env python3
"""
One-time importer: upload approved questions from local JSON banks to Firestore.

Usage:
  python import_to_firestore.py
  python import_to_firestore.py --dry-run
  python import_to_firestore.py --section english
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path
from typing import Any

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent
REPO_ROOT = BASE_DIR.parent
QUESTION_BANK_DIR = BASE_DIR / "data" / "question_bank"

ALL_SECTIONS = ("advanced_maths", "basic_maths", "iq", "english")


def load_env() -> None:
    for env_file in (REPO_ROOT / ".env.local", REPO_ROOT / ".env"):
        if env_file.exists():
            load_dotenv(env_file)


def resolve_service_account_path() -> Path:
    raw = os.getenv("FIREBASE_SERVICE_ACCOUNT_KEY_PATH", "").strip()
    if not raw:
        raise RuntimeError(
            "FIREBASE_SERVICE_ACCOUNT_KEY_PATH is not set. "
            "Add it to .env.local (see test-backend/README.md)."
        )

    path = Path(raw)
    if not path.is_absolute():
        path = REPO_ROOT / path

    if not path.exists():
        raise FileNotFoundError(f"Service account key not found: {path}")

    return path


def init_firestore():
    import firebase_admin
    from firebase_admin import credentials, firestore

    if not firebase_admin._apps:
        cred = credentials.Certificate(str(resolve_service_account_path()))
        firebase_admin.initialize_app(cred)

    return firestore.client()


def load_questions_from_file(section_file: Path) -> list[dict[str, Any]]:
    with section_file.open("r", encoding="utf-8") as fh:
        data = json.load(fh)

    if not isinstance(data, list):
        raise ValueError(f"{section_file.name} must contain a JSON array of questions.")

    return data


def validate_question(question: dict[str, Any], source_file: str) -> None:
    required = (
        "id",
        "section",
        "topic",
        "subtopic",
        "difficulty",
        "questionText",
        "options",
        "correctOptionIndex",
        "explanation",
        "source",
        "status",
        "tags",
        "createdAt",
        "updatedAt",
    )
    missing = [field for field in required if field not in question]
    if missing:
        raise ValueError(f"{source_file}: question missing fields {missing}")

    if not isinstance(question["options"], list) or len(question["options"]) != 4:
        raise ValueError(f"{source_file}: question {question['id']} must have exactly 4 options.")

    correct = question["correctOptionIndex"]
    if not isinstance(correct, int) or correct < 0 or correct > 3:
        raise ValueError(
            f"{source_file}: question {question['id']} has invalid correctOptionIndex={correct!r}."
        )


def collect_questions(sections: tuple[str, ...]) -> list[dict[str, Any]]:
    collected: list[dict[str, Any]] = []
    seen_ids: set[str] = set()

    for section in sections:
        file_path = QUESTION_BANK_DIR / f"{section}.json"
        if not file_path.exists():
            raise FileNotFoundError(f"Question bank not found: {file_path}")

        rows = load_questions_from_file(file_path)
        approved = 0
        skipped = 0

        for question in rows:
            if question.get("status") != "approved":
                skipped += 1
                continue

            validate_question(question, file_path.name)

            qid = str(question["id"]).strip()
            if not qid:
                raise ValueError(f"{file_path.name}: approved question with empty id.")

            if qid in seen_ids:
                raise ValueError(f"Duplicate question id across banks: {qid}")

            seen_ids.add(qid)
            collected.append(question)
            approved += 1

        print(f"[{section}] {approved} approved, {skipped} skipped (non-approved)")

    return collected


def upsert_questions(questions: list[dict[str, Any]], dry_run: bool) -> int:
    if dry_run:
        print(f"Dry run: validated {len(questions)} approved questions. No upload performed.")
        return len(questions)

    db = init_firestore()
    batch_size = 400
    uploaded = 0

    for index in range(0, len(questions), batch_size):
        batch = db.batch()
        chunk = questions[index : index + batch_size]

        for question in chunk:
            doc_id = str(question["id"])
            ref = db.collection("questionBank").document(doc_id)
            batch.set(ref, question, merge=True)

        batch.commit()
        uploaded += len(chunk)
        print(f"Committed batch: {uploaded}/{len(questions)}")

    return uploaded


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Import approved FAST test questions from JSON into Firestore questionBank."
    )
    parser.add_argument(
        "--section",
        choices=ALL_SECTIONS,
        help="Import only one section (default: all sections).",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Validate JSON files without uploading to Firestore.",
    )
    return parser.parse_args()


def main() -> int:
    load_env()
    args = parse_args()

    sections = (args.section,) if args.section else ALL_SECTIONS

    try:
        questions = collect_questions(sections)
        uploaded = upsert_questions(questions, dry_run=args.dry_run)

        if args.dry_run:
            print(f"Dry run complete. {uploaded} questions validated.")
        else:
            print(f"Uploaded {uploaded} questions to Firestore.")
        return 0
    except Exception as exc:
        print(f"Import failed: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
