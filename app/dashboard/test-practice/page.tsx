"use client"
import { DashboardHeader } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  },
  {
    id: "english",
    title: "English",
    description: "Grammar, Vocabulary, Comprehension",
    icon: Languages,
    color: "bg-emerald-500",
  },
  {
    id: "analytical",
    title: "IQ & Analytical",
    description: "Logical Reasoning, Pattern Recognition",
    icon: Brain,
    color: "bg-pink-500",
  },
]

const mockTests = [
  {
    id: "mock-1",
    title: "Full Mock Test",
    duration: "120 min",
    questions: 100,
    attempted: false,
  }
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
                  <p className="text-3xl font-bold">78%</p>
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
                  </div>
                  <CardTitle className="mt-4">{category.title}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Link href={`/dashboard/test-practice/quiz?subject=${category.id}`}>
                      <Button className="w-full group-hover:bg-primary">
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

      </div>
    </div>
  )
}
