"use client"

import { Plus, Upload } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { StatsCards } from "@/components/stats-cards"
import { DocumentsTable } from "@/components/documents-table"
import { useRequireAuth } from "@/lib/useRequireAuth"

export default function DashboardPage() {
   const { checking } = useRequireAuth()

  if (checking) return <div className="flex h-screen items-center justify-center"><span className="text-muted-foreground">Loading...</span></div>

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader 
          title="Dashboard" 
          description="Manage your documents and chat with AI"
          action={
            <Button asChild size="sm">
              <Link href="/dashboard/upload">
                <Upload className="mr-2 h-4 w-4" />
                Upload Document
              </Link>
            </Button>
          }
        />
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">
            {/* Stats */}
            <StatsCards />

            {/* Recent Documents */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Recent Documents</h2>
                  <p className="text-sm text-muted-foreground">Your recently uploaded files</p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/documents">View All</Link>
                </Button>
              </div>
              <DocumentsTable />
            </div>

            {/* Quick Actions */}
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              <Link 
                href="/dashboard/chat"
                className="group flex items-center gap-3 sm:gap-4 rounded-xl border border-border bg-card p-4 sm:p-6 transition-colors hover:border-primary/50 hover:bg-muted/50"
              >
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Plus className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-medium text-foreground group-hover:text-primary truncate">Start New Chat</h3>
                  <p className="text-sm text-muted-foreground truncate">Ask questions about your documents</p>
                </div>
              </Link>
              <Link 
                href="/dashboard/upload"
                className="group flex items-center gap-3 sm:gap-4 rounded-xl border border-border bg-card p-4 sm:p-6 transition-colors hover:border-primary/50 hover:bg-muted/50"
              >
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Upload className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-medium text-foreground group-hover:text-primary truncate">Upload Documents</h3>
                  <p className="text-sm text-muted-foreground truncate">Add new files to your knowledge base</p>
                </div>
              </Link>
              <Link 
                href="/dashboard/documents"
                className="group flex items-center gap-3 sm:gap-4 rounded-xl border border-border bg-card p-4 sm:p-6 transition-colors hover:border-primary/50 hover:bg-muted/50 sm:col-span-2 lg:col-span-1"
              >
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Plus className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-medium text-foreground group-hover:text-primary truncate">Browse Library</h3>
                  <p className="text-sm text-muted-foreground truncate">View and manage all documents</p>
                </div>
              </Link>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
