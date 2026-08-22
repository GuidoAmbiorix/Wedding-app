-- ═══════════════════════════════════════════════════════════
-- MIGRACIÓN v4 — Rediseño (paleta oliva/chocolate + nuevas secciones)
-- Solo agrega columnas/tablas, no toca data existente. Segura de
-- correr más de una vez (idempotente).
--
-- Orden de ejecución en una instancia de Supabase NUEVA (vacía):
--   1. schema.sql
--   2. migration.sql
--   3. migration_v2.sql
--   4. migration_v3.sql
--   5. migration_v4.sql   (este archivo)
--
-- Si ya tenías datos migrados desde otra instancia con el schema
-- completo, basta con correr este archivo.
-- ═══════════════════════════════════════════════════════════

ALTER TABLE wedding_info
  ADD COLUMN IF NOT EXISTS ceremony_info   text,
  ADD COLUMN IF NOT EXISTS transport_info  text,
  ADD COLUMN IF NOT EXISTS drinking_note   text,
  ADD COLUMN IF NOT EXISTS cover_video_url text;

ALTER TABLE wedding_faq
  ADD COLUMN IF NOT EXISTS category text;

-- Año a mostrar en la foto polaroid de la sección "Our love story"
ALTER TABLE wedding_gallery_photos
  ADD COLUMN IF NOT EXISTS year text;

-- Wedding party (padrinos, damas, etc.) — sección "Wedding Party"
create table if not exists wedding_party (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role_label text,
  role_group text check (role_group in ('honor','bridesmaid','groomsman')) default 'bridesmaid',
  photo_url text,
  bio text,
  sort_order integer default 0,
  created_at timestamptz default now()
);

alter table wedding_party enable row level security;

drop policy if exists "Public read wedding_party" on wedding_party;
create policy "Public read wedding_party" on wedding_party for select using (true);

drop policy if exists "Anyone can insert wedding_party" on wedding_party;
create policy "Anyone can insert wedding_party" on wedding_party for insert with check (true);

drop policy if exists "Anyone can update wedding_party" on wedding_party;
create policy "Anyone can update wedding_party" on wedding_party for update using (true);

drop policy if exists "Anyone can delete wedding_party" on wedding_party;
create policy "Anyone can delete wedding_party" on wedding_party for delete using (true);
