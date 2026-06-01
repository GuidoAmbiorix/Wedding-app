<script setup>
import { onMounted, computed } from 'vue'
import { useGuestsStore } from '@/stores/guests'
import { storeToRefs } from 'pinia'

const guestsStore = useGuestsStore()
const { guests, loading, stats } = storeToRefs(guestsStore)

onMounted(() => guestsStore.fetchGuests())

const answered = computed(() =>
  guests.value.filter(g => {
    const s = g.rsvps?.[0]?.status
    return s && s !== 'pending'
  })
)

const pct = computed(() =>
  guests.value.length ? Math.round(answered.value.length / guests.value.length * 100) : 0
)

const statusCfg = {
  attending: { label: 'Asistirá',  cls: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' },
  declined:  { label: 'No asiste', cls: 'bg-red-50 text-red-600 ring-1 ring-red-200' },
  pending:   { label: 'Pendiente', cls: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200' },
  maybe:     { label: 'Tal vez',   cls: 'bg-blue-50 text-blue-600 ring-1 ring-blue-200' },
}

const mealLabel = { chicken:'Pollo', beef:'Res', fish:'Pescado', vegetarian:'Vegetariano', vegan:'Vegano' }
</script>

<template>
  <div class="p-6 lg:p-8 min-h-full">

    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Confirmaciones</h1>
      <p class="text-sm text-gray-500 mt-0.5">
        {{ stats.attending }} asistirán · {{ stats.declined }} no asisten · {{ stats.pending }} pendientes
      </p>
    </div>

    <!-- Stats cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <p class="text-3xl font-bold text-gray-900">{{ stats.total }}</p>
        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-1">Invitados</p>
      </div>
      <div class="bg-emerald-50 rounded-xl border border-emerald-100 shadow-sm p-4">
        <p class="text-3xl font-bold text-emerald-600">{{ stats.attending }}</p>
        <p class="text-xs font-semibold text-emerald-400 uppercase tracking-wider mt-1">Asistirán</p>
      </div>
      <div class="bg-red-50 rounded-xl border border-red-100 shadow-sm p-4">
        <p class="text-3xl font-bold text-red-500">{{ stats.declined }}</p>
        <p class="text-xs font-semibold text-red-300 uppercase tracking-wider mt-1">Declinaron</p>
      </div>
      <div class="bg-violet-50 rounded-xl border border-violet-100 shadow-sm p-4">
        <p class="text-3xl font-bold text-violet-600">{{ stats.totalAttending }}</p>
        <p class="text-xs font-semibold text-violet-400 uppercase tracking-wider mt-1">Total personas</p>
      </div>
    </div>

    <!-- Progress bar -->
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-8">
      <div class="flex justify-between items-center mb-3">
        <p class="text-sm font-semibold text-gray-700">Respuestas recibidas</p>
        <p class="text-sm font-bold text-violet-600">{{ answered.length }} / {{ guests.length }} &nbsp;({{ pct }}%)</p>
      </div>
      <div class="h-3 bg-gray-100 rounded-full overflow-hidden">
        <div
          class="h-full bg-gradient-to-r from-violet-500 to-emerald-500 rounded-full transition-all duration-700"
          :style="`width: ${pct}%`"
        />
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div v-if="loading" class="py-20 flex justify-center">
        <div class="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
      </div>
      <table v-else class="w-full text-sm">
        <thead>
          <tr class="border-b border-gray-100 bg-gray-50">
            <th class="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Invitado</th>
            <th class="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
            <th class="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">+1</th>
            <th class="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Menú</th>
            <th class="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden xl:table-cell">Mensaje</th>
            <th class="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Respondió</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="guest in guests" :key="guest.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-5 py-4">
              <p class="font-semibold text-gray-900">{{ guest.first_name }} {{ guest.last_name }}</p>
              <p class="text-xs text-gray-400 mt-0.5">{{ guest.email || '—' }}</p>
            </td>
            <td class="px-5 py-4">
              <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
                    :class="statusCfg[guest.rsvps?.[0]?.status || 'pending'].cls">
                {{ statusCfg[guest.rsvps?.[0]?.status || 'pending'].label }}
              </span>
            </td>
            <td class="px-5 py-4 text-xs text-gray-500 hidden md:table-cell">
              {{ guest.rsvps?.[0]?.plus_one_confirmed ? (guest.rsvps[0].plus_one_name || 'Sí ✓') : '—' }}
            </td>
            <td class="px-5 py-4 text-xs text-gray-500 hidden lg:table-cell capitalize">
              {{ mealLabel[guest.rsvps?.[0]?.meal_choice] || '—' }}
            </td>
            <td class="px-5 py-4 text-xs text-gray-500 hidden xl:table-cell max-w-xs">
              <span class="line-clamp-2">{{ guest.rsvps?.[0]?.message || '—' }}</span>
            </td>
            <td class="px-5 py-4 text-xs text-gray-400 hidden lg:table-cell">
              {{ guest.rsvps?.[0]?.responded_at
                ? new Date(guest.rsvps[0].responded_at).toLocaleDateString('es-ES')
                : '—' }}
            </td>
          </tr>
          <tr v-if="guests.length === 0 && !loading">
            <td colspan="6" class="py-16 text-center text-gray-400">
              <p class="text-4xl mb-3">✉️</p>
              <p class="text-sm">Aún no hay confirmaciones.</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
