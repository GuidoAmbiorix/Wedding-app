-- ═══════════════════════════════════════════════════════════
-- MIGRACIÓN v6 — Cuentas bancarias en vez de tiendas de regalo
-- Solo agrega una tabla nueva, no toca data existente. Idempotente.
-- La tabla wedding_registry (tiendas) queda sin usar en el sitio,
-- pero no se borra por si quieres volver a usarla.
-- ═══════════════════════════════════════════════════════════

create table if not exists wedding_bank_accounts (
  id uuid primary key default gen_random_uuid(),
  bank_name text not null,
  account_number text not null,
  holder_name text not null,
  account_type text check (account_type in ('ahorros','corriente')) default 'ahorros',
  holder_id text,
  note text,
  sort_order integer default 0,
  created_at timestamptz default now()
);

alter table wedding_bank_accounts enable row level security;

drop policy if exists "Public read wedding_bank_accounts" on wedding_bank_accounts;
create policy "Public read wedding_bank_accounts" on wedding_bank_accounts for select using (true);

drop policy if exists "Anyone can insert wedding_bank_accounts" on wedding_bank_accounts;
create policy "Anyone can insert wedding_bank_accounts" on wedding_bank_accounts for insert with check (true);

drop policy if exists "Anyone can update wedding_bank_accounts" on wedding_bank_accounts;
create policy "Anyone can update wedding_bank_accounts" on wedding_bank_accounts for update using (true);

drop policy if exists "Anyone can delete wedding_bank_accounts" on wedding_bank_accounts;
create policy "Anyone can delete wedding_bank_accounts" on wedding_bank_accounts for delete using (true);
