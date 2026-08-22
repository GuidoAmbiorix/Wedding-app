<script setup>
import { onMounted, computed } from 'vue'
import { useGuestsStore } from '@/stores/guests'
import { storeToRefs } from 'pinia'

const guestsStore = useGuestsStore()
const { guests, loading, stats } = storeToRefs(guestsStore)

onMounted(() => guestsStore.fetchGuests())

// Confirmados y declinados = han respondido
const responded = computed(() =>
  guests.value.filter(g => g.status === 'confirmado' || g.status === 'no_puede_ir' || g.status === 'no_seguro')
)
const pct = computed(() =>
  guests.value.length ? Math.round(responded.value.length / guests.value.length * 100) : 0
)

const statusCfg = {
  confirmado:      { label: 'Confirmado',     cls: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' },
  no_seguro:       { label: 'No está seguro', cls: 'bg-amber-50 text-amber-600 ring-1 ring-amber-200' },
  no_puede_ir:     { label: 'No puede ir',    cls: 'bg-red-50 text-red-600 ring-1 ring-red-200' },
  enviada:         { label: 'Enviada',        cls: 'bg-blue-50 text-blue-600 ring-1 ring-blue-200' },
  sin_enviar:      { label: 'Sin enviar',     cls: 'bg-gray-100 text-gray-500' },
  lista_de_espera: { label: 'En espera',      cls: 'bg-purple-50 text-purple-600 ring-1 ring-purple-200' },
}

const sideCfg = {
  jennifer: { label: 'Jennifer', color: '#be185d' },
  guido:    { label: 'Guido',    color: '#1d4ed8' },
  ambos:    { label: 'Ambos',    color: '#2c4628' },
}

const mealLabel = { chicken:'Pollo', beef:'Res', fish:'Pescado', vegetarian:'Vegetariano', vegan:'Vegano' }
</script>

<template>
  <div class="p-4 sm:p-6 lg:p-8 min-h-full pb-24 sm:pb-8">

    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-xl sm:text-2xl font-bold text-gray-900">Confirmaciones</h1>
      <p class="text-xs sm:text-sm text-gray-500 mt-0.5">
        {{ stats.confirmado }} confirmados · {{ stats.no_puede_ir }} no asisten · {{ stats.no_seguro }} no seguros
      </p>
    </div>

    <!-- Stats cards -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <p class="text-2xl sm:text-3xl font-bold text-gray-900">{{ stats.total }}</p>
        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-1">Invitados</p>
      </div>
      <div class="bg-emerald-50 rounded-xl border border-emerald-100 shadow-sm p-4">
        <p class="text-2xl sm:text-3xl font-bold text-emerald-600">{{ stats.confirmado }}</p>
        <p class="text-xs font-semibold text-emerald-400 uppercase tracking-wider mt-1">Confirmados</p>
      </div>
      <div class="bg-red-50 rounded-xl border border-red-100 shadow-sm p-4">
        <p class="text-2xl sm:text-3xl font-bold text-red-500">{{ stats.no_puede_ir }}</p>
        <p class="text-xs font-semibold text-red-300 uppercase tracking-wider mt-1">No asisten</p>
      </div>
      <div class="bg-violet-50 rounded-xl border border-violet-100 shadow-sm p-4">
        <p class="text-2xl sm:text-3xl font-bold text-violet-600">{{ stats.totalPeople }}</p>
        <p class="text-xs font-semibold text-violet-400 uppercase tracking-wider mt-1">Total personas</p>
      </div>
    </div>

    <!-- Progress bar -->
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5 mb-6">
      <div class="flex justify-between items-center mb-3">
        <p class="text-sm font-semibold text-gray-700">Respuestas recibidas</p>
        <p class="text-sm font-bold text-violet-600">{{ responded.length }} / {{ guests.length }} ({{ pct }}%)</p>
      </div>
      <div class="h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div class="h-full bg-gradient-to-r from-violet-500 to-emerald-500 rounded-full transition-all duration-700"
             :style="`width:${pct}%`" />
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="bg-white rounded-xl border border-gray-100 py-20 flex justify-center">
      <div class="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
    </div>

    <template v-else>
      <!-- ── MÓVIL: Cards ── -->
      <div class="sm:hidden space-y-3">
        <div v-if="guests.length === 0" class="bg-white rounded-xl border border-gray-100 py-16 text-center">
          <p class="text-sm text-gray-400">Aún no hay respuestas.</p>
        </div>

        <div v-for="guest in guests" :key="guest.id"
             class="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <!-- Nombre + status -->
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                   :style="guest.side === 'jennifer' ? 'background:linear-gradient(135deg,#be185d,#db2777)' :
                           guest.side === 'guido'    ? 'background:linear-gradient(135deg,#1d4ed8,#2563eb)' :
                                                       'background:linear-gradient(135deg,#2c4628,#3a5733)'">
                {{ (guest.guest_display_name || guest.first_name || '?')[0].toUpperCase() }}
              </div>
              <div class="min-w-0">
                <p class="font-semibold text-gray-900 text-sm truncate">
                  {{ guest.guest_display_name || `${guest.first_name} ${guest.last_name}` }}
                </p>
                <p class="text-[11px] text-gray-400 mt-0.5">
                  {{ (guest.adults_count ?? 1) + (guest.children_count ?? 0) }} personas
                  <span v-if="guest.side"> · <span :style="`color:${sideCfg[guest.side]?.color}`">{{ sideCfg[guest.side]?.label }}</span></span>
                </p>
              </div>
            </div>
            <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap flex-shrink-0"
                  :class="statusCfg[guest.status]?.cls || statusCfg.sin_enviar.cls">
              {{ statusCfg[guest.status]?.label || 'Sin enviar' }}
            </span>
          </div>

          <!-- Menú por miembros (si tiene rsvp con members_responses) -->
          <div v-if="guest.wedding_rsvps?.[0]?.members_responses?.length" class="mt-3 pt-3 border-t border-gray-50 space-y-1">
            <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Menú</p>
            <div v-for="mr in guest.wedding_rsvps[0].members_responses" :key="mr.name"
                 class="flex justify-between text-xs">
              <span class="text-gray-600">{{ mr.name }}</span>
              <span class="text-gray-400">{{ mealLabel[mr.meal_choice] || '—' }}</span>
            </div>
          </div>
          <!-- Mensaje -->
          <p v-if="guest.wedding_rsvps?.[0]?.message"
             class="mt-3 pt-3 border-t border-gray-50 text-xs text-gray-500 italic line-clamp-2">
            "{{ guest.wedding_rsvps[0].message }}"
          </p>
        </div>
      </div>

      <!-- ── DESKTOP: Tabla ── -->
      <div class="hidden sm:block bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm min-w-[640px]">
            <thead>
              <tr class="border-b border-gray-100 bg-gray-50/60">
                <th class="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Invitado</th>
                <th class="px-4 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Estado</th>
                <th class="px-4 py-3.5 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">Personas</th>
                <th class="px-4 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Menú</th>
                <th class="px-4 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider hidden xl:table-cell">Mensaje</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="guest in guests" :key="guest.id" class="hover:bg-gray-50/60 transition-colors">
                <!-- Nombre -->
                <td class="px-5 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                         :style="guest.side === 'jennifer' ? 'background:linear-gradient(135deg,#be185d,#db2777)' :
                                 guest.side === 'guido'    ? 'background:linear-gradient(135deg,#1d4ed8,#2563eb)' :
                                                             'background:linear-gradient(135deg,#2c4628,#3a5733)'">
                      {{ (guest.guest_display_name || guest.first_name || '?')[0].toUpperCase() }}
                    </div>
                    <div>
                      <p class="font-semibold text-gray-900">{{ guest.guest_display_name || `${guest.first_name} ${guest.last_name}` }}</p>
                      <p class="text-xs text-gray-400 mt-0.5">
                        {{ (guest.adults_count ?? 1) + (guest.children_count ?? 0) }} personas
                        <span v-if="guest.side" :style="`color:${sideCfg[guest.side]?.color}`"> · {{ sideCfg[guest.side]?.label }}</span>
                      </p>
                    </div>
                  </div>
                </td>
                <!-- Estado -->
                <td class="px-4 py-4">
                  <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
                        :class="statusCfg[guest.status]?.cls || statusCfg.sin_enviar.cls">
                    {{ statusCfg[guest.status]?.label || 'Sin enviar' }}
                  </span>
                </td>
                <!-- Personas -->
                <td class="px-4 py-4 text-center font-bold text-gray-800">
                  {{ (guest.adults_count ?? 1) + (guest.children_count ?? 0) }}
                </td>
                <!-- Menú -->
                <td class="px-4 py-4 text-xs text-gray-500 hidden lg:table-cell">
                  <div v-if="guest.wedding_rsvps?.[0]?.members_responses?.length" class="space-y-0.5">
                    <p v-for="mr in guest.wedding_rsvps[0].members_responses" :key="mr.name" class="truncate">
                      {{ mr.name }}: {{ mealLabel[mr.meal_choice] || '—' }}
                    </p>
                  </div>
                  <span v-else>{{ mealLabel[guest.wedding_rsvps?.[0]?.meal_choice] || '—' }}</span>
                </td>
                <!-- Mensaje -->
                <td class="px-4 py-4 text-xs text-gray-400 hidden xl:table-cell max-w-xs">
                  <span class="line-clamp-2 italic">{{ guest.wedding_rsvps?.[0]?.message || '—' }}</span>
                </td>
              </tr>

              <tr v-if="guests.length === 0">
                <td colspan="5" class="py-16 text-center text-gray-400 text-sm">
                  Aún no hay respuestas registradas.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>
