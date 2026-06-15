"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { QuestionCard } from "@/components/test/QuestionCard"
import { SECTION_LABELS } from "@/lib/constants/test-sections"
import { testApiFetch } from "@/lib/utils/test-api"
import type { PublicQuestion, SectionKey, SectionResult, TestMode } from "@/lib/types/test.types"
import { Loader2, RotateCcw, TrendingDown } from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

type ReviewItem = {
  question: PublicQuestion | null
  userAnswer: number | null
  correctOptionIndex: number
  explanation: string
  topic: string
  subtopic: string
}

type TopicWeakness = {
  topic: string
  subtopic: string
  wrong: number
  total: number
  accuracyPct: number
}

type ReviewSection = {
  key: SectionKey
  items: ReviewItem[]
  score: SectionResult | null
}

type ReviewPayload = {
  sessionId: string
  mode: TestMode
  sectionsIncluded: SectionKey[]
  totalScore: number
  maxScore: number
  sections: ReviewSection[]
  topicAnalysis: {
    bySection: Array<{ section: SectionKey; weaknesses: TopicWeakness[] }>
    overall: TopicWeakness[]
  }
  completedAt: string | null
}

type SessionPayload = {
  session: {
    status: string
    totalScore: number
    sectionScores: Partial<Record<SectionKey, SectionResult>>
    sections: SectionKey[]
  }
}

function formatTestLabel(mode: TestMode, sections: SectionKey[]) {
  if (mode === "full") return "Full Mock Test"
  if (sections.length === 1) return `${SECTION_LABELS[sections[0]]} Practice`
  return "Section Practice"
}

function formatDate(value: string | null) {
  if (!value) return ""
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString()
}

