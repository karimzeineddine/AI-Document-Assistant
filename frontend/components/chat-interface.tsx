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

export function ChatInterface({ initialQuestion }: { initialQuestion?: string }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)

  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // 🔥 Send message (USED EVERYWHERE)
  const sendMessage = async (question: string, chatId: string | null) => {
    if (!question.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: question,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      const token = localStorage.getItem("token")
      console.log("Token being sent:", token)  // ← is it null?

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/search/ask`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            question,
            chatId,
          }),
        }
      )

      if (!res.ok) {
  const text = await res.text()
  console.error("Status:", res.status)      // ← add this
  console.error("API ERROR:", text)
  throw new Error(text)
}

      const data = await res.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.answer,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      setCurrentChatId(data.chatId)

    } catch (err) {
      console.error(err)

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          role: "assistant",
          content: "Something went wrong. Please try again.",
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  // 🔥 Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const question = input.trim()
    setInput("")

    await sendMessage(question, currentChatId)
  }

  // 🔥 Enter key submit
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  // 🔥 Auto-send initial question (ONLY ONCE)
  // Add this ref
const hasSentInitial = useRef(false)

// Update the useEffect
useEffect(() => {
  if (initialQuestion && messages.length === 0 && !hasSentInitial.current) {
    hasSentInitial.current = true  // ← mark as sent before calling
    sendMessage(initialQuestion, null)
  }
}, [initialQuestion])

  return (
    <div className="flex h-full flex-col">
      
      {/* Messages */}
      <ScrollArea ref={scrollRef} className="flex-1 px-3 sm:px-4">
        <div className="mx-auto max-w-3xl py-4 sm:py-6">

          {/* ✅ Empty state */}
          {messages.length === 0 && !isLoading && (
            <div className="text-center text-muted-foreground mt-10">
              <p className="text-sm">
                Start a conversation by asking about your documents.
              </p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "mb-4 sm:mb-6 flex gap-2 sm:gap-4",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {message.role === "assistant" && (
                <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-primary">
                  <Sparkles className="h-4 w-4 text-primary-foreground" />
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
                    "rounded-2xl px-3 sm:px-4 py-2 sm:py-3 text-sm",
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
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              {message.role === "user" && (
                <div className="hidden sm:flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </div>
          ))}

          {/* Loading */}
          {isLoading && (
            <div className="mb-6 flex gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="flex items-center gap-1 rounded-2xl bg-muted px-4 py-3">
                <div className="h-2 w-2 animate-bounce bg-muted-foreground rounded-full"></div>
                <div className="h-2 w-2 animate-bounce bg-muted-foreground rounded-full delay-150"></div>
                <div className="h-2 w-2 animate-bounce bg-muted-foreground rounded-full delay-300"></div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t border-border bg-background p-3 sm:p-4">
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
          <div className="flex items-end gap-2 rounded-xl border bg-card p-2">
            <Button type="button" variant="ghost" size="icon">
              <Paperclip className="h-4 w-4" />
            </Button>

            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your documents..."
              className="flex-1 resize-none border-0 bg-transparent focus-visible:ring-0"
              rows={1}
            />

            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isLoading}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}