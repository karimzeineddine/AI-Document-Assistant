"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getToken } from "@/lib/auth"

export function useRequireAuth() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    if (!getToken()) {
      router.push("/")
    } else {
      setChecking(false)
    }
  }, [])

  return { checking }
}