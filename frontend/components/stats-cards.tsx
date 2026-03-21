import { FileText, MessageSquare, HardDrive, Zap } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const stats = [
  {
    title: "Total Documents",
    value: "247",
    change: "+12 this week",
    icon: FileText,
  },
  {
    title: "Chat Sessions",
    value: "1,284",
    change: "+89 this week",
    icon: MessageSquare,
  },
  {
    title: "Storage Used",
    value: "4.2 GB",
    change: "of 10 GB",
    icon: HardDrive,
  },
  {
    title: "AI Queries",
    value: "12.4K",
    change: "+2.1K this month",
    icon: Zap,
  },
]

export function StatsCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="border-border bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="mt-1 text-2xl font-semibold text-foreground">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{stat.change}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
