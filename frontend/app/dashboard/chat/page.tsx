import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { ChatInterface } from "@/components/chat-interface"

export default function ChatPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col">
        <DashboardHeader 
          title="Chat with Documents" 
          description="Ask questions about your uploaded files"
        />
        <ChatInterface />
      </SidebarInset>
    </SidebarProvider>
  )
}
