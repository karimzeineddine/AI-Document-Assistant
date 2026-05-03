"use client"

import { useState, useEffect } from "react"
import {
  FileText,
  FileSpreadsheet,
  FileImage,
  MoreHorizontal,
  Download,
  Trash2,
  MessageSquare,
  Eye,
} from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

export function DocumentsTable() {
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDocs, setSelectedDocs] = useState<string[]>([])

  const fileIcons = {
    pdf: FileText,
    xlsx: FileSpreadsheet,
    docx: FileText,
    png: FileImage,
  }

  const statusStyles = {
    Ready: "bg-primary/10 text-primary border-primary/20",
    processing: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    error: "bg-destructive/10 text-destructive border-destructive/20",
  }

  // ✅ Fetch documents
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const token = localStorage.getItem("token")

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/documents`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (!res.ok) throw new Error("Failed to fetch")

        const data = await res.json()
        setDocuments(data)

      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchDocuments()
  }, [])

  const toggleAll = () => {
    if (selectedDocs.length === documents.length) {
      setSelectedDocs([])
    } else {
      setSelectedDocs(documents.map((d) => d.id))
    }
  }

  const toggleDoc = (id: string) => {
    if (selectedDocs.includes(id)) {
      setSelectedDocs(selectedDocs.filter((d) => d !== id))
    } else {
      setSelectedDocs([...selectedDocs, id])
    }
  }

  // ✅ Loading state
  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading documents...</p>
  }

  // ✅ Empty state
  if (documents.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No documents uploaded yet.
      </p>
    )
  }

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:block rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border">
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedDocs.length === documents.length}
                  onCheckedChange={toggleAll}
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Uploaded</TableHead>
              <TableHead>Status</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>

          <TableBody>
            {documents.map((doc) => {
              const fileType = doc.name.split(".").pop()

              const FileIcon =
                fileIcons[fileType as keyof typeof fileIcons] || FileText

              const formattedSize =
                doc.size < 1024
                  ? `${doc.size} B`
                  : doc.size < 1024 * 1024
                  ? `${(doc.size / 1024).toFixed(1)} KB`
                  : `${(doc.size / (1024 * 1024)).toFixed(1)} MB`

              const formattedDate = new Date(doc.uploadedAt).toLocaleDateString()

              return (
                <TableRow key={doc.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedDocs.includes(doc.id)}
                      onCheckedChange={() => toggleDoc(doc.id)}
                    />
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
                        <FileIcon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <span>{doc.name}</span>
                    </div>
                  </TableCell>

                  <TableCell>{formattedSize}</TableCell>
                  <TableCell>{formattedDate}</TableCell>

                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        statusStyles[doc.status as keyof typeof statusStyles]
                      }
                    >
                      {doc.status}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>

                        <DropdownMenuItem>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Chat
                        </DropdownMenuItem>

                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Mobile */}
      <div className="md:hidden space-y-3">
        {documents.map((doc) => {
          const fileType = doc.name.split(".").pop()
          const FileIcon =
            fileIcons[fileType as keyof typeof fileIcons] || FileText

          const formattedSize =
            doc.size < 1024
              ? `${doc.size} B`
              : doc.size < 1024 * 1024
              ? `${(doc.size / 1024).toFixed(1)} KB`
              : `${(doc.size / (1024 * 1024)).toFixed(1)} MB`

          const formattedDate = new Date(doc.uploadedAt).toLocaleDateString()

          return (
            <div key={doc.id} className="rounded-lg border p-4">
              <div className="flex justify-between">
                <div className="flex gap-3">
                  <FileIcon className="h-5 w-5" />
                  <div>
                    <p>{doc.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formattedSize} • {formattedDate}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <Badge variant="outline">
                  {doc.status}
                </Badge>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}