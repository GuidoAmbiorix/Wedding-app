-- ═══════════════════════════════════════════════════════════
-- MIGRACIÓN v3 — Cupos por novio en weddings
-- Solo agrega columnas, no toca data existente.
-- ═══════════════════════════════════════════════════════════

ALTER TABLE weddings
  ADD COLUMN IF NOT EXISTS total_capacity   integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS jennifer_quota   integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS guido_quota      integer DEFAULT 0;
