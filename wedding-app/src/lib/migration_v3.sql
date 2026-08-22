-- ═══════════════════════════════════════════════════════════
-- MIGRACIÓN v3 — Cupos por novio en wedding_info
-- Solo agrega columnas, no toca data existente.
-- ═══════════════════════════════════════════════════════════

ALTER TABLE wedding_info
  ADD COLUMN IF NOT EXISTS total_capacity   integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS jennifer_quota   integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS guido_quota      integer DEFAULT 0;
