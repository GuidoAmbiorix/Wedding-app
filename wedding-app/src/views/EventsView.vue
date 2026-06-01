<script setup>
import { ref, onMounted } from 'vue'
import TheNavbar from '@/components/TheNavbar.vue'
import TheFooter from '@/components/TheFooter.vue'
import { supabase } from '@/lib/supabase'

const events = ref([])
const loading = ref(true)

onMounted(async () => {
  const { data } = await supabase.from('events').select('*').order('sort_order')
  if (data) events.value = data
  loading.value = false
})

const formatDate = (d) => d ? new Date(d + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }) : ''
const formatTime = (t) => t ? t.slice(0, 5) : ''
</script>

<template>
  <div class="min-h-screen bg-[var(--ivory)]">
    <TheNavbar />
    <div class="pt-32 pb-20 px-6 max-w-4xl mx-auto">
      <div class="text-center mb-16">
        <p class="text-xs tracking-[0.3em] uppercase text-[var(--text-muted)] mb-4">El gran día</p>
        <h1 style="font-family: var(--font-serif); font-weight: 300; font-size: clamp(2.5rem, 5vw, 4rem); color: var(--charcoal);">
          Eventos
        </h1>
        <div class="divider-ornament max-w-xs mx-auto mt-6"><span>&#10022;</span></div>
      </div>

      <div v-if="loading" class="py-16 text-center">
        <div class="w-6 h-6 border-2 border-[var(--dusty-rose)] border-t-transparent rounded-full animate-spin mx-auto" />
      </div>

      <div v-else-if="events.length" class="space-y-8">
        <div
          v-for="event in events"
          :key="event.id"
          class="bg-white border border-[var(--champagne)] p-8 md:p-12 flex flex-col md:flex-row gap-8"
        >
          <div class="md:w-32 flex-shrink-0 text-center">
            <p class="text-xs tracking-[0.2em] uppercase text-[var(--text-muted)] mb-1">Hora</p>
            <p class="text-3xl text-[var(--charcoal)]" style="font-family: var(--font-serif);">
              {{ formatTime(event.event_time) }}
            </p>
          </div>
          <div class="flex-1">
            <h2 class="mb-2" style="font-family: var(--font-serif); font-weight: 400; font-size: 1.8rem; color: var(--charcoal);">
              {{ event.name }}
            </h2>
            <p class="text-xs tracking-widest uppercase text-[var(--dusty-rose)] mb-4">
              {{ formatDate(event.event_date) }}
            </p>
            <p v-if="event.venue" class="text-sm text-[var(--charcoal)] mb-1">{{ event.venue }}</p>
            <p v-if="event.address" class="text-xs text-[var(--text-muted)] mb-3">{{ event.address }}</p>
            <p v-if="event.dress_code" class="text-xs tracking-widest uppercase text-[var(--text-muted)]">
              Dress code: {{ event.dress_code }}
            </p>
            <p v-if="event.notes" class="text-sm text-[var(--text-muted)] mt-3 italic" style="font-family: var(--font-serif);">
              {{ event.notes }}
            </p>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-12">
        <p class="text-[var(--text-muted)] text-sm">No hay eventos cargados aún.</p>
      </div>
    </div>
    <TheFooter />
  </div>
</template>
