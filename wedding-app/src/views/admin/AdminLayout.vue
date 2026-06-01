<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterView, RouterLink, useRoute } from 'vue-router'
import { useWeddingStore } from '@/stores/wedding'
import { useGuestsStore } from '@/stores/guests'
import { storeToRefs } from 'pinia'

const route = useRoute()
const weddingStore = useWeddingStore()
const guestsStore = useGuestsStore()
const { wedding } = storeToRefs(weddingStore)
const { stats } = storeToRefs(guestsStore)

// Inicializa ambos stores al entrar al admin (una sola vez gracias al guard interno)
onMounted(() => {
  if (!wedding.value) weddingStore.fetchWedding()
  if (!guestsStore.guests.length) guestsStore.fetchGuests()
})

const sidebarOpen = ref(true)

const links = [
  {
    to: '/admin/invitados',
    label: 'Invitados',
    sub: computed(() => `${stats.value.total} registrados`),
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m4-4a4 4 0 100-8 4 4 0 000 8zm6 0a3 3 0 100-6 3 3 0 000 6z"/></svg>`,
  },
  {
    to: '/admin/confirmaciones',
    label: 'Confirmaciones',
    sub: computed(() => `${stats.value.attending} asistirán`),
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
  },
  {
    to: '/admin/configuracion',
    label: 'Configuración',
    sub: computed(() => 'Datos generales'),
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`,
  },
]

const pageTitle = computed(() => {
  const map = {
    '/admin/invitados': 'Lista de Invitados',
    '/admin/confirmaciones': 'Confirmaciones RSVP',
    '/admin/configuracion': 'Configuración',
  }
  return map[route.path] || 'Panel Admin'
})

const weddingDate = computed(() => {
  if (!wedding.value?.wedding_date) return null
  return new Date(wedding.value.wedding_date + 'T00:00:00')
    .toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
})
</script>

<template>
  <div class="min-h-screen flex" style="background:#f8f7f5;">

    <!-- ── SIDEBAR ── -->
    <aside
      class="flex-shrink-0 flex flex-col transition-all duration-300 relative z-20"
      :class="sidebarOpen ? 'w-64' : 'w-16'"
      style="background: linear-gradient(180deg, #0e1a0e 0%, #1e0f35 100%);"
    >
      <!-- Brand -->
      <div class="px-4 py-5 border-b border-white/10 flex items-center gap-3 min-h-[72px]">
        <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
             style="background: linear-gradient(135deg, #3d1f6b, #2d5a27);">
          <span class="text-white text-xs font-bold">
            {{ wedding?.couple_name_1?.[0] }}{{ wedding?.couple_name_2?.[0] }}
          </span>
        </div>
        <div v-if="sidebarOpen" class="overflow-hidden">
          <p class="text-white text-sm font-semibold leading-tight truncate">
            {{ wedding ? `${wedding.couple_name_1.split(' ')[0]} & ${wedding.couple_name_2.split(' ')[0]}` : 'The Wedding' }}
          </p>
          <p class="text-white/40 text-xs truncate">{{ weddingDate || 'Sin fecha' }}</p>
        </div>
        <!-- Toggle -->
        <button
          @click="sidebarOpen = !sidebarOpen"
          class="ml-auto text-white/30 hover:text-white/70 transition cursor-pointer border-none bg-transparent flex-shrink-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" :d="sidebarOpen ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'" />
          </svg>
        </button>
      </div>

      <!-- Nav label -->
      <div v-if="sidebarOpen" class="px-4 pt-5 pb-2">
        <p class="text-white/30 text-[10px] font-semibold uppercase tracking-widest">Menú</p>
      </div>

      <!-- Nav links -->
      <nav class="flex-1 px-2 py-2 space-y-1">
        <RouterLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 no-underline group relative"
          :class="route.path === link.to
            ? 'bg-white/10 text-white'
            : 'text-white/50 hover:bg-white/5 hover:text-white/80'"
        >
          <!-- Active indicator -->
          <div
            v-if="route.path === link.to"
            class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full"
            style="background: #7b4fa6;"
          />
          <!-- Icon -->
          <span class="flex-shrink-0" v-html="link.icon" />
          <!-- Label -->
          <div v-if="sidebarOpen" class="flex-1 min-w-0">
            <p class="text-sm font-medium leading-none mb-0.5">{{ link.label }}</p>
            <p class="text-[11px] text-white/30 leading-none">{{ link.sub.value }}</p>
          </div>
        </RouterLink>
      </nav>

      <!-- Stats pill (collapsed) -->
      <div v-if="!sidebarOpen" class="px-2 pb-2 space-y-1">
        <div class="flex flex-col items-center gap-1 py-2">
          <span class="text-white text-sm font-bold">{{ stats.attending }}</span>
          <span class="text-white/30 text-[9px] uppercase tracking-widest">RSVP</span>
        </div>
      </div>

      <!-- Bottom links -->
      <div class="px-2 pb-3 border-t border-white/10 pt-3 space-y-1">
        <RouterLink
          to="/"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/40 hover:bg-white/5 hover:text-white/70 transition no-underline"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
          </svg>
          <span v-if="sidebarOpen" class="text-sm">Ver sitio</span>
        </RouterLink>
      </div>
    </aside>

    <!-- ── MAIN ── -->
    <div class="flex-1 flex flex-col min-w-0">

      <!-- Top bar -->
      <header class="h-[72px] bg-white border-b border-gray-200 flex items-center px-6 gap-4 flex-shrink-0 shadow-sm">
        <div class="flex-1 min-w-0">
          <h1 class="text-lg font-bold text-gray-900 leading-none">{{ pageTitle }}</h1>
          <p class="text-xs text-gray-400 mt-0.5">Panel de administración</p>
        </div>

        <!-- Stats rápidas en header -->
        <div class="hidden sm:flex items-center gap-4">
          <div class="text-center">
            <p class="text-base font-bold text-gray-900 leading-none">{{ stats.total }}</p>
            <p class="text-[10px] text-gray-400 uppercase tracking-wider">Total</p>
          </div>
          <div class="w-px h-8 bg-gray-200" />
          <div class="text-center">
            <p class="text-base font-bold leading-none" style="color:#2d5a27;">{{ stats.attending }}</p>
            <p class="text-[10px] text-gray-400 uppercase tracking-wider">Asistirán</p>
          </div>
          <div class="w-px h-8 bg-gray-200" />
          <div class="text-center">
            <p class="text-base font-bold text-amber-500 leading-none">{{ stats.pending }}</p>
            <p class="text-[10px] text-gray-400 uppercase tracking-wider">Pendientes</p>
          </div>
        </div>

        <!-- Avatar -->
        <div class="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
             style="background: linear-gradient(135deg, #3d1f6b, #2d5a27);">
          {{ wedding?.couple_name_1?.[0] }}{{ wedding?.couple_name_2?.[0] }}
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1 overflow-auto" style="background:#f8f7f5;">
        <RouterView />
      </main>
    </div>
  </div>
</template>
