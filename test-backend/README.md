# FAST Test — Question Bank Import

One-time script to upload local JSON question banks into Firestore `questionBank`.

This is **not** used by the Next.js app at runtime. Run it manually after you add or update questions in `data/question_bank/`.

## Prerequisites

- Python 3.10+
- A Firebase **service account key** (JSON file) with Firestore access

## 1) Get a Firebase service account key

1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select your project (e.g. `fastconnect-app`)
3. Go to **Project settings** (gear icon) → **Service accounts**
4. Click **Generate new private key**
5. Save the downloaded JSON file somewhere safe (do **not** commit it to git)

Example path:

```text
E:/fast-connect-1/secrets/firebase-service-account.json
```

## 2) Configure environment

Add this to your project `.env.local` (repo root):

```env
FIREBASE_SERVICE_ACCOUNT_KEY_PATH=secrets/firebase-service-account.json
```

Use a path relative to the repo root, or an absolute path.

> The Next.js app uses `NEXT_PUBLIC_FIREBASE_*` client keys.  
> This import script uses the **service account** only for the one-time upload.

## 3) Install Python dependencies

From the repo root:

```bash
cd test-backend
pip install -r requirements.txt
```

## 4) Run the import

Validate JSON only (no upload):

```bash
python import_to_firestore.py --dry-run
```

Import all sections:

```bash
python import_to_firestore.py
```

Import one section only:

```bash
python import_to_firestore.py --section english
```

## What the script does

1. Reads JSON arrays from `test-backend/data/question_bank/`:
   - `advanced_maths.json`
   - `basic_maths.json`
   - `iq.json`
   - `english.json`
2. Skips any question where `status != "approved"`
3. Validates required fields and MCQ structure (4 options, valid `correctOptionIndex`)
4. Upserts each approved question to Firestore: `questionBank/{question.id}`

On success you should see:

```text
Uploaded X questions to Firestore.
```

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `FIREBASE_SERVICE_ACCOUNT_KEY_PATH is not set` | Add the variable to `.env.local` |
| `Service account key not found` | Check the file path |
| `Duplicate question id` | Ensure `id` values are unique across all JSON files |
| Permission denied in Firestore | Confirm the service account has Firestore write access |

## Question JSON format

Each file must be a JSON array. Example entry:

```json
{
  "id": "adv_calc_001",
  "section": "advanced_maths",
  "topic": "calculus",
  "subtopic": "limits",
  "difficulty": "medium",
  "questionText": "...",
  "options": ["A", "B", "C", "D"],
  "correctOptionIndex": 0,
  "explanation": "...",
  "source": { "type": "manual", "reference": "..." },
  "status": "approved",
  "tags": ["fsc_part2"],
  "createdAt": "2026-06-14T00:00:00.000Z",
  "updatedAt": "2026-06-14T00:00:00.000Z"
}
```
