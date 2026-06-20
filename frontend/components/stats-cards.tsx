"use client"

import { useEffect, useState } from "react"
import { FileText, MessageSquare, HardDrive, Zap } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface DashboardStats {
  totalDocuments: number
  documentsThisWeek: number
  totalChatSessions: number
  chatsThisWeek: number
  storageUsedBytes: number
  storageUsedMb: number
  totalAiQueries: number
  aiQueriesThisMonth: number
}

const STORAGE_QUOTA_GB = 10 // placeholder until plans/limits (point #6) are built

function formatStorage(bytes: number) {
  const gb = bytes / 1024 / 1024 / 1024
  if (gb >= 1) return `${gb.toFixed(2)} GB`

  const mb = bytes / 1024 / 1024
  if (mb >= 1) return `${mb.toFixed(2)} MB`

  const kb = bytes / 1024
  return `${kb.toFixed(1)} KB`
}

function formatCount(value: number) {
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
  return value.toString()
}

export function StatsCards() {
  const [data, setData] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStats() {
      try {
        const token = localStorage.getItem("token")

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) throw new Error("Failed to load dashboard stats")

        const json: DashboardStats = await res.json()
        setData(json)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong")
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const stats = data
    ? [
      {
        title: "Total Documents",
        value: data.totalDocuments.toString(),
        change: `+${data.documentsThisWeek} this week`,
        icon: FileText,
      },
      {
        title: "Chat Sessions",
        value: formatCount(data.totalChatSessions),
        change: `+${data.chatsThisWeek} this week`,
        icon: MessageSquare,
      },
      {
        title: "Storage Used",
        value: formatStorage(data.storageUsedBytes),
        change: `of ${STORAGE_QUOTA_GB} GB`,
        icon: HardDrive,
      },
      {
        title: "AI Queries",
        value: formatCount(data.totalAiQueries),
        change: `+${formatCount(data.aiQueriesThisMonth)} this month`,
        icon: Zap,
      },
    ]
    : []

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
        {error}
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {(loading ? Array.from({ length: 4 }) : stats).map((stat, i) => (
        <Card key={loading ? i : (stat as any).title} className="border-border bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {loading ? (
                    <span className="inline-block h-4 w-24 animate-pulse rounded bg-muted" />
                  ) : (
                    (stat as any).title
                  )}
                </p>
                <p className="mt-1 text-2xl font-semibold text-foreground">
                  {loading ? (
                    <span className="inline-block h-6 w-16 animate-pulse rounded bg-muted" />
                  ) : (
                    (stat as any).value
                  )}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {loading ? (
                    <span className="inline-block h-3 w-20 animate-pulse rounded bg-muted" />
                  ) : (
                    (stat as any).change
                  )}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                {!loading && (() => {
                  const Icon = (stat as any).icon
                  return <Icon className="h-6 w-6 text-primary" />
                })()}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}