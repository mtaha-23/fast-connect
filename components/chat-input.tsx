"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Paperclip, Mic, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatInputProps {
  onSendMessage: (message: string) => void
  isLoading?: boolean
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim())
      setMessage("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
    }
  }, [message])

  return (
    <form onSubmit={handleSubmit} className="relative bg-muted/50 rounded-2xl border border-border p-2">
      <div className="flex items-end gap-2">
        {/* Attachments Button */}
        <Button type="button" variant="ghost" size="icon" className="shrink-0 h-10 w-10 rounded-xl">
          <Paperclip className="w-5 h-5 text-muted-foreground" />
        </Button>

        {/* Text Input */}
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything about FAST University..."
          className="flex-1 min-h-[44px] max-h-[200px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 py-3"
          rows={1}
        />

        {/* Voice Input */}
        <Button type="button" variant="ghost" size="icon" className="shrink-0 h-10 w-10 rounded-xl">
          <Mic className="w-5 h-5 text-muted-foreground" />
        </Button>

        {/* Send Button */}
        <Button
          type="submit"
          size="icon"
          className={cn("shrink-0 h-10 w-10 rounded-xl transition-all", message.trim() ? "bg-primary" : "bg-muted")}
          disabled={!message.trim() || isLoading}
        >
          {isLoading ? <Sparkles className="w-5 h-5 animate-pulse" /> : <Send className="w-5 h-5" />}
        </Button>
      </div>
    </form>
  )
}
