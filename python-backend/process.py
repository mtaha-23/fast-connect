import json
import sys
from pathlib import Path

try:
    import pandas as pd
except ImportError:
    print(json.dumps({"error": "pandas not installed", "details": "Please install pandas: pip install pandas"}))
    sys.exit(1)

BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = BASE_DIR / "data.csv"

try:
    if not DATA_PATH.exists():
        print(json.dumps({"error": "data.csv not found", "details": f"Expected file at: {DATA_PATH}"}))
        sys.exit(1)
    courses_df = pd.read_csv(DATA_PATH)
except Exception as e:
    print(json.dumps({"error": "failed to load data.csv", "details": str(e)}))
    sys.exit(1)


def ai_batch_advisor(
    current_semester,
    passed_courses,
    failed_courses,
    low_grade_courses,
    gpa,
    warning_count,
    credit_earned,
    max_courses,
):
    recommended = []

    # FYP eligibility check
    if credit_earned >= 97:
        fyp_course = courses_df[courses_df["course_id"] == "CS4091"]
        if not fyp_course.empty:
            recommended.append(("CS4091", "Final Year Project - I", 200))

    # Add failed core courses with high priority
    for _, course in courses_df.iterrows():
        if course["course_id"] in failed_courses and str(course["is_core"]).lower() == "yes":
            recommended.append((course["course_id"], course["course_name"], 150))

    # Add low-grade courses (prioritize low/medium difficulty if warning_count == 2)
    if warning_count == 2:
        for _, course in courses_df.iterrows():
            cid = course["course_id"]
            difficulty = str(course["difficulty_level"]).lower()

            if cid in low_grade_courses and difficulty in ["low", "medium"]:
                recommended.append((cid, course["course_name"], 120))
    else:
        # If warning_count is not 2, add all low-grade courses
        for _, course in courses_df.iterrows():
            cid = course["course_id"]
            if cid in low_grade_courses:
                recommended.append((cid, course["course_name"], 120))

    # *** NEW LOGIC: If warning_count == 2, STOP HERE - only recommend failed/low-grade courses ***
    if warning_count == 2:
        recommended = sorted(recommended, key=lambda x: x[2], reverse=True)
        return recommended[:max_courses]

    # Continue with regular course recommendations only if warning_count != 2
    for _, course in courses_df.iterrows():
        cid = course["course_id"]
        sem = str(course["semester_offered"])
        difficulty = str(course["difficulty_level"]).lower()

        if cid in passed_courses or any(cid == r[0] for r in recommended):
            continue

        sem_ok = False
        for s in sem.split("-"):
            try:
                if int(s) <= current_semester:
                    sem_ok = True
            except Exception:
                pass
        if not sem_ok:
            continue

        prereq = (
            str(course["prerequisite_course_ids"]).split(",")
            if pd.notna(course["prerequisite_course_ids"])
            else []
        )
        prereq_not_met = any(p.strip() and p not in passed_courses for p in prereq)
        if prereq_not_met:
            continue

        score = 0
        if difficulty == "low":
            score += 3
        if difficulty == "medium":
            score += 1
        if str(course["is_core"]).lower() == "yes":
            score += 1

        if gpa >= 3.0 and difficulty == "high":
            score += 1

        recommended.append((cid, course["course_name"], score))

    recommended = sorted(recommended, key=lambda x: x[2], reverse=True)

    return recommended[:max_courses]


def _to_list(value):
    if isinstance(value, list):
        return [str(v).strip() for v in value if str(v).strip()]
    if isinstance(value, str):
        return [v.strip() for v in value.split(",") if v.strip()]
    return []


def run_from_payload(payload):
    current_semester = int(payload.get("current_semester") or payload.get("currentSemester") or 0)
    passed_courses = _to_list(payload.get("passed_courses") or payload.get("passedCourses") or [])
    failed_courses = _to_list(payload.get("failed_courses") or payload.get("failedCourses") or [])
    low_grade_courses = _to_list(
        payload.get("low_grade_courses") or payload.get("lowGradeCourses") or []
    )
    gpa = float(payload.get("gpa") or 0)
    warning_count = int(payload.get("warning_count") or payload.get("warningCount") or 0)
    credit_earned = int(payload.get("credit_earned") or payload.get("creditEarned") or 0)
    max_courses = int(payload.get("max_courses") or payload.get("maxCourses") or 5)

    recs = ai_batch_advisor(
        current_semester,
        passed_courses,
        failed_courses,
        low_grade_courses,
        gpa,
        warning_count,
        credit_earned,
        max_courses,
    )
    return recs


def format_recommendations(recommendations):
    return [
        {"courseId": cid, "courseName": name, "score": score, "isCore": bool(score >= 1)}
        for cid, name, score in recommendations
    ]


def main():
    payload = None

    if not sys.stdin.isatty():
        raw = sys.stdin.read().strip()
        if raw:
            try:
                payload = json.loads(raw)
            except Exception as exc:
                print(json.dumps({"error": "invalid input", "details": str(exc)}), file=sys.stderr)
                sys.exit(1)

    if not payload:
        print(json.dumps({"error": "no input provided"}), file=sys.stderr)
        sys.exit(1)

    try:
        recs = run_from_payload(payload)
        print(json.dumps({"recommendations": format_recommendations(recs)}))
    except Exception as exc:
        print(json.dumps({"error": "processing failed", "details": str(exc)}), file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()