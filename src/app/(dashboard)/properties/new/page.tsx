import { Header } from "@/components/layout/header"
import { PropertyForm } from "@/components/properties/property-form"
import { createProperty } from "../actions"

export default function NewPropertyPage() {
  return (
    <>
      <Header title="Ajouter un bien" />
      <div className="p-6 max-w-3xl">
        <PropertyForm action={createProperty} submitLabel="Ajouter le bien" />
      </div>
    </>
  )
}
