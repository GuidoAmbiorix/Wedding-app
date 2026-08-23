const IMG = '/img/';

export const demoWedding = {
  id: 'demo',
  couple_name_1:      'Jennifer',
  couple_name_2:      'Guido',
  wedding_date:       '2026-11-15',
  venue:              'Bosque San Miguel',
  venue_address:      'Bosque San Miguel, Santo Domingo, D.N.',
  cover_photo_url:    IMG + 'hero.jpg',
  cover_video_url:    '/video/hero.mp4',
  save_the_date_image_url: '',
  couple_photo_url:   IMG + 'couple.jpg',
  venue_photo_url:    IMG + 'venue.jpg',
  details_photo_url:  IMG + 'lake.jpg',
  registry_photo_url: IMG + 'hands.jpg',
  story:              'Lo que empezó como una amistad de café a media tarde se convirtió, sin que lo notáramos, en una conversación que no quisimos terminar. Años después, seguimos eligiéndonos cada día.',
  venue_description:  'Celebraremos entre jardines y luz cálida en uno de los rincones más hermosos de la capital. Ceremonia y recepción serán en el mismo lugar, así que podrás quedarte con nosotros toda la noche.',
  invitation_text:    'Nos encantaría que estuvieras presente el día en que digamos «sí» frente a quienes más amamos. Aquí encontrarás todo lo que necesitas saber.',
  dress_code:         'Etiqueta formal. Nos inspira la paleta del bosque: verdes profundos, salvia y tonos tierra. Te pedimos reservar el blanco, marfil y crema para la novia.',
  ceremony_info:      'La ceremonia se realizará en Bosque San Miguel a las 5:00 PM. Te pedimos llegar 30 minutos antes para acomodarte.',
  transport_info:     'Habrá transporte disponible desde puntos de encuentro designados, con servicio de regreso al finalizar la celebración.',
  drinking_note:      'Por favor usa las áreas exteriores designadas si deseas fumar. Anima a quienes beban a hacerlo con responsabilidad y a planear transporte seguro.',
  rsvp_deadline:      '2026-10-01',
  theme:              'forest',
  total_capacity:     150,
  jennifer_quota:     75,
  guido_quota:        75,
};

export const demoEvents = [
  { id:'e1', name:'Llegada e ingreso',  event_time:'16:00', venue:'Bosque San Miguel', notes:'Recíbete con una copa, firma el libro de visitas y encuentra tu lugar.', sort_order:1 },
  { id:'e2', name:'Ceremonia',          event_time:'17:00', venue:'Jardín principal',  notes:'El momento del «sí». Te pedimos silenciar los teléfonos.', sort_order:2 },
  { id:'e3', name:'Fotografía',         event_time:'18:00', venue:'Jardines',          notes:'Capturando los momentos más especiales del día.', sort_order:3 },
  { id:'e4', name:'Cóctel',             event_time:'18:30', venue:'Terraza',           notes:'Bebidas y pasapalos mientras la pareja toma sus fotos.', sort_order:4 },
  { id:'e5', name:'Recepción',          event_time:'19:30', venue:'Salón',             notes:'¡La gran entrada de los novios! La cena se servirá poco después.', sort_order:5 },
  { id:'e6', name:'Brindis y pastel',   event_time:'21:00', venue:'Salón',             notes:'Alza tu copa por los recién casados.', sort_order:6 },
  { id:'e7', name:'Baile',              event_time:'22:00', venue:'Pista',             notes:'A la pista: baila, ríe y celebra con nosotros.', sort_order:7 },
];

