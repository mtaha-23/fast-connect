"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { QuestionCard } from "@/components/test/QuestionCard"
import { SectionTimer } from "@/components/test/SectionTimer"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  SECTION_LABELS,
  clearSectionTimer,
  getSectionRemainingSeconds,
  getSectionTimeSpentSec,
  markSectionStarted,
  readSectionStartTime,
} from "@/lib/constants/test-sections"
import { testApiFetch } from "@/lib/utils/test-api"
import { SECTION_CONFIG, type PublicQuestion, type SectionKey, type SectionResult, type TestSession } from "@/lib/types/test.types"
import { cn } from "@/lib/utils"
import { CheckCircle2, ChevronLeft, ChevronRight, Loader2, XCircle, AlertCircle } from "lucide-react"

type Phase = "loading" | "intro" | "active" | "submitted" | "error"

type SectionQuestions = {
  key: SectionKey
  questionIds: string[]
  questions: PublicQuestion[]
}

type SessionPayload = {
  session: TestSession
  sectionQuestions: SectionQuestions[]
}

type SubmitResponse = {
  result: SectionResult
  explanations: { questionId: string; explanation: string }[]
  sessionCompleted: boolean
  totalScore?: number
}

function findActiveSectionIndex(session: TestSession) {
  return session.sections.findIndex((section) => !session.sectionSubmittedAt[section])
}

