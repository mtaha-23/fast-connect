"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { DashboardHeader } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertTriangle, Brain, Loader2, ShieldCheck, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface Recommendation {
  courseId: string
  courseName: string
  score: number
  isCore?: boolean
}

type CourseMap = Record<string, { courseId: string; courseName: string }[]>

export default function BatchAdvisorPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [error, setError] = useState<string | null>(null)
  const [courseOptions, setCourseOptions] = useState<CourseMap>({})
  const [courseFetchError, setCourseFetchError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    currentSemester: "",
    gpa: "",
    warningCount: "0",
    creditEarned: "",
    maxCourses: "5",
  })
  const [passedSelected, setPassedSelected] = useState<string[]>([])
  const [failedSelected, setFailedSelected] = useState<string[]>([])
  const [lowSelected, setLowSelected] = useState<string[]>([])
  const [fieldErrors, setFieldErrors] = useState({
    currentSemester: "",
    gpa: "",
  })

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const res = await fetch("/api/batch-advisor")
        if (!res.ok) throw new Error("Could not load course list")
        const data = await res.json()
        setCourseOptions(data.semesters || {})
      } catch (err: any) {
        setCourseFetchError(err.message || "Failed to load courses")
      }
    }
    loadCourses()
  }, [])

  // Validation functions
  const validateCurrentSemester = (value: string): string => {
    if (!value.trim()) {
      return "Current semester is required"
    }
    const num = Number(value)
    if (Number.isNaN(num) || num < 1 || num > 8) {
      return "Current semester must be between 1 and 8"
    }
    return ""
  }

  const validateGPA = (value: string): string => {
    if (!value.trim()) {
      return "CGPA is required"
    }
    const num = Number(value)
    if (Number.isNaN(num) || num < 0 || num > 4) {
      return "CGPA must be between 0 and 4"
    }
    return ""
  }

  const numericSemester = Number(formData.currentSemester || 0)
  const visibleSemesters = useMemo(
    () =>
      Object.keys(courseOptions).filter((sem) => {
        const num = Number(sem)
        if (Number.isNaN(num)) return false
        // If student is in semester N, only show semesters strictly before N
        if (numericSemester && numericSemester > 0) return num < numericSemester
        return true
      }),
    [courseOptions, numericSemester],
  )

  // Filter courses for failed selection (exclude passed courses)
  const getFilteredCoursesForFailed = useMemo(() => {
    const filtered: CourseMap = {}
    Object.keys(courseOptions).forEach((sem) => {
      filtered[sem] = (courseOptions[sem] || []).filter(
        (course) => !passedSelected.includes(course.courseId)
      )
    })
    return filtered
  }, [courseOptions, passedSelected])

  // Filter courses for low grade selection (only include passed courses)
  const getFilteredCoursesForLow = useMemo(() => {
    const filtered: CourseMap = {}
    Object.keys(courseOptions).forEach((sem) => {
      filtered[sem] = (courseOptions[sem] || []).filter((course) =>
        passedSelected.includes(course.courseId)
      )
    })
    return filtered
  }, [courseOptions, passedSelected])

  // Remove failed courses that are in passed courses
  useEffect(() => {
    const filtered = failedSelected.filter((id) => !passedSelected.includes(id))
    if (filtered.length !== failedSelected.length) {
      setFailedSelected(filtered)
    }
  }, [passedSelected, failedSelected])

  // Remove low grade courses that are not in passed courses
  useEffect(() => {
    const filtered = lowSelected.filter((id) => passedSelected.includes(id))
    if (filtered.length !== lowSelected.length) {
      setLowSelected(filtered)
    }
  }, [passedSelected, lowSelected])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsAnalyzing(true)
    setError(null)

    // Validate fields
    const semesterError = validateCurrentSemester(formData.currentSemester)
    const gpaError = validateGPA(formData.gpa)

    setFieldErrors({
      currentSemester: semesterError,
      gpa: gpaError,
    })

    // If there are validation errors, don't submit
    if (semesterError || gpaError) {
      setIsAnalyzing(false)
      return
    }

    try {
      const payload = {
        currentSemester: Number(formData.currentSemester || 0),
        gpa: Number(formData.gpa || 0),
        warningCount: Number(formData.warningCount || 0),
        creditEarned: Number(formData.creditEarned || 0),
        maxCourses: Number(formData.maxCourses || 5),
        passedCourses: passedSelected,
        failedCourses: failedSelected,
        lowGradeCourses: lowSelected,
      }

      const res = await fetch("/api/batch-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const detail = await res.json().catch(() => ({}))
        throw new Error(detail?.error || "Could not generate recommendations")
      }

      const data = await res.json()
      setRecommendations(data.recommendations || [])
      setShowResults(true)
    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
    setIsAnalyzing(false)
    }
  }

  const isSubmitDisabled =
    isAnalyzing ||
    !formData.currentSemester ||
    !formData.gpa ||
    !formData.creditEarned ||
    !formData.maxCourses ||
    courseFetchError !== null ||
    fieldErrors.currentSemester !== "" ||
    fieldErrors.gpa !== ""

  const toggleCourse = (value: string, list: string[], setter: (v: string[]) => void) => {
    setter(list.includes(value) ? list.filter((c) => c !== value) : [...list, value])
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader
        title="AI Batch Advisor"
        description="Get course recommendations powered by your academic history"
      />

      <div className="p-4">
        {!showResults ? (
          <div className="max-w-4xl mx-auto space-y-4">
            {error && (
              <Card className="border-destructive/30">
                <CardContent className="flex items-center gap-3 py-3">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  <div className="text-sm text-destructive"> {error}</div>
                </CardContent>
              </Card>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-base">Academic Info</CardTitle>
                  <CardDescription className="text-xs">Fill only what applies.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                  <div className="space-y-1.5">
                    <Label htmlFor="currentSemester">Current Semester</Label>
                    <Input
                      id="currentSemester"
                      type="number"
                      min={1}
                      max={8}
                      placeholder="e.g., 5"
                      value={formData.currentSemester}
                      onChange={(e) => {
                        const value = e.target.value
                        setFormData({ ...formData, currentSemester: value })
                        if (fieldErrors.currentSemester) {
                          setFieldErrors({ ...fieldErrors, currentSemester: "" })
                        }
                      }}
                      onBlur={(e) => {
                        const error = validateCurrentSemester(e.target.value)
                        setFieldErrors({ ...fieldErrors, currentSemester: error })
                      }}
                      className={fieldErrors.currentSemester ? "border-destructive focus:border-destructive" : ""}
                    />
                    {fieldErrors.currentSemester && (
                      <p className="text-xs text-destructive">{fieldErrors.currentSemester}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="gpa">CGPA</Label>
                    <Input
                      id="gpa"
                      type="number"
                      step="0.01"
                      min={0}
                      max={4}
                      placeholder="e.g., 2.9"
                      value={formData.gpa}
                      onChange={(e) => {
                        const value = e.target.value
                        setFormData({ ...formData, gpa: value })
                        if (fieldErrors.gpa) {
                          setFieldErrors({ ...fieldErrors, gpa: "" })
                        }
                      }}
                      onBlur={(e) => {
                        const error = validateGPA(e.target.value)
                        setFieldErrors({ ...fieldErrors, gpa: error })
                      }}
                      className={fieldErrors.gpa ? "border-destructive focus:border-destructive" : ""}
                    />
                    {fieldErrors.gpa && (
                      <p className="text-xs text-destructive">{fieldErrors.gpa}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="warningCount">Active Warnings</Label>
                    <Select
                      value={formData.warningCount}
                      onValueChange={(value) => setFormData({ ...formData, warningCount: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Warnings" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0</SelectItem>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="creditEarned">Credits Earned</Label>
                    <Input
                      id="creditEarned"
                      type="number"
                      min={0}
                      placeholder="e.g., 80"
                      value={formData.creditEarned}
                      onChange={(e) => setFormData({ ...formData, creditEarned: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="maxCourses">Max Courses</Label>
                    <Input
                      id="maxCourses"
                      type="number"
                      min={1}
                      max={7}
                      placeholder="e.g., 5"
                      value={formData.maxCourses}
                      onChange={(e) => setFormData({ ...formData, maxCourses: e.target.value })}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-base">Course History</CardTitle>
                  <CardDescription className="text-xs">Select completed / failed / low-grade.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {courseFetchError ? (
                    <div className="flex items-center gap-2 text-sm text-destructive">
                      <AlertTriangle className="w-4 h-4" />
                      {courseFetchError}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      <CoursePicker
                        label="Passed"
                        help="Already cleared"
                        semesters={visibleSemesters}
                        allCourses={courseOptions}
                        selected={passedSelected}
                        onToggle={(id) => toggleCourse(id, passedSelected, setPassedSelected)}
                        onSetSelected={(ids) => setPassedSelected(ids)}
                      />
                      <CoursePicker
                        label="Failed / Retake"
                        help="Needs a repeat (excludes passed courses)"
                        semesters={visibleSemesters}
                        allCourses={getFilteredCoursesForFailed}
                        selected={failedSelected}
                        onToggle={(id) => toggleCourse(id, failedSelected, setFailedSelected)}
                        onSetSelected={(ids) => setFailedSelected(ids)}
                      />
                      <CoursePicker
                        label="Low Grade"
                        help="Improve C or below (only passed courses)"
                        semesters={visibleSemesters}
                        allCourses={getFilteredCoursesForLow}
                        selected={lowSelected}
                        onToggle={(id) => toggleCourse(id, lowSelected, setLowSelected)}
                        onSetSelected={(ids) => setLowSelected(ids)}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              <Button type="submit" size="sm" className="w-full h-10" disabled={isSubmitDisabled}>
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating course plan...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Get Batch Advice
                  </>
                )}
              </Button>
            </form>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold leading-tight">Recommended courses</h2>
                
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                {recommendations.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground text-sm">
                    No recommendations were returned. Try lowering the max courses or revisiting your inputs.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left px-4 py-3 text-sm font-semibold">Course ID</th>
                          <th className="text-left px-4 py-3 text-sm font-semibold">Course Name</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recommendations.map((rec, index) => (
                          <tr
                            key={rec.courseId}
                            className={cn(
                              "border-b last:border-b-0 hover:bg-muted/50 transition-colors",
                              index === 0 && "bg-primary/5"
                            )}
                          >
                            <td className="px-4 py-3">
                              <span className="text-sm font-medium">{rec.courseId}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-sm text-muted-foreground">{rec.courseName}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-center gap-2 pt-3">
              <Button variant="outline" size="sm" onClick={() => setShowResults(false)}>
                Edit inputs
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

type CoursePickerProps = {
  label: string
  help: string
  semesters: string[]
  allCourses: CourseMap
  selected: string[]
  onToggle: (courseId: string) => void
  onSetSelected: (courseIds: string[]) => void
}

function CoursePicker({ label, help, semesters, allCourses, selected, onToggle, onSetSelected }: CoursePickerProps) {
  const semesterKeys = semesters.length ? semesters : Object.keys(allCourses)
  const [openSem, setOpenSem] = useState<string>(() => semesterKeys[0] || "")
  const initialSet = useRef(false)

  const onToggleSem = (ids: string[]) => onSetSelected(ids)

  useEffect(() => {
    if (!initialSet.current && semesterKeys[0]) {
      setOpenSem(semesterKeys[0])
      initialSet.current = true
      return
    }
    if (openSem && !semesterKeys.includes(openSem)) {
      setOpenSem(semesterKeys[0] || "")
    }
  }, [semesterKeys, openSem])

  return (
    <CollapsibleSection title={label} badgeText={`${selected.length} selected`}>
      <p className="text-sm text-muted-foreground mb-2">{help}</p>
      <span className="text-xs text-muted-foreground block mb-3">
        Showing {semesterKeys.length || 0} semesters
      </span>
      <div className="grid grid-cols-1 gap-3 max-h-72 overflow-auto pr-1">
        {semesterKeys.map((sem) => (
          <div key={sem} className="rounded-lg border">
            <button
              type="button"
              onClick={() => setOpenSem((prev) => (prev === sem ? "" : sem))}
              className="flex w-full items-center justify-between px-3 py-2 text-sm font-semibold hover:bg-muted"
            >
              <span>Semester {sem}</span>
              <span className={cn("text-xs transition", openSem === sem ? "rotate-180" : "")}>⌃</span>
            </button>
            {openSem === sem && (
              <div className="space-y-2 px-3 pb-3">
                <label className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                  <Checkbox
                    checked={
                      (allCourses[sem] || []).length > 0 &&
                      (allCourses[sem] || []).every((c) => selected.includes(c.courseId))
                    }
                    onCheckedChange={() => {
                      const semIds = (allCourses[sem] || []).map((c) => c.courseId)
                      const allInSemSelected = semIds.every((id) => selected.includes(id))
                      if (allInSemSelected) {
                        // deselect all from this semester
                        const remaining = selected.filter((id) => !semIds.includes(id))
                        onToggleSem(remaining)
                      } else {
                        // add all from this semester
                        const merged = Array.from(new Set([...selected, ...semIds]))
                        onToggleSem(merged)
                      }
                    }}
                  />
                  <span>Select all in this semester</span>
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {(allCourses[sem] || []).map((course) => (
                    <label
                      key={course.courseId}
                      className="flex items-start gap-3 rounded-lg border p-2.5 hover:border-primary/50 transition bg-card"
                    >
                      <Checkbox
                        checked={selected.includes(course.courseId)}
                        onCheckedChange={() => onToggle(course.courseId)}
                      />
                      <div>
                        <p className="text-sm font-medium">{course.courseId}</p>
                        <p className="text-xs text-muted-foreground">{course.courseName}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {semesterKeys.length === 0 && (
          <p className="text-sm text-muted-foreground">No courses available from the catalog.</p>
        )}
      </div>
    </CollapsibleSection>
  )
}

type CollapsibleProps = {
  title: string
  badgeText?: string
  children: React.ReactNode
}

function CollapsibleSection({ title, badgeText, children }: CollapsibleProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="group rounded-lg border bg-card shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full cursor-pointer items-center justify-between px-3 py-2 text-sm font-medium"
      >
        <span>{title}</span>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {badgeText && <Badge variant="secondary">{badgeText}</Badge>}
          <span className={cn("transition", open ? "rotate-180" : "")}>⌃</span>
        </div>
      </button>
      {open && <div className="px-3 pb-3">{children}</div>}
    </div>
  )
}
