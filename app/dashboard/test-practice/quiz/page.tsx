"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Clock, ChevronLeft, ChevronRight, Flag, CheckCircle2, XCircle, AlertCircle } from "lucide-react"
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

const sampleQuestions = [
  {
    id: 1,
    question: "If f(x) = 3x² - 2x + 1, what is f(2)?",
    options: ["9", "11", "13", "7"],
    correct: 0,
    subject: "Mathematics",
  },
  {
    id: 2,
    question: "Which of the following is NOT a prime number?",
    options: ["17", "23", "27", "31"],
    correct: 2,
    subject: "Mathematics",
  },
  {
    id: 3,
    question: "The synonym of 'Ephemeral' is:",
    options: ["Eternal", "Transient", "Permanent", "Durable"],
    correct: 1,
    subject: "English",
  },
  {
    id: 4,
    question: "Complete the series: 2, 6, 12, 20, ?",
    options: ["28", "30", "32", "26"],
    correct: 1,
    subject: "Analytical",
  },
  {
    id: 5,
    question: "What is the derivative of sin(x)?",
    options: ["-cos(x)", "cos(x)", "tan(x)", "-sin(x)"],
    correct: 1,
    subject: "Mathematics",
  },
]

export default function QuizPage() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(sampleQuestions.length).fill(null))
  const [flagged, setFlagged] = useState<boolean[]>(new Array(sampleQuestions.length).fill(false))
  const [timeLeft, setTimeLeft] = useState(30 * 60) // 30 minutes
  const [showSubmitDialog, setShowSubmitDialog] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Timer
  useEffect(() => {
    if (isSubmitted) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isSubmitted])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleAnswerSelect = (optionIndex: number) => {
    if (isSubmitted) return
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = optionIndex
    setAnswers(newAnswers)
  }

  const handleFlag = () => {
    const newFlagged = [...flagged]
    newFlagged[currentQuestion] = !newFlagged[currentQuestion]
    setFlagged(newFlagged)
  }

  const handleSubmit = () => {
    setIsSubmitted(true)
    setShowSubmitDialog(false)
  }

  const calculateScore = () => {
    let correct = 0
    answers.forEach((answer, index) => {
      if (answer === sampleQuestions[index].correct) {
        correct++
      }
    })
    return Math.round((correct / sampleQuestions.length) * 100)
  }

  const answeredCount = answers.filter((a) => a !== null).length
  const progress = (answeredCount / sampleQuestions.length) * 100

  if (isSubmitted) {
    const score = calculateScore()
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="w-full max-w-2xl">
          <CardContent className="pt-8 text-center">
            <div
              className={cn(
                "w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6",
                score >= 70
                  ? "bg-emerald-500/10 text-emerald-500"
                  : score >= 50
                    ? "bg-yellow-500/10 text-yellow-500"
                    : "bg-red-500/10 text-red-500",
              )}
            >
              <span className="text-4xl font-bold">{score}%</span>
            </div>

            <h2 className="text-2xl font-bold mb-2">
              {score >= 70 ? "Excellent Work!" : score >= 50 ? "Good Effort!" : "Keep Practicing!"}
            </h2>
            <p className="text-muted-foreground mb-8">
              You answered {answeredCount} out of {sampleQuestions.length} questions
            </p>

            {/* Results Summary */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-emerald-500/10 rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-emerald-500">
                  {answers.filter((a, i) => a === sampleQuestions[i].correct).length}
                </p>
                <p className="text-sm text-muted-foreground">Correct</p>
              </div>
              <div className="p-4 bg-red-500/10 rounded-xl">
                <XCircle className="w-6 h-6 text-red-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-red-500">
                  {answers.filter((a, i) => a !== null && a !== sampleQuestions[i].correct).length}
                </p>
                <p className="text-sm text-muted-foreground">Incorrect</p>
              </div>
              <div className="p-4 bg-muted rounded-xl">
                <AlertCircle className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                <p className="text-2xl font-bold">{answers.filter((a) => a === null).length}</p>
                <p className="text-sm text-muted-foreground">Unanswered</p>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => router.push("/dashboard/analytics")}>
                View Analytics
              </Button>
              <Button onClick={() => router.push("/dashboard/test-practice")}>Back to Tests</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard/test-practice")}>
                <ChevronLeft className="w-4 h-4 mr-1" />
                Exit
              </Button>
              <div className="h-6 w-px bg-border" />
              <Badge variant="secondary">{sampleQuestions[currentQuestion].subject}</Badge>
            </div>

            {/* Timer */}
            <div
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg",
                timeLeft < 300 ? "bg-red-500/10 text-red-500" : "bg-muted",
              )}
            >
              <Clock className="w-5 h-5" />
              {formatTime(timeLeft)}
            </div>

            <Button onClick={() => setShowSubmitDialog(true)}>Submit Test</Button>
          </div>

          {/* Progress */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">
                Question {currentQuestion + 1} of {sampleQuestions.length}
              </span>
              <span className="text-muted-foreground">{answeredCount} answered</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </header>

      {/* Question Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Panel */}
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="pt-6">
                {/* Question */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-muted-foreground">Question {currentQuestion + 1}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleFlag}
                      className={cn(flagged[currentQuestion] && "text-yellow-500")}
                    >
                      <Flag className={cn("w-4 h-4 mr-2", flagged[currentQuestion] && "fill-yellow-500")} />
                      {flagged[currentQuestion] ? "Flagged" : "Flag"}
                    </Button>
                  </div>
                  <h2 className="text-xl font-semibold">{sampleQuestions[currentQuestion].question}</h2>
                </div>

                {/* Options */}
                <div className="space-y-3">
                  {sampleQuestions[currentQuestion].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      className={cn(
                        "w-full p-4 rounded-xl border-2 text-left transition-all",
                        "hover:border-primary/50 hover:bg-primary/5",
                        answers[currentQuestion] === index ? "border-primary bg-primary/10" : "border-border",
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2",
                            answers[currentQuestion] === index
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border",
                          )}
                        >
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span>{option}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
                    disabled={currentQuestion === 0}
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                  <Button
                    onClick={() => setCurrentQuestion((prev) => Math.min(sampleQuestions.length - 1, prev + 1))}
                    disabled={currentQuestion === sampleQuestions.length - 1}
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Question Navigator */}
          <div className="lg:col-span-1">
            <Card className="sticky top-32">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Question Navigator</h3>
                <div className="grid grid-cols-5 gap-2">
                  {sampleQuestions.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentQuestion(index)}
                      className={cn(
                        "w-10 h-10 rounded-lg text-sm font-medium transition-all relative",
                        currentQuestion === index
                          ? "bg-primary text-primary-foreground"
                          : answers[index] !== null
                            ? "bg-emerald-500/20 text-emerald-600"
                            : "bg-muted hover:bg-muted/80",
                        flagged[index] && "ring-2 ring-yellow-500 ring-offset-2",
                      )}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                {/* Legend */}
                <div className="mt-6 space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-emerald-500/20" />
                    <span className="text-muted-foreground">Answered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-muted" />
                    <span className="text-muted-foreground">Unanswered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-muted ring-2 ring-yellow-500" />
                    <span className="text-muted-foreground">Flagged</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Submit Dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Test?</AlertDialogTitle>
            <AlertDialogDescription>
              You have answered {answeredCount} out of {sampleQuestions.length} questions.
              {answeredCount < sampleQuestions.length && (
                <span className="block mt-2 text-yellow-500">
                  {sampleQuestions.length - answeredCount} questions are still unanswered.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Test</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit}>Submit Test</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
