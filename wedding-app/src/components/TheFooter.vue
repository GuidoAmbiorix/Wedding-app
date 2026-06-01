<script setup>
import { useWeddingStore } from '@/stores/wedding'
import { storeToRefs } from 'pinia'

const { wedding } = storeToRefs(useWeddingStore())

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('es-ES', {
    day: 'numeric', month: 'long', year: 'numeric'
  })
}
</script>

<template>
  <footer
    class="relative overflow-hidden py-20 px-6"
    style="background: var(--forest-deep); border-top: 1px solid rgba(201,166,86,0.15);"
  >
    <!-- Glows de fondo -->
    <div class="absolute bottom-0 left-1/3 w-96 h-64 rounded-full blur-[100px] pointer-events-none"
         style="background: rgba(61,31,107,0.2);" />
    <div class="absolute top-0 right-1/4 w-64 h-48 rounded-full blur-[80px] pointer-events-none"
         style="background: rgba(45,90,39,0.15);" />

    <div class="relative z-10 max-w-4xl mx-auto text-center">
      <!-- Monogram grande -->
      <p
        class="text-6xl md:text-8xl mb-2 leading-none opacity-10 select-none"
        style="font-family: var(--font-serif); font-style: italic; color: var(--cream);"
      >
        {{ wedding?.couple_name_1?.[0] }}{{ wedding?.couple_name_2?.[0] }}
      </p>

      <!-- Nombres -->
      <p
        class="text-3xl md:text-5xl mb-3"
        style="font-family: var(--font-serif); font-style: italic; font-weight: 300; color: var(--cream);"
      >
        <span v-if="wedding">
          {{ wedding.couple_name_1 }}
          <span style="color: var(--gold); font-size: 0.7em;"> &amp; </span>
          {{ wedding.couple_name_2 }}
        </span>
        <span v-else>Jennifer &amp; Guido</span>
      </p>

      <!-- Fecha -->
      <p
        v-if="wedding?.wedding_date"
        class="text-xs tracking-[0.25em] uppercase mb-8"
        style="color: var(--gold);"
      >
        {{ formatDate(wedding.wedding_date) }}
      </p>

      <!-- Divisor -->
      <div class="divider-ornament max-w-xs mx-auto mb-8">
        <span>&#10022;</span>
      </div>

      <!-- Links -->
      <div class="flex flex-wrap justify-center gap-6 mb-8">
        <RouterLink
          v-for="link in [
            { to: '/nuestra-historia', label: 'Historia' },
            { to: '/eventos', label: 'Eventos' },
            { to: '/galeria', label: 'Galería' },
            { to: '/faq', label: 'FAQ' },
          ]"
          :key="link.to"
          :to="link.to"
          class="text-xs tracking-widest uppercase no-underline transition-colors"
          style="color: var(--cream-dim);"
          onmouseover="this.style.color='var(--gold-light)'"
          onmouseout="this.style.color='var(--cream-dim)'"
        >
          {{ link.label }}
        </RouterLink>
      </div>

      <p class="text-xs tracking-widest uppercase" style="color: var(--cream-dim);">
        Hecho con amor &middot; {{ new Date().getFullYear() }}
      </p>
    </div>
  </footer>
</template>
