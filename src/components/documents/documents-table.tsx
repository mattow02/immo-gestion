"use client"

import { Download, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DOCUMENT_TYPES, formatDate } from "@/lib/constants"
import { deleteDocument } from "@/app/(dashboard)/documents/actions"
import { toast } from "sonner"
import type { Document } from "@/lib/types/database"

type DocumentRow = Document & {
  property: { name: string | null; address: string } | null
}

export function DocumentsTable({ documents, canDelete = true }: { documents: DocumentRow[]; canDelete?: boolean }) {
  async function handleDelete(id: string) {
    const result = await deleteDocument(id)
    if (result?.error) toast.error(result.error)
    else toast.success("Document supprime")
  }

  if (documents.length === 0) {
    return <p className="text-center py-12 text-muted-foreground">Aucun document.</p>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nom</TableHead>
          <TableHead>Bien</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Date</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {documents.map((doc) => {
          const docType = DOCUMENT_TYPES.find((t) => t.value === doc.type)
          return (
            <TableRow key={doc.id}>
              <TableCell className="font-medium">{doc.name}</TableCell>
              <TableCell className="text-muted-foreground">{doc.property?.name || doc.property?.address || "-"}</TableCell>
              <TableCell><Badge variant="secondary">{docType?.label}</Badge></TableCell>
              <TableCell className="text-muted-foreground">{formatDate(doc.uploaded_at)}</TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <a href={`/api/documents/${doc.id}`} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="icon" title="Telecharger"><Download className="h-4 w-4" /></Button>
                  </a>
                  {canDelete && (
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(doc.id)} title="Supprimer">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
