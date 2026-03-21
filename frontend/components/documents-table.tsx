"use client"

import { useState } from "react"
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

const documents = [
  {
    id: "1",
    name: "Employee Handbook 2024.pdf",
    type: "pdf",
    size: "2.4 MB",
    uploadedAt: "Mar 12, 2024",
    status: "indexed",
  },
  {
    id: "2",
    name: "Q4 Financial Report.xlsx",
    type: "xlsx",
    size: "1.8 MB",
    uploadedAt: "Mar 10, 2024",
    status: "indexed",
  },
  {
    id: "3",
    name: "Product Roadmap.docx",
    type: "docx",
    size: "856 KB",
    uploadedAt: "Mar 8, 2024",
    status: "processing",
  },
  {
    id: "4",
    name: "Brand Guidelines.pdf",
    type: "pdf",
    size: "5.2 MB",
    uploadedAt: "Mar 5, 2024",
    status: "indexed",
  },
  {
    id: "5",
    name: "Meeting Notes - March.docx",
    type: "docx",
    size: "124 KB",
    uploadedAt: "Mar 3, 2024",
    status: "indexed",
  },
  {
    id: "6",
    name: "Architecture Diagram.png",
    type: "png",
    size: "3.1 MB",
    uploadedAt: "Feb 28, 2024",
    status: "indexed",
  },
]

const fileIcons = {
  pdf: FileText,
  xlsx: FileSpreadsheet,
  docx: FileText,
  png: FileImage,
}

const statusStyles = {
  indexed: "bg-primary/10 text-primary border-primary/20",
  processing: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  error: "bg-destructive/10 text-destructive border-destructive/20",
}

export function DocumentsTable() {
  const [selectedDocs, setSelectedDocs] = useState<string[]>([])

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

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border">
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedDocs.length === documents.length}
                  onCheckedChange={toggleAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead className="text-muted-foreground">Name</TableHead>
              <TableHead className="text-muted-foreground">Size</TableHead>
              <TableHead className="text-muted-foreground">Uploaded</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => {
              const FileIcon = fileIcons[doc.type as keyof typeof fileIcons] || FileText
              return (
                <TableRow
                  key={doc.id}
                  className="border-border hover:bg-muted/50"
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedDocs.includes(doc.id)}
                      onCheckedChange={() => toggleDoc(doc.id)}
                      aria-label={`Select ${doc.name}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
                        <FileIcon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <span className="font-medium text-foreground">{doc.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{doc.size}</TableCell>
                  <TableCell className="text-muted-foreground">{doc.uploadedAt}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={statusStyles[doc.status as keyof typeof statusStyles]}
                    >
                      {doc.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Chat with document
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:text-destructive">
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

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {documents.map((doc) => {
          const FileIcon = fileIcons[doc.type as keyof typeof fileIcons] || FileText
          return (
            <div
              key={doc.id}
              className="rounded-lg border border-border bg-card p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <Checkbox
                    checked={selectedDocs.includes(doc.id)}
                    onCheckedChange={() => toggleDoc(doc.id)}
                    aria-label={`Select ${doc.name}`}
                    className="shrink-0"
                  />
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted">
                    <FileIcon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground truncate">{doc.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">{doc.size}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{doc.uploadedAt}</span>
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Chat with document
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive focus:text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <Badge
                  variant="outline"
                  className={statusStyles[doc.status as keyof typeof statusStyles]}
                >
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
