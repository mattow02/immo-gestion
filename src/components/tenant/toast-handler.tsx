"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"

export function ToastHandler({ paramKey, message }: { paramKey: string; message: string }) {
  const searchParams = useSearchParams()
  useEffect(() => {
    if (searchParams.get(paramKey) === "true") {
      toast.success(message)
      window.history.replaceState({}, "", window.location.pathname)
    }
  }, [searchParams, paramKey, message])
  return null
}
