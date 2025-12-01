"use client"

import { useState, useRef, useEffect } from "react"
import { DashboardHeader } from "@/components/header"
import { ChatMessage } from "@/components/chat-message"
import { ChatInput } from "@/components/chat-input"
import { SuggestedPrompts } from "@/components/suggested-prompts"
import { Bot, Sparkles, RotateCcw, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
}

const welcomeMessage: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "Hello! I'm your FASTConnect AI assistant. I can help you with information about FAST University admissions, programs, campus facilities, and more. What would you like to know?",
  timestamp: new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  }),
}

// Simulated AI responses
const getAIResponse = (userMessage: string): string => {
  const lowerMessage = userMessage.toLowerCase()

  if (lowerMessage.includes("admission") || lowerMessage.includes("requirement")) {
    return "For admission to FAST University, you need to:\n\n1. Pass the FAST Entry Test (NET)\n2. Have a minimum of 60% marks in FSc/A-Levels\n3. Submit your application before the deadline\n\nThe entry test covers English, Mathematics, and IQ/Analytical sections. Would you like more details about any specific requirement?"
  }

  if (lowerMessage.includes("entry test") || lowerMessage.includes("net")) {
    return "The FAST National Entry Test (NET) is conducted multiple times a year:\n\n- **Test Dates**: Usually in June-July and December-January\n- **Duration**: 2 hours\n- **Sections**: English, Mathematics, IQ/Analytical\n- **Format**: MCQs (100 questions)\n\nWould you like to start practicing with our test preparation module?"
  }

  if (lowerMessage.includes("fee") || lowerMessage.includes("cost")) {
    return "The fee structure at FAST varies by program:\n\n- **BS Programs**: ~PKR 180,000-220,000 per semester\n- **MS Programs**: ~PKR 200,000-250,000 per semester\n- **PhD Programs**: ~PKR 150,000-180,000 per semester\n\nScholarships are available based on merit and need. Would you like information about financial aid?"
  }

  if (lowerMessage.includes("campus") || lowerMessage.includes("location")) {
    return "FAST has campuses in major cities across Pakistan:\n\n1. **Islamabad** - Main campus\n2. **Lahore** - Faisal Town\n3. **Karachi** - FAST-NUCES\n4. **Peshawar** - Near GT Road\n5. **Chiniot-Faisalabad**\n\nEach campus offers state-of-the-art facilities. Would you like to take a virtual tour?"
  }

  if (lowerMessage.includes("program") || lowerMessage.includes("course")) {
    return "FAST offers a variety of undergraduate and graduate programs:\n\n**Undergraduate:**\n- BS Computer Science\n- BS Software Engineering\n- BS Data Science\n- BS Artificial Intelligence\n- BS Electrical Engineering\n- BS Business Administration\n\n**Graduate:**\n- MS Computer Science\n- MS Data Science\n- MBA\n\nWhich program interests you?"
  }

  return "That's a great question! I'd be happy to help you with information about FAST University. Could you please be more specific about what you'd like to know? I can help with:\n\n- Admission requirements\n- Entry test details\n- Fee structure\n- Campus information\n- Available programs\n- Scholarships"
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([welcomeMessage])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    // Simulate AI response delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: getAIResponse(content),
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }

    setMessages((prev) => [...prev, aiResponse])
    setIsLoading(false)
  }

  const handleNewChat = () => {
    setMessages([welcomeMessage])
  }

  return (
    <div className="h-screen flex flex-col">
      <DashboardHeader title="AI Chatbot" description="Get instant answers about FAST University" />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Chat Header Actions */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-medium text-sm">FASTConnect Assistant</h3>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                Online
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleNewChat}>
              <RotateCcw className="w-4 h-4 mr-2" />
              New Chat
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.length === 1 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-2">How can I help you today?</h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Ask me anything about FAST University - admissions, programs, campus life, and more.
                </p>
                <SuggestedPrompts onSelectPrompt={handleSendMessage} />
              </div>
            )}

            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                role={message.role}
                content={message.content}
                timestamp={message.timestamp}
              />
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-primary-foreground" />
                </div>
                <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce delay-75" />
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce delay-150" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-border bg-background">
          <div className="max-w-3xl mx-auto">
            <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
            <p className="text-xs text-muted-foreground text-center mt-3">
              FASTConnect AI may produce inaccurate information. Please verify important details.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