export const demoFaq = [
  { id:'f1', question:'¿Cuándo es la boda?',              answer:'El domingo 15 de noviembre de 2026. La ceremonia comienza a las 5:00 PM.', category:'Detalles generales', sort_order:1 },
  { id:'f2', question:'¿Dónde es el lugar?',               answer:'En Bosque San Miguel, Santo Domingo. Hay estacionamiento gratuito y servicio de valet.', category:'Detalles generales', sort_order:2 },
  { id:'f3', question:'¿A qué hora debo llegar?',          answer:'Recomendamos llegar 30 minutos antes (4:30 PM). La ceremonia empieza puntual a las 5:00 PM.', category:'Detalles generales', sort_order:3 },
  { id:'f4', question:'¿Cuál es el código de vestimenta?', answer:'Etiqueta formal. Por favor evita el blanco, marfil y crema — reservados para la novia.', category:'Detalles generales', sort_order:4 },
  { id:'f5', question:'¿Puedo llevar a mis hijos?',        answer:'Adoramos a los pequeños, pero será una celebración solo para adultos. ¡Disfruta una noche libre con nosotros!', category:'RSVP e invitaciones', sort_order:5 },
  { id:'f6', question:'¿Puedo llevar acompañante?',        answer:'Tu invitación indica si tienes un cupo adicional. Si el nombre aparece al confirmar, ¡con gusto lo recibimos!', category:'RSVP e invitaciones', sort_order:6 },
  { id:'f7', question:'¿Puedo tomar fotos durante la ceremonia?', answer:'Tendremos una «ceremonia sin pantallas». Nuestro fotógrafo capturará cada momento.', category:'Otros detalles', sort_order:7 },
];

export const demoRegistry = [
  { id:'r1', store_name:'Casa Cuesta',  store_url:'#', description:'Lista física en tienda' },
  { id:'r2', store_name:'Amazon',       store_url:'#', description:'Registro online' },
  { id:'r3', store_name:'Luna de miel', store_url:'#', description:'Fondo de viaje' },
];

export const demoAccommodations = [
  { id:'a1', hotel_name:'JW Marriott',            address:'Av. Winston Churchill', url:'#', promo_code:'JENNIFER&GUIDO', distance_km:6 },
  { id:'a2', hotel_name:'Embassy Suites',          address:'Av. Tiradentes',        url:'#', promo_code:'JENNIFER&GUIDO', distance_km:4 },
  { id:'a3', hotel_name:'Catalonia Santo Domingo', address:'Malecón',               url:'#', promo_code:'JENNIFER&GUIDO', distance_km:8 },
];

export const demoGallery = [
  { id:'g1', url:IMG+'g1.jpg', caption:'El primer paseo',    year:'2019', sort_order:1 },
  { id:'g2', url:IMG+'g2.jpg', caption:'Tarde de campo',     year:'2021', sort_order:2 },
  { id:'g3', url:IMG+'g3.jpg', caption:'Luces cálidas',      year:'2023', sort_order:3 },
  { id:'g4', url:IMG+'g4.jpg', caption:'Entre los árboles',  year:'2024', sort_order:4 },
  { id:'g5', url:IMG+'g5.jpg', caption:'Manos entrelazadas', year:'2025', sort_order:5 },
  { id:'g6', url:IMG+'g6.jpg', caption:'El bosque',          year:'2026', sort_order:6 },
];

export const demoGuestbook = [
  { id:'gb1', guest_name:'Familia Rodríguez', message:'No puedo esperar a celebrar con ustedes. ¡Los amamos!',  approved:true,  created_at:'2026-05-02' },
  { id:'gb2', guest_name:'Carolina & Marcos', message:'Qué felicidad ver este día llegar. Allí estaremos.',     approved:true,  created_at:'2026-05-10' },
  { id:'gb3', guest_name:'Tía Rosa',          message:'¡Bendiciones para esta hermosa pareja!',                 approved:false, created_at:'2026-05-18' },
];

export const demoWeddingParty = [
  { id:'wp1', name:'Amelia Davis', role_label:'Madrina de honor', role_group:'honor', photo_url:IMG+'party1.jpg', sort_order:1 },
  { id:'wp2', name:'David Watson',  role_label:'Padrino de honor', role_group:'honor', photo_url:IMG+'party2.jpg', sort_order:2 },
  { id:'wp3', name:'Taylor Banks',  role_label:'', role_group:'bridesmaid', photo_url:IMG+'party3.jpg', sort_order:3 },
  { id:'wp4', name:'Jessica Hodges',role_label:'', role_group:'bridesmaid', photo_url:IMG+'party4.jpg', sort_order:4 },
  { id:'wp5', name:'Luis Fernández',role_label:'', role_group:'groomsman', photo_url:IMG+'party5.jpg', sort_order:5 },
  { id:'wp6', name:'Marcos Reyes',  role_label:'', role_group:'groomsman', photo_url:IMG+'party6.jpg', sort_order:6 },
];

