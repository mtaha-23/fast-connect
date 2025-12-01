"use client"

import { DashboardHeader } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Target, TrendingUp, Award, BookOpen, Brain, Calculator, Languages, ArrowUp, ArrowDown } from "lucide-react"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Cell,
  BarChart,
  Bar,
} from "recharts"
import { cn } from "@/lib/utils"

const performanceData = [
  { week: "W1", score: 58, tests: 3 },
  { week: "W2", score: 62, tests: 4 },
  { week: "W3", score: 65, tests: 5 },
  { week: "W4", score: 71, tests: 4 },
  { week: "W5", score: 68, tests: 6 },
  { week: "W6", score: 75, tests: 5 },
  { week: "W7", score: 78, tests: 7 },
  { week: "W8", score: 82, tests: 6 },
]

const subjectData = [
  { name: "Mathematics", score: 78, color: "#3b82f6" },
  { name: "English", score: 85, color: "#10b981" },
  { name: "Analytical", score: 70, color: "#ec4899" },
]

const strengthsWeaknesses = [
  { topic: "Algebra", category: "Math", score: 92, trend: "up" },
  { topic: "Grammar", category: "English", score: 88, trend: "up" },
  { topic: "Calculus", category: "Math", score: 65, trend: "up" },
  { topic: "Vocabulary", category: "English", score: 78, trend: "down" },
  { topic: "Pattern Recognition", category: "Analytical", score: 60, trend: "down" },
  { topic: "Logical Reasoning", category: "Analytical", score: 72, trend: "up" },
]

const admissionProbability = 78

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen">
      <DashboardHeader title="Predictive Analytics" description="Track your performance and admission probability" />

      <div className="p-6 space-y-6">
        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Overall Score</p>
                  <p className="text-3xl font-bold">78%</p>
                  <p className="text-sm text-emerald-500 flex items-center gap-1 mt-1">
                    <ArrowUp className="w-3 h-3" />
                    +5% this month
                  </p>
                </div>
                <div className="p-3 bg-blue-500 rounded-xl">
                  <Target className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tests Completed</p>
                  <p className="text-3xl font-bold">47</p>
                  <p className="text-sm text-emerald-500 flex items-center gap-1 mt-1">
                    <ArrowUp className="w-3 h-3" />
                    +12 this month
                  </p>
                </div>
                <div className="p-3 bg-emerald-500 rounded-xl">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Percentile Rank</p>
                  <p className="text-3xl font-bold">Top 15%</p>
                  <p className="text-sm text-emerald-500 flex items-center gap-1 mt-1">
                    <ArrowUp className="w-3 h-3" />
                    +3 positions
                  </p>
                </div>
                <div className="p-3 bg-pink-500 rounded-xl">
                  <Award className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Study Streak</p>
                  <p className="text-3xl font-bold">14 days</p>
                  <p className="text-sm text-muted-foreground mt-1">Keep it up!</p>
                </div>
                <div className="p-3 bg-indigo-500 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admission Probability */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Admission Probability</CardTitle>
            <CardDescription>Based on your performance and historical admission data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Probability Meter */}
              <div className="relative w-48 h-48">
                <svg className="w-48 h-48 transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    className="text-muted"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${admissionProbability * 5.52} 552`}
                    className="text-primary"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold">{admissionProbability}%</span>
                  <span className="text-sm text-muted-foreground">Probability</span>
                </div>
              </div>

              {/* Recommendations */}
              <div className="flex-1 space-y-4">
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                  <h4 className="font-semibold text-emerald-600 mb-2">Strong Performance</h4>
                  <p className="text-sm text-muted-foreground">
                    Your English scores are excellent! Keep maintaining this level.
                  </p>
                </div>
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                  <h4 className="font-semibold text-yellow-600 mb-2">Areas for Improvement</h4>
                  <p className="text-sm text-muted-foreground">
                    Focus on Pattern Recognition and Logical Reasoning to boost your overall score.
                  </p>
                </div>
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                  <h4 className="font-semibold text-blue-600 mb-2">Target Score</h4>
                  <p className="text-sm text-muted-foreground">
                    Aim for 85%+ overall to increase admission probability to 90%+.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Trend</CardTitle>
              <CardDescription>Your weekly score progression</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="week"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                      domain={[0, 100]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorScore)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Subject Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Subject Performance</CardTitle>
              <CardDescription>Score breakdown by subject</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={subjectData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                    <XAxis
                      type="number"
                      domain={[0, 100]}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                      width={100}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                      {subjectData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Strengths & Weaknesses */}
        <Card>
          <CardHeader>
            <CardTitle>Topic Analysis</CardTitle>
            <CardDescription>Your strongest and weakest areas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {strengthsWeaknesses.map((item, index) => (
                <div key={index} className="p-4 bg-muted/50 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {item.category === "Math" && <Calculator className="w-4 h-4 text-blue-500" />}
                      {item.category === "English" && <Languages className="w-4 h-4 text-emerald-500" />}
                      {item.category === "Analytical" && <Brain className="w-4 h-4 text-pink-500" />}
                      <span className="font-medium">{item.topic}</span>
                    </div>
                    <Badge variant={item.score >= 80 ? "default" : item.score >= 60 ? "secondary" : "destructive"}>
                      {item.score}%
                    </Badge>
                  </div>
                  <Progress value={item.score} className="h-2" />
                  <div className="flex items-center gap-1 text-sm">
                    {item.trend === "up" ? (
                      <ArrowUp className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <ArrowDown className="w-3 h-3 text-red-500" />
                    )}
                    <span className={cn(item.trend === "up" ? "text-emerald-500" : "text-red-500")}>
                      {item.trend === "up" ? "Improving" : "Needs focus"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
