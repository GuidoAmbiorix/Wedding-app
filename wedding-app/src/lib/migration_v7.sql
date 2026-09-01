-- ═══════════════════════════════════════════════════════════
-- MIGRACIÓN v7 — Varias fotos para la sección Venue (antes 1 sola)
-- Solo agrega una tabla nueva, no toca data existente. Idempotente.
-- ═══════════════════════════════════════════════════════════

create table if not exists wedding_venue_photos (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  caption text,
  sort_order integer default 0,
  created_at timestamptz default now()
);

alter table wedding_venue_photos enable row level security;

drop policy if exists "Public read wedding_venue_photos" on wedding_venue_photos;
create policy "Public read wedding_venue_photos" on wedding_venue_photos for select using (true);

drop policy if exists "Anyone can insert wedding_venue_photos" on wedding_venue_photos;
create policy "Anyone can insert wedding_venue_photos" on wedding_venue_photos for insert with check (true);

drop policy if exists "Anyone can update wedding_venue_photos" on wedding_venue_photos;
create policy "Anyone can update wedding_venue_photos" on wedding_venue_photos for update using (true);

drop policy if exists "Anyone can delete wedding_venue_photos" on wedding_venue_photos;
create policy "Anyone can delete wedding_venue_photos" on wedding_venue_photos for delete using (true);

-- Nota: se le grantea explícito a anon/authenticated porque en esta
-- instancia self-hosted las tablas nuevas no heredan privilegios por
-- default (ver bug de wedding_bank_accounts).
GRANT SELECT, INSERT, UPDATE, DELETE ON wedding_venue_photos TO anon, authenticated;
