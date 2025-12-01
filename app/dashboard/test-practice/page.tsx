"use client"
import { DashboardHeader } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Clock, Target, TrendingUp, Play, ChevronRight, Calculator, Languages, Brain } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const testCategories = [
  {
    id: "mathematics",
    title: "Mathematics",
    description: "Algebra, Calculus, Geometry, Trigonometry",
    icon: Calculator,
    color: "bg-blue-500",
    totalQuestions: 500,
    completed: 125,
    avgScore: 78,
  },
  {
    id: "english",
    title: "English",
    description: "Grammar, Vocabulary, Comprehension",
    icon: Languages,
    color: "bg-emerald-500",
    totalQuestions: 400,
    completed: 200,
    avgScore: 82,
  },
  {
    id: "analytical",
    title: "IQ & Analytical",
    description: "Logical Reasoning, Pattern Recognition",
    icon: Brain,
    color: "bg-pink-500",
    totalQuestions: 300,
    completed: 75,
    avgScore: 70,
  },
]

const mockTests = [
  {
    id: "mock-1",
    title: "Full Mock Test #1",
    duration: "120 min",
    questions: 100,
    difficulty: "Medium",
    attempted: true,
    score: 75,
  },
  {
    id: "mock-2",
    title: "Full Mock Test #2",
    duration: "120 min",
    questions: 100,
    difficulty: "Hard",
    attempted: true,
    score: 68,
  },
  {
    id: "mock-3",
    title: "Full Mock Test #3",
    duration: "120 min",
    questions: 100,
    difficulty: "Medium",
    attempted: false,
  },
  {
    id: "mock-4",
    title: "Full Mock Test #4",
    duration: "120 min",
    questions: 100,
    difficulty: "Easy",
    attempted: false,
  },
]

const recentTests = [
  { name: "Math Quiz #12", score: 85, date: "Today", questions: 20 },
  { name: "English Practice #8", score: 90, date: "Yesterday", questions: 25 },
  { name: "Full Mock Test #2", score: 68, date: "2 days ago", questions: 100 },
]

export default function TestPracticePage() {
  return (
    <div className="min-h-screen">
      <DashboardHeader title="Test Practice" description="Prepare for your FAST Entry Test" />

      <div className="p-6 space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tests Taken</p>
                  <p className="text-3xl font-bold">47</p>
                </div>
                <div className="p-3 bg-blue-500 rounded-xl">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Score</p>
                  <p className="text-3xl font-bold">76%</p>
                </div>
                <div className="p-3 bg-emerald-500 rounded-xl">
                  <Target className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Time Spent</p>
                  <p className="text-3xl font-bold">42h</p>
                </div>
                <div className="p-3 bg-pink-500 rounded-xl">
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Improvement</p>
                  <p className="text-3xl font-bold">+12%</p>
                </div>
                <div className="p-3 bg-indigo-500 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Test Categories */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Practice by Subject</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testCategories.map((category) => (
              <Card key={category.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className={cn("p-3 rounded-xl", category.color)}>
                      <category.icon className="w-6 h-6 text-white" />
                    </div>
                    <Badge variant="secondary">{category.avgScore}% avg</Badge>
                  </div>
                  <CardTitle className="mt-4">{category.title}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">
                        {category.completed}/{category.totalQuestions}
                      </span>
                    </div>
                    <Progress value={(category.completed / category.totalQuestions) * 100} className="h-2" />
                    <Link href={`/dashboard/test-practice/quiz?subject=${category.id}`}>
                      <Button className="w-full mt-2 group-hover:bg-primary">
                        Start Practice
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Mock Tests */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Full Mock Tests</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockTests.map((test) => (
              <Card
                key={test.id}
                className={cn("hover:shadow-lg transition-shadow", test.attempted && "border-primary/20")}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={
                        test.difficulty === "Easy"
                          ? "secondary"
                          : test.difficulty === "Medium"
                            ? "default"
                            : "destructive"
                      }
                    >
                      {test.difficulty}
                    </Badge>
                    {test.attempted && <span className="text-sm font-semibold text-primary">{test.score}%</span>}
                  </div>
                  <CardTitle className="text-lg">{test.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {test.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {test.questions} Qs
                    </span>
                  </div>
                  <Link href={`/dashboard/test-practice/quiz?mock=${test.id}`}>
                    <Button variant={test.attempted ? "outline" : "default"} className="w-full">
                      <Play className="w-4 h-4 mr-2" />
                      {test.attempted ? "Retry Test" : "Start Test"}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Tests</CardTitle>
            <CardDescription>Your latest test attempts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTests.map((test, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        test.score >= 80
                          ? "bg-emerald-500/10 text-emerald-500"
                          : test.score >= 60
                            ? "bg-blue-500/10 text-blue-500"
                            : "bg-red-500/10 text-red-500",
                      )}
                    >
                      {test.score}%
                    </div>
                    <div>
                      <p className="font-medium">{test.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {test.questions} questions • {test.date}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
