-- ═══════════════════════════════════════════════════════════
-- MIGRACIÓN v9 — Paleta de vestimenta configurable
-- Solo agrega una tabla nueva, no toca data existente. Idempotente.
-- ═══════════════════════════════════════════════════════════

create table if not exists wedding_dress_palette (
  id uuid primary key default gen_random_uuid(),
  color text not null,
  label text,
  sort_order integer default 0,
  created_at timestamptz default now()
);

alter table wedding_dress_palette enable row level security;

drop policy if exists "Public read wedding_dress_palette" on wedding_dress_palette;
create policy "Public read wedding_dress_palette" on wedding_dress_palette for select using (true);

drop policy if exists "Anyone can insert wedding_dress_palette" on wedding_dress_palette;
create policy "Anyone can insert wedding_dress_palette" on wedding_dress_palette for insert with check (true);

drop policy if exists "Anyone can update wedding_dress_palette" on wedding_dress_palette;
create policy "Anyone can update wedding_dress_palette" on wedding_dress_palette for update using (true);

drop policy if exists "Anyone can delete wedding_dress_palette" on wedding_dress_palette;
create policy "Anyone can delete wedding_dress_palette" on wedding_dress_palette for delete using (true);

-- Nota: se le grantea explícito a anon/authenticated porque en esta
-- instancia self-hosted las tablas nuevas no heredan privilegios por
-- default (ver bug de wedding_bank_accounts / wedding_venue_photos).
GRANT SELECT, INSERT, UPDATE, DELETE ON wedding_dress_palette TO anon, authenticated;

-- Semilla con la paleta de referencia (podés editarla desde Configuración).
-- Solo inserta si la tabla está vacía, para que correr esta migración de
-- nuevo no duplique filas.
insert into wedding_dress_palette (color, label, sort_order)
select * from (values
  ('#666352', 'Verde Oliva',    1),
  ('#454637', 'Verde Bosque',   2),
  ('#9C8E9D', 'Lavanda Suave',  3),
  ('#6A505B', 'Morado Grisáceo',4),
  ('#B08483', 'Rosa Viejo',     5),
  ('#87604F', 'Terracota Suave',6),
  ('#5A4238', 'Marrón Moka',    7),
  ('#A48266', 'Dorado Antiguo', 8)
) as seed(color, label, sort_order)
where not exists (select 1 from wedding_dress_palette);
