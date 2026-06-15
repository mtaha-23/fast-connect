"use client"

import { useEffect, useRef, useState } from "react"
import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"

type SectionTimerProps = {
  totalSeconds: number
  onTimeUp: () => void
}

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
}

export function SectionTimer({ totalSeconds, onTimeUp }: SectionTimerProps) {
  const [timeLeft, setTimeLeft] = useState(totalSeconds)
  const onTimeUpRef = useRef(onTimeUp)
  const firedRef = useRef(false)

  useEffect(() => {
    onTimeUpRef.current = onTimeUp
  }, [onTimeUp])

  useEffect(() => {
    setTimeLeft(totalSeconds)
    firedRef.current = false
  }, [totalSeconds])

  useEffect(() => {
    if (timeLeft <= 0) {
      if (!firedRef.current) {
        firedRef.current = true
        onTimeUpRef.current()
      }
      return
    }

    const timer = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => window.clearInterval(timer)
  }, [timeLeft])

  const isUrgent = timeLeft <= 60

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg",
        isUrgent ? "bg-red-500/10 text-red-500" : "bg-emerald-500/10 text-emerald-600",
      )}
    >
      <Clock className="w-5 h-5" />
      {formatTime(timeLeft)}
    </div>
  )
}
