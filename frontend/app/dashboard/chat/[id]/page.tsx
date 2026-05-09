"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { ChatInterface } from "@/components/chat-interface"

export default function ChatPage() {
  const params = useParams()
  const chatId = params.id as string

  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchChat = async () => {
      try {
        const token = localStorage.getItem("token")

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/search/${chatId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (!res.ok)
          throw new Error("Failed to fetch chat")

        const data = await res.json()

        setMessages(data.messages)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchChat()
  }, [chatId])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col">
        <DashboardHeader
          title="Chat"
          description="Continue your conversation"
        />

        <ChatInterface
          initialMessages={messages}
          currentChatId={chatId}
        />
      </SidebarInset>
    </SidebarProvider>
  )
}