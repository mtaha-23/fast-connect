import { cn } from "@/lib/utils"
import type { PublicQuestion } from "@/lib/types/test.types"

type QuestionCardProps = {
  question: PublicQuestion
  selectedOption: number | null
  onSelect: (index: number) => void
  reviewMode?: boolean
  correctOptionIndex?: number
  disabled?: boolean
}

export function QuestionCard({
  question,
  selectedOption,
  onSelect,
  reviewMode = false,
  correctOptionIndex,
  disabled = false,
}: QuestionCardProps) {
  const isFormatted = question.questionText.includes("\n")

  return (
    <div className="space-y-3">
      {isFormatted ? (
        <pre className="font-mono bg-gray-50 p-4 rounded text-sm overflow-x-auto whitespace-pre">
          {question.questionText}
        </pre>
      ) : (
        <p className="text-base font-semibold leading-relaxed">{question.questionText}</p>
      )}

      <div className="space-y-3">
        {question.options.map((option, index) => {
          const isSelected = selectedOption === index
          const isCorrect = reviewMode && correctOptionIndex === index
          const isWrong =
            reviewMode && selectedOption !== null && isSelected && correctOptionIndex !== index
          const isUnanswered = reviewMode && selectedOption === null

          return (
            <button
              key={index}
              type="button"
              disabled={disabled || reviewMode}
              onClick={() => onSelect(index)}
              className={cn(
                "w-full p-4 rounded-xl border-2 text-left transition-all",
                !reviewMode && "hover:border-primary/50 hover:bg-primary/5",
                !reviewMode && isSelected && "border-primary bg-primary/10",
                !reviewMode && !isSelected && "border-border",
                reviewMode && isCorrect && "border-emerald-500 bg-emerald-500/10",
                reviewMode && isWrong && "border-red-500 bg-red-500/10",
                reviewMode && isUnanswered && !isCorrect && "border-border bg-muted/40",
                reviewMode && !isCorrect && !isWrong && !isUnanswered && "border-border",
                disabled && !reviewMode && "opacity-60 cursor-not-allowed",
              )}
            >
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 shrink-0",
                    !reviewMode && isSelected && "border-primary bg-primary text-primary-foreground",
                    !reviewMode && !isSelected && "border-border",
                    reviewMode && isCorrect && "border-emerald-500 bg-emerald-500 text-white",
                    reviewMode && isWrong && "border-red-500 bg-red-500 text-white",
                    reviewMode && !isCorrect && !isWrong && "border-border",
                  )}
                >
                  {String.fromCharCode(65 + index)}
                </div>
                <span>{option}</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
