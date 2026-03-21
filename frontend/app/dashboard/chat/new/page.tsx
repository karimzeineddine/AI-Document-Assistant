"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Send, Paperclip, Sparkles, FileText, MessageSquare, Search, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"

const suggestionCards = [
  {
    icon: FileText,
    title: "Summarize a document",
    description: "Get a quick overview of any uploaded document",
  },
  {
    icon: Search,
    title: "Find specific information",
    description: "Search for facts, figures, or clauses across documents",
  },
  {
    icon: MessageSquare,
    title: "Compare documents",
    description: "Identify differences between multiple versions",
  },
  {
    icon: Zap,
    title: "Extract key insights",
    description: "Pull out important takeaways and action items",
  },
]

export default function NewChatPage() {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    setIsLoading(true)
    // Simulate creating a new chat and redirect
    await new Promise((resolve) => setTimeout(resolve, 500))
    // In a real app, this would create a chat and redirect to it
    router.push("/dashboard/chat")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleSuggestionClick = (title: string) => {
    setInput(title)
    textareaRef.current?.focus()
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader title="New Chat" />
        <main className="flex-1 flex flex-col bg-background">
          <div className="flex-1 flex flex-col items-center justify-center px-3 sm:px-4 py-6 sm:py-8">
            <div className="w-full max-w-2xl space-y-6 sm:space-y-8">
              {/* Welcome Section */}
              <div className="text-center space-y-3 sm:space-y-4">
                <div className="flex justify-center">
                  <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-xl sm:rounded-2xl bg-primary/10">
                    <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                  </div>
                </div>
                <h1 className="text-xl sm:text-2xl font-semibold text-foreground">
                  How can I help you today?
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto px-2">
                  Ask me anything about your documents. I can search, summarize, compare, and extract insights.
                </p>
              </div>

              {/* Suggestion Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {suggestionCards.map((card, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(card.title)}
                    className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl border border-border bg-card text-left hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <card.icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="space-y-0.5 sm:space-y-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{card.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">{card.description}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Input Area */}
              <form onSubmit={handleSubmit}>
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
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
