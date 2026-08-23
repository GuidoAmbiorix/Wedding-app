-- ═══════════════════════════════════════════════════════════
-- MIGRACIÓN v5 — Sección "Save the Date"
-- Solo agrega una columna, no toca data existente. Idempotente.
-- ═══════════════════════════════════════════════════════════

ALTER TABLE wedding_info
  ADD COLUMN IF NOT EXISTS save_the_date_image_url text;
