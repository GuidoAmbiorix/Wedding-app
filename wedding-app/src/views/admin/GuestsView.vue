<script setup>
import { ref, onMounted, computed } from 'vue'
import { useGuestsStore } from '@/stores/guests'
import { storeToRefs } from 'pinia'

const guestsStore = useGuestsStore()
const { guests, loading, stats } = storeToRefs(guestsStore)

const showDrawer  = ref(false)
const editingGuest = ref(null)
const search      = ref('')
const filterGroup  = ref('')
const filterStatus = ref('')
const filterSide   = ref('')
const saving = ref(false)

// ── Status config ─────────────────────────────────────────────────────────────
const statusCfg = {
  confirmado:      { label: 'Confirmado',    short: 'Confirmado',  cls: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' },
  no_seguro:       { label: 'No está seguro',short: 'No seguro',   cls: 'bg-amber-50 text-amber-600 ring-1 ring-amber-200' },
  no_puede_ir:     { label: 'No puede ir',   short: 'No puede ir', cls: 'bg-red-50 text-red-600 ring-1 ring-red-200' },
  enviada:         { label: 'Invitación enviada', short: 'Enviada', cls: 'bg-blue-50 text-blue-600 ring-1 ring-blue-200' },
  sin_enviar:      { label: 'Sin enviar',    short: 'Sin enviar',  cls: 'bg-gray-100 text-gray-500' },
  lista_de_espera: { label: 'Lista de espera', short: 'En espera', cls: 'bg-purple-50 text-purple-600 ring-1 ring-purple-200' },
}
const statusOptions = Object.entries(statusCfg).map(([value, cfg]) => ({ value, ...cfg }))

// ── Group config ──────────────────────────────────────────────────────────────
const groupOptions = [
  { value: 'family',    label: 'Familia',  color: '#7b4fa6' },
  { value: 'friends',   label: 'Amigos',   color: '#2d5a27' },
  { value: 'bride',     label: 'Novia',    color: '#be185d' },
  { value: 'groom',     label: 'Novio',    color: '#1d4ed8' },
  { value: 'coworkers', label: 'Trabajo',  color: '#b45309' },
  { value: 'other',     label: 'Otro',     color: '#6b7280' },
]
const groupLabel = Object.fromEntries(groupOptions.map(g => [g.value, g.label]))

// ── Guest type ────────────────────────────────────────────────────────────────
const guestTypes = [
  { value: 'individual', label: 'Individual', desc: 'Una sola persona' },
  { value: 'grupo',      label: 'Grupo',      desc: 'Familia o pareja' },
]

// ── Empty form ────────────────────────────────────────────────────────────────
const emptyMember = () => ({ name: '', meal_choice: '', dietary: '' })
const sideOptions = [
  { value: 'jennifer', label: 'Jennifer', color: '#be185d' },
  { value: 'guido',    label: 'Guido',    color: '#1d4ed8' },
  { value: 'ambos',    label: 'Ambos',    color: '#2c4628' },
]
const sideCfg = Object.fromEntries(sideOptions.map(s => [s.value, s]))

const emptyForm = () => ({
  guest_type: 'individual',
  guest_display_name: '', first_name: '', last_name: '',
  email: '', phone: '', whatsapp: '',
  adults_count: 1, children_count: 0,
  members: [],
  status: 'sin_enviar',
  side: '',
  table_name: '', guest_group: 'friends',
  notes: '',
})
const form = ref(emptyForm())

// ── Filters ───────────────────────────────────────────────────────────────────
const filteredGuests = computed(() =>
  guests.value.filter(g => {
    const q = search.value.toLowerCase()
    const matchSearch = !q ||
      (g.guest_display_name || '').toLowerCase().includes(q) ||
      (g.email || '').toLowerCase().includes(q) ||
      (g.whatsapp || '').includes(q)
    const matchGroup  = !filterGroup.value  || g.guest_group === filterGroup.value
    const matchStatus = !filterStatus.value || g.status === filterStatus.value
    const matchSide   = !filterSide.value   || g.side === filterSide.value
    return matchSearch && matchGroup && matchStatus && matchSide
  })
)

const filteredTotals = computed(() => ({
  adults:   filteredGuests.value.reduce((s, g) => s + (g.adults_count   ?? 1), 0),
  children: filteredGuests.value.reduce((s, g) => s + (g.children_count ?? 0), 0),
  total:    filteredGuests.value.reduce((s, g) => s + (g.adults_count ?? 1) + (g.children_count ?? 0), 0),
}))

onMounted(() => guestsStore.fetchGuests())

// ── Drawer helpers ─────────────────────────────────────────────────────────────
function openAdd() {
  editingGuest.value = null
  form.value = emptyForm()
  showDrawer.value = true
}
function openEdit(guest) {
  editingGuest.value = guest
  // Destructure out joined/virtual fields before loading into form
  const { rsvps, ...guestData } = guest
  form.value = {
    ...emptyForm(),
    ...guestData,
    guest_type: guestData.guest_type || (guestData.members?.length ? 'grupo' : 'individual'),
    members: (guestData.members || []).map(m => ({ ...m })),
  }
  showDrawer.value = true
}
function closeDrawer() { showDrawer.value = false }

function addMember() {
  form.value.members.push(emptyMember())
}
function removeMember(i) {
  form.value.members.splice(i, 1)
}

// Keep adults_count in sync with members list
function syncCounts() {
  const adults   = form.value.members.filter((_, i) => i < form.value.adults_count).length
  // just keep the counts manual; no auto-sync
}

// ── Save ──────────────────────────────────────────────────────────────────────
async function save() {
  saving.value = true
  try {
    const payload = { ...form.value }
    if (payload.guest_type === 'individual') {
      // For individual, display name = full name; clear group fields
      payload.guest_display_name = `${payload.first_name} ${payload.last_name}`.trim()
      payload.members = []
      payload.adults_count = 1
      payload.children_count = 0
    } else {
      // For group, display name is required
      if (!payload.guest_display_name) {
        payload.guest_display_name = `${payload.first_name} ${payload.last_name}`.trim()
      }
    }
    if (editingGuest.value) {
      await guestsStore.updateGuest(editingGuest.value.id, payload)
    } else {
      await guestsStore.addGuest(payload)
    }
    showDrawer.value = false
  } finally {
    saving.value = false
  }
}

async function remove(id) {
  if (confirm('¿Eliminar este invitado?')) await guestsStore.deleteGuest(id)
}


// ── Meal labels ───────────────────────────────────────────────────────────────
const mealOptions = [
  { value: 'beef',       label: 'Res' },
  { value: 'chicken',    label: 'Pollo' },
  { value: 'fish',       label: 'Pescado' },
  { value: 'vegetarian', label: 'Vegetariano' },
  { value: 'vegan',      label: 'Vegano' },
]
</script>

<template>
  <div class="p-4 sm:p-6 lg:p-8 min-h-full pb-24 sm:pb-8">

    <!-- Header -->
    <div class="flex items-center justify-between gap-4 mb-6">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold text-gray-900">Invitados</h1>
        <p class="text-xs sm:text-sm text-gray-400 mt-0.5">
          {{ stats.total }} registros &middot; {{ stats.totalPeople }} personas &middot; {{ stats.confirmado }} confirmados
        </p>
      </div>
      <!-- Desktop add button -->
      <button
        @click="openAdd"
        class="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 text-white text-sm font-semibold rounded-xl hover:opacity-90 active:scale-95 transition-all cursor-pointer border-none shadow"
        style="background: linear-gradient(135deg, #2c4628, #3a5733);"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
        </svg>
        Agregar invitado
      </button>
    </div>

    <!-- Stats grid -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
      <!-- Confirmados -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-1">
        <p class="text-2xl font-bold text-emerald-600 leading-none">{{ stats.confirmado }}</p>
        <p class="text-xs text-gray-400 uppercase tracking-wider">Confirmados</p>
      </div>
      <!-- No seguros -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-1">
        <p class="text-2xl font-bold text-amber-500 leading-none">{{ stats.no_seguro }}</p>
        <p class="text-xs text-gray-400 uppercase tracking-wider">No seguros</p>
      </div>
      <!-- No pueden ir -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-1">
        <p class="text-2xl font-bold text-red-500 leading-none">{{ stats.no_puede_ir }}</p>
        <p class="text-xs text-gray-400 uppercase tracking-wider">No pueden ir</p>
      </div>
      <!-- Enviadas -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-1">
        <p class="text-2xl font-bold text-blue-500 leading-none">{{ stats.enviada }}</p>
        <p class="text-xs text-gray-400 uppercase tracking-wider">Enviadas</p>
      </div>
      <!-- Lista espera -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-1">
        <p class="text-2xl font-bold text-purple-500 leading-none">{{ stats.lista_espera }}</p>
        <p class="text-xs text-gray-400 uppercase tracking-wider">Lista espera</p>
      </div>
      <!-- Total personas -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-1">
        <p class="text-2xl font-bold text-gray-800 leading-none">{{ stats.totalPeople }}</p>
        <p class="text-xs text-gray-400 uppercase tracking-wider">Personas</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="space-y-2 mb-5">
      <div class="relative">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input v-model="search" type="text"
          placeholder="Buscar nombre, email o WhatsApp..."
          class="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
        />
      </div>
      <div class="grid grid-cols-3 gap-2">
        <select v-model="filterSide" class="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition cursor-pointer">
          <option value="">Todos</option>
          <option v-for="s in sideOptions" :key="s.value" :value="s.value">{{ s.label }}</option>
        </select>
        <select v-model="filterStatus" class="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition cursor-pointer">
          <option value="">Estado</option>
          <option v-for="s in statusOptions" :key="s.value" :value="s.value">{{ s.short }}</option>
        </select>
        <select v-model="filterGroup" class="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition cursor-pointer">
          <option value="">Grupo</option>
          <option v-for="g in groupOptions" :key="g.value" :value="g.value">{{ g.label }}</option>
        </select>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="bg-white rounded-2xl border border-gray-100 shadow-sm py-20 flex justify-center">
      <div class="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
    </div>

    <template v-else>
      <!-- ── MOBILE: Cards ── -->
      <div class="sm:hidden space-y-3">
        <div v-if="filteredGuests.length === 0" class="bg-white rounded-2xl border border-gray-100 py-16 text-center">
          <p class="text-sm font-semibold text-gray-400">No hay invitados</p>
          <p class="text-xs text-gray-300 mt-1">Toca + para agregar el primero</p>
        </div>

        <div v-for="guest in filteredGuests" :key="guest.id"
             class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 active:bg-gray-50 transition-colors">
          <!-- Top row: avatar + name + status -->
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5"
                 :style="guest.side === 'jennifer' ? 'background:linear-gradient(135deg,#be185d,#db2777)' :
                         guest.side === 'guido'    ? 'background:linear-gradient(135deg,#1d4ed8,#2563eb)' :
                                                     'background:linear-gradient(135deg,#2c4628,#3a5733)'">
              {{ (guest.guest_display_name || guest.first_name || '?')[0].toUpperCase() }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-gray-900 text-sm leading-snug truncate">
                {{ guest.guest_display_name || `${guest.first_name} ${guest.last_name}` }}
              </p>
              <div class="flex items-center gap-1.5 mt-1 flex-wrap">
                <span v-if="guest.side"
                      class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold text-white"
                      :style="`background:${sideCfg[guest.side]?.color}`">
                  {{ sideCfg[guest.side]?.label }}
                </span>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-500">
                  {{ guest.guest_type === 'grupo' ? 'Grupo' : 'Individual' }}
                </span>
              </div>
            </div>
            <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap flex-shrink-0"
                  :class="statusCfg[guest.status]?.cls || statusCfg.sin_enviar.cls">
              {{ statusCfg[guest.status]?.short || 'Sin enviar' }}
            </span>
          </div>

          <!-- Info row -->
          <div class="mt-3 flex items-center gap-4 text-xs text-gray-500">
            <span class="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m4-4a4 4 0 100-8 4 4 0 000 8zm6 0a3 3 0 100-6 3 3 0 000 6z"/>
              </svg>
              <b class="text-gray-700">{{ (guest.adults_count ?? 1) + (guest.children_count ?? 0) }}</b>
              personas
            </span>
            <span v-if="guest.table_name" class="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M3 14h18M10 4v16M14 4v16"/>
              </svg>
              {{ guest.table_name }}
            </span>
            <span v-if="guest.whatsapp" class="flex items-center gap-1 text-gray-400 truncate">
              {{ guest.whatsapp }}
            </span>
          </div>

          <!-- Actions -->
          <div class="mt-3 flex gap-2 pt-3 border-t border-gray-50">
            <button @click="openEdit(guest)"
              class="flex-1 py-2 text-xs font-semibold rounded-xl border border-gray-200 text-gray-600 bg-white active:bg-green-50 active:border-green-400 active:text-green-700 transition cursor-pointer">
              Editar
            </button>
            <button @click="remove(guest.id)"
              class="flex-1 py-2 text-xs font-semibold rounded-xl border border-gray-200 text-gray-400 bg-white active:bg-red-50 active:border-red-300 active:text-red-500 transition cursor-pointer">
              Borrar
            </button>
          </div>
        </div>

        <!-- Mobile totals -->
        <div v-if="filteredGuests.length > 0" class="text-center text-xs text-gray-400 py-2">
          {{ filteredGuests.length }} registros · {{ filteredTotals.total }} personas ({{ filteredTotals.adults }}A · {{ filteredTotals.children }}N)
        </div>
      </div>

      <!-- ── DESKTOP: Table ── -->
      <div class="hidden sm:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm min-w-[700px]">
            <thead>
              <tr class="border-b border-gray-100 bg-gray-50/60">
                <th class="px-5 py-3.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Invitado</th>
                <th class="px-4 py-3.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Parte de</th>
                <th class="px-4 py-3.5 text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Personas</th>
                <th class="px-4 py-3.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Mesa</th>
                <th class="px-4 py-3.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Estado</th>
                <th class="px-4 py-3.5 text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="guest in filteredGuests" :key="guest.id" class="hover:bg-gray-50/70 transition-colors">
                <!-- Invitado -->
                <td class="px-5 py-3.5">
                  <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                         :style="guest.side === 'jennifer' ? 'background:linear-gradient(135deg,#be185d,#db2777)' :
                                 guest.side === 'guido'    ? 'background:linear-gradient(135deg,#1d4ed8,#2563eb)' :
                                                             'background:linear-gradient(135deg,#2c4628,#3a5733)'">
                      {{ (guest.guest_display_name || guest.first_name || '?')[0].toUpperCase() }}
                    </div>
                    <div>
                      <p class="font-semibold text-gray-900 leading-snug">
                        {{ guest.guest_display_name || `${guest.first_name} ${guest.last_name}` }}
                      </p>
                      <p class="text-[11px] text-gray-400 mt-0.5 flex items-center gap-1.5">
                        <span class="px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 font-medium">
                          {{ guest.guest_type === 'grupo' ? 'Grupo' : 'Individual' }}
                        </span>
                        <span v-if="guest.guest_type === 'grupo' && guest.members?.length">
                          {{ guest.members.length }} miembro{{ guest.members.length !== 1 ? 's' : '' }}
                        </span>
                        <span v-if="guest.whatsapp">· {{ guest.whatsapp }}</span>
                      </p>
                    </div>
                  </div>
                </td>
                <!-- Parte de -->
                <td class="px-4 py-3.5">
                  <span v-if="guest.side"
                        class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold text-white"
                        :style="`background:${sideCfg[guest.side]?.color}`">
                    {{ sideCfg[guest.side]?.label }}
                  </span>
                  <span v-else class="text-gray-300 text-xs">—</span>
                </td>
                <!-- Personas -->
                <td class="px-4 py-3.5 text-center">
                  <span class="text-base font-bold text-gray-800">{{ (guest.adults_count ?? 1) + (guest.children_count ?? 0) }}</span>
                  <p class="text-[10px] text-gray-400 leading-none mt-0.5">
                    {{ guest.adults_count ?? 1 }}A<template v-if="guest.children_count"> · {{ guest.children_count }}N</template>
                  </p>
                </td>
                <!-- Mesa -->
                <td class="px-4 py-3.5">
                  <span v-if="guest.table_name" class="text-sm text-gray-600 font-medium">{{ guest.table_name }}</span>
                  <span v-else class="text-gray-300 text-xs">Sin asignar</span>
                </td>
                <!-- Estado -->
                <td class="px-4 py-3.5">
                  <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
                        :class="statusCfg[guest.status]?.cls || statusCfg.sin_enviar.cls">
                    {{ statusCfg[guest.status]?.short || 'Sin enviar' }}
                  </span>
                </td>
                <!-- Acciones -->
                <td class="px-4 py-3.5">
                  <div class="flex items-center justify-end gap-2">
                    <button @click="openEdit(guest)"
                      class="px-3 py-1.5 text-xs font-semibold rounded-lg border bg-white text-gray-600 border-gray-200 hover:border-green-400 hover:text-green-700 hover:bg-green-50 transition cursor-pointer">
                      Editar
                    </button>
                    <button @click="remove(guest.id)"
                      class="px-3 py-1.5 text-xs font-semibold rounded-lg border bg-white text-gray-400 border-gray-200 hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition cursor-pointer">
                      Borrar
                    </button>
                  </div>
                </td>
              </tr>

              <!-- Totals -->
              <tr v-if="filteredGuests.length > 0" class="border-t-2 border-gray-100 bg-gray-50">
                <td class="px-5 py-3 text-xs font-semibold text-gray-500">{{ filteredGuests.length }} registro{{ filteredGuests.length !== 1 ? 's' : '' }}</td>
                <td />
                <td class="px-4 py-3 text-center">
                  <span class="text-sm font-bold text-gray-800">{{ filteredTotals.total }}</span>
                  <p class="text-[10px] text-gray-400">{{ filteredTotals.adults }}A · {{ filteredTotals.children }}N</p>
                </td>
                <td colspan="3" />
              </tr>

              <!-- Empty -->
              <tr v-if="filteredGuests.length === 0">
                <td colspan="6" class="py-20 text-center">
                  <p class="text-sm font-semibold text-gray-400">No hay invitados</p>
                  <p class="text-xs text-gray-300 mt-1">Agrega el primero con el botón de arriba</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>

  <!-- FAB móvil para agregar -->
  <button
    @click="openAdd"
    class="sm:hidden fixed bottom-6 right-5 z-30 w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-white border-none cursor-pointer active:scale-95 transition-transform"
    style="background: linear-gradient(135deg, #2c4628, #3a5733);"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
    </svg>
  </button>

  <!-- Backdrop -->
  <Transition
    enter-active-class="transition duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="showDrawer" class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" @click="closeDrawer" />
  </Transition>

  <!-- Drawer -->
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="translate-x-full opacity-0"
    enter-to-class="translate-x-0 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="translate-x-0 opacity-100"
    leave-to-class="translate-x-full opacity-0"
  >
    <div v-if="showDrawer" class="fixed right-0 top-0 h-full z-50 flex flex-col w-full max-w-lg shadow-2xl bg-white">

      <!-- Drawer header -->
      <div class="flex-shrink-0 relative overflow-hidden" style="background: linear-gradient(135deg, #1b2c1c 0%, #0e1a0e 100%); min-height: 110px;">
        <div class="absolute -top-6 -right-6 w-32 h-32 rounded-full opacity-10" style="background: radial-gradient(circle, #c6a86a, transparent);"></div>
        <div class="relative z-10 px-6 py-5 flex items-start justify-between">
          <div>
            <div class="flex items-center gap-2 mb-1.5">
              <div class="w-1 h-4 rounded-full bg-[#c6a86a]"></div>
              <p class="text-xs font-semibold uppercase tracking-widest text-[#c6a86a]">
                {{ editingGuest ? 'Editar invitado' : 'Nuevo invitado' }}
              </p>
            </div>
            <h2 class="text-xl font-bold text-white leading-tight">
              {{ editingGuest ? (editingGuest.guest_display_name || `${editingGuest.first_name} ${editingGuest.last_name}`) : 'Agregar al evento' }}
            </h2>
          </div>
          <button @click="closeDrawer" class="w-9 h-9 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition cursor-pointer border-none bg-transparent flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Form body -->
      <div class="flex-1 overflow-y-auto" style="background:#f8f7f5;">
        <form @submit.prevent="save" id="guest-form" class="p-5 space-y-4">

          <!-- Tipo de invitado -->
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div class="px-4 py-3 border-b border-gray-50 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m4-4a4 4 0 100-8 4 4 0 000 8zm6 0a3 3 0 100-6 3 3 0 000 6z"/>
              </svg>
              <span class="text-xs font-semibold text-gray-600 uppercase tracking-wider">Tipo de invitado</span>
            </div>
            <div class="p-4 grid grid-cols-2 gap-3">
              <button v-for="t in guestTypes" :key="t.value" type="button"
                @click="form.guest_type = t.value"
                class="py-3 px-4 rounded-xl border-2 text-left transition-all cursor-pointer"
                :class="form.guest_type === t.value
                  ? 'border-green-600 bg-green-50'
                  : 'border-gray-200 bg-gray-50 hover:border-gray-300'"
              >
                <p class="text-sm font-bold" :class="form.guest_type === t.value ? 'text-green-700' : 'text-gray-600'">{{ t.label }}</p>
                <p class="text-xs mt-0.5" :class="form.guest_type === t.value ? 'text-green-500' : 'text-gray-400'">{{ t.desc }}</p>
              </button>
            </div>
          </div>

          <!-- Nombre del registro -->
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div class="px-4 py-3 border-b border-gray-50 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              <span class="text-xs font-semibold text-gray-600 uppercase tracking-wider">Identificación</span>
            </div>
            <div class="p-4 space-y-3">
              <!-- Individual: nombre + apellido -->
              <template v-if="form.guest_type === 'individual'">
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs font-medium text-gray-500 mb-1.5">Nombre *</label>
                    <input v-model="form.first_name" required
                      class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:bg-white focus:border-transparent transition"
                      placeholder="Jennifer" />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-500 mb-1.5">Apellido *</label>
                    <input v-model="form.last_name" required
                      class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:bg-white focus:border-transparent transition"
                      placeholder="García" />
                  </div>
                </div>
              </template>
              <!-- Grupo: nombre del grupo + contacto secundario -->
              <template v-else>
                <div>
                  <label class="block text-xs font-medium text-gray-500 mb-1.5">
                    Nombre del grupo *
                    <span class="font-normal text-gray-400 ml-1">(ej: Familia Alcantara, Luis &amp; Sara)</span>
                  </label>
                  <input v-model="form.guest_display_name" required
                    class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:bg-white focus:border-transparent transition"
                    placeholder="Familia Alcantara Feliu" />
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs font-medium text-gray-500 mb-1.5">Nombre contacto</label>
                    <input v-model="form.first_name"
                      class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:bg-white focus:border-transparent transition"
                      placeholder="Roberto" />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-500 mb-1.5">Apellido</label>
                    <input v-model="form.last_name"
                      class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:bg-white focus:border-transparent transition"
                      placeholder="Alcantara" />
                  </div>
                </div>
              </template>
            </div>
          </div>

          <!-- Estado -->
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div class="px-4 py-3 border-b border-gray-50 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span class="text-xs font-semibold text-gray-600 uppercase tracking-wider">Estado de la invitación</span>
            </div>
            <div class="p-4">
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button v-for="s in statusOptions" :key="s.value" type="button"
                  @click="form.status = s.value"
                  class="py-2.5 px-3 rounded-xl border-2 text-xs font-semibold transition-all cursor-pointer text-center"
                  :class="form.status === s.value
                    ? 'border-green-600 bg-green-50 text-green-700'
                    : 'border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300'"
                >{{ s.short }}</button>
              </div>
            </div>
          </div>

          <!-- Miembros (solo grupo) -->
          <div v-if="form.guest_type === 'grupo'" class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div class="px-4 py-3 border-b border-gray-50 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m4-4a4 4 0 100-8 4 4 0 000 8zm6 0a3 3 0 100-6 3 3 0 000 6z"/>
              </svg>
              <span class="text-xs font-semibold text-gray-600 uppercase tracking-wider">Miembros del grupo</span>
              <span class="ml-auto text-xs text-gray-400">{{ form.members.length }} persona{{ form.members.length !== 1 ? 's' : '' }}</span>
            </div>
            <div class="p-4 space-y-3">
              <div v-for="(member, i) in form.members" :key="i" class="flex gap-2 items-start bg-gray-50 rounded-xl p-3">
                <div class="flex-1 space-y-2">
                  <input v-model="member.name" placeholder="Nombre del miembro"
                    class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition" />
                  <div class="grid grid-cols-2 gap-2">
                    <select v-model="member.meal_choice"
                      class="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition cursor-pointer">
                      <option value="">Menú (opcional)</option>
                      <option v-for="m in mealOptions" :key="m.value" :value="m.value">{{ m.label }}</option>
                    </select>
                    <input v-model="member.dietary" placeholder="Restricción (opc.)"
                      class="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition" />
                  </div>
                </div>
                <button type="button" @click="removeMember(i)"
                  class="w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition cursor-pointer border-none bg-transparent">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
              <button type="button" @click="addMember"
                class="w-full py-2 border-2 border-dashed border-gray-200 rounded-xl text-xs font-semibold text-gray-400 hover:border-green-300 hover:text-green-600 transition cursor-pointer bg-transparent flex items-center justify-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
                </svg>
                Agregar miembro
              </button>
            </div>
          </div>

          <!-- Cupos (solo grupo) -->
          <div v-if="form.guest_type === 'grupo'" class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div class="px-4 py-3 border-b border-gray-50 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a2 2 0 012-2z"/>
              </svg>
              <span class="text-xs font-semibold text-gray-600 uppercase tracking-wider">Cupos reservados</span>
              <span class="ml-auto text-xs text-gray-400">Total: {{ (form.adults_count || 0) + (form.children_count || 0) }}</span>
            </div>
            <div class="p-4 grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1.5">Adultos</label>
                <input v-model.number="form.adults_count" type="number" min="0" max="20"
                  class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-400 focus:bg-white focus:border-transparent transition" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1.5">Niños</label>
                <input v-model.number="form.children_count" type="number" min="0" max="20"
                  class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-400 focus:bg-white focus:border-transparent transition" />
              </div>
            </div>
          </div>

          <!-- Contacto -->
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div class="px-4 py-3 border-b border-gray-50 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              <span class="text-xs font-semibold text-gray-600 uppercase tracking-wider">Contacto</span>
            </div>
            <div class="p-4 space-y-3">
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1.5">WhatsApp</label>
                <input v-model="form.whatsapp" type="tel"
                  class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:bg-white focus:border-transparent transition"
                  placeholder="+1 809 000 0000" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1.5">Correo electrónico</label>
                <input v-model="form.email" type="email"
                  class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:bg-white focus:border-transparent transition"
                  placeholder="correo@ejemplo.com" />
              </div>
            </div>
          </div>

          <!-- Clasificación -->
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div class="px-4 py-3 border-b border-gray-50 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a2 2 0 012-2z"/>
              </svg>
              <span class="text-xs font-semibold text-gray-600 uppercase tracking-wider">Clasificación</span>
            </div>
            <div class="p-4 space-y-3">
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-2">¿De parte de quién?</label>
                <div class="grid grid-cols-3 gap-2">
                  <button v-for="s in sideOptions" :key="s.value" type="button"
                    @click="form.side = s.value"
                    class="py-2.5 px-3 rounded-xl border-2 text-xs font-semibold transition-all cursor-pointer text-center"
                    :style="form.side === s.value
                      ? `border-color:${s.color}; background:${s.color}; color:#fff;`
                      : 'border-color:#e5e7eb; background:#f9fafb; color:#6b7280;'"
                  >{{ s.label }}</button>
                </div>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-2">Grupo</label>
                <div class="grid grid-cols-3 gap-2">
                  <button v-for="g in groupOptions" :key="g.value" type="button"
                    @click="form.guest_group = g.value"
                    class="py-2.5 px-3 rounded-xl border-2 text-xs font-semibold transition-all cursor-pointer text-center"
                    :style="form.guest_group === g.value
                      ? `border-color: ${g.color}; background: ${g.color}18; color: ${g.color};`
                      : 'border-color: #e5e7eb; background: #f9fafb; color: #6b7280;'"
                  >{{ g.label }}</button>
                </div>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1.5">Mesa asignada</label>
                <input v-model="form.table_name"
                  class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:bg-white focus:border-transparent transition"
                  placeholder="Mesa 1, Mesa VIP..." />
              </div>
            </div>
          </div>

          <!-- Notas -->
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div class="px-4 py-3 border-b border-gray-50 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <span class="text-xs font-semibold text-gray-600 uppercase tracking-wider">Notas internas</span>
            </div>
            <div class="p-4">
              <textarea v-model="form.notes" rows="3"
                class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:bg-white focus:border-transparent transition resize-none"
                placeholder="Notas para el equipo organizador..." />
            </div>
          </div>

          <div class="h-2" />
        </form>
      </div>

      <!-- Drawer footer -->
      <div class="flex-shrink-0 px-5 py-4 bg-white border-t border-gray-100 flex items-center gap-3">
        <button type="button" @click="closeDrawer"
          class="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition cursor-pointer bg-white">
          Cancelar
        </button>
        <button type="submit" form="guest-form"
          :disabled="saving || (form.guest_type === 'individual' ? !form.first_name : !form.guest_display_name)"
          class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 active:scale-95 transition-all cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
          style="background: linear-gradient(135deg, #2c4628, #3a5733);">
          <svg v-if="saving" class="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          {{ saving ? 'Guardando...' : editingGuest ? 'Guardar cambios' : 'Agregar invitado' }}
        </button>
      </div>
    </div>
  </Transition>
</template>
