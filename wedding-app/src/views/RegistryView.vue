<script setup>
import { ref, onMounted } from 'vue'
import TheNavbar from '@/components/TheNavbar.vue'
import TheFooter from '@/components/TheFooter.vue'
import { supabase } from '@/lib/supabase'

const stores = ref([])
const loading = ref(true)

onMounted(async () => {
  const { data } = await supabase.from('registry').select('*')
  if (data) stores.value = data
  loading.value = false
})
</script>

<template>
  <div class="min-h-screen bg-[var(--ivory)]">
    <TheNavbar />
    <div class="pt-32 pb-20 px-6 max-w-4xl mx-auto">
      <div class="text-center mb-16">
        <p class="text-xs tracking-[0.3em] uppercase text-[var(--text-muted)] mb-4">Con gratitud</p>
        <h1 style="font-family: var(--font-serif); font-weight: 300; font-size: clamp(2.5rem, 5vw, 4rem); color: var(--charcoal);">
          Mesa de Regalos
        </h1>
        <div class="divider-ornament max-w-xs mx-auto mt-6"><span>&#10022;</span></div>
        <p class="text-sm text-[var(--text-muted)] mt-6 max-w-xl mx-auto leading-relaxed" style="font-family: var(--font-serif); font-style: italic;">
          Su presencia es el mejor regalo. Si desean obsequiarnos algo, aquí encontrarán nuestras listas.
        </p>
      </div>

      <div v-if="loading" class="py-16 text-center">
        <div class="w-6 h-6 border-2 border-[var(--dusty-rose)] border-t-transparent rounded-full animate-spin mx-auto" />
      </div>

      <div v-else-if="stores.length" class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <a
          v-for="store in stores"
          :key="store.id"
          :href="store.store_url"
          target="_blank"
          rel="noopener"
          class="block bg-white border border-[var(--champagne)] p-8 text-center hover:border-[var(--dusty-rose)] hover:shadow-lg transition-all duration-300 no-underline group"
        >
          <img v-if="store.logo_url" :src="store.logo_url" :alt="store.store_name" class="h-12 object-contain mx-auto mb-4" />
          <h2
            class="mb-2 text-[var(--charcoal)] group-hover:text-[var(--dusty-rose)] transition-colors"
            style="font-family: var(--font-serif); font-weight: 400; font-size: 1.5rem;"
          >{{ store.store_name }}</h2>
          <p v-if="store.description" class="text-xs text-[var(--text-muted)]">{{ store.description }}</p>
          <p class="text-xs tracking-widest uppercase text-[var(--dusty-rose)] mt-4">Ver lista &rarr;</p>
        </a>
      </div>
      <div v-else class="text-center py-12">
        <p class="text-[var(--text-muted)] text-sm">Las listas de regalos se publicarán pronto.</p>
      </div>
    </div>
    <TheFooter />
  </div>
</template>
