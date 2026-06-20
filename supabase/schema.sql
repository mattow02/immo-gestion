-- Immo-Gestion — Phase 1 Schema
-- Run this in the Supabase SQL Editor

-- ============================================
-- Table: profiles
-- ============================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role text not null default 'owner' check (role in ('owner', 'tenant')),
  full_name text,
  phone text,
  created_at timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'owner'),
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================
-- Table: properties
-- ============================================
create table public.properties (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text,
  address text not null,
  city text not null,
  postal_code text not null,
  surface_m2 numeric,
  rooms integer,
  property_type text default 'apartment' check (property_type in ('apartment','house','studio','building')),
  floor integer,
  year_built integer,
  purchase_price numeric,
  current_rent numeric,
  charges_monthly numeric,
  tax_annual numeric,
  dpe text check (dpe in ('A','B','C','D','E','F','G')),
  status text default 'vacant' check (status in ('rented','vacant','maintenance')),
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-update updated_at
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger properties_updated_at
  before update on public.properties
  for each row execute function public.update_updated_at();

-- ============================================
-- RLS Policies
-- ============================================
alter table public.profiles enable row level security;
alter table public.properties enable row level security;

create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Owners can view own properties"
  on public.properties for select using (auth.uid() = owner_id);
create policy "Owners can insert own properties"
  on public.properties for insert with check (auth.uid() = owner_id);
create policy "Owners can update own properties"
  on public.properties for update using (auth.uid() = owner_id);
create policy "Owners can delete own properties"
  on public.properties for delete using (auth.uid() = owner_id);
