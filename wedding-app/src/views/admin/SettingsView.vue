<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { useWeddingStore } from '@/stores/wedding'
import { useGuestsStore } from '@/stores/guests'
import { storeToRefs } from 'pinia'

const weddingStore = useWeddingStore()
const guestsStore  = useGuestsStore()
const { wedding }  = storeToRefs(weddingStore)
const { guests }   = storeToRefs(guestsStore)

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
  couple_photo_url: '',
  venue_photo_url: '',
  details_photo_url: '',
  registry_photo_url: '',
  story: '',
  invitation_text: '',
  venue_description: '',
  dress_code: '',
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
  <div class="p-6 lg:p-8">

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">

      <!-- ── FORM (2/3) ── -->
      <form @submit.prevent="save" class="xl:col-span-2 space-y-5">

        <!-- Sección: Novios -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-50 flex items-center gap-3">
            <div class="w-7 h-7 rounded-lg flex items-center justify-center" style="background:#f3f0ff;">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" style="color:#7b4fa6;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
            </div>
            <p class="text-sm font-semibold text-gray-800">Los novios</p>
          </div>
          <div class="p-6 grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Nombre 1 *</label>
              <input v-model="form.couple_name_1" required
                class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:bg-white focus:border-transparent transition"
                placeholder="Jennifer Alondra" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Nombre 2 *</label>
              <input v-model="form.couple_name_2" required
                class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:bg-white focus:border-transparent transition"
                placeholder="Guido Ambiorix" />
            </div>
          </div>
        </div>

        <!-- Sección: Fecha y lugar -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-50 flex items-center gap-3">
            <div class="w-7 h-7 rounded-lg flex items-center justify-center" style="background:#f0fdf4;">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" style="color:#2d5a27;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
            <p class="text-sm font-semibold text-gray-800">Fecha y lugar</p>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Fecha de la boda *</label>
              <input v-model="form.wedding_date" type="date" required
                class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:bg-white focus:border-transparent transition" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Venue / Salón</label>
                <input v-model="form.venue"
                  class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:bg-white focus:border-transparent transition"
                  placeholder="Bosque San Miguel" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Dirección</label>
                <input v-model="form.venue_address"
                  class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:bg-white focus:border-transparent transition"
                  placeholder="Km 12, San Miguel" />
              </div>
            </div>
          </div>
        </div>

        <!-- Sección: Foto de portada -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-50 flex items-center gap-3">
            <div class="w-7 h-7 rounded-lg flex items-center justify-center bg-amber-50">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
            <p class="text-sm font-semibold text-gray-800">Foto de portada</p>
          </div>
          <div class="p-6">
            <input v-model="form.cover_photo_url"
              class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:bg-white focus:border-transparent transition"
              placeholder="https://tu-foto.com/imagen.jpg" />
            <p class="text-xs text-gray-400 mt-2">Pega la URL pública de Supabase Storage, Cloudinary o cualquier host de imágenes.</p>
            <!-- Preview inline -->
            <div v-if="form.cover_photo_url" class="mt-3 rounded-xl overflow-hidden bg-gray-100 relative" style="height:140px;">
              <img :src="form.cover_photo_url" alt="Preview" class="w-full h-full object-cover" @error="$event.target.style.display='none'" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-3">
                <span class="text-white text-xs font-medium">Vista previa del hero</span>
              </div>
            </div>
            <div v-else class="mt-3 rounded-xl border-2 border-dashed border-gray-200 h-24 flex items-center justify-center">
              <p class="text-xs text-gray-400">La imagen aparecerá aquí</p>
            </div>
          </div>
        </div>

        <!-- Sección: Historia -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-50 flex items-center gap-3">
            <div class="w-7 h-7 rounded-lg flex items-center justify-center bg-rose-50">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
              </svg>
            </div>
            <p class="text-sm font-semibold text-gray-800">Nuestra historia</p>
            <span class="ml-auto text-xs text-gray-400">{{ form.story?.length || 0 }} caracteres</span>
          </div>
          <div class="p-6 space-y-4">
            <textarea v-model="form.story" rows="5"
              class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:bg-white focus:border-transparent transition resize-none"
              placeholder="Cuéntanos cómo se conocieron, qué los une, qué los hace especiales..." />
            <div>
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Texto de invitación</label>
              <textarea v-model="form.invitation_text" rows="3"
                class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:bg-white focus:border-transparent transition resize-none"
                placeholder="Nos encantaría que estuvieras presente en este momento tan especial..." />
              <p class="text-xs text-gray-400 mt-1">Aparece debajo del relato en la sección "Nuestra historia".</p>
            </div>
          </div>
        </div>

        <!-- Sección: El lugar -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-50 flex items-center gap-3">
            <div class="w-7 h-7 rounded-lg flex items-center justify-center bg-green-50">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
            <p class="text-sm font-semibold text-gray-800">El lugar</p>
          </div>
          <div class="p-6">
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Descripción del venue</label>
            <textarea v-model="form.venue_description" rows="3"
              class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:bg-white focus:border-transparent transition resize-none"
              placeholder="Celebraremos entre jardines y luz cálida, rodeados de naturaleza..." />
            <p class="text-xs text-gray-400 mt-1">Aparece en la sección "Dónde sucede todo".</p>
          </div>
        </div>

        <!-- Sección: Código de vestimenta -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-50 flex items-center gap-3">
            <div class="w-7 h-7 rounded-lg flex items-center justify-center bg-purple-50">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7 7l10 10M17 7L7 17"/>
              </svg>
            </div>
            <p class="text-sm font-semibold text-gray-800">Código de vestimenta</p>
          </div>
          <div class="p-6 space-y-4">
            <textarea v-model="form.dress_code" rows="3"
              class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:bg-white focus:border-transparent transition resize-none"
              placeholder="Etiqueta formal. Nos inspira la paleta del bosque: verdes profundos, salvia y tonos tierra..." />
            <div>
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Fecha límite de RSVP</label>
              <input v-model="form.rsvp_deadline" type="date"
                class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:bg-white focus:border-transparent transition" />
              <p class="text-xs text-gray-400 mt-1">Los invitados verán esta fecha como límite para confirmar.</p>
            </div>
          </div>
        </div>

        <!-- Sección: Fotos adicionales -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-50 flex items-center gap-3">
            <div class="w-7 h-7 rounded-lg flex items-center justify-center bg-amber-50">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
            <p class="text-sm font-semibold text-gray-800">Fotos adicionales</p>
          </div>
          <div class="p-6 space-y-4">
            <p class="text-xs text-gray-400">Pega URLs públicas de Supabase Storage, Cloudinary u otro host. Si se dejan vacíos se usan las imágenes por defecto de <code class="bg-gray-100 px-1 rounded">public/img/</code>.</p>
            <div v-for="field in [
              { key: 'couple_photo_url',   label: 'Foto de la pareja',   hint: 'Sección Nuestra Historia' },
              { key: 'venue_photo_url',    label: 'Foto del venue',       hint: 'Sección Dónde sucede todo' },
              { key: 'details_photo_url',  label: 'Foto de detalles',     hint: 'Encabezado sección Detalles' },
              { key: 'registry_photo_url', label: 'Foto mesa de regalos', hint: 'Sección Mesa de Regalos' },
            ]" :key="field.key" class="space-y-1">
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ field.label }}</label>
              <input v-model="form[field.key]"
                class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:bg-white focus:border-transparent transition"
                placeholder="https://..." />
              <p class="text-xs text-gray-400">{{ field.hint }}</p>
            </div>
          </div>
        </div>

        <!-- Sección: Cupos -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-50 flex items-center gap-3">
            <div class="w-7 h-7 rounded-lg flex items-center justify-center bg-green-50">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m4-4a4 4 0 100-8 4 4 0 000 8zm6 0a3 3 0 100-6 3 3 0 000 6z"/>
              </svg>
            </div>
            <p class="text-sm font-semibold text-gray-800">Cupos de invitados</p>
          </div>
          <div class="p-6 space-y-5">

            <!-- Inputs de cuotas -->
            <div class="grid grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Total del evento</label>
                <input v-model.number="form.total_capacity" type="number" min="0"
                  class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:bg-white focus:border-transparent transition"
                  placeholder="0" />
                <p class="text-xs text-gray-400 mt-1">Capacidad máxima del venue</p>
              </div>
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider mb-2" style="color:#be185d;">
                  Cupo Jennifer
                </label>
                <input v-model.number="form.jennifer_quota" type="number" min="0"
                  class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:bg-white focus:border-transparent transition"
                  placeholder="0" />
                <p class="text-xs text-gray-400 mt-1">Personas que puede invitar</p>
              </div>
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider mb-2" style="color:#1d4ed8;">
                  Cupo Guido
                </label>
                <input v-model.number="form.guido_quota" type="number" min="0"
                  class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white focus:border-transparent transition"
                  placeholder="0" />
                <p class="text-xs text-gray-400 mt-1">Personas que puede invitar</p>
              </div>
            </div>

            <!-- Stats en tiempo real -->
            <div class="rounded-2xl border border-gray-100 overflow-hidden">
              <div class="px-4 py-2.5 bg-gray-50 border-b border-gray-100">
                <p class="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Uso actual · {{ quotaStats.total }} personas registradas</p>
              </div>
              <div class="divide-y divide-gray-50">

                <!-- Jennifer -->
                <div class="px-4 py-3.5 flex items-center gap-4">
                  <div class="w-2.5 h-2.5 rounded-full flex-shrink-0" style="background:#be185d;"></div>
                  <p class="text-sm font-semibold text-gray-700 w-24">Jennifer</p>
                  <div class="flex-1">
                    <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div class="h-full rounded-full transition-all"
                           style="background:#be185d;"
                           :style="{ width: form.jennifer_quota > 0 ? `${Math.min(100, quotaStats.jUsed / form.jennifer_quota * 100)}%` : '0%' }">
                      </div>
                    </div>
                  </div>
                  <div class="text-right flex-shrink-0 w-32">
                    <p class="text-sm font-bold text-gray-800">{{ quotaStats.jUsed }} <span class="text-gray-400 font-normal">/ {{ form.jennifer_quota || '—' }}</span></p>
                    <p class="text-[11px] text-gray-400">{{ form.jennifer_quota ? `${quotaStats.jLeft} disponibles` : 'Sin cupo definido' }}</p>
                  </div>
                </div>

                <!-- Guido -->
                <div class="px-4 py-3.5 flex items-center gap-4">
                  <div class="w-2.5 h-2.5 rounded-full flex-shrink-0" style="background:#1d4ed8;"></div>
                  <p class="text-sm font-semibold text-gray-700 w-24">Guido</p>
                  <div class="flex-1">
                    <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div class="h-full rounded-full transition-all"
                           style="background:#1d4ed8;"
                           :style="{ width: form.guido_quota > 0 ? `${Math.min(100, quotaStats.gUsed / form.guido_quota * 100)}%` : '0%' }">
                      </div>
                    </div>
                  </div>
                  <div class="text-right flex-shrink-0 w-32">
                    <p class="text-sm font-bold text-gray-800">{{ quotaStats.gUsed }} <span class="text-gray-400 font-normal">/ {{ form.guido_quota || '—' }}</span></p>
                    <p class="text-[11px] text-gray-400">{{ form.guido_quota ? `${quotaStats.gLeft} disponibles` : 'Sin cupo definido' }}</p>
                  </div>
                </div>

                <!-- Ambos -->
                <div v-if="quotaStats.bothUsed > 0" class="px-4 py-3.5 flex items-center gap-4">
                  <div class="w-2.5 h-2.5 rounded-full flex-shrink-0" style="background:#2c4628;"></div>
                  <p class="text-sm font-semibold text-gray-700 w-24">Ambos</p>
                  <div class="flex-1" />
                  <div class="text-right flex-shrink-0 w-32">
                    <p class="text-sm font-bold text-gray-800">{{ quotaStats.bothUsed }}</p>
                    <p class="text-[11px] text-gray-400">Compartidos</p>
                  </div>
                </div>

                <!-- Total vs capacidad -->
                <div class="px-4 py-3.5 flex items-center gap-4 bg-gray-50/50">
                  <div class="w-2.5 h-2.5 rounded-full flex-shrink-0 bg-gray-400"></div>
                  <p class="text-sm font-semibold text-gray-500 w-24">Total</p>
                  <div class="flex-1">
                    <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div class="h-full rounded-full transition-all bg-gray-400"
                           :style="{ width: form.total_capacity > 0 ? `${Math.min(100, quotaStats.total / form.total_capacity * 100)}%` : '0%' }">
                      </div>
                    </div>
                  </div>
                  <div class="text-right flex-shrink-0 w-32">
                    <p class="text-sm font-bold text-gray-700">{{ quotaStats.total }} <span class="text-gray-400 font-normal">/ {{ form.total_capacity || '—' }}</span></p>
                    <p class="text-[11px] text-gray-400">{{ form.total_capacity ? `${Math.max(0, form.total_capacity - quotaStats.total)} libres` : 'Sin capacidad definida' }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Save bar -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4 flex items-center gap-4">
          <button
            type="submit"
            class="px-6 py-2.5 text-white text-sm font-semibold rounded-xl hover:opacity-90 active:opacity-80 transition cursor-pointer border-none shadow-sm"
            style="background: linear-gradient(135deg, #3d1f6b, #2d5a27);"
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
          <span class="ml-auto text-xs text-gray-400">Los cambios se reflejan en el sitio público al instante</span>
        </div>
      </form>

      <!-- ── PREVIEW CARD (1/3) ── -->
      <div class="space-y-4">
        <!-- Mini preview del hero -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div class="px-4 py-3 border-b border-gray-50">
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Vista previa</p>
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
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Detalles</p>
          <div v-for="item in [
            { label: 'Venue', value: form.venue || 'Sin definir', icon: '📍' },
            { label: 'Fecha', value: form.wedding_date || 'Sin fecha', icon: '📅' },
            { label: 'Historia', value: form.story ? `${form.story.length} caracteres` : 'Sin historia', icon: '✍️' },
          ]" :key="item.label" class="flex items-start gap-3">
            <span class="text-base mt-0.5">{{ item.icon }}</span>
            <div>
              <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide">{{ item.label }}</p>
              <p class="text-sm text-gray-700 mt-0.5 leading-snug">{{ item.value }}</p>
            </div>
          </div>
        </div>

        <!-- Link público -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Sitio público</p>
          <a href="/" target="_blank"
            class="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:border-violet-300 hover:text-violet-600 transition no-underline">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
            </svg>
            Abrir sitio en nueva pestaña
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
