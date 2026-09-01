<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { useWeddingStore } from '@/stores/wedding'
import { useGuestsStore } from '@/stores/guests'
import { storeToRefs } from 'pinia'
import { useData } from '@/composables/useData.js'
import AdminListEditor from '@/components/admin/AdminListEditor.vue'

const weddingStore = useWeddingStore()
const guestsStore  = useGuestsStore()
const { wedding }  = storeToRefs(weddingStore)
const { guests }   = storeToRefs(guestsStore)

const { state: listState, load: loadLists, actions: listActions } = useData()
loadLists()

onMounted(() => {
  if (!wedding.value) weddingStore.fetchWedding()
  if (!guests.value.length) guestsStore.fetchGuests()
})

const form = ref({
  couple_name_1: '',
  couple_name_2: '',
  wedding_date: '',
  venue: '',
  venue_address: '',
  cover_photo_url: '',
  cover_video_url: '',
  save_the_date_image_url: '',
  couple_photo_url: '',
  details_photo_url: '',
  registry_photo_url: '',
  story: '',
  invitation_text: '',
  venue_description: '',
  dress_code: '',
  ceremony_info: '',
  drinking_note: '',
  rsvp_deadline: '',
  total_capacity: 0,
  jennifer_quota: 0,
  guido_quota: 0,
})

// ── Cupos en uso ──────────────────────────────────────────────────────────────
const quotaStats = computed(() => {
  const count = (side) => guests.value
    .filter(g => g.side === side)
    .reduce((s, g) => s + (g.adults_count ?? 1) + (g.children_count ?? 0), 0)
  const jUsed = count('jennifer')
  const gUsed = count('guido')
  const bothUsed = guests.value
    .filter(g => g.side === 'ambos')
    .reduce((s, g) => s + (g.adults_count ?? 1) + (g.children_count ?? 0), 0)
  const total = guests.value.reduce((s, g) => s + (g.adults_count ?? 1) + (g.children_count ?? 0), 0)
  return {
    jUsed, gUsed, bothUsed, total,
    jLeft: Math.max(0, (form.value.jennifer_quota || 0) - jUsed),
    gLeft: Math.max(0, (form.value.guido_quota    || 0) - gUsed),
  }
})

const saved = ref(false)

const tabs = [
  { id: 'general',      label: 'General',           icon: 'M11.5 3.5c.83 0 1.5.67 1.5 1.5v1.55a7 7 0 012.1.87l1.1-1.1a1.5 1.5 0 112.12 2.12l-1.1 1.1a7 7 0 01.87 2.1H19.5a1.5 1.5 0 010 3h-1.41a7 7 0 01-.87 2.1l1.1 1.1a1.5 1.5 0 11-2.12 2.12l-1.1-1.1a7 7 0 01-2.1.87v1.55a1.5 1.5 0 01-3 0v-1.55a7 7 0 01-2.1-.87l-1.1 1.1a1.5 1.5 0 11-2.12-2.12l1.1-1.1a7 7 0 01-.87-2.1H4.5a1.5 1.5 0 010-3h1.55a7 7 0 01.87-2.1l-1.1-1.1a1.5 1.5 0 112.12-2.12l1.1 1.1a7 7 0 012.1-.87V5c0-.83.67-1.5 1.5-1.5z' },
  { id: 'itinerario',   label: 'Itinerario',        icon: 'M8 2v3M16 2v3M3.5 9h17M5 5h14a1.5 1.5 0 011.5 1.5v13A1.5 1.5 0 0119 21H5a1.5 1.5 0 01-1.5-1.5v-13A1.5 1.5 0 015 5z' },
  { id: 'faq',          label: 'Preguntas',         icon: 'M9.5 9a2.5 2.5 0 115 0c0 1.5-2.5 2-2.5 4M12 17h.01M12 21a9 9 0 100-18 9 9 0 000 18z' },
  { id: 'regalos',      label: 'Regalos',           icon: 'M20 12v9H4v-9M2 7h20v5H2V7zM12 22V7M12 7C10 3 5 3 5 5.5S9 7 12 7zM12 7c2-4 7-4 7-1.5S15 7 12 7z' },
  { id: 'cortejo',      label: 'Cortejo',           icon: 'M16 11a4 4 0 10-8 0 4 4 0 008 0zM6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2' },
  { id: 'galeria',      label: 'Galería',           icon: 'M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1zM8 11a2 2 0 100-4 2 2 0 000 4zM3 16l5-5 4 4 3-3 6 6' },
]
const activeTab = ref('general')

