"use client"

import type React from "react"

import { useState } from "react"
import { DashboardHeader } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Brain,
  Sparkles,
  Loader2,
  Code,
  Database,
  Cpu,
  BarChart3,
  Briefcase,
  Users,
  Clock,
  CheckCircle2,
} from "lucide-react"
import { cn } from "@/lib/utils"

const interests = [
  { id: "programming", label: "Programming & Development", icon: Code },
  { id: "data", label: "Data Science & Analytics", icon: Database },
  { id: "ai", label: "Artificial Intelligence", icon: Cpu },
  { id: "business", label: "Business & Management", icon: Briefcase },
  { id: "security", label: "Cybersecurity", icon: BarChart3 },
]

interface Recommendation {
  program: string
  description: string
  matchScore: number
  duration: string
  careers: string[]
  reasons: string[]
  icon: React.ElementType
  color: string
}

const mockRecommendations: Recommendation[] = [
  {
    program: "BS Computer Science",
    description: "Comprehensive program covering software development, algorithms, and computing theory.",
    matchScore: 95,
    duration: "4 years",
    careers: ["Software Engineer", "Full Stack Developer", "Systems Architect"],
    reasons: [
      "Strong match with your programming interest",
      "Excellent analytical scores in tests",
      "High demand in job market",
    ],
    icon: Code,
    color: "bg-blue-500",
  },
  {
    program: "BS Data Science",
    description: "Focus on statistical analysis, machine learning, and data-driven decision making.",
    matchScore: 88,
    duration: "4 years",
    careers: ["Data Scientist", "ML Engineer", "Business Analyst"],
    reasons: [
      "Aligns with data analytics interest",
      "Growing field with excellent opportunities",
      "Good mathematics foundation",
    ],
    icon: Database,
    color: "bg-emerald-500",
  },
  {
    program: "BS Artificial Intelligence",
    description: "Specialized program in AI, deep learning, and intelligent systems.",
    matchScore: 82,
    duration: "4 years",
    careers: ["AI Engineer", "Research Scientist", "Robotics Engineer"],
    reasons: ["Matches AI interest", "Cutting-edge curriculum", "Strong analytical abilities"],
    icon: Cpu,
    color: "bg-pink-500",
  },
]

