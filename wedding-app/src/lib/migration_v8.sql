-- ═══════════════════════════════════════════════════════════
-- MIGRACIÓN v8 — Colores de marca (primary/secondary/texto) configurables
-- Solo agrega columnas con default, no toca data existente. Idempotente.
-- ═══════════════════════════════════════════════════════════

ALTER TABLE wedding_info
  ADD COLUMN IF NOT EXISTS theme_primary   text DEFAULT '#808A68',
  ADD COLUMN IF NOT EXISTS theme_secondary text DEFAULT '#EEEFE1',
  ADD COLUMN IF NOT EXISTS theme_text      text DEFAULT '#3a3623';