export default function TestSessionPage() {
  const router = useRouter()
  const params = useParams()
  const sessionId = String(params.sessionId ?? "")

  const [phase, setPhase] = useState<Phase>("loading")
  const [error, setError] = useState<string | null>(null)
  const [payload, setPayload] = useState<SessionPayload | null>(null)
  const [sectionIndex, setSectionIndex] = useState(0)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answersBySection, setAnswersBySection] = useState<Partial<Record<SectionKey, (number | null)[]>>>({})
  const [sectionResult, setSectionResult] = useState<SectionResult | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [showSubmitDialog, setShowSubmitDialog] = useState(false)
  const [timerSeconds, setTimerSeconds] = useState(0)
  const submitLockRef = useRef(false)

  const session = payload?.session
  const sectionQuestions = payload?.sectionQuestions ?? []
  const currentSectionKey = session?.sections[sectionIndex]
  const currentSectionData = sectionQuestions.find((s) => s.key === currentSectionKey)
  const currentQuestions = currentSectionData?.questions ?? []
  const currentAnswers = currentSectionKey ? answersBySection[currentSectionKey] ?? [] : []
  const currentQuestion = currentQuestions[questionIndex]

  const loadSession = useCallback(async () => {
    try {
      setPhase("loading")
      setError(null)
      const data = await testApiFetch<SessionPayload>(`/api/tests/${sessionId}`)

      if (data.session.status === "completed") {
        router.replace(`/dashboard/test-practice/results/${sessionId}`)
        return
      }

      const activeIdx = findActiveSectionIndex(data.session)
      if (activeIdx === -1) {
        router.replace(`/dashboard/test-practice/results/${sessionId}`)
        return
      }

      const mergedAnswers: Partial<Record<SectionKey, (number | null)[]>> = {}
      for (const section of data.session.sections) {
        const existing = data.session.answersBySection[section]
        const count = data.sectionQuestions.find((s) => s.key === section)?.questions.length ?? 0
        mergedAnswers[section] = existing?.length
          ? [...existing]
          : new Array(count).fill(null)
      }

      setPayload(data)
      setAnswersBySection(mergedAnswers)
      setSectionIndex(activeIdx)

      const activeSection = data.session.sections[activeIdx]
      const hasStarted = Boolean(readSectionStartTime(sessionId, activeSection))

      if (hasStarted && !data.session.sectionSubmittedAt[activeSection]) {
        setTimerSeconds(getSectionRemainingSeconds(sessionId, activeSection, SECTION_CONFIG[activeSection].durationSec))
        setPhase("active")
      } else {
        setPhase("intro")
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load session.")
      setPhase("error")
    }
  }, [router, sessionId])

  useEffect(() => {
    if (sessionId) loadSession()
  }, [sessionId, loadSession])

  const unansweredCount = useMemo(
    () => currentAnswers.filter((a) => a === null).length,
    [currentAnswers],
  )

  const handleSelectOption = (optionIndex: number | null) => {
    if (!currentSectionKey || phase !== "active" || submitting) return
    setAnswersBySection((prev) => {
      const next = { ...prev }
      const row = [...(next[currentSectionKey] ?? [])]
      row[questionIndex] = optionIndex
      next[currentSectionKey] = row
      return next
    })
  }

  const submitSection = useCallback(async () => {
    if (!currentSectionKey || !session || submitLockRef.current) return

    submitLockRef.current = true
    setSubmitting(true)
    setShowSubmitDialog(false)

    try {
      const durationSec = SECTION_CONFIG[currentSectionKey].durationSec
      const timeSpentSec = getSectionTimeSpentSec(sessionId, currentSectionKey, durationSec)
      const answers = answersBySection[currentSectionKey] ?? []

      const data = await testApiFetch<SubmitResponse>(
        `/api/tests/${sessionId}/sections/${currentSectionKey}/submit`,
        {
          method: "POST",
          body: JSON.stringify({ answers, timeSpentSec }),
        },
      )

      clearSectionTimer(sessionId, currentSectionKey)
      setSectionResult(data.result)

      if (data.sessionCompleted) {
        router.push(`/dashboard/test-practice/results/${sessionId}`)
        return
      }

      setPayload((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          session: {
            ...prev.session,
            sectionSubmittedAt: {
              ...prev.session.sectionSubmittedAt,
              [currentSectionKey]: new Date().toISOString(),
            },
            sectionScores: {
              ...prev.session.sectionScores,
              [currentSectionKey]: data.result,
            },
            answersBySection: {
              ...prev.session.answersBySection,
              [currentSectionKey]: answers,
            },
          },
        }
      })

      setPhase("submitted")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to submit section.")
      submitLockRef.current = false
    } finally {
      setSubmitting(false)
    }
  }, [answersBySection, currentSectionKey, router, session, sessionId])

  const startSection = () => {
    if (!currentSectionKey) return
    markSectionStarted(sessionId, currentSectionKey)
    setTimerSeconds(getSectionRemainingSeconds(sessionId, currentSectionKey, SECTION_CONFIG[currentSectionKey].durationSec))
    setQuestionIndex(0)
    setPhase("active")
  }

  const goToNextSection = () => {
    if (!session) return
    const nextIndex = sectionIndex + 1
    if (nextIndex >= session.sections.length) {
      router.push(`/dashboard/test-practice/results/${sessionId}`)
      return
    }

    submitLockRef.current = false
    setSectionResult(null)
    setSectionIndex(nextIndex)
    setQuestionIndex(0)
    setPhase("intro")
  }

  if (phase === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        <Loader2 className="w-6 h-6 mr-2 animate-spin" />
        Loading test session...
      </div>
    )
  }

  if (phase === "error" || !session || !currentSectionKey) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center space-y-4">
            <p className="text-destructive">{error ?? "Session unavailable."}</p>
            <Button onClick={() => router.push("/dashboard/test-practice")}>Back to Test Practice</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (phase === "intro") {
    const cfg = SECTION_CONFIG[currentSectionKey]
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        <Card className="max-w-lg w-full">
          <CardContent className="pt-8 space-y-6 text-center">
            <Badge variant="secondary" className="mb-2">
              {session.mode === "full" ? `Section ${sectionIndex + 1} of ${session.sections.length}` : "Section Practice"}
            </Badge>
            <h1 className="text-2xl font-bold">{SECTION_LABELS[currentSectionKey]}</h1>
            <p className="text-muted-foreground">
              {cfg.questions} questions · {cfg.durationSec / 60} minutes · {cfg.maxMarks} marks
            </p>
            <p className="text-sm text-muted-foreground">
              Timer starts when you begin. Unanswered questions receive no penalty. Leftover time does not carry to the next section.
            </p>
            <Button size="lg" onClick={startSection}>
              Start Section
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (phase === "submitted" && sectionResult) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        <Card className="max-w-lg w-full">
          <CardContent className="pt-8 space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-1">Section Complete</h2>
              <p className="text-muted-foreground">{SECTION_LABELS[currentSectionKey]}</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-emerald-500/10 p-4 text-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
                <p className="text-xl font-bold text-emerald-600">{sectionResult.correct}</p>
                <p className="text-xs text-muted-foreground">Correct</p>
              </div>
              <div className="rounded-xl bg-red-500/10 p-4 text-center">
                <XCircle className="w-5 h-5 text-red-500 mx-auto mb-1" />
                <p className="text-xl font-bold text-red-600">{sectionResult.wrong}</p>
                <p className="text-xs text-muted-foreground">Wrong</p>
              </div>
              <div className="rounded-xl bg-muted p-4 text-center">
                <AlertCircle className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
                <p className="text-xl font-bold">{sectionResult.unanswered}</p>
                <p className="text-xs text-muted-foreground">Skipped</p>
              </div>
            </div>

            <div className="text-center rounded-xl border border-border p-4">
              <p className="text-sm text-muted-foreground">Section Score</p>
              <p className="text-3xl font-bold">
                {sectionResult.score.toFixed(2)} / {sectionResult.maxMarks}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              {session.mode === "full" && sectionIndex < session.sections.length - 1 ? (
                <Button onClick={goToNextSection}>Start Next Section</Button>
              ) : (
                <Button onClick={() => router.push(`/dashboard/test-practice/results/${sessionId}`)}>
                  View Full Results
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <Badge variant="secondary" className="shrink-0">
                {SECTION_LABELS[currentSectionKey]}
              </Badge>
              <span className="text-sm text-muted-foreground truncate">
                Question {questionIndex + 1} of {currentQuestions.length}
              </span>
            </div>

            <SectionTimer
              key={`${currentSectionKey}-${timerSeconds}`}
              totalSeconds={timerSeconds}
              onTimeUp={() => {
                if (!submitting) void submitSection()
              }}
            />

            <Button onClick={() => setShowSubmitDialog(true)} disabled={submitting}>
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Section"}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="pt-6">
                {currentQuestion ? (
                  <QuestionCard
                    question={currentQuestion}
                    selectedOption={currentAnswers[questionIndex] ?? null}
                    onSelect={handleSelectOption}
                    disabled={submitting}
                  />
                ) : null}

                <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                  <Button
                    variant="outline"
                    onClick={() => setQuestionIndex((i) => Math.max(0, i - 1))}
                    disabled={questionIndex === 0 || submitting}
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                  <Button
                    onClick={() => setQuestionIndex((i) => Math.min(currentQuestions.length - 1, i + 1))}
                    disabled={questionIndex >= currentQuestions.length - 1 || submitting}
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-28">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Question Palette</h3>
                <div className="grid grid-cols-5 gap-2">
                  {currentQuestions.map((_, index) => {
                    const answered = currentAnswers[index] !== null
                    const isCurrent = index === questionIndex
                    return (
                      <button
                        key={index}
                        type="button"
                        disabled={submitting}
                        onClick={() => setQuestionIndex(index)}
                        className={cn(
                          "w-10 h-10 rounded-lg text-sm font-medium transition-all",
                          isCurrent && "ring-2 ring-primary ring-offset-2",
                          answered ? "bg-emerald-500/20 text-emerald-700" : "bg-muted hover:bg-muted/80",
                        )}
                      >
                        {index + 1}
                      </button>
                    )
                  })}
                </div>
                <div className="mt-6 space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-emerald-500/20" />
                    Answered
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-muted" />
                    Unanswered
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit this section?</AlertDialogTitle>
            <AlertDialogDescription>
              You have answered {currentAnswers.length - unansweredCount} of {currentQuestions.length} questions.
              {unansweredCount > 0 ? (
                <span className="block mt-2 text-yellow-600">
                  {unansweredCount} question{unansweredCount === 1 ? "" : "s"} still unanswered.
                </span>
              ) : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting}>Continue Section</AlertDialogCancel>
            <AlertDialogAction onClick={() => void submitSection()} disabled={submitting}>
              Submit Section
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
