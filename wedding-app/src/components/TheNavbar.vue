<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useWeddingStore } from '@/stores/wedding'
import { storeToRefs } from 'pinia'

const route = useRoute()
const { wedding } = storeToRefs(useWeddingStore())

const scrolled = ref(false)
const menuOpen = ref(false)

const navLinks = [
  { to: '/nuestra-historia', label: 'Nuestra Historia', num: '01' },
  { to: '/eventos',          label: 'Eventos',          num: '02' },
  { to: '/galeria',          label: 'Galería',           num: '03' },
  { to: '/mesa-de-regalos',  label: 'Mesa de Regalos',  num: '04' },
  { to: '/alojamiento',      label: 'Alojamiento',      num: '05' },
  { to: '/faq',              label: 'Preguntas',         num: '06' },
]

const onScroll = () => { scrolled.value = window.scrollY > 60 }
onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))

function close() { menuOpen.value = false }
</script>

<template>
  <!-- Bar -->
  <nav
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
    :class="scrolled && !menuOpen
      ? 'bg-[var(--forest-deep)]/90 backdrop-blur-md border-b border-[var(--gold-muted)]/20'
      : 'bg-transparent'"
  >
    <div class="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">

      <!-- Monogram / Names -->
      <RouterLink
        to="/"
        class="no-underline transition-opacity hover:opacity-70"
        @click="close"
      >
        <span
          class="tracking-[0.18em] text-sm"
          :class="menuOpen ? 'text-[var(--cream)]' : 'text-[var(--cream)]'"
          style="font-family: var(--font-serif); font-style: italic;"
        >
          <span v-if="wedding">
            {{ wedding.couple_name_1.split(' ')[0] }}
            <span class="text-[var(--gold)] mx-1">&amp;</span>
            {{ wedding.couple_name_2.split(' ')[0] }}
          </span>
          <span v-else>J <span class="text-[var(--gold)]">&amp;</span> G</span>
        </span>
      </RouterLink>

      <!-- Hamburger -->
      <button
        @click="menuOpen = !menuOpen"
        class="relative z-60 w-10 h-10 flex flex-col items-center justify-center gap-[5px] cursor-pointer border-none bg-transparent group"
        :aria-label="menuOpen ? 'Cerrar menú' : 'Abrir menú'"
      >
        <span
          class="block w-6 h-px transition-all duration-400 origin-center"
          :class="menuOpen
            ? 'rotate-45 translate-y-[6px] bg-[var(--cream)]'
            : 'bg-[var(--cream)]'"
        />
        <span
          class="block w-6 h-px transition-all duration-300"
          :class="menuOpen
            ? 'opacity-0 bg-[var(--cream)]'
            : 'bg-[var(--cream)]'"
        />
        <span
          class="block w-6 h-px transition-all duration-400 origin-center"
          :class="menuOpen
            ? '-rotate-45 -translate-y-[6px] bg-[var(--cream)]'
            : 'bg-[var(--cream)]'"
        />
      </button>
    </div>
  </nav>

  <!-- Full-screen overlay menu -->
  <Transition
    enter-active-class="transition-all duration-500 ease-in-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-all duration-400 ease-in-out"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="menuOpen"
      class="fixed inset-0 z-40 flex"
      style="background: linear-gradient(135deg, var(--forest-deep) 0%, var(--violet-deep) 60%, var(--forest-dark) 100%);"
    >
      <!-- Decorative background text -->
      <div
        class="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
      >
        <span
          class="text-[25vw] font-serif opacity-[0.03] text-[var(--cream)] leading-none"
          style="font-family: var(--font-serif); font-style: italic;"
        >
          {{ wedding?.couple_name_1?.split(' ')[0]?.[0] }}{{ wedding?.couple_name_2?.split(' ')[0]?.[0] }}
        </span>
      </div>

      <!-- Nav links -->
      <div class="relative z-10 flex flex-col justify-center px-12 md:px-24 py-20 w-full max-w-3xl">

        <!-- Divider top -->
        <div class="w-12 h-px bg-[var(--gold-muted)] mb-10" />

        <nav>
          <ul class="list-none space-y-2">
            <li
              v-for="(link, i) in navLinks"
              :key="link.to"
              class="overflow-hidden"
            >
              <RouterLink
                :to="link.to"
                class="group flex items-baseline gap-5 no-underline py-2 transition-all duration-300"
                :style="`transition-delay: ${i * 60}ms`"
                @click="close"
              >
                <span class="text-xs text-[var(--gold-muted)] tracking-widest w-6 flex-shrink-0 group-hover:text-[var(--gold)] transition-colors">
                  {{ link.num }}
                </span>
                <span
                  class="text-3xl md:text-5xl text-[var(--cream)] group-hover:text-[var(--gold-light)] transition-colors"
                  style="font-family: var(--font-serif); font-weight: 300;"
                  :class="route.path === link.to ? 'text-[var(--gold-light)] italic' : ''"
                >
                  {{ link.label }}
                </span>
                <span class="ml-auto text-[var(--gold)] opacity-0 group-hover:opacity-100 transition-opacity text-xl">
                  &#8594;
                </span>
              </RouterLink>
            </li>
          </ul>
        </nav>

        <!-- Divider + RSVP -->
        <div class="mt-10 pt-8 border-t border-[var(--gold-muted)]/30 flex items-center gap-6">
          <RouterLink
            to="/confirmar"
            class="btn-forest text-xs"
            @click="close"
          >
            Confirmar Asistencia
          </RouterLink>
          <RouterLink
            to="/admin"
            class="text-xs tracking-widest uppercase text-[var(--cream-dim)] hover:text-[var(--cream)] transition-colors no-underline"
            @click="close"
          >
            Admin
          </RouterLink>
        </div>

        <!-- Date bottom -->
        <div class="mt-8">
          <p
            class="text-sm text-[var(--cream-muted)] tracking-[0.15em]"
            style="font-family: var(--font-serif); font-style: italic;"
          >
            {{ wedding?.wedding_date
              ? new Date(wedding.wedding_date + 'T00:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
              : '' }}
          </p>
        </div>
      </div>

      <!-- Right side decorative panel (desktop) -->
      <div class="hidden lg:flex flex-1 items-end justify-end p-16 pointer-events-none">
        <div class="text-right">
          <p class="text-xs tracking-[0.3em] uppercase text-[var(--gold-muted)] mb-2">Una boda en el bosque</p>
          <p
            class="text-6xl xl:text-8xl text-[var(--cream)]/10"
            style="font-family: var(--font-serif); font-style: italic; font-weight: 300;"
          >
            {{ wedding?.couple_name_1?.split(' ')[0] }}<br>
            <span class="text-[var(--gold)]/20 text-4xl">&amp;</span><br>
            {{ wedding?.couple_name_2?.split(' ')[0] }}
          </p>
        </div>
      </div>
    </div>
  </Transition>
</template>