// ── Config de campos para cada lista editable ──────────────────────────────
const eventFields = [
  { key: 'event_time', label: 'Hora', type: 'time' },
  { key: 'name', label: 'Nombre del evento', type: 'text', placeholder: 'Ceremonia' },
  { key: 'notes', label: 'Notas (opcional)', type: 'textarea', placeholder: 'Detalles para los invitados...' },
]
const faqFields = [
  { key: 'question', label: 'Pregunta', type: 'text', placeholder: '¿Cuál es el dress code?' },
  { key: 'answer', label: 'Respuesta', type: 'textarea', placeholder: 'Pedimos vestimenta elegante...' },
  { key: 'category', label: 'Categoría (opcional)', type: 'text', placeholder: 'Detalles generales' },
]
const bankAccountFields = [
  { key: 'bank_name', label: 'Banco', type: 'text', placeholder: 'Banreservas' },
  { key: 'account_number', label: 'Número de cuenta', type: 'text', placeholder: '1234567890' },
  { key: 'holder_name', label: 'Nombre del titular', type: 'text', placeholder: 'Jennifer Alondra' },
  { key: 'account_type', label: 'Tipo de cuenta', type: 'select', options: [
    { value: 'ahorros', label: 'Ahorros' },
    { value: 'corriente', label: 'Corriente' },
  ] },
  { key: 'holder_id', label: 'Cédula/RNC del titular (opcional)', type: 'text', placeholder: '000-0000000-0' },
  { key: 'note', label: 'Nota/instrucciones (opcional)', type: 'textarea', placeholder: 'Por favor escribe tu nombre en el concepto de la transferencia' },
]
const partyFields = [
  { key: 'name', label: 'Nombre', type: 'text', placeholder: 'Amelia Davis' },
  { key: 'role_group', label: 'Grupo', type: 'select', options: [
    { value: 'honor', label: 'Pareja de honor' },
    { value: 'bridesmaid', label: 'Damas de honor' },
    { value: 'groomsman', label: 'Padrinos' },
  ] },
  { key: 'role_label', label: 'Rol (opcional)', type: 'text', placeholder: 'Madrina de honor' },
  { key: 'photo_url', label: 'Foto', type: 'text', placeholder: 'https://...' },
]
const galleryFields = [
  { key: 'url', label: 'URL de la foto', type: 'text', placeholder: 'https://...' },
  { key: 'caption', label: 'Descripción', type: 'text', placeholder: 'El primer paseo' },
  { key: 'year', label: 'Año (opcional)', type: 'text', placeholder: '2024' },
]
const venuePhotoFields = [
  { key: 'url', label: 'URL de la foto', type: 'text', placeholder: 'https://...' },
  { key: 'caption', label: 'Descripción (opcional)', type: 'text', placeholder: 'Entrada principal' },
]

watch(wedding, (val) => {
  if (val) form.value = { ...val }
}, { immediate: true })

async function save() {
  await weddingStore.updateWedding(form.value)
  saved.value = true
  setTimeout(() => { saved.value = false }, 2500)
}
</script>

