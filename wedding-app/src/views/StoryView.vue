<script setup>
import TheNavbar from '@/components/TheNavbar.vue'
import TheFooter from '@/components/TheFooter.vue'
import { useWeddingStore } from '@/stores/wedding'
import { storeToRefs } from 'pinia'

const { wedding } = storeToRefs(useWeddingStore())
</script>

<template>
  <div class="min-h-screen bg-[var(--ivory)]">
    <TheNavbar />
    <div class="pt-32 pb-20 px-6 max-w-3xl mx-auto">
      <div class="text-center mb-16">
        <p class="text-xs tracking-[0.3em] uppercase text-[var(--text-muted)] mb-4">Con amor</p>
        <h1 style="font-family: var(--font-serif); font-weight: 300; font-size: clamp(2.5rem, 5vw, 4rem); color: var(--charcoal);">
          Nuestra Historia
        </h1>
        <div class="divider-ornament max-w-xs mx-auto mt-6"><span>&#10022;</span></div>
      </div>

      <div v-if="wedding?.story" class="prose max-w-none">
        <p
          class="text-lg leading-relaxed text-[var(--charcoal)] whitespace-pre-line"
          style="font-family: var(--font-serif); font-weight: 300;"
        >
          {{ wedding.story }}
        </p>
      </div>
      <div v-else class="text-center py-12">
        <p class="text-[var(--text-muted)] text-sm">
          Agrega su historia desde el
          <RouterLink to="/admin/configuracion" class="text-[var(--dusty-rose)] hover:underline">panel admin</RouterLink>.
        </p>
      </div>
    </div>
    <TheFooter />
  </div>
</template>
