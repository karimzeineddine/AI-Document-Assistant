import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { UploadZone } from "@/components/upload-zone"

export default function UploadPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader 
          title="Upload Documents" 
          description="Add new documents to your knowledge base"
        />
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="mx-auto max-w-3xl space-y-4 sm:space-y-6">
            <UploadZone />
            
            {/* Tips */}
            <div className="rounded-lg border border-border bg-card p-4 sm:p-6">
              <h3 className="text-sm font-medium text-foreground">Tips for better results</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  Use high-quality scans with clear text for PDFs
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  Keep file sizes under 50MB for faster processing
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  Use descriptive file names for easier searching
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  Documents are automatically indexed for AI search
                </li>
              </ul>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