export const demoGuests = [
  {
    id:'gu1', guest_type:'grupo', side:'jennifer', guest_display_name:'Familia Alcantara Feliu',
    first_name:'Roberto', last_name:'Alcantara',
    email:'roberto@mail.com', phone:'809-555-0101', whatsapp:'18095550101',
    adults_count:3, children_count:1,
    members: [
      { name:'Roberto Alcantara', meal_choice:'beef',    dietary:'' },
      { name:'María Feliu',       meal_choice:'chicken', dietary:'' },
      { name:'Ana Alcantara',     meal_choice:'fish',    dietary:'' },
      { name:'Robertito',         meal_choice:'',        dietary:'Sin mariscos' },
    ],
    table_name:'Mesa 1', guest_group:'family',
    status:'confirmado',
    rsvp_token:'tok-alcantara', invitation_sent_at:'2026-05-01',
    notes: '',
  },
  {
    id:'gu2', guest_type:'individual', side:'guido', guest_display_name:'José Martínez',
    first_name:'José', last_name:'Martínez',
    email:'jose@mail.com', phone:'809-555-0102', whatsapp:'18095550102',
    adults_count:1, children_count:0,
    members: [],
    table_name:'Mesa 2', guest_group:'friends',
    status:'enviada',
    rsvp_token:'tok-jose', invitation_sent_at:'2026-05-01',
    notes: '',
  },
  {
    id:'gu3', guest_type:'individual', side:'jennifer', guest_display_name:'Ana Gómez',
    first_name:'Ana', last_name:'Gómez',
    email:'ana@mail.com', phone:'809-555-0103', whatsapp:'18095550103',
    adults_count:2, children_count:0,
    members: [
      { name:'Ana Gómez',    meal_choice:'', dietary:'' },
      { name:'Pedro García', meal_choice:'', dietary:'' },
    ],
    table_name:'Mesa 1', guest_group:'bride',
    status:'sin_enviar',
    rsvp_token:'tok-ana', invitation_sent_at:null,
    notes: '',
  },
  {
    id:'gu4', guest_type:'grupo', side:'guido', guest_display_name:'Luis & Sara Fernández',
    first_name:'Luis', last_name:'Fernández',
    email:'luis@mail.com', phone:'809-555-0104', whatsapp:'18095550104',
    adults_count:2, children_count:0,
    members: [
      { name:'Luis Fernández', meal_choice:'beef', dietary:'' },
      { name:'Sara Fernández', meal_choice:'fish', dietary:'' },
    ],
    table_name:'Mesa 3', guest_group:'groom',
    status:'confirmado',
    rsvp_token:'tok-luis', invitation_sent_at:'2026-05-01',
    notes: '',
  },
  {
    id:'gu5', guest_type:'individual', side:'ambos', guest_display_name:'María Santos',
    first_name:'María', last_name:'Santos',
    email:'maria@mail.com', phone:'809-555-0105', whatsapp:'18095550105',
    adults_count:1, children_count:0,
    members: [],
    table_name:'Mesa 2', guest_group:'coworkers',
    status:'no_puede_ir',
    rsvp_token:'tok-maria', invitation_sent_at:'2026-05-01',
    notes: '',
  },
  {
    id:'gu6', guest_type:'individual', guest_display_name:'Carlos Díaz',
    first_name:'Carlos', last_name:'Díaz',
    email:'', phone:'', whatsapp:'18095550106',
    adults_count:1, children_count:0,
    members: [],
    table_name:'', guest_group:'friends',
    status:'lista_de_espera',
    rsvp_token:'tok-carlos', invitation_sent_at:null,
    notes: 'Por si acaso alguien cancela',
  },
];

export const demoRsvps = [
  { id:'rs1', guest_id:'gu1', status:'attending', members_responses:[
    { name:'Roberto Alcantara', meal_choice:'beef',    dietary:'' },
    { name:'María Feliu',       meal_choice:'chicken', dietary:'' },
    { name:'Ana Alcantara',     meal_choice:'fish',    dietary:'' },
    { name:'Robertito',         meal_choice:'',        dietary:'Sin mariscos' },
  ], message:'¡Felicidades! Allí estaremos.', responded_at:'2026-05-12' },
  { id:'rs4', guest_id:'gu4', status:'attending', members_responses:[
    { name:'Luis Fernández', meal_choice:'beef', dietary:'' },
    { name:'Sara Fernández', meal_choice:'fish', dietary:'' },
  ], message:null, responded_at:'2026-05-20' },
];
