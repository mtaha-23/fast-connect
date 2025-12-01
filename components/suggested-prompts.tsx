"use client"

import { Button } from "@/components/ui/button"
import { GraduationCap, Calendar, DollarSign, MapPin, BookOpen, Clock } from "lucide-react"

interface SuggestedPromptsProps {
  onSelectPrompt: (prompt: string) => void
}

const prompts = [
  {
    icon: GraduationCap,
    text: "What are the admission requirements?",
  },
  {
    icon: Calendar,
    text: "When is the next entry test date?",
  },
  {
    icon: DollarSign,
    text: "What is the fee structure?",
  },
  {
    icon: MapPin,
    text: "Which campuses does FAST have?",
  },
  {
    icon: BookOpen,
    text: "What programs are offered in CS?",
  },
  {
    icon: Clock,
    text: "What is the application deadline?",
  },
]

export function SuggestedPrompts({ onSelectPrompt }: SuggestedPromptsProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground text-center">Try asking about:</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {prompts.map((prompt, index) => (
          <Button
            key={index}
            variant="outline"
            className="h-auto py-3 px-4 justify-start gap-3 text-left bg-transparent"
            onClick={() => onSelectPrompt(prompt.text)}
          >
            <prompt.icon className="w-4 h-4 text-primary shrink-0" />
            <span className="text-sm">{prompt.text}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}
