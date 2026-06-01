<script setup>
import { ref, onMounted } from 'vue'
import TheNavbar from '@/components/TheNavbar.vue'
import TheFooter from '@/components/TheFooter.vue'
import { supabase } from '@/lib/supabase'

const faqs = ref([])
const open = ref(null)
const loading = ref(true)

onMounted(async () => {
  const { data } = await supabase.from('faq').select('*').order('sort_order')
  if (data) faqs.value = data
  loading.value = false
})
</script>

<template>
  <div class="min-h-screen bg-[var(--ivory)]">
    <TheNavbar />
    <div class="pt-32 pb-20 px-6 max-w-2xl mx-auto">
      <div class="text-center mb-16">
        <p class="text-xs tracking-[0.3em] uppercase text-[var(--text-muted)] mb-4">Todo lo que necesitas</p>
        <h1 style="font-family: var(--font-serif); font-weight: 300; font-size: clamp(2.5rem, 5vw, 4rem); color: var(--charcoal);">
          Preguntas Frecuentes
        </h1>
        <div class="divider-ornament max-w-xs mx-auto mt-6"><span>&#10022;</span></div>
      </div>

      <div v-if="loading" class="py-16 text-center">
        <div class="w-6 h-6 border-2 border-[var(--dusty-rose)] border-t-transparent rounded-full animate-spin mx-auto" />
      </div>

      <div v-else-if="faqs.length" class="space-y-2">
        <div
          v-for="faq in faqs"
          :key="faq.id"
          class="bg-white border border-[var(--champagne)] overflow-hidden"
        >
          <button
            @click="open = open === faq.id ? null : faq.id"
            class="w-full px-6 py-5 text-left flex items-center justify-between cursor-pointer bg-transparent border-none hover:bg-[var(--ivory)] transition-colors"
          >
            <span class="text-sm text-[var(--charcoal)]" style="font-family: var(--font-serif); font-size: 1.1rem;">
              {{ faq.question }}
            </span>
            <span
              class="text-[var(--dusty-rose)] text-lg ml-4 flex-shrink-0 transition-transform duration-300"
              :class="open === faq.id ? 'rotate-45' : ''"
            >+</span>
          </button>
          <Transition name="slide-up">
            <div v-if="open === faq.id" class="px-6 pb-5">
              <p class="text-sm text-[var(--text-muted)] leading-relaxed border-t border-[var(--champagne)] pt-4">
                {{ faq.answer }}
              </p>
            </div>
          </Transition>
        </div>
      </div>

      <div v-else class="text-center py-12">
        <p class="text-[var(--text-muted)] text-sm">Las preguntas frecuentes se publicarán pronto.</p>
      </div>
    </div>
    <TheFooter />
  </div>
</template>
