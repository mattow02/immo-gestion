"use client"

import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { deleteRequest } from "./actions"
import { toast } from "sonner"

export function DeleteRequestButton({ requestId }: { requestId: string }) {
  async function handleDelete() {
    const result = await deleteRequest(requestId)
    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success("Demande supprimee")
    }
  }

  return (
    <Button variant="ghost" size="sm" className="text-destructive h-7 px-2" onClick={handleDelete}>
      <Trash2 className="h-3.5 w-3.5" />
    </Button>
  )
}
