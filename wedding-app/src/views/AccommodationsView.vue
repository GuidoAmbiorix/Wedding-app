<script setup>
import { ref, onMounted } from 'vue'
import TheNavbar from '@/components/TheNavbar.vue'
import TheFooter from '@/components/TheFooter.vue'
import { supabase } from '@/lib/supabase'

const hotels = ref([])
const loading = ref(true)

onMounted(async () => {
  const { data } = await supabase.from('accommodations').select('*').order('distance_km')
  if (data) hotels.value = data
  loading.value = false
})
</script>

<template>
  <div class="min-h-screen bg-[var(--ivory)]">
    <TheNavbar />
    <div class="pt-32 pb-20 px-6 max-w-4xl mx-auto">
      <div class="text-center mb-16">
        <p class="text-xs tracking-[0.3em] uppercase text-[var(--text-muted)] mb-4">Para tu comodidad</p>
        <h1 style="font-family: var(--font-serif); font-weight: 300; font-size: clamp(2.5rem, 5vw, 4rem); color: var(--charcoal);">
          Alojamiento
        </h1>
        <div class="divider-ornament max-w-xs mx-auto mt-6"><span>&#10022;</span></div>
      </div>

      <div v-if="loading" class="py-16 text-center">
        <div class="w-6 h-6 border-2 border-[var(--dusty-rose)] border-t-transparent rounded-full animate-spin mx-auto" />
      </div>

      <div v-else-if="hotels.length" class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div
          v-for="hotel in hotels"
          :key="hotel.id"
          class="bg-white border border-[var(--champagne)] p-8"
        >
          <h2 class="mb-1" style="font-family: var(--font-serif); font-weight: 400; font-size: 1.4rem; color: var(--charcoal);">
            {{ hotel.hotel_name }}
          </h2>
          <p v-if="hotel.distance_km" class="text-xs tracking-widest uppercase text-[var(--dusty-rose)] mb-3">
            A {{ hotel.distance_km }} km del venue
          </p>
          <p v-if="hotel.address" class="text-xs text-[var(--text-muted)] mb-2">{{ hotel.address }}</p>
          <p v-if="hotel.price_range" class="text-xs text-[var(--text-muted)] mb-2">{{ hotel.price_range }}</p>
          <p v-if="hotel.promo_code" class="text-xs text-[var(--charcoal)] mb-4">
            Código: <span class="font-medium tracking-widest">{{ hotel.promo_code }}</span>
          </p>
          <a
            v-if="hotel.url"
            :href="hotel.url"
            target="_blank"
            rel="noopener"
            class="text-xs tracking-widest uppercase text-[var(--dusty-rose)] hover:underline no-underline"
          >
            Ver hotel &rarr;
          </a>
        </div>
      </div>

      <div v-else class="text-center py-12">
        <p class="text-[var(--text-muted)] text-sm">Las opciones de alojamiento se publicarán pronto.</p>
      </div>
    </div>
    <TheFooter />
  </div>
</template>
