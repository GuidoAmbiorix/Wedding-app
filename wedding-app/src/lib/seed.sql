-- ============================================
-- SEED INICIAL: Jennifer Alondra & Guido Ambiorix
-- Ejecutar DESPUÉS del schema.sql en Supabase SQL Editor
-- ============================================

-- 1. Datos principales de la boda
INSERT INTO wedding_info (
  couple_name_1, couple_name_2, wedding_date,
  venue, venue_address, story, theme
) VALUES (
  'Jennifer Alondra',
  'Guido Ambiorix',
  '2026-11-15',
  'Bosque San Miguel',
  'Carretera al Bosque km 12, San Miguel',
  'Todo comenzó una tarde de otoño en la que ninguno de los dos esperaba encontrar nada especial. Él llegó tarde, ella estaba a punto de irse. Un café, una conversación que no quería terminar, y así comenzó todo. Años después, seguimos eligiéndonos cada día.',
  'forest'
) ON CONFLICT DO NOTHING;

-- 2. Eventos
INSERT INTO wedding_events (name, event_date, event_time, venue, address, dress_code, notes, sort_order)
VALUES
  (
    'Ceremonia',
    '2026-11-15', '16:00',
    'Capilla del Bosque',
    'Sendero Principal, Bosque San Miguel',
    'Elegante — tonos tierra, verde o morado',
    'Les pedimos llegar 20 minutos antes.',
    1
  ),
  (
    'Cóctel',
    '2026-11-15', '17:30',
    'Jardín del Bosque',
    'Área exterior, Bosque San Miguel',
    'Elegante',
    'Música en vivo mientras disfrutamos el atardecer entre los árboles.',
    2
  ),
  (
    'Recepción',
    '2026-11-15', '19:00',
    'Gran Salón del Bosque',
    'Salón Principal, Bosque San Miguel',
    'Elegante — tonos tierra, verde o morado',
    'Cena, baile y celebración hasta la madrugada.',
    3
  )
ON CONFLICT DO NOTHING;

-- 3. FAQ
INSERT INTO wedding_faq (question, answer, sort_order)
VALUES
  (
    '¿Cuál es el dress code?',
    'Pedimos vestimenta elegante. Nos encantaría que se inspiren en la paleta del bosque: verdes, tierra, champagne, morado o negro. Eviten el blanco y el rojo.',
    1
  ),
  (
    '¿Hay estacionamiento?',
    'Sí, contamos con estacionamiento gratuito en el venue. También habrá servicio de valet parking.',
    2
  ),
  (
    '¿Puedo llevar niños?',
    'La ceremonia y recepción son exclusivamente para adultos. Si necesitas ayuda con opciones de cuidado infantil, no dudes en contactarnos.',
    3
  ),
  (
    '¿Habrá opciones vegetarianas o veganas?',
    'Por supuesto. Al confirmar tu asistencia podrás indicar tu preferencia de menú, incluyendo opciones vegetarianas y veganas.',
    4
  ),
  (
    '¿Cuándo debo confirmar mi asistencia?',
    'Por favor confirma antes del 15 de octubre de 2026 usando el enlace personalizado que te enviamos.',
    5
  ),
  (
    '¿Puedo tomar fotos durante la ceremonia?',
    'Durante la ceremonia les pedimos que disfruten el momento sin teléfonos. Tendremos fotógrafo profesional. En la recepción ¡todo vale!',
    6
  )
ON CONFLICT DO NOTHING;

-- 4. Opciones de alojamiento
INSERT INTO wedding_accommodations (hotel_name, address, url, promo_code, price_range, distance_km)
VALUES
  (
    'Hotel Bosque & Spa',
    'Av. del Pinar 45, San Miguel',
    'https://hotelbosque.com',
    'JENNIFER2026',
    '$120 - $180 / noche',
    0.5
  ),
  (
    'Posada La Encina',
    'Calle de los Robles 12, San Miguel',
    'https://posadaencina.com',
    'GUIDO2026',
    '$80 - $120 / noche',
    1.2
  ),
  (
    'Airbnb — Cabañas del Bosque',
    'Zona rural, San Miguel',
    'https://airbnb.com',
    NULL,
    '$60 - $150 / noche',
    2.0
  )
ON CONFLICT DO NOTHING;

-- 5. Mesa de regalos
INSERT INTO wedding_registry (store_name, store_url, description)
VALUES
  (
    'Liverpool',
    'https://www.liverpool.com.mx/tienda/content/EventoEspecial',
    'Nuestra lista en Liverpool con artículos para el hogar.'
  ),
  (
    'Amazon',
    'https://www.amazon.com.mx/wedding',
    'Lista en Amazon con una selección variada.'
  ),
  (
    'Sobre de regalo',
    NULL,
    'Si lo prefieres, un sobre siempre es bienvenido con mucho amor.'
  )
ON CONFLICT DO NOTHING;

-- 6. Álbum de galería
INSERT INTO wedding_albums (name)
VALUES
  ('Sesión de Compromiso'),
  ('Nuestra Historia'),
  ('El Gran Día')
ON CONFLICT DO NOTHING;

-- 7. Invitados de ejemplo + RSVP automático
-- (descomenta para cargar invitados de prueba)
/*
INSERT INTO wedding_guests (first_name, last_name, email, guest_group, plus_one_allowed, table_name)
VALUES
  ('María', 'García', 'maria@ejemplo.com', 'family', true, 'Mesa 1'),
  ('Carlos', 'López', 'carlos@ejemplo.com', 'friends', false, 'Mesa 2'),
  ('Ana', 'Martínez', 'ana@ejemplo.com', 'bride', true, 'Mesa 1')
ON CONFLICT DO NOTHING;
*/
