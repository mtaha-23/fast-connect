import { NextRequest, NextResponse } from "next/server"
import { spawn } from "child_process"
import fs from "fs/promises"
import path from "path"

type AdvisorRequest = {
  currentSemester: number
  passedCourses: string[]
  failedCourses: string[]
  lowGradeCourses: string[]
  gpa: number
  warningCount: number
  creditEarned: number
  maxCourses: number
}

const PYTHON_CMD = process.env.PYTHON_PATH || "python"
const SCRIPT_PATH = path.join(process.cwd(), "public", "process.py")
const WORK_DIR = path.join(process.cwd(), "public")
const DATA_PATH = path.join(WORK_DIR, "data.csv")

async function runPython(payload: AdvisorRequest) {
  return new Promise<{ recommendations: any[] }>((resolve, reject) => {
    const child = spawn(PYTHON_CMD, [SCRIPT_PATH], { cwd: WORK_DIR })

    let stdout = ""
    let stderr = ""

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString()
    })

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString()
    })

    child.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(stderr || `Python exited with code ${code}`))
        return
      }

      try {
        const parsed = JSON.parse(stdout)
        resolve(parsed)
      } catch (err) {
        reject(new Error(`Failed to parse Python output: ${err}`))
      }
    })

    child.stdin.write(JSON.stringify(payload))
    child.stdin.end()
  })
}

function sanitizeList(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((v) => String(v).trim()).filter(Boolean)
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean)
  }
  return []
}

async function getCourseCatalog() {
  const raw = await fs.readFile(DATA_PATH, "utf-8")
  const lines = raw.split(/\r?\n/).filter((l) => l.trim().length > 0)
  const [, ...rows] = lines

  const bySemester: Record<string, { courseId: string; courseName: string }[]> = {}

  rows.forEach((row) => {
    const cols = row.split(",")
    const courseId = cols[0]?.trim()
    const courseName = cols[1]?.trim()
    const sem = cols[2]?.trim()
    if (!courseId || !courseName || !sem) return

    const semKey = sem.split("-")[0]
    if (!bySemester[semKey]) bySemester[semKey] = []
    bySemester[semKey].push({ courseId, courseName })
  })

  return bySemester
}

export async function GET() {
  try {
    const semesters = await getCourseCatalog()
    return NextResponse.json({ semesters })
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to load courses", details: error?.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<AdvisorRequest>

    const payload: AdvisorRequest = {
      currentSemester: Number(body.currentSemester ?? 0),
      passedCourses: sanitizeList(body.passedCourses),
      failedCourses: sanitizeList(body.failedCourses),
      lowGradeCourses: sanitizeList(body.lowGradeCourses),
      gpa: Number(body.gpa ?? 0),
      warningCount: Number(body.warningCount ?? 0),
      creditEarned: Number(body.creditEarned ?? 0),
      maxCourses: Number(body.maxCourses ?? 5),
    }

    const results = await runPython(payload)
    return NextResponse.json(results)
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to generate recommendations", details: error?.message ?? String(error) },
      { status: 500 },
    )
  }
}
