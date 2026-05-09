"use client"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { ChatInterface } from "@/components/chat-interface"
import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"

export default function ChatPage() {
  const [input, setInput] = useState("")
  const searchParams = useSearchParams()
  const initialQuestion = searchParams.get("question")

  useEffect(() => {
    if (initialQuestion) {
      setInput(initialQuestion)
    }
  }, [initialQuestion])

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col">
        <DashboardHeader
          title="Chat with Documents"
          description="Ask questions about your uploaded files"
        />
        <ChatInterface initialQuestion={initialQuestion || ""} />
      </SidebarInset>
    </SidebarProvider>
  )
}
