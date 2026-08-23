import { reactive, ref, computed } from 'vue';
import { supabase, isLive } from '@/lib/supabase.js';
import * as demo from '@/data/demo.js';

const state = reactive({
  wedding: { ...demo.demoWedding },
  events: [],
  faq: [],
  registry: [],
  accommodations: [],
  bankAccounts: [],
  gallery: [],
  guestbook: [],
  weddingParty: [],
  guests: [],
  rsvps: [],
});
const loaded = ref(false);

function seedDemo() {
  state.wedding        = { ...demo.demoWedding };
  state.events         = demo.demoEvents.map(x => ({ ...x }));
  state.faq            = demo.demoFaq.map(x => ({ ...x }));
  state.registry       = demo.demoRegistry.map(x => ({ ...x }));
  state.accommodations = demo.demoAccommodations.map(x => ({ ...x }));
  state.bankAccounts    = demo.demoBankAccounts.map(x => ({ ...x }));
  state.gallery        = demo.demoGallery.map(x => ({ ...x }));
  state.guestbook      = demo.demoGuestbook.map(x => ({ ...x }));
  state.weddingParty   = demo.demoWeddingParty.map(x => ({ ...x }));
  state.guests         = demo.demoGuests.map(x => ({ ...x }));
  state.rsvps          = demo.demoRsvps.map(x => ({ ...x }));
}

async function load() {
  if (loaded.value) return;
  if (!isLive) { seedDemo(); loaded.value = true; return; }
  try {
    // No cargamos guests ni rsvps en el sitio público:
    // - Reduce queries innecesarias (~40% menos data)
    // - Evita exponer la lista de invitados en el cliente
    // - findGuest() hace la query puntual al momento de buscar
    const [w, ev, fq, rg, ac, ga, gb, wp, ba] = await Promise.all([
      supabase.from('wedding_info').select('*').limit(1).single(),
      supabase.from('wedding_events').select('*').order('sort_order'),
      supabase.from('wedding_faq').select('*').order('sort_order'),
      supabase.from('wedding_registry').select('*'),
      supabase.from('wedding_accommodations').select('*'),
      supabase.from('wedding_gallery_photos').select('*').order('sort_order'),
      supabase.from('wedding_guestbook').select('*').order('created_at', { ascending: false }),
      supabase.from('wedding_party').select('*').order('sort_order'),
      supabase.from('wedding_bank_accounts').select('*').order('sort_order'),
    ]);
    if (w.data) state.wedding    = w.data;
    state.events         = ev.data  || [];
    state.faq            = fq.data  || [];
    state.registry       = rg.data  || [];
    state.accommodations = ac.data  || [];
    state.gallery        = ga.data  || [];
    state.guestbook      = gb.data  || [];
    state.weddingParty   = wp.data  || [];
    state.bankAccounts   = ba.data  || [];
  } catch (e) {
    console.warn('Supabase falló, usando demo:', e);
    seedDemo();
  }
  loaded.value = true;
}

const uid = () => 'loc-' + Math.random().toString(36).slice(2, 9);

// ── Acciones públicas ──────────────────────────────────────────
async function findGuest(name) {
  const q = (name || '').trim().toLowerCase();
  if (!q) return null;
  if (isLive) {
    // Busca primero por guest_display_name, luego por first_name
    const { data } = await supabase
      .from('wedding_guests')
      .select('*')
      .or(`guest_display_name.ilike.%${q}%,first_name.ilike.%${q.split(' ')[0]}%`)
      .limit(20);
    if (!data?.length) return null;
    // Refina: preferir match exacto en display_name
    return data.find(g =>
      (g.guest_display_name || '').toLowerCase().includes(q)
    ) || data.find(g =>
      (`${g.first_name} ${g.last_name}`).toLowerCase().includes(q)
    ) || data[0];
  }
  // Demo mode
  return state.guests.find(g =>
    (g.guest_display_name || '').toLowerCase().includes(q) ||
    (`${g.first_name} ${g.last_name}`).toLowerCase().includes(q)
  ) || null;
}

async function findGuestByToken(token) {
  if (isLive) {
    const { data } = await supabase.from('wedding_guests').select('*').eq('rsvp_token', token).single();
    return data || null;
  }
  return state.guests.find(g => g.rsvp_token === token) || null;
}

async function markInvitationSent(guestId) {
  const ts = new Date().toISOString();
  const guest = state.guests.find(g => g.id === guestId);
  if (guest) guest.invitation_sent_at = ts;
  if (isLive) await supabase.from('wedding_guests').update({ invitation_sent_at: ts }).eq('id', guestId);
}

