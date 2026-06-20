export type Profile = {
  id: string
  email: string
  role: "owner" | "tenant"
  full_name: string | null
  phone: string | null
  created_at: string
}

export type PropertyType = "apartment" | "house" | "studio" | "building"
export type PropertyStatus = "rented" | "vacant" | "maintenance"
export type DPE = "A" | "B" | "C" | "D" | "E" | "F" | "G"

export type Property = {
  id: string
  owner_id: string
  name: string | null
  address: string
  city: string
  postal_code: string
  surface_m2: number | null
  rooms: number | null
  property_type: PropertyType
  floor: number | null
  year_built: number | null
  purchase_price: number | null
  current_rent: number | null
  charges_monthly: number | null
  tax_annual: number | null
  dpe: DPE | null
  status: PropertyStatus
  notes: string | null
  created_at: string
  updated_at: string
}
