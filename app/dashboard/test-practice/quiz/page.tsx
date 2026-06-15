"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

/** Legacy route — redirects to the full test practice module. */
export default function QuizPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/dashboard/test-practice")
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center text-muted-foreground">
      <Loader2 className="w-6 h-6 mr-2 animate-spin" />
      Redirecting to Test Practice...
    </div>
  )
}