async function submitRsvp(guest, payload) {
  const row = {
    id: uid(),
    guest_id: guest ? guest.id : null,
    status: payload.status,
    plus_one_confirmed: !!payload.plus_one_name,
    plus_one_name: payload.plus_one_name || null,
    meal_choice: payload.meal_choice || null,
    message: payload.message || null,
    responded_at: new Date().toISOString(),
  };
  if (isLive) {
    // Upsert por guest_id
    const { data: existing } = await supabase.from('wedding_rsvps').select('id').eq('guest_id', row.guest_id).maybeSingle();
    let data;
    if (existing) {
      const res = await supabase.from('wedding_rsvps').update({ ...row, id: undefined }).eq('id', existing.id).select().single();
      data = res.data;
    } else {
      const res = await supabase.from('wedding_rsvps').insert({ ...row, id: undefined }).select().single();
      data = res.data;
    }
    if (data) {
      const idx = state.rsvps.findIndex(r => r.guest_id === row.guest_id);
      if (idx >= 0) state.rsvps[idx] = data; else state.rsvps.push(data);
    }
    return data;
  }
  const existing = state.rsvps.find(r => r.guest_id === row.guest_id && row.guest_id);
  if (existing) Object.assign(existing, row); else state.rsvps.push(row);
  return row;
}

async function addGuestbook(name, message) {
  const row = { id: uid(), guest_name: name, message, approved: false, created_at: new Date().toISOString() };
  if (isLive) { await supabase.from('wedding_guestbook').insert({ ...row, id: undefined }); }
  state.guestbook.unshift(row);
  return row;
}

// ── CRUD genérico para el panel ────────────────────────────────
function table(key, tbl) {
  return {
    async add(rec) {
      if (isLive) {
        const { data } = await supabase.from(tbl).insert({ ...rec }).select().single();
        if (data) { state[key].push(data); return data; }
      }
      const row = { id: uid(), ...rec };
      state[key].push(row);
      return row;
    },
    async update(id, patch) {
      const item = state[key].find(x => x.id === id);
      if (item) Object.assign(item, patch);
      if (isLive) await supabase.from(tbl).update(patch).eq('id', id);
    },
    async remove(id) {
      const i = state[key].findIndex(x => x.id === id);
      if (i > -1) state[key].splice(i, 1);
      if (isLive) await supabase.from(tbl).delete().eq('id', id);
    },
  };
}

const actions = {
  events:         table('events', 'wedding_events'),
  faq:            table('faq', 'wedding_faq'),
  registry:       table('registry', 'wedding_registry'),
  accommodations: table('accommodations', 'wedding_accommodations'),
  gallery:        table('gallery', 'wedding_gallery_photos'),
  guests:         table('guests', 'wedding_guests'),
  guestbook:      table('guestbook', 'wedding_guestbook'),
  weddingParty:   table('weddingParty', 'wedding_party'),
  bankAccounts:   table('bankAccounts', 'wedding_bank_accounts'),
};

async function updateWedding(patch) {
  Object.assign(state.wedding, patch);
  if (isLive) await supabase.from('wedding_info').update(patch).eq('id', state.wedding.id);
}

// ── Stats ──────────────────────────────────────────────────────
const stats = computed(() => {
  const rs          = state.rsvps;
  const attending   = rs.filter(r => r.status === 'attending');
  const responded   = rs.filter(r => r.status !== 'pending');
  const totalAdults   = state.guests.reduce((s, g) => s + (g.adults_count   ?? 1), 0);
  const totalChildren = state.guests.reduce((s, g) => s + (g.children_count ?? 0), 0);
  return {
    guests:       state.guests.length,
    invited:      state.guests.filter(g => g.invitation_sent_at).length,
    viewed:       state.guests.filter(g => g.invitation_viewed_at).length,
    responded:    responded.length,
    attending:    attending.length,
    declined:     rs.filter(r => r.status === 'declined').length,
    pending:      state.guests.length - responded.length,
    headcount:    attending.reduce((n, r) => n + 1 + (r.plus_one_confirmed ? 1 : 0), 0),
    totalAdults,
    totalChildren,
    totalPeople:  totalAdults + totalChildren,
  };
});

export function useData() {
  return {
    state, load, loaded, isLive, stats,
    findGuest, findGuestByToken,
    markInvitationSent,
    submitRsvp, addGuestbook,
    actions, updateWedding,
  };
}
