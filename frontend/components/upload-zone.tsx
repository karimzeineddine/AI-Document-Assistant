"use client"

import { useState, useCallback } from "react"
import { Upload, FileText, X, CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface UploadFile {
  id: string
  name: string
  size: number
  progress: number
  status: "uploading" | "complete" | "error"
}

export function UploadZone() {
  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState<UploadFile[]>([])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const simulateUpload = (file: File) => {
    const uploadFile: UploadFile = {
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      progress: 0,
      status: "uploading",
    }

    setFiles((prev) => [...prev, uploadFile])

    // Simulate progress
    const interval = setInterval(() => {
      setFiles((prev) =>
        prev.map((f) => {
          if (f.id === uploadFile.id) {
            const newProgress = Math.min(f.progress + Math.random() * 20, 100)
            return {
              ...f,
              progress: newProgress,
              status: newProgress >= 100 ? "complete" : "uploading",
            }
          }
          return f
        })
      )
    }, 300)

    setTimeout(() => {
      clearInterval(interval)
      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id ? { ...f, progress: 100, status: "complete" } : f
        )
      )
    }, 3000)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    droppedFiles.forEach(simulateUpload)
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (selectedFiles) {
      Array.from(selectedFiles).forEach(simulateUpload)
    }
  }

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  return (
    <div className="space-y-6">
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 sm:p-12 transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border bg-card hover:border-muted-foreground/50"
        )}
      >
        <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-muted">
          <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-base sm:text-lg font-medium text-foreground text-center">
          Drop your documents here
        </h3>
        <p className="mt-1 text-sm text-muted-foreground text-center">
          or tap to browse from your device
        </p>
        <input
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.txt,.xlsx,.csv,.png,.jpg,.jpeg"
          onChange={handleFileSelect}
          className="absolute inset-0 cursor-pointer opacity-0"
        />
        <div className="mt-4 sm:mt-6">
          <Button variant="outline" className="pointer-events-none">
            Browse Files
          </Button>
        </div>
        <p className="mt-4 text-xs text-muted-foreground text-center px-2">
          PDF, DOC, DOCX, TXT, XLSX, CSV, PNG, JPG
        </p>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Uploading files</h4>
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-4 rounded-lg border border-border bg-card p-4"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="truncate text-sm font-medium text-foreground">
                    {file.name}
                  </p>
                  <div className="flex items-center gap-2">
                    {file.status === "complete" && (
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    )}
                    {file.status === "uploading" && (
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => removeFile(file.id)}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>
                </div>
                <div className="mt-1 flex items-center gap-3">
                  <Progress value={file.progress} className="h-1.5 flex-1" />
                  <span className="text-xs text-muted-foreground">
                    {formatSize(file.size)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
