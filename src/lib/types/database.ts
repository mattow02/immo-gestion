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

export type InvitationCode = {
  id: string
  code: string
  property_id: string
  owner_id: string
  tenant_email: string | null
  used: boolean
  used_at: string | null
  created_at: string
}

export type TenancyStatus = "active" | "ended" | "pending"

export type Tenancy = {
  id: string
  property_id: string
  tenant_id: string
  start_date: string
  end_date: string | null
  rent_amount: number
  deposit_amount: number | null
  status: TenancyStatus
  created_at: string
  // joined
  property?: Property
  tenant?: Profile
}

export type RequestType = "repair" | "question" | "complaint" | "other"
export type RequestStatus = "open" | "in_progress" | "resolved" | "closed"
export type RequestPriority = "low" | "medium" | "high" | "urgent"

export type MaintenanceRequest = {
  id: string
  tenancy_id: string | null
  tenant_id: string
  property_id: string
  type: RequestType
  title: string
  description: string | null
  status: RequestStatus
  priority: RequestPriority
  created_at: string
  resolved_at: string | null
  // joined
  property?: Property
  tenant?: Profile
}
