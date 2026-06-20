-- Phase 2: Tenants, Tenancies, Requests, Invitation Codes

-- ============================================
-- Table: invitation_codes
-- ============================================
create table if not exists public.invitation_codes (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  property_id uuid not null references public.properties(id) on delete cascade,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  tenant_email text,
  used boolean default false,
  used_at timestamptz,
  created_at timestamptz default now()
);

-- ============================================
-- Table: tenancies
-- ============================================
create table if not exists public.tenancies (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  tenant_id uuid not null references public.profiles(id) on delete cascade,
  start_date date not null,
  end_date date,
  rent_amount numeric not null,
  deposit_amount numeric,
  status text default 'active' check (status in ('active', 'ended', 'pending')),
  created_at timestamptz default now()
);

-- ============================================
-- Table: requests
-- ============================================
create table if not exists public.requests (
  id uuid primary key default gen_random_uuid(),
  tenancy_id uuid references public.tenancies(id) on delete cascade,
  tenant_id uuid not null references public.profiles(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  type text default 'repair' check (type in ('repair', 'question', 'complaint', 'other')),
  title text not null,
  description text,
  status text default 'open' check (status in ('open', 'in_progress', 'resolved', 'closed')),
  priority text default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  created_at timestamptz default now(),
  resolved_at timestamptz
);

-- ============================================
-- RLS: invitation_codes
-- ============================================
alter table public.invitation_codes enable row level security;

create policy "Owners can manage own invitation codes"
  on public.invitation_codes for all using (auth.uid() = owner_id);
create policy "Anyone can read valid invitation code"
  on public.invitation_codes for select using (true);

-- ============================================
-- RLS: tenancies
-- ============================================
alter table public.tenancies enable row level security;

create policy "Owners can view tenancies of their properties"
  on public.tenancies for select using (
    auth.uid() in (select owner_id from public.properties where id = property_id)
  );
create policy "Owners can manage tenancies of their properties"
  on public.tenancies for all using (
    auth.uid() in (select owner_id from public.properties where id = property_id)
  );
create policy "Tenants can view own tenancies"
  on public.tenancies for select using (auth.uid() = tenant_id);

-- ============================================
-- RLS: requests
-- ============================================
alter table public.requests enable row level security;

create policy "Tenants can manage own requests"
  on public.requests for all using (auth.uid() = tenant_id);
create policy "Owners can view requests on their properties"
  on public.requests for select using (
    auth.uid() in (select owner_id from public.properties where id = property_id)
  );
create policy "Owners can update requests on their properties"
  on public.requests for update using (
    auth.uid() in (select owner_id from public.properties where id = property_id)
  );