export default function TestResultsPage() {
  const router = useRouter()
  const params = useParams()
  const sessionId = String(params.sessionId ?? "")

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [review, setReview] = useState<ReviewPayload | null>(null)
  const [showReview, setShowReview] = useState(false)

  useEffect(() => {
    if (!sessionId) return

    const load = async () => {
      try {
        setLoading(true)
        const sessionData = await testApiFetch<SessionPayload>(`/api/tests/${sessionId}`)

        if (sessionData.session.status !== "completed") {
          router.replace(`/dashboard/test-practice/session/${sessionId}`)
          return
        }

        const reviewData = await testApiFetch<ReviewPayload>(`/api/tests/${sessionId}/review`)
        setReview(reviewData)
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load results.")
      } finally {
        setLoading(false)
      }
    }

    void load()
  }, [router, sessionId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        <Loader2 className="w-6 h-6 mr-2 animate-spin" />
        Loading results...
      </div>
    )
  }

  if (error || !review) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center space-y-4">
            <p className="text-destructive">{error ?? "Results unavailable."}</p>
            <Button asChild>
              <Link href="/dashboard/test-practice">Back to Test Practice</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const chartData = review.sections.map((section) => ({
    name: SECTION_LABELS[section.key].split(" ")[0],
    scored: Number((section.score?.score ?? 0).toFixed(2)),
    max: section.score?.maxMarks ?? 0,
  }))

  const testLabel = formatTestLabel(review.mode, review.sectionsIncluded)

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto p-6 space-y-8">
        <div className="text-center space-y-3">
          <div className="flex justify-center gap-2 flex-wrap">
            <Badge variant="secondary">{testLabel}</Badge>
            {review.completedAt ? (
              <Badge variant="outline">{formatDate(review.completedAt)}</Badge>
            ) : null}
          </div>
          <p className="text-muted-foreground">Your total score</p>
          <p className="text-6xl font-bold text-primary">
            {review.totalScore.toFixed(2)}
            <span className="text-2xl text-muted-foreground font-normal"> / {review.maxScore}</span>
          </p>
        </div>

        {review.topicAnalysis.overall.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-amber-600" />
                Topics to Improve
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm text-muted-foreground">
                Based on wrong answers in this {review.mode === "full" ? "full mock test" : "practice session"}.
              </p>

              <div className="space-y-3">
                {review.topicAnalysis.overall.slice(0, 8).map((row) => (
                  <div
                    key={`${row.topic}-${row.subtopic}`}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-lg border border-border/60 p-3"
                  >
                    <div>
                      <p className="font-medium">{row.topic}</p>
                      {row.subtopic ? <p className="text-sm text-muted-foreground">{row.subtopic}</p> : null}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {row.wrong} wrong of {row.total} · {row.accuracyPct}% accuracy
                    </div>
                  </div>
                ))}
              </div>

              {review.mode === "full"
                ? review.topicAnalysis.bySection.map((sectionRow) =>
                    sectionRow.weaknesses.length > 0 ? (
                      <div key={sectionRow.section} className="space-y-2">
                        <h3 className="font-medium">{SECTION_LABELS[sectionRow.section]}</h3>
                        <div className="flex flex-wrap gap-2">
                          {sectionRow.weaknesses.slice(0, 6).map((row) => (
                            <Badge key={`${sectionRow.section}-${row.topic}-${row.subtopic}`} variant="outline">
                              {row.topic}
                              {row.subtopic ? ` · ${row.subtopic}` : ""} ({row.wrong} wrong)
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ) : null,
                  )
                : null}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              Great work — no wrong answers to analyze in this attempt.
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Section Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="py-3 pr-4">Section</th>
                  <th className="py-3 pr-4">Correct</th>
                  <th className="py-3 pr-4">Wrong</th>
                  <th className="py-3 pr-4">Unanswered</th>
                  <th className="py-3">Score</th>
                </tr>
              </thead>
              <tbody>
                {review.sections.map((section) => (
                  <tr key={section.key} className="border-b border-border/60">
                    <td className="py-3 pr-4 font-medium">{SECTION_LABELS[section.key]}</td>
                    <td className="py-3 pr-4">{section.score?.correct ?? 0}</td>
                    <td className="py-3 pr-4">{section.score?.wrong ?? 0}</td>
                    <td className="py-3 pr-4">{section.score?.unanswered ?? 0}</td>
                    <td className="py-3">
                      {(section.score?.score ?? 0).toFixed(2)} / {section.score?.maxMarks ?? 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Score by Section</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="scored" name="Scored" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="max" name="Max" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-3 justify-center">
          <Button asChild variant="outline">
            <Link href="/dashboard/test-practice">
              <RotateCcw className="w-4 h-4 mr-2" />
              Try Again
            </Link>
          </Button>
          <Button onClick={() => setShowReview((v) => !v)}>
            {showReview ? "Hide Review" : "Review Answers"}
          </Button>
        </div>

        {showReview ? (
          <div className="space-y-8">
            {review.sections.map((section) => (
              <div key={section.key} className="space-y-4">
                <h2 className="text-xl font-semibold">{SECTION_LABELS[section.key]}</h2>
                {section.items.map((item, index) => {
                  if (!item.question) return null
                  const status =
                    item.userAnswer === null
                      ? "unanswered"
                      : item.userAnswer === item.correctOptionIndex
                        ? "correct"
                        : "wrong"

                  return (
                    <Card key={item.question.id}>
                      <CardContent className="pt-6 space-y-4">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div>
                            <p className="text-sm text-muted-foreground">Question {index + 1}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.topic}
                              {item.subtopic ? ` · ${item.subtopic}` : ""}
                            </p>
                          </div>
                          <span
                            className={
                              status === "correct"
                                ? "text-emerald-600 text-sm font-medium"
                                : status === "wrong"
                                  ? "text-red-600 text-sm font-medium"
                                  : "text-muted-foreground text-sm font-medium"
                            }
                          >
                            {status === "correct" ? "Correct" : status === "wrong" ? "Wrong" : "Unanswered"}
                          </span>
                        </div>
                        <QuestionCard
                          question={item.question}
                          selectedOption={item.userAnswer}
                          onSelect={() => {}}
                          reviewMode
                          correctOptionIndex={item.correctOptionIndex}
                          disabled
                        />
                        {item.explanation ? (
                          <p className="text-sm rounded-lg bg-muted/60 p-3 text-muted-foreground">
                            <span className="font-medium text-foreground">Explanation: </span>
                            {item.explanation}
                          </p>
                        ) : null}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}
