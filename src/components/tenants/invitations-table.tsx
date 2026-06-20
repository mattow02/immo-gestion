"use client"

import { useState } from "react"
import { Copy, Check, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { deleteInvitation } from "@/app/(dashboard)/tenants/actions"
import { toast } from "sonner"
import type { InvitationCode } from "@/lib/types/database"

type InvitationWithJoins = InvitationCode & {
  property: { name: string | null; address: string } | null
}

export function InvitationsTable({ invitations }: { invitations: InvitationWithJoins[] }) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  async function handleCopy(code: string, id: string) {
    await navigator.clipboard.writeText(code)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  async function handleDelete(id: string) {
    const result = await deleteInvitation(id)
    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success("Code supprime")
    }
  }

  if (invitations.length === 0) {
    return <p className="text-sm text-muted-foreground py-8 text-center">Aucun code d&apos;invitation.</p>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Code</TableHead>
          <TableHead>Bien</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invitations.map((inv) => (
          <TableRow key={inv.id}>
            <TableCell className="font-mono tracking-wider font-medium">{inv.code}</TableCell>
            <TableCell>{inv.property?.name || inv.property?.address}</TableCell>
            <TableCell className="text-muted-foreground">{inv.tenant_email || "-"}</TableCell>
            <TableCell>
              {inv.used ? (
                <Badge variant="secondary" className="bg-gray-100 text-gray-800">Utilise</Badge>
              ) : (
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">Disponible</Badge>
              )}
            </TableCell>
            <TableCell>
              <div className="flex gap-1">
                {!inv.used && (
                  <>
                    <Button variant="ghost" size="icon" onClick={() => handleCopy(inv.code, inv.id)}>
                      {copiedId === inv.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(inv.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
