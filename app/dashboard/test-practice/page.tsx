"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { DashboardHeader } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SECTION_CONFIG, FULL_TEST_SECTIONS, type SectionKey } from "@/lib/types/test.types"
import { SECTION_LABELS, SECTION_NEGATIVE_MARKING } from "@/lib/constants/test-sections"
import { testApiFetch } from "@/lib/utils/test-api"
import { useAuth } from "@/lib/hooks/use-auth"
import { BookOpen, Brain, Calculator, Clock, History, Languages, Loader2, Play, Target } from "lucide-react"
import { cn } from "@/lib/utils"

const SECTION_ICONS: Record<SectionKey, typeof Calculator> = {
  advanced_maths: Calculator,
  basic_maths: Target,
  iq: Brain,
  english: Languages,
}

const SECTION_COLORS: Record<SectionKey, string> = {
  advanced_maths: "bg-blue-500",
  basic_maths: "bg-indigo-500",
  iq: "bg-pink-500",
  english: "bg-emerald-500",
}

type StartResponse = {
  sessionId: string
}

type HistoryAttempt = {
  sessionId: string
  mode: "full" | "section"
  label: string
  totalScore: number
  maxScore: number
  completedAt: string | null
  createdAt: string
}

type HistoryResponse = {
  attempts: HistoryAttempt[]
}

function formatDate(value: string | null) {
  if (!value) return "—"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString()
}

export default function TestPracticePage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [starting, setStarting] = useState<"full" | SectionKey | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [historyLoading, setHistoryLoading] = useState(false)
  const [history, setHistory] = useState<HistoryAttempt[]>([])

  useEffect(() => {
    if (!user) return

    const loadHistory = async () => {
      setHistoryLoading(true)
      try {
        const data = await testApiFetch<HistoryResponse>("/api/tests/history")
        setHistory(data.attempts)
      } catch {
        // History is optional on the landing page.
      } finally {
        setHistoryLoading(false)
      }
    }

    void loadHistory()
  }, [user])

  const startTest = async (mode: "full" | "section", sections: SectionKey[]) => {
    if (!user) {
      setError("Please sign in to start a test.")
      return
    }

    setError(null)
    setStarting(mode === "full" ? "full" : sections[0])

    try {
      const data = await testApiFetch<StartResponse>("/api/tests/start", {
        method: "POST",
        body: JSON.stringify({ mode, sections }),
      })

      router.push(`/dashboard/test-practice/session/${data.sessionId}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to start test.")
      setStarting(null)
    }
  }

  const totalQuestions = FULL_TEST_SECTIONS.reduce((sum, key) => sum + SECTION_CONFIG[key].questions, 0)
  const totalMinutes = FULL_TEST_SECTIONS.reduce((sum, key) => sum + SECTION_CONFIG[key].durationSec, 0) / 60

  return (
    <div className="min-h-screen">
      <DashboardHeader title="Test Practice" description="Simulate the FAST undergraduate admission test" />

      <div className="p-6 space-y-8 max-w-6xl mx-auto">
        {error ? (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/10 text-destructive px-4 py-3">
            <div className="font-medium">Could not start test</div>
            <div className="text-sm opacity-90">{error}</div>
          </div>
        ) : null}

        <section>
          <h2 className="text-xl font-semibold mb-4">Full Mock Test</h2>
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>FAST Full Mock Test</CardTitle>
              <CardDescription>
                All four sections in order. Each section has its own timer — leftover time does not carry forward.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {totalMinutes} min total
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  {totalQuestions} questions
                </span>
                <span className="flex items-center gap-1">
                  <Target className="w-4 h-4" />
                  100 marks
                </span>
              </div>
              <Button
                className="w-full sm:w-auto"
                disabled={authLoading || starting !== null}
                onClick={() => startTest("full", [...FULL_TEST_SECTIONS])}
              >
                {starting === "full" ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Play className="w-4 h-4 mr-2" />
                )}
                Start Full Mock Test
              </Button>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Practice a Section</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FULL_TEST_SECTIONS.map((section) => {
              const cfg = SECTION_CONFIG[section]
              const Icon = SECTION_ICONS[section]
              const isStarting = starting === section

              return (
                <Card key={section} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={cn("p-3 rounded-xl", SECTION_COLORS[section])}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{SECTION_LABELS[section]}</CardTitle>
                        <CardDescription>{SECTION_NEGATIVE_MARKING[section]}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="rounded-lg bg-muted/60 p-3 text-center">
                        <p className="text-muted-foreground">Questions</p>
                        <p className="font-semibold">{cfg.questions}</p>
                      </div>
                      <div className="rounded-lg bg-muted/60 p-3 text-center">
                        <p className="text-muted-foreground">Time</p>
                        <p className="font-semibold">{cfg.durationSec / 60} min</p>
                      </div>
                      <div className="rounded-lg bg-muted/60 p-3 text-center">
                        <p className="text-muted-foreground">Marks</p>
                        <p className="font-semibold">{cfg.maxMarks}</p>
                      </div>
                    </div>
                    <Button
                      className="w-full"
                      variant="outline"
                      disabled={authLoading || starting !== null}
                      onClick={() => startTest("section", [section])}
                    >
                      {isStarting ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Play className="w-4 h-4 mr-2" />
                      )}
                      Start Section
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-4">
            <History className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-xl font-semibold">Past Attempts</h2>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Your test history</CardTitle>
              <CardDescription>Completed entry test practice sessions and full mock tests.</CardDescription>
            </CardHeader>
            <CardContent>
              {!user ? (
                <p className="text-sm text-muted-foreground">Sign in to view your past attempts.</p>
              ) : historyLoading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading history...
                </div>
              ) : history.length === 0 ? (
                <p className="text-sm text-muted-foreground">No completed tests yet. Start a mock test above.</p>
              ) : (
                <div className="space-y-3">
                  {history.map((attempt) => (
                    <div
                      key={attempt.sessionId}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-border/60 p-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium">{attempt.label}</p>
                          <Badge variant="secondary">
                            {attempt.totalScore.toFixed(2)} / {attempt.maxScore}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(attempt.completedAt ?? attempt.createdAt)}
                        </p>
                      </div>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/dashboard/test-practice/results/${attempt.sessionId}`}>View Results</Link>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
