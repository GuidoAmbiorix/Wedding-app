<script setup>
import { ref, onMounted } from 'vue'
import TheNavbar from '@/components/TheNavbar.vue'
import TheFooter from '@/components/TheFooter.vue'
import { supabase } from '@/lib/supabase'

const photos = ref([])
const lightbox = ref(null)
const loading = ref(true)

onMounted(async () => {
  const { data } = await supabase.from('gallery_photos').select('*').order('sort_order')
  if (data) photos.value = data
  loading.value = false
})
</script>

<template>
  <div class="min-h-screen bg-[var(--ivory)]">
    <TheNavbar />
    <div class="pt-32 pb-20 px-6 max-w-6xl mx-auto">
      <div class="text-center mb-16">
        <p class="text-xs tracking-[0.3em] uppercase text-[var(--text-muted)] mb-4">Momentos</p>
        <h1 style="font-family: var(--font-serif); font-weight: 300; font-size: clamp(2.5rem, 5vw, 4rem); color: var(--charcoal);">
          Galería
        </h1>
        <div class="divider-ornament max-w-xs mx-auto mt-6"><span>&#10022;</span></div>
      </div>

      <div v-if="loading" class="py-16 text-center">
        <div class="w-6 h-6 border-2 border-[var(--dusty-rose)] border-t-transparent rounded-full animate-spin mx-auto" />
      </div>

      <div v-else-if="photos.length" class="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        <div
          v-for="photo in photos"
          :key="photo.id"
          class="break-inside-avoid cursor-pointer group relative overflow-hidden"
          @click="lightbox = photo"
        >
          <img
            :src="photo.url"
            :alt="photo.caption || ''"
            class="w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div
            v-if="photo.caption"
            class="absolute inset-0 bg-[var(--charcoal)]/0 group-hover:bg-[var(--charcoal)]/30 transition-all duration-300 flex items-end"
          >
            <p class="px-4 pb-4 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
               style="font-family: var(--font-serif); font-style: italic;">
              {{ photo.caption }}
            </p>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-12">
        <p class="text-[var(--text-muted)] text-sm">Las fotos se publicarán pronto.</p>
      </div>
    </div>

    <!-- Lightbox -->
    <Transition name="fade">
      <div
        v-if="lightbox"
        class="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-6"
        @click.self="lightbox = null"
      >
        <button
          @click="lightbox = null"
          class="absolute top-6 right-6 text-white/60 hover:text-white text-3xl cursor-pointer border-none bg-transparent"
        >&times;</button>
        <img :src="lightbox.url" :alt="lightbox.caption" class="max-h-[90vh] max-w-full object-contain" />
        <p v-if="lightbox.caption" class="absolute bottom-6 text-white/60 text-sm" style="font-family: var(--font-serif); font-style: italic;">
          {{ lightbox.caption }}
        </p>
      </div>
    </Transition>

    <TheFooter />
  </div>
</template>