export default function BatchAdvisorPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [formData, setFormData] = useState({
    fscMarks: "",
    entrytestScore: "",
    preferredCampus: "",
    additionalInfo: "",
  })

  const handleInterestToggle = (id: string) => {
    setSelectedInterests((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsAnalyzing(true)

    // Simulate AI analysis
    await new Promise((resolve) => setTimeout(resolve, 2500))

    setIsAnalyzing(false)
    setShowResults(true)
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader title="AI Batch Advisor" description="Get personalized program recommendations" />

      <div className="p-6">
        {!showResults ? (
          <div className="max-w-3xl mx-auto">
            {/* Header Card */}
            <Card className="mb-8 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary rounded-xl">
                    <Brain className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold mb-2">Let AI Find Your Perfect Program</h2>
                    <p className="text-muted-foreground">
                      Answer a few questions about your interests and academic background, and our AI will recommend the
                      best programs for you at FAST University.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Interests */}
              <Card>
                <CardHeader>
                  <CardTitle>Select Your Interests</CardTitle>
                  <CardDescription>Choose areas that interest you the most</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {interests.map((interest) => (
                      <button
                        key={interest.id}
                        type="button"
                        onClick={() => handleInterestToggle(interest.id)}
                        className={cn(
                          "flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left",
                          selectedInterests.includes(interest.id)
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50",
                        )}
                      >
                        <div
                          className={cn(
                            "p-2 rounded-lg",
                            selectedInterests.includes(interest.id) ? "bg-primary text-primary-foreground" : "bg-muted",
                          )}
                        >
                          <interest.icon className="w-5 h-5" />
                        </div>
                        <span className="font-medium">{interest.label}</span>
                        {selectedInterests.includes(interest.id) && (
                          <CheckCircle2 className="w-5 h-5 text-primary ml-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Academic Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Academic Background</CardTitle>
                  <CardDescription>Tell us about your academic performance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fscMarks">FSc/A-Level Marks (%)</Label>
                      <Input
                        id="fscMarks"
                        type="number"
                        placeholder="e.g., 85"
                        value={formData.fscMarks}
                        onChange={(e) => setFormData({ ...formData, fscMarks: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="entrytestScore">Entry Test Score (if taken)</Label>
                      <Input
                        id="entrytestScore"
                        type="number"
                        placeholder="e.g., 75"
                        value={formData.entrytestScore}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            entrytestScore: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferredCampus">Preferred Campus</Label>
                    <Select
                      value={formData.preferredCampus}
                      onValueChange={(value) => setFormData({ ...formData, preferredCampus: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a campus" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="islamabad">Islamabad</SelectItem>
                        <SelectItem value="lahore">Lahore</SelectItem>
                        <SelectItem value="karachi">Karachi</SelectItem>
                        <SelectItem value="peshawar">Peshawar</SelectItem>
                        <SelectItem value="chiniot">Chiniot-Faisalabad</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="additionalInfo">Additional Information (Optional)</Label>
                    <Textarea
                      id="additionalInfo"
                      placeholder="Tell us about any specific goals, skills, or preferences..."
                      value={formData.additionalInfo}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          additionalInfo: e.target.value,
                        })
                      }
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Submit */}
              <Button
                type="submit"
                size="lg"
                className="w-full h-12"
                disabled={isAnalyzing || selectedInterests.length === 0}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing Your Profile...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Get AI Recommendations
                  </>
                )}
              </Button>
            </form>
          </div>
        ) : (
          /* Results */
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Results Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Your Personalized Recommendations</h2>
              <p className="text-muted-foreground">
                Based on your interests and academic background, here are the best programs for you
              </p>
            </div>

            {/* Recommendations */}
            <div className="space-y-4">
              {mockRecommendations.map((rec, index) => (
                <Card
                  key={rec.program}
                  className={cn("overflow-hidden", index === 0 && "border-primary/30 ring-1 ring-primary/20")}
                >
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      {/* Left Side */}
                      <div className="flex-1 p-6">
                        <div className="flex items-start gap-4">
                          <div className={cn("p-3 rounded-xl", rec.color)}>
                            <rec.icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-xl font-semibold">{rec.program}</h3>
                              {index === 0 && <Badge className="bg-primary">Best Match</Badge>}
                            </div>
                            <p className="text-muted-foreground mb-4">{rec.description}</p>

                            {/* Meta Info */}
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {rec.duration}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                {rec.careers.length} career paths
                              </span>
                            </div>

                            {/* Careers */}
                            <div className="flex flex-wrap gap-2">
                              {rec.careers.map((career) => (
                                <Badge key={career} variant="secondary">
                                  {career}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Reasons */}
                        <div className="mt-6 pt-4 border-t border-border">
                          <h4 className="text-sm font-medium mb-3">Why this program?</h4>
                          <ul className="space-y-2">
                            {rec.reasons.map((reason, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                {reason}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Right Side - Match Score */}
                      <div className="md:w-48 p-6 bg-muted/50 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-border">
                        <div className="relative w-24 h-24 mb-3">
                          <svg className="w-24 h-24 transform -rotate-90">
                            <circle
                              cx="48"
                              cy="48"
                              r="42"
                              stroke="currentColor"
                              strokeWidth="8"
                              fill="none"
                              className="text-muted"
                            />
                            <circle
                              cx="48"
                              cy="48"
                              r="42"
                              stroke="currentColor"
                              strokeWidth="8"
                              fill="none"
                              strokeDasharray={`${rec.matchScore * 2.64} 264`}
                              className="text-primary"
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-2xl font-bold">{rec.matchScore}%</span>
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">Match Score</span>
                        <Button className="mt-4 w-full" size="sm">
                          Learn More
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Actions */}
            <div className="flex justify-center gap-4 pt-4">
              <Button variant="outline" onClick={() => setShowResults(false)}>
                Update Preferences
              </Button>
              <Button>Apply Now</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