<template>
  <div class="p-4 sm:p-6 lg:p-8 pb-24 sm:pb-8" style="background:#faf7f0; min-height:100%;">

    <!-- ── Tabs ── -->
    <div class="mb-6 -mx-1 px-1 overflow-x-auto">
      <div class="flex gap-1.5 border-b border-[#ece5d6] min-w-max">
        <button
          v-for="t in tabs" :key="t.id"
          type="button"
          @click="activeTab = t.id"
          :class="['flex items-center gap-2 px-4 py-3 text-[13px] font-medium whitespace-nowrap border-b-2 -mb-px transition-colors',
                    activeTab === t.id
                      ? 'border-[#c9a24b] text-[#3a3623]'
                      : 'border-transparent text-[#9a9280] hover:text-[#5a5442]']"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" :d="t.icon"/>
          </svg>
          <span :class="activeTab === t.id ? 'font-serif text-[15px] tracking-wide' : ''">{{ t.label }}</span>
        </button>
      </div>
    </div>

    <!-- ── Tab: General ── -->
    <div v-if="activeTab === 'general'" class="grid grid-cols-1 xl:grid-cols-3 gap-6">

      <!-- ── FORM (2/3) ── -->
      <form @submit.prevent="save" class="xl:col-span-2 space-y-5">

        <!-- Sección: Novios -->
        <div class="bg-white rounded-2xl border border-[#ece5d6] shadow-[0_1px_3px_rgba(58,54,35,0.05)] overflow-hidden">
          <div class="px-6 py-4 border-b border-[#f2ecdf] flex items-center gap-3">
            <div class="w-7 h-7 rounded-lg flex items-center justify-center" style="background:#f3f0ff;">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" style="color:#7b4fa6;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
            </div>
            <p class="font-serif text-[16px] font-semibold text-[#2a2620] tracking-wide">Los novios</p>
          </div>
          <div class="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-[11px] font-semibold text-[#9a9280] uppercase tracking-wider mb-2">Nombre 1 *</label>
              <input v-model="form.couple_name_1" required
                class="w-full rounded-xl border border-[#e8e1d3] bg-[#faf7f0] px-4 py-3 text-sm text-[#2a2620] focus:outline-none focus:ring-2 focus:ring-[#c9a24b]/40 focus:bg-white focus:border-[#c9a24b] transition"
                placeholder="Jennifer Alondra" />
            </div>
            <div>
              <label class="block text-[11px] font-semibold text-[#9a9280] uppercase tracking-wider mb-2">Nombre 2 *</label>
              <input v-model="form.couple_name_2" required
                class="w-full rounded-xl border border-[#e8e1d3] bg-[#faf7f0] px-4 py-3 text-sm text-[#2a2620] focus:outline-none focus:ring-2 focus:ring-[#c9a24b]/40 focus:bg-white focus:border-[#c9a24b] transition"
                placeholder="Guido Ambiorix" />
            </div>
          </div>
        </div>

        <!-- Sección: Fecha y lugar -->
        <div class="bg-white rounded-2xl border border-[#ece5d6] shadow-[0_1px_3px_rgba(58,54,35,0.05)] overflow-hidden">
          <div class="px-6 py-4 border-b border-[#f2ecdf] flex items-center gap-3">
            <div class="w-7 h-7 rounded-lg flex items-center justify-center" style="background:#f0fdf4;">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" style="color:#2d5a27;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
            <p class="font-serif text-[16px] font-semibold text-[#2a2620] tracking-wide">Fecha y lugar</p>
          </div>
          <div class="p-4 sm:p-6 space-y-4">
            <div>
              <label class="block text-[11px] font-semibold text-[#9a9280] uppercase tracking-wider mb-2">Fecha de la boda *</label>
              <input v-model="form.wedding_date" type="date" required
                class="w-full rounded-xl border border-[#e8e1d3] bg-[#faf7f0] px-4 py-3 text-sm text-[#2a2620] focus:outline-none focus:ring-2 focus:ring-[#c9a24b]/40 focus:bg-white focus:border-[#c9a24b] transition" />
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-[11px] font-semibold text-[#9a9280] uppercase tracking-wider mb-2">Venue / Salón</label>
                <input v-model="form.venue"
                  class="w-full rounded-xl border border-[#e8e1d3] bg-[#faf7f0] px-4 py-3 text-sm text-[#2a2620] placeholder-[#a8a08f] focus:outline-none focus:ring-2 focus:ring-[#c9a24b]/40 focus:bg-white focus:border-[#c9a24b] transition"
                  placeholder="Bosque San Miguel" />
              </div>
              <div>
                <label class="block text-[11px] font-semibold text-[#9a9280] uppercase tracking-wider mb-2">Dirección</label>
                <input v-model="form.venue_address"
                  class="w-full rounded-xl border border-[#e8e1d3] bg-[#faf7f0] px-4 py-3 text-sm text-[#2a2620] placeholder-[#a8a08f] focus:outline-none focus:ring-2 focus:ring-[#c9a24b]/40 focus:bg-white focus:border-[#c9a24b] transition"
                  placeholder="Km 12, San Miguel" />
              </div>
            </div>
          </div>
        </div>

        <!-- Sección: Historia -->
        <div class="bg-white rounded-2xl border border-[#ece5d6] shadow-[0_1px_3px_rgba(58,54,35,0.05)] overflow-hidden">
          <div class="px-6 py-4 border-b border-[#f2ecdf] flex items-center gap-3">
            <div class="w-7 h-7 rounded-lg flex items-center justify-center bg-rose-50">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
              </svg>
            </div>
            <p class="font-serif text-[16px] font-semibold text-[#2a2620] tracking-wide">Nuestra historia</p>
            <span class="ml-auto text-xs text-gray-400">{{ form.story?.length || 0 }} caracteres</span>
          </div>
          <div class="p-4 sm:p-6 space-y-4">
            <textarea v-model="form.story" rows="5"
              class="w-full rounded-xl border border-[#e8e1d3] bg-[#faf7f0] px-4 py-3 text-sm text-[#2a2620] placeholder-[#a8a08f] focus:outline-none focus:ring-2 focus:ring-[#c9a24b]/40 focus:bg-white focus:border-[#c9a24b] transition resize-none"
              placeholder="Cuéntanos cómo se conocieron, qué los une, qué los hace especiales..." />
            <div>
              <label class="block text-[11px] font-semibold text-[#9a9280] uppercase tracking-wider mb-2">Texto de invitación</label>
              <textarea v-model="form.invitation_text" rows="3"
                class="w-full rounded-xl border border-[#e8e1d3] bg-[#faf7f0] px-4 py-3 text-sm text-[#2a2620] placeholder-[#a8a08f] focus:outline-none focus:ring-2 focus:ring-[#c9a24b]/40 focus:bg-white focus:border-[#c9a24b] transition resize-none"
                placeholder="Nos encantaría que estuvieras presente en este momento tan especial..." />
              <p class="text-xs text-gray-400 mt-1">Aparece debajo del relato en la sección "Nuestra historia".</p>
            </div>
          </div>
        </div>

        <!-- Sección: El lugar -->
        <div class="bg-white rounded-2xl border border-[#ece5d6] shadow-[0_1px_3px_rgba(58,54,35,0.05)] overflow-hidden">
          <div class="px-6 py-4 border-b border-[#f2ecdf] flex items-center gap-3">
            <div class="w-7 h-7 rounded-lg flex items-center justify-center bg-green-50">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
            <p class="font-serif text-[16px] font-semibold text-[#2a2620] tracking-wide">El lugar</p>
          </div>
          <div class="p-4 sm:p-6">
            <label class="block text-[11px] font-semibold text-[#9a9280] uppercase tracking-wider mb-2">Descripción del venue</label>
            <textarea v-model="form.venue_description" rows="3"
              class="w-full rounded-xl border border-[#e8e1d3] bg-[#faf7f0] px-4 py-3 text-sm text-[#2a2620] placeholder-[#a8a08f] focus:outline-none focus:ring-2 focus:ring-[#c9a24b]/40 focus:bg-white focus:border-[#c9a24b] transition resize-none"
              placeholder="Celebraremos entre jardines y luz cálida, rodeados de naturaleza..." />
            <p class="text-xs text-gray-400 mt-1">Aparece en la sección "Dónde sucede todo".</p>
          </div>
        </div>

        <!-- Sección: Código de vestimenta -->
        <div class="bg-white rounded-2xl border border-[#ece5d6] shadow-[0_1px_3px_rgba(58,54,35,0.05)] overflow-hidden">
          <div class="px-6 py-4 border-b border-[#f2ecdf] flex items-center gap-3">
            <div class="w-7 h-7 rounded-lg flex items-center justify-center bg-purple-50">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7 7l10 10M17 7L7 17"/>
              </svg>
            </div>
            <p class="font-serif text-[16px] font-semibold text-[#2a2620] tracking-wide">Código de vestimenta</p>
          </div>
          <div class="p-4 sm:p-6 space-y-4">
            <textarea v-model="form.dress_code" rows="3"
              class="w-full rounded-xl border border-[#e8e1d3] bg-[#faf7f0] px-4 py-3 text-sm text-[#2a2620] placeholder-[#a8a08f] focus:outline-none focus:ring-2 focus:ring-[#c9a24b]/40 focus:bg-white focus:border-[#c9a24b] transition resize-none"
              placeholder="Etiqueta formal. Nos inspira la paleta del bosque: verdes profundos, salvia y tonos tierra..." />
            <div>
              <label class="block text-[11px] font-semibold text-[#9a9280] uppercase tracking-wider mb-2">Fecha límite de RSVP</label>
              <input v-model="form.rsvp_deadline" type="date"
                class="w-full rounded-xl border border-[#e8e1d3] bg-[#faf7f0] px-4 py-3 text-sm text-[#2a2620] focus:outline-none focus:ring-2 focus:ring-[#c9a24b]/40 focus:bg-white focus:border-[#c9a24b] transition" />
              <p class="text-xs text-gray-400 mt-1">Los invitados verán esta fecha como límite para confirmar.</p>
            </div>
          </div>
        </div>

        <!-- Sección: Información adicional -->
        <div class="bg-white rounded-2xl border border-[#ece5d6] shadow-[0_1px_3px_rgba(58,54,35,0.05)] overflow-hidden">
          <div class="px-6 py-4 border-b border-[#f2ecdf] flex items-center gap-3">
            <div class="w-7 h-7 rounded-lg flex items-center justify-center bg-purple-50">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <p class="font-serif text-[16px] font-semibold text-[#2a2620] tracking-wide">Información adicional</p>
          </div>
          <div class="p-4 sm:p-6 space-y-4">
            <div>
              <label class="block text-[11px] font-semibold text-[#9a9280] uppercase tracking-wider mb-2">Ceremonia</label>
              <textarea v-model="form.ceremony_info" rows="2"
                class="w-full rounded-xl border border-[#e8e1d3] bg-[#faf7f0] px-4 py-3 text-sm text-[#2a2620] placeholder-[#a8a08f] focus:outline-none focus:ring-2 focus:ring-[#c9a24b]/40 focus:bg-white focus:border-[#c9a24b] transition resize-none"
                placeholder="La ceremonia se realizará en... Te pedimos llegar..." />
            </div>
            <div>
              <label class="block text-[11px] font-semibold text-[#9a9280] uppercase tracking-wider mb-2">Nota sobre bebidas / fumar</label>
              <textarea v-model="form.drinking_note" rows="2"
                class="w-full rounded-xl border border-[#e8e1d3] bg-[#faf7f0] px-4 py-3 text-sm text-[#2a2620] placeholder-[#a8a08f] focus:outline-none focus:ring-2 focus:ring-[#c9a24b]/40 focus:bg-white focus:border-[#c9a24b] transition resize-none"
                placeholder="Por favor usa las áreas designadas..." />
            </div>
            <p class="text-xs text-gray-400">Aparecen en la sección "Información adicional" del sitio. Los padrinos/damas se administran en la tabla <code class="bg-[#f2ecdf] px-1 rounded text-[#6b6350]">wedding_party</code> de Supabase.</p>
          </div>
        </div>

        <!-- Sección: Cupos -->
        <div class="bg-white rounded-2xl border border-[#ece5d6] shadow-[0_1px_3px_rgba(58,54,35,0.05)] overflow-hidden">
          <div class="px-6 py-4 border-b border-[#f2ecdf] flex items-center gap-3">
            <div class="w-7 h-7 rounded-lg flex items-center justify-center bg-green-50">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m4-4a4 4 0 100-8 4 4 0 000 8zm6 0a3 3 0 100-6 3 3 0 000 6z"/>
              </svg>
            </div>
            <p class="font-serif text-[16px] font-semibold text-[#2a2620] tracking-wide">Cupos de invitados</p>
          </div>
          <div class="p-4 sm:p-6 space-y-5">

            <!-- Inputs de cuotas -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="block text-[11px] font-semibold text-[#9a9280] uppercase tracking-wider mb-2">Total del evento</label>
                <input v-model.number="form.total_capacity" type="number" min="0"
                  class="w-full rounded-xl border border-[#e8e1d3] bg-[#faf7f0] px-4 py-3 text-sm text-[#2a2620] focus:outline-none focus:ring-2 focus:ring-[#c9a24b]/40 focus:bg-white focus:border-[#c9a24b] transition"
                  placeholder="0" />
                <p class="text-xs text-gray-400 mt-1">Capacidad máxima del venue</p>
              </div>
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider mb-2" style="color:#b3665a;">
                  Cupo Jennifer
                </label>
                <input v-model.number="form.jennifer_quota" type="number" min="0"
                  class="w-full rounded-xl border border-[#e8e1d3] bg-[#faf7f0] px-4 py-3 text-sm text-[#2a2620] focus:outline-none focus:ring-2 focus:ring-[#b3665a]/40 focus:bg-white focus:border-[#b3665a] transition"
                  placeholder="0" />
                <p class="text-xs text-gray-400 mt-1">Personas que puede invitar</p>
              </div>
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider mb-2" style="color:#3d6b6b;">
                  Cupo Guido
                </label>
                <input v-model.number="form.guido_quota" type="number" min="0"
                  class="w-full rounded-xl border border-[#e8e1d3] bg-[#faf7f0] px-4 py-3 text-sm text-[#2a2620] focus:outline-none focus:ring-2 focus:ring-[#3d6b6b]/40 focus:bg-white focus:border-[#3d6b6b] transition"
                  placeholder="0" />
                <p class="text-xs text-gray-400 mt-1">Personas que puede invitar</p>
              </div>
            </div>

            <!-- Stats en tiempo real -->
            <div class="rounded-2xl border border-gray-100 overflow-hidden">
              <div class="px-4 py-2.5 bg-[#faf7f0] border-b border-[#ece5d6]">
                <p class="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Uso actual · {{ quotaStats.total }} personas registradas</p>
              </div>
              <div class="divide-y divide-gray-50">

                <!-- Jennifer -->
                <div class="px-4 py-3.5 flex items-center gap-4">
                  <div class="w-2.5 h-2.5 rounded-full flex-shrink-0" style="background:#b3665a;"></div>
                  <p class="text-sm font-semibold text-gray-700 w-16 sm:w-24">Jennifer</p>
                  <div class="flex-1">
                    <div class="h-2 bg-[#f2ecdf] rounded-full overflow-hidden">
                      <div class="h-full rounded-full transition-all"
                           style="background:#b3665a;"
                           :style="{ width: form.jennifer_quota > 0 ? `${Math.min(100, quotaStats.jUsed / form.jennifer_quota * 100)}%` : '0%' }">
                      </div>
                    </div>
                  </div>
                  <div class="text-right flex-shrink-0 w-24 sm:w-32">
                    <p class="text-sm font-bold text-gray-800">{{ quotaStats.jUsed }} <span class="text-gray-400 font-normal">/ {{ form.jennifer_quota || '—' }}</span></p>
                    <p class="text-[11px] text-gray-400">{{ form.jennifer_quota ? `${quotaStats.jLeft} disponibles` : 'Sin cupo definido' }}</p>
                  </div>
                </div>

                <!-- Guido -->
                <div class="px-4 py-3.5 flex items-center gap-4">
                  <div class="w-2.5 h-2.5 rounded-full flex-shrink-0" style="background:#3d6b6b;"></div>
                  <p class="text-sm font-semibold text-gray-700 w-16 sm:w-24">Guido</p>
                  <div class="flex-1">
                    <div class="h-2 bg-[#f2ecdf] rounded-full overflow-hidden">
                      <div class="h-full rounded-full transition-all"
                           style="background:#3d6b6b;"
                           :style="{ width: form.guido_quota > 0 ? `${Math.min(100, quotaStats.gUsed / form.guido_quota * 100)}%` : '0%' }">
                      </div>
                    </div>
                  </div>
                  <div class="text-right flex-shrink-0 w-24 sm:w-32">
                    <p class="text-sm font-bold text-gray-800">{{ quotaStats.gUsed }} <span class="text-gray-400 font-normal">/ {{ form.guido_quota || '—' }}</span></p>
                    <p class="text-[11px] text-gray-400">{{ form.guido_quota ? `${quotaStats.gLeft} disponibles` : 'Sin cupo definido' }}</p>
                  </div>
                </div>

                <!-- Ambos -->
                <div v-if="quotaStats.bothUsed > 0" class="px-4 py-3.5 flex items-center gap-4">
                  <div class="w-2.5 h-2.5 rounded-full flex-shrink-0" style="background:#8a8175;"></div>
                  <p class="text-sm font-semibold text-gray-700 w-16 sm:w-24">Ambos</p>
                  <div class="flex-1" />
                  <div class="text-right flex-shrink-0 w-24 sm:w-32">
                    <p class="text-sm font-bold text-gray-800">{{ quotaStats.bothUsed }}</p>
                    <p class="text-[11px] text-gray-400">Compartidos</p>
                  </div>
                </div>

                <!-- Total vs capacidad -->
                <div class="px-4 py-3.5 flex items-center gap-4 bg-[#faf7f0]/60">
                  <div class="w-2.5 h-2.5 rounded-full flex-shrink-0 bg-gray-400"></div>
                  <p class="text-sm font-semibold text-gray-500 w-16 sm:w-24">Total</p>
                  <div class="flex-1">
                    <div class="h-2 bg-[#f2ecdf] rounded-full overflow-hidden">
                      <div class="h-full rounded-full transition-all bg-gray-400"
                           :style="{ width: form.total_capacity > 0 ? `${Math.min(100, quotaStats.total / form.total_capacity * 100)}%` : '0%' }">
                      </div>
                    </div>
                  </div>
                  <div class="text-right flex-shrink-0 w-24 sm:w-32">
                    <p class="text-sm font-bold text-gray-700">{{ quotaStats.total }} <span class="text-gray-400 font-normal">/ {{ form.total_capacity || '—' }}</span></p>
                    <p class="text-[11px] text-gray-400">{{ form.total_capacity ? `${Math.max(0, form.total_capacity - quotaStats.total)} libres` : 'Sin capacidad definida' }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Save bar -->
        <div class="sticky bottom-4 z-20 bg-white/95 backdrop-blur rounded-2xl border border-[#ece5d6] shadow-[0_8px_24px_rgba(58,54,35,0.12)] px-4 sm:px-6 py-4 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            class="w-full sm:w-auto px-7 py-2.5 text-[#faf7f0] text-sm font-semibold rounded-xl hover:brightness-110 active:brightness-95 transition cursor-pointer border-none shadow-sm"
            style="background: linear-gradient(135deg, #4a4530, #3a3623);"
          >
            Guardar cambios
          </button>
          <Transition name="fade">
            <span v-if="saved" class="flex items-center gap-2 text-sm font-medium text-emerald-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
              Guardado correctamente
            </span>
          </Transition>
          <span class="hidden sm:block sm:ml-auto text-xs text-[#9a9280]">Los cambios se reflejan en el sitio público al instante</span>
        </div>
      </form>

      <!-- ── PREVIEW CARD (1/3) ── -->
      <div class="space-y-4">
        <!-- Mini preview del hero -->
        <div class="bg-white rounded-2xl border border-[#ece5d6] shadow-[0_1px_3px_rgba(58,54,35,0.05)] overflow-hidden">
          <div class="px-4 py-3 border-b border-[#f2ecdf]">
            <p class="text-[11px] font-semibold text-[#9a9280] uppercase tracking-wider">Vista previa</p>
          </div>
          <div
            class="relative h-48 flex items-end p-4"
            :style="form.cover_photo_url
              ? `background-image: url('${form.cover_photo_url}'); background-size: cover; background-position: center;`
              : 'background: linear-gradient(135deg, #0e1a0e 0%, #1e0f35 100%);'"
          >
            <div class="absolute inset-0" style="background: linear-gradient(to top, rgba(14,26,14,0.9), transparent);"></div>
            <div class="relative z-10">
              <p class="text-white/50 text-[9px] tracking-widest uppercase mb-1">Nos casamos</p>
              <p class="text-white font-light leading-tight" style="font-family: var(--font-serif); font-size:1.1rem;">
                {{ form.couple_name_1 || 'Jennifer Alondra' }}
              </p>
              <p class="text-[#c9a656] font-light" style="font-family: var(--font-serif); font-size:0.85rem; font-style:italic;">&amp;</p>
              <p class="text-white font-light leading-tight" style="font-family: var(--font-serif); font-size:1.1rem;">
                {{ form.couple_name_2 || 'Guido Ambiorix' }}
              </p>
              <p class="text-white/50 text-[9px] tracking-widest uppercase mt-2">
                {{ form.wedding_date
                  ? new Date(form.wedding_date + 'T00:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
                  : 'Fecha por definir' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Info cards -->
        <div class="bg-white rounded-2xl border border-[#ece5d6] shadow-[0_1px_3px_rgba(58,54,35,0.05)] p-4 space-y-3">
          <p class="text-[11px] font-semibold text-[#9a9280] uppercase tracking-wider">Detalles</p>
          <div v-for="item in [
            { label: 'Venue', value: form.venue || 'Sin definir', icon: '📍' },
            { label: 'Fecha', value: form.wedding_date || 'Sin fecha', icon: '📅' },
            { label: 'Historia', value: form.story ? `${form.story.length} caracteres` : 'Sin historia', icon: '✍️' },
          ]" :key="item.label" class="flex items-start gap-3">
            <span class="text-base mt-0.5">{{ item.icon }}</span>
            <div>
              <p class="text-[11px] font-semibold text-[#9a9280] uppercase tracking-wide">{{ item.label }}</p>
              <p class="text-sm text-[#2a2620] mt-0.5 leading-snug">{{ item.value }}</p>
            </div>
          </div>
        </div>

        <!-- Link público -->
        <div class="bg-white rounded-2xl border border-[#ece5d6] shadow-[0_1px_3px_rgba(58,54,35,0.05)] p-4">
          <p class="text-[11px] font-semibold text-[#9a9280] uppercase tracking-wider mb-3">Sitio público</p>
          <a href="/" target="_blank"
            class="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#e8e1d3] text-sm text-[#5a5442] hover:border-[#c9a24b] hover:text-[#8a6a24] transition no-underline">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
            </svg>
            Abrir sitio en nueva pestaña
          </a>
        </div>
      </div>
    </div>

    <!-- ── Tab: Itinerario ── -->
    <div v-else-if="activeTab === 'itinerario'" class="max-w-2xl">
      <AdminListEditor
        title="Itinerario" description="El horario del día que ven los invitados en la sección Detalles."
        icon="M8 2v3M16 2v3M3.5 9h17M5 5h14a1.5 1.5 0 011.5 1.5v13A1.5 1.5 0 0119 21H5a1.5 1.5 0 01-1.5-1.5v-13A1.5 1.5 0 015 5z"
        icon-bg="#f0fdf4" icon-color="#2d5a27"
        :items="listState.events" :fields="eventFields"
        title-field="name" subtitle-field="event_time" item-label="evento" sortable
        :empty-defaults="{ name: '', event_time: '', notes: '' }"
        :add="listActions.events.add" :update="listActions.events.update" :remove="listActions.events.remove" />
    </div>

    <!-- ── Tab: FAQ ── -->
    <div v-else-if="activeTab === 'faq'" class="max-w-2xl">
      <AdminListEditor
        title="Preguntas Frecuentes" description="Se agrupan por categoría automáticamente si la llenas."
        icon="M9.5 9a2.5 2.5 0 115 0c0 1.5-2.5 2-2.5 4M12 17h.01M12 21a9 9 0 100-18 9 9 0 000 18z"
        icon-bg="#f3f0ff" icon-color="#7b4fa6"
        :items="listState.faq" :fields="faqFields"
        title-field="question" subtitle-field="category" item-label="pregunta" sortable
        :empty-defaults="{ question: '', answer: '', category: '' }"
        :add="listActions.faq.add" :update="listActions.faq.update" :remove="listActions.faq.remove" />
    </div>

    <!-- ── Tab: Mesa de Regalos ── -->
    <div v-else-if="activeTab === 'regalos'" class="max-w-2xl space-y-5">

      <form @submit.prevent="save">
        <div class="bg-white rounded-2xl border border-[#ece5d6] shadow-[0_1px_3px_rgba(58,54,35,0.05)] overflow-hidden">
          <div class="px-6 py-4 border-b border-[#f2ecdf] flex items-center gap-3">
            <div class="w-7 h-7 rounded-lg flex items-center justify-center bg-amber-50">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
            <p class="font-serif text-[16px] font-semibold text-[#2a2620] tracking-wide">Foto de la sección</p>
          </div>
          <div class="p-4 sm:p-6 space-y-3">
            <label class="block text-[11px] font-semibold text-[#9a9280] uppercase tracking-wider">Imagen al lado del texto</label>
            <input v-model="form.registry_photo_url"
              class="w-full rounded-xl border border-[#e8e1d3] bg-[#faf7f0] px-4 py-3 text-sm text-[#2a2620] placeholder-[#a8a08f] focus:outline-none focus:ring-2 focus:ring-[#c9a24b]/40 focus:bg-white focus:border-[#c9a24b] transition"
              placeholder="https://..." />
            <p class="text-xs text-gray-400">Aparece junto al texto "Mesa de Regalos" en el sitio.</p>
          </div>
        </div>
        <button type="submit" class="mt-3 px-5 py-2 rounded-lg text-sm font-semibold text-[#faf7f0]" style="background:#3a3623">Guardar foto</button>
        <Transition name="fade">
          <span v-if="saved" class="ml-3 text-sm font-medium text-emerald-600">Guardado ✓</span>
        </Transition>
      </form>

      <AdminListEditor
        title="Cuentas Bancarias" description="Opciones de regalo en efectivo por transferencia bancaria."
        icon="M20 12v9H4v-9M2 7h20v5H2V7zM12 22V7M12 7C10 3 5 3 5 5.5S9 7 12 7zM12 7c2-4 7-4 7-1.5S15 7 12 7z"
        icon-bg="#fff7ed" icon-color="#c2621a"
        :items="listState.bankAccounts" :fields="bankAccountFields"
        title-field="bank_name" subtitle-field="holder_name" item-label="cuenta" sortable
        :empty-defaults="{ bank_name: '', account_number: '', holder_name: '', account_type: 'ahorros', holder_id: '', note: '' }"
        :add="listActions.bankAccounts.add" :update="listActions.bankAccounts.update" :remove="listActions.bankAccounts.remove" />
    </div>


    <!-- ── Tab: Cortejo ── -->
    <div v-else-if="activeTab === 'cortejo'" class="max-w-2xl">
      <AdminListEditor
        title="Cortejo / Wedding Party" description="Padrinos y damas que aparecen en la sección Wedding Party."
        icon="M16 11a4 4 0 10-8 0 4 4 0 008 0zM6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"
        icon-bg="#fdf2f8" icon-color="#be185d"
        :items="listState.weddingParty" :fields="partyFields"
        title-field="name" subtitle-field="role_label" item-label="persona" sortable
        :empty-defaults="{ name: '', role_group: 'bridesmaid', role_label: '', photo_url: '' }"
        :add="listActions.weddingParty.add" :update="listActions.weddingParty.update" :remove="listActions.weddingParty.remove" />
    </div>

    <!-- ── Tab: Galería ── -->
    <div v-else-if="activeTab === 'galeria'" class="max-w-2xl space-y-5">

      <form @submit.prevent="save" class="space-y-5">
        <!-- Sección: Foto/video de portada -->
        <div class="bg-white rounded-2xl border border-[#ece5d6] shadow-[0_1px_3px_rgba(58,54,35,0.05)] overflow-hidden">
          <div class="px-6 py-4 border-b border-[#f2ecdf] flex items-center gap-3">
            <div class="w-7 h-7 rounded-lg flex items-center justify-center bg-amber-50">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
            <p class="font-serif text-[16px] font-semibold text-[#2a2620] tracking-wide">Foto de portada</p>
          </div>
          <div class="p-4 sm:p-6 space-y-4">
            <div>
              <label class="block text-[11px] font-semibold text-[#9a9280] uppercase tracking-wider mb-2">Foto de fondo</label>
              <input v-model="form.cover_photo_url"
                class="w-full rounded-xl border border-[#e8e1d3] bg-[#faf7f0] px-4 py-3 text-sm text-[#2a2620] placeholder-[#a8a08f] focus:outline-none focus:ring-2 focus:ring-[#c9a24b]/40 focus:bg-white focus:border-[#c9a24b] transition"
                placeholder="https://tu-foto.com/imagen.jpg" />
              <p class="text-xs text-gray-400 mt-2">Pega la URL pública de Supabase Storage, Cloudinary o cualquier host de imágenes. También se usa como poster mientras carga el video.</p>
            </div>
            <div>
              <label class="block text-[11px] font-semibold text-[#9a9280] uppercase tracking-wider mb-2">Video de fondo (opcional)</label>
              <input v-model="form.cover_video_url"
                class="w-full rounded-xl border border-[#e8e1d3] bg-[#faf7f0] px-4 py-3 text-sm text-[#2a2620] placeholder-[#a8a08f] focus:outline-none focus:ring-2 focus:ring-[#c9a24b]/40 focus:bg-white focus:border-[#c9a24b] transition"
                placeholder="https://tu-video.com/hero.mp4" />
              <p class="text-xs text-gray-400 mt-2">Si se llena, el hero reproduce este video en loop (sin audio) en vez de la foto. Recomendado: mp4 H.264, 1920×1080, sin audio, pocos MB. Se ignora si el visitante tiene "reducir movimiento" activado.</p>
            </div>
            <!-- Preview inline -->
            <div v-if="form.cover_video_url" class="mt-3 rounded-xl overflow-hidden bg-[#f2ecdf] relative" style="height:140px;">
              <video :src="form.cover_video_url" class="w-full h-full object-cover" autoplay muted loop playsinline></video>
              <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-3">
                <span class="text-white text-xs font-medium">Vista previa del video</span>
              </div>
            </div>
            <div v-else-if="form.cover_photo_url" class="mt-3 rounded-xl overflow-hidden bg-[#f2ecdf] relative" style="height:140px;">
              <img :src="form.cover_photo_url" alt="Preview" class="w-full h-full object-cover" @error="$event.target.style.display='none'" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-3">
                <span class="text-white text-xs font-medium">Vista previa del hero</span>
              </div>
            </div>
            <div v-else class="mt-3 rounded-xl border-2 border-dashed border-gray-200 h-24 flex items-center justify-center">
              <p class="text-xs text-gray-400">La imagen o video aparecerá aquí</p>
            </div>
          </div>
        </div>

        <!-- Sección: Save the Date -->
        <div class="bg-white rounded-2xl border border-[#ece5d6] shadow-[0_1px_3px_rgba(58,54,35,0.05)] overflow-hidden">
          <div class="px-6 py-4 border-b border-[#f2ecdf] flex items-center gap-3">
            <div class="w-7 h-7 rounded-lg flex items-center justify-center bg-rose-50">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <p class="font-serif text-[16px] font-semibold text-[#2a2620] tracking-wide">Save the Date</p>
          </div>
          <div class="p-4 sm:p-6 space-y-3">
            <label class="block text-[11px] font-semibold text-[#9a9280] uppercase tracking-wider">Imagen del save the date</label>
            <input v-model="form.save_the_date_image_url"
              class="w-full rounded-xl border border-[#e8e1d3] bg-[#faf7f0] px-4 py-3 text-sm text-[#2a2620] placeholder-[#a8a08f] focus:outline-none focus:ring-2 focus:ring-[#c9a24b]/40 focus:bg-white focus:border-[#c9a24b] transition"
              placeholder="https://tu-imagen.com/save-the-date.jpg" />
            <p class="text-xs text-gray-400">Pega la URL pública de la imagen que diseñaron para el "save the date". Se muestra dentro de la tarjeta que aparece al romper el sello. Si se deja vacío, se muestra una tarjeta de texto con los nombres, fecha y venue.</p>
            <div v-if="form.save_the_date_image_url" class="mt-2 rounded-xl overflow-hidden bg-[#f2ecdf]" style="max-height:220px;">
              <img :src="form.save_the_date_image_url" alt="Preview" class="w-full h-auto object-contain" style="max-height:220px" @error="$event.target.style.display='none'" />
            </div>
          </div>
        </div>

        <!-- Sección: Fotos adicionales -->
        <div class="bg-white rounded-2xl border border-[#ece5d6] shadow-[0_1px_3px_rgba(58,54,35,0.05)] overflow-hidden">
          <div class="px-6 py-4 border-b border-[#f2ecdf] flex items-center gap-3">
            <div class="w-7 h-7 rounded-lg flex items-center justify-center bg-amber-50">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
            <p class="font-serif text-[16px] font-semibold text-[#2a2620] tracking-wide">Fotos adicionales</p>
          </div>
          <div class="p-4 sm:p-6 space-y-4">
            <p class="text-xs text-gray-400">Pega URLs públicas de Supabase Storage, Cloudinary u otro host. Si se dejan vacíos se usan las imágenes por defecto de <code class="bg-[#f2ecdf] px-1 rounded text-[#6b6350]">public/img/</code>.</p>
            <div v-for="field in [
              { key: 'couple_photo_url',   label: 'Foto de la pareja',   hint: 'Sección Nuestra Historia' },
            ]" :key="field.key" class="space-y-1">
              <label class="block text-[11px] font-semibold text-[#9a9280] uppercase tracking-wider">{{ field.label }}</label>
              <input v-model="form[field.key]"
                class="w-full rounded-xl border border-[#e8e1d3] bg-[#faf7f0] px-4 py-3 text-sm text-[#2a2620] placeholder-[#a8a08f] focus:outline-none focus:ring-2 focus:ring-[#c9a24b]/40 focus:bg-white focus:border-[#c9a24b] transition"
                placeholder="https://..." />
              <p class="text-xs text-gray-400">{{ field.hint }}</p>
            </div>
          </div>
        </div>

        <!-- Save bar -->
        <div class="sticky bottom-4 z-20 bg-white/95 backdrop-blur rounded-2xl border border-[#ece5d6] shadow-[0_8px_24px_rgba(58,54,35,0.12)] px-4 sm:px-6 py-4 flex flex-wrap items-center gap-3">
          <button type="submit"
            class="w-full sm:w-auto px-7 py-2.5 text-[#faf7f0] text-sm font-semibold rounded-xl hover:brightness-110 active:brightness-95 transition cursor-pointer border-none shadow-sm"
            style="background: linear-gradient(135deg, #4a4530, #3a3623);">
            Guardar cambios
          </button>
          <Transition name="fade">
            <span v-if="saved" class="flex items-center gap-2 text-sm font-medium text-emerald-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
              Guardado correctamente
            </span>
          </Transition>
        </div>
      </form>

      <AdminListEditor
        title="Fotos del Venue" description="Varias fotos del lugar, se muestran en la sección Venue."
        icon="M3 21V8l9-5 9 5v13M9 21v-6h6v6M3 12h18"
        icon-bg="#eff6ff" icon-color="#1d4ed8"
        :items="listState.venuePhotos" :fields="venuePhotoFields"
        title-field="caption" subtitle-field="url" item-label="foto" sortable
        :empty-defaults="{ url: '', caption: '' }"
        :add="listActions.venuePhotos.add" :update="listActions.venuePhotos.update" :remove="listActions.venuePhotos.remove" />

      <AdminListEditor
        title="Galería" description="Fotos que aparecen en Our love story y en la galería del sitio."
        icon="M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1zM8 11a2 2 0 100-4 2 2 0 000 4zM3 16l5-5 4 4 3-3 6 6"
        icon-bg="#f0fdf4" icon-color="#2d5a27"
        :items="listState.gallery" :fields="galleryFields"
        title-field="caption" subtitle-field="url" item-label="foto" sortable
        :empty-defaults="{ url: '', caption: '', year: '' }"
        :add="listActions.gallery.add" :update="listActions.gallery.update" :remove="listActions.gallery.remove" />
    </div>
  </div>
</template>
