-- Phase 3: Payments + Documents + Storage

-- ============================================
-- Table: payments
-- ============================================
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  tenancy_id uuid not null references public.tenancies(id) on delete cascade,
  amount numeric not null,
  due_date date not null,
  paid_date date,
  status text default 'pending' check (status in ('paid', 'pending', 'late')),
  payment_method text check (payment_method in ('virement', 'cheque', 'especes', 'autre')),
  notes text,
  created_at timestamptz default now()
);

-- ============================================
-- Table: documents
-- ============================================
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  tenancy_id uuid references public.tenancies(id) on delete set null,
  type text not null check (type in ('bail', 'etat_des_lieux', 'quittance', 'assurance', 'autre')),
  name text not null,
  file_path text not null,
  uploaded_by uuid not null references public.profiles(id),
  uploaded_at timestamptz default now()
);

-- ============================================
-- RLS: payments
-- ============================================
alter table public.payments enable row level security;

create policy "Owners can manage payments on their properties"
  on public.payments for all using (
    auth.uid() in (
      select p.owner_id from public.properties p
      join public.tenancies t on t.property_id = p.id
      where t.id = tenancy_id
    )
  );

create policy "Tenants can view own payments"
  on public.payments for select using (
    auth.uid() in (
      select tenant_id from public.tenancies where id = tenancy_id
    )
  );

-- ============================================
-- RLS: documents
-- ============================================
alter table public.documents enable row level security;

create policy "Owners can manage documents on their properties"
  on public.documents for all using (
    auth.uid() in (
      select owner_id from public.properties where id = property_id
    )
  );

create policy "Tenants can view tenancy documents"
  on public.documents for select using (
    tenancy_id is not null and auth.uid() in (
      select tenant_id from public.tenancies where id = tenancy_id
    )
  );

-- ============================================
-- Storage bucket
-- ============================================
insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;

create policy "Owners can upload documents"
  on storage.objects for insert
  with check (
    bucket_id = 'documents'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Owners can read own documents"
  on storage.objects for select
  using (
    bucket_id = 'documents'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Owners can delete own documents"
  on storage.objects for delete
  using (
    bucket_id = 'documents'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
