-- ═══════════════════════════════════════════════════════════
-- MIGRACIÓN v2 — Tipo de invitado + Parte del novio
-- Solo ejecuta esto si ya corriste migration.sql antes.
-- Es seguro: solo agrega columnas, no toca data existente.
-- ═══════════════════════════════════════════════════════════

-- ── Nuevas columnas en guests ─────────────────────────────
ALTER TABLE guests
  ADD COLUMN IF NOT EXISTS guest_type text DEFAULT 'individual',
  ADD COLUMN IF NOT EXISTS side       text DEFAULT '';

-- ── Inferir guest_type desde members ya existentes ────────
-- Si el registro ya tiene miembros (jsonb array no vacío) → grupo
UPDATE guests
SET guest_type = 'grupo'
WHERE guest_type = 'individual'
  AND members IS NOT NULL
  AND members != 'null'::jsonb
  AND jsonb_array_length(members) > 0;
