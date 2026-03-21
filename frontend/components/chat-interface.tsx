"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Paperclip, Sparkles, User, Copy, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "Hello! I'm your AI document assistant. I can help you search, analyze, and answer questions about your uploaded documents. What would you like to know?",
    timestamp: new Date(Date.now() - 3600000),
  },
  {
    id: "2",
    role: "user",
    content: "How many vacation days do employees get according to the handbook?",
    timestamp: new Date(Date.now() - 3500000),
  },
  {
    id: "3",
    role: "assistant",
    content: "Based on the Employee Handbook 2024, full-time employees are entitled to:\n\n• **21 days** of paid vacation per year for the first 5 years\n• **25 days** after 5 years of service\n• **30 days** after 10 years of service\n\nVacation days must be requested at least 2 weeks in advance for periods longer than 3 consecutive days. Unused vacation days can be carried over to the next year, up to a maximum of 5 days.",
    timestamp: new Date(Date.now() - 3400000),
  },
]

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I've searched through your documents and found relevant information. Based on the uploaded files, I can provide you with detailed insights. Would you like me to elaborate on any specific aspect?",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Chat Messages */}
      <ScrollArea ref={scrollRef} className="flex-1 px-3 sm:px-4">
        <div className="mx-auto max-w-3xl py-4 sm:py-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "mb-4 sm:mb-6 flex gap-2 sm:gap-4",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {message.role === "assistant" && (
                <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
                  <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary-foreground" />
                </div>
              )}
              <div
                className={cn(
                  "flex max-w-[85%] sm:max-w-[80%] flex-col gap-2",
                  message.role === "user" ? "items-end" : "items-start"
                )}
              >
                <div
                  className={cn(
                    "rounded-2xl px-3 sm:px-4 py-2 sm:py-3 text-sm leading-relaxed",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  )}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                </div>
                {message.role === "assistant" && (
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Copy className="h-3.5 w-3.5" />
                      <span className="sr-only">Copy</span>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span className="sr-only">Regenerate</span>
                    </Button>
                  </div>
                )}
              </div>
              {message.role === "user" && (
                <div className="hidden sm:flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="mb-4 sm:mb-6 flex gap-2 sm:gap-4">
              <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
                <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary-foreground" />
              </div>
              <div className="flex items-center gap-1 rounded-2xl bg-muted px-3 sm:px-4 py-2 sm:py-3">
                <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]"></div>
                <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]"></div>
                <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground"></div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-border bg-background p-3 sm:p-4">
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
          <div className="relative flex items-end gap-1 sm:gap-2 rounded-xl border border-input bg-card p-1.5 sm:p-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 sm:h-9 sm:w-9 shrink-0"
            >
              <Paperclip className="h-4 w-4" />
              <span className="sr-only">Attach file</span>
            </Button>
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your documents..."
              className="min-h-[40px] sm:min-h-[44px] max-h-[120px] sm:max-h-[200px] flex-1 resize-none border-0 bg-transparent px-1 sm:px-2 py-2.5 sm:py-3 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
              rows={1}
            />
            <Button
              type="submit"
              size="icon"
              className="h-8 w-8 sm:h-9 sm:w-9 shrink-0"
              disabled={!input.trim() || isLoading}
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </div>
          <p className="mt-2 text-center text-xs text-muted-foreground hidden sm:block">
            DocuMind AI can make mistakes. Verify important information.
          </p>
        </form>
      </div>
    </div>
  )
}
