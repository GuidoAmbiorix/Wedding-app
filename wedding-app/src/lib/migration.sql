-- ═══════════════════════════════════════════════════════════
-- MIGRACIÓN — Jennifer & Guido Wedding App
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════

-- ── weddings: campos de contenido ───────────────────────────
ALTER TABLE weddings
  ADD COLUMN IF NOT EXISTS rsvp_deadline      date,
  ADD COLUMN IF NOT EXISTS theme              text DEFAULT 'forest',
  ADD COLUMN IF NOT EXISTS dress_code         text,
  ADD COLUMN IF NOT EXISTS venue_description  text,
  ADD COLUMN IF NOT EXISTS invitation_text    text,
  ADD COLUMN IF NOT EXISTS couple_photo_url   text,
  ADD COLUMN IF NOT EXISTS venue_photo_url    text,
  ADD COLUMN IF NOT EXISTS details_photo_url  text,
  ADD COLUMN IF NOT EXISTS registry_photo_url text;

-- ── guests: campos de invitación v1 (ya aplicados) ──────────
ALTER TABLE guests
  ADD COLUMN IF NOT EXISTS whatsapp              text,
  ADD COLUMN IF NOT EXISTS invitation_channel    text DEFAULT 'whatsapp',
  ADD COLUMN IF NOT EXISTS invitation_sent_at    timestamptz,
  ADD COLUMN IF NOT EXISTS invitation_viewed_at  timestamptz,
  ADD COLUMN IF NOT EXISTS adults_count          integer DEFAULT 1,
  ADD COLUMN IF NOT EXISTS children_count        integer DEFAULT 0;

-- ── guests: nuevo modelo de estado y grupos familiares ───────
ALTER TABLE guests
  ADD COLUMN IF NOT EXISTS guest_display_name text,
  ADD COLUMN IF NOT EXISTS guest_type         text DEFAULT 'individual',
  ADD COLUMN IF NOT EXISTS side               text DEFAULT '',
  ADD COLUMN IF NOT EXISTS status             text DEFAULT 'sin_enviar',
  ADD COLUMN IF NOT EXISTS members            jsonb DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS rsvp_notes         text;

-- Inferir guest_type desde datos existentes (si tienen members no vacíos = grupo)
UPDATE guests SET guest_type = 'grupo'
WHERE members IS NOT NULL AND jsonb_array_length(members) > 0;

-- Poblar guest_display_name con datos existentes
UPDATE guests
SET guest_display_name = TRIM(COALESCE(first_name,'') || ' ' || COALESCE(last_name,''))
WHERE guest_display_name IS NULL OR guest_display_name = '';

-- Constraint de valores válidos para status
-- (sin vista — todo es manual)
ALTER TABLE guests DROP CONSTRAINT IF EXISTS guests_status_check;
ALTER TABLE guests ADD CONSTRAINT guests_status_check
  CHECK (status IN (
    'sin_enviar',
    'enviada',
    'confirmado',
    'no_seguro',
    'no_puede_ir',
    'lista_de_espera'
  ));

-- Migrar status existente desde rsvps hacia guests.status
UPDATE guests g
SET status = CASE r.status
  WHEN 'attending' THEN 'confirmado'
  WHEN 'declined'  THEN 'no_puede_ir'
  WHEN 'maybe'     THEN 'no_seguro'
  ELSE
    CASE
      WHEN g.invitation_sent_at IS NOT NULL THEN 'enviada'
      ELSE 'sin_enviar'
    END
END
FROM rsvps r
WHERE r.guest_id = g.id;

-- ── rsvps: columna para respuestas por miembro ───────────────
ALTER TABLE rsvps
  ADD COLUMN IF NOT EXISTS members_responses jsonb DEFAULT '[]';

-- ── weddings: valores por defecto ───────────────────────────
UPDATE weddings SET
  rsvp_deadline     = '2026-10-01',
  dress_code        = 'Etiqueta formal. Nos inspira la paleta del bosque: verdes profundos, salvia y tonos tierra. Te pedimos reservar el blanco, marfil y crema para la novia.',
  venue_description = 'Celebraremos entre jardines y luz calida en uno de los rincones mas hermosos de la capital. Ceremonia y recepcion seran en el mismo lugar.',
  invitation_text   = 'Nos encantaria que estuvieras presente el dia en que digamos si frente a quienes mas amamos.'
WHERE id IS NOT NULL;
