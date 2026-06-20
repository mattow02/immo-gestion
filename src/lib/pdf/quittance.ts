import { jsPDF } from "jspdf"
import { formatCurrency, formatDate, formatMonth, PAYMENT_METHODS } from "@/lib/constants"

type QuittanceData = {
  tenantName: string
  tenantEmail: string
  ownerName: string
  propertyAddress: string
  propertyCity: string
  amount: number
  dueDate: string
  paidDate: string
  paymentMethod: string | null
}

export function generateQuittancePdf(data: QuittanceData): Blob {
  const doc = new jsPDF({ format: "a4", unit: "mm" })
  const w = doc.internal.pageSize.getWidth()
  let y = 30

  doc.setFontSize(18)
  doc.text("QUITTANCE DE LOYER", w / 2, y, { align: "center" })
  y += 15

  doc.setFontSize(10)
  doc.setTextColor(100)
  doc.text(`Periode : ${formatMonth(data.dueDate)}`, w / 2, y, { align: "center" })
  y += 20

  doc.setTextColor(0)
  doc.setFontSize(11)
  doc.text("BAILLEUR", 20, y)
  doc.setFontSize(10)
  y += 7
  doc.text(data.ownerName, 20, y)
  y += 15

  doc.setFontSize(11)
  doc.text("LOCATAIRE", 20, y)
  doc.setFontSize(10)
  y += 7
  doc.text(data.tenantName, 20, y)
  y += 5
  doc.text(data.tenantEmail, 20, y)
  y += 15

  doc.setFontSize(11)
  doc.text("BIEN", 20, y)
  doc.setFontSize(10)
  y += 7
  doc.text(`${data.propertyAddress}, ${data.propertyCity}`, 20, y)
  y += 20

  doc.setDrawColor(200)
  doc.line(20, y, w - 20, y)
  y += 10

  doc.setFontSize(11)
  doc.text("DETAILS DU PAIEMENT", 20, y)
  y += 10

  doc.setFontSize(10)
  const details = [
    ["Montant", formatCurrency(data.amount)],
    ["Date de paiement", formatDate(data.paidDate)],
    ["Methode", PAYMENT_METHODS.find((m) => m.value === data.paymentMethod)?.label || "-"],
  ]

  for (const [label, value] of details) {
    doc.text(label, 30, y)
    doc.text(value, 120, y)
    y += 7
  }

  y += 15
  doc.line(20, y, w - 20, y)
  y += 15

  doc.setFontSize(10)
  doc.text(
    `Je soussigne ${data.ownerName}, bailleur, donne quittance a ${data.tenantName}`,
    20, y, { maxWidth: w - 40 },
  )
  y += 10
  doc.text(
    `pour la somme de ${formatCurrency(data.amount)} au titre du loyer du mois de ${formatMonth(data.dueDate)}.`,
    20, y, { maxWidth: w - 40 },
  )

  y += 30
  doc.setTextColor(100)
  doc.setFontSize(9)
  doc.text(`Document genere le ${new Date().toLocaleDateString("fr-FR")}`, w / 2, y, { align: "center" })

  return doc.output("blob")
}
