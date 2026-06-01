<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useWeddingStore } from '@/stores/wedding'
import { storeToRefs } from 'pinia'
import TheNavbar from '@/components/TheNavbar.vue'
import TheFooter from '@/components/TheFooter.vue'
import ForestLeaves from '@/components/ForestLeaves.vue'
import FirefliesCanvas from '@/components/FirefliesCanvas.vue'
import { RouterLink } from 'vue-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const { wedding } = storeToRefs(useWeddingStore())

// ── Countdown ──
const now = ref(new Date())
let timer = null
onMounted(() => { timer = setInterval(() => { now.value = new Date() }, 1000) })
onUnmounted(() => clearInterval(timer))

const countdown = computed(() => {
  if (!wedding.value?.wedding_date) return null
  const diff = new Date(wedding.value.wedding_date + 'T00:00:00') - now.value
  if (diff <= 0) return null
  return {
    dias:  Math.floor(diff / 86400000),
    horas: Math.floor((diff % 86400000) / 3600000),
    min:   Math.floor((diff % 3600000) / 60000),
    seg:   Math.floor((diff % 60000) / 1000),
  }
})

const formatDate = (d) => d
  ? new Date(d + 'T00:00:00').toLocaleDateString('es-ES', { weekday:'long', day:'numeric', month:'long', year:'numeric' })
  : ''

// ── Parallax ──
const parallaxY = ref(0)
const scrollProgress = ref(0)
const onScroll = () => {
  parallaxY.value = window.scrollY * 0.32
  const max = document.body.scrollHeight - window.innerHeight
  scrollProgress.value = max > 0 ? (window.scrollY / max) * 100 : 0
}
onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))

// ── GSAP Animations ──
let gsapCtx = null

onMounted(() => {
  gsapCtx = gsap.context(() => {

    // Hero — entrada en cascada
    const tl = gsap.timeline({ delay: 0.2 })
    tl.fromTo('.hero-label',  { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' })
      .fromTo('.hero-name-1', { opacity: 0, y: 60, skewY: 4 }, { opacity: 1, y: 0, skewY: 0, duration: 1, ease: 'power3.out' }, '-=0.3')
      .fromTo('.hero-amp',    { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' }, '-=0.5')
      .fromTo('.hero-name-2', { opacity: 0, y: 60, skewY: -4 }, { opacity: 1, y: 0, skewY: 0, duration: 1, ease: 'power3.out' }, '-=0.5')
      .fromTo('.hero-date',   { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3')
      .fromTo('.hero-countdown .cd-item', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out' }, '-=0.2')
      .fromTo('.hero-cta',    { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.2')

    // Scroll progress line
    gsap.fromTo('.scroll-line', { scaleX: 0 }, {
      scaleX: 1, ease: 'none',
      scrollTrigger: { scrub: 0.3, start: 'top top', end: 'bottom bottom' }
    })

    // Save-the-date strip text scroll
    gsap.fromTo('.std-text', { x: 0 }, {
      x: '-50%', repeat: -1, duration: 18, ease: 'none'
    })

    // Historia reveal
    gsap.fromTo('.story-badge', { opacity: 0, x: -30 }, {
      opacity: 1, x: 0, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: '.story-section', start: 'top 75%' }
    })
    gsap.fromTo('.story-heading', { opacity: 0, y: 40 }, {
      opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: '.story-section', start: 'top 70%' }
    })
    gsap.fromTo('.story-text', { opacity: 0, y: 30 }, {
      opacity: 1, y: 0, duration: 0.9, delay: 0.15, ease: 'power3.out',
      scrollTrigger: { trigger: '.story-section', start: 'top 70%' }
    })

    // Cards stagger
    gsap.fromTo('.nav-card', { opacity: 0, y: 50, scale: 0.96 }, {
      opacity: 1, y: 0, scale: 1,
      duration: 0.65, stagger: 0.07, ease: 'power3.out',
      scrollTrigger: { trigger: '.cards-grid', start: 'top 80%' }
    })

    // Countdown section
    gsap.fromTo('.countdown-block', { opacity: 0, y: 40 }, {
      opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: '.big-countdown', start: 'top 75%' }
    })

  })
})

onUnmounted(() => { gsapCtx?.revert(); ScrollTrigger.getAll().forEach(t => t.kill()) })

const cards = [
  { to: '/nuestra-historia', label: 'Nuestra Historia', desc: 'Cómo nos conocimos',    icon: '♡', color: '#7b4fa6' },
  { to: '/eventos',          label: 'Eventos',           desc: 'Ceremonia y recepción', icon: '◇', color: '#2d5a27' },
  { to: '/galeria',          label: 'Galería',            desc: 'Nuestras fotos',        icon: '◻', color: '#c9a656' },
  { to: '/mesa-de-regalos',  label: 'Mesa de Regalos',   desc: 'Listas de regalos',     icon: '✦', color: '#5a8a52' },
  { to: '/alojamiento',      label: 'Alojamiento',        desc: 'Hoteles recomendados',  icon: '⌂', color: '#3d1f6b' },
  { to: '/faq',              label: 'Preguntas',           desc: 'Todo lo que necesitas', icon: '?', color: '#8db882' },
]
</script>

<template>
  <div style="background: var(--forest-deep);">
    <TheNavbar />

    <!-- ── SCROLL PROGRESS BAR ── -->
    <div class="fixed top-0 left-0 right-0 h-[2px] z-[100] origin-left scroll-line"
         style="background: linear-gradient(90deg, var(--violet-bright), var(--gold), var(--forest-sage));" />

    <!-- ══════════════════════════════════════
         HERO
    ═══════════════════════════════════════ -->
    <section class="relative h-screen min-h-[640px] overflow-hidden flex items-end">

      <!-- Background foto con parallax -->
      <div class="absolute inset-0 will-change-transform"
           :style="`transform: translateY(${parallaxY}px) scale(1.18);`">
        <div v-if="wedding?.cover_photo_url"
             class="absolute inset-0 bg-cover bg-center"
             :style="`background-image: url('${wedding.cover_photo_url}')`" />
        <div v-else class="absolute inset-0"
             style="background: linear-gradient(160deg, #0e1a0e 0%, #1e0f35 55%, #0e1a0e 100%);" />
      </div>

      <!-- Overlays en capas -->
      <div class="absolute inset-0" style="background: linear-gradient(to bottom, rgba(14,26,14,0.1) 0%, rgba(14,26,14,0.25) 45%, rgba(14,26,14,0.88) 80%, rgba(14,26,14,1) 100%);" />

      <!-- Glows laterales -->
      <div class="absolute top-1/4 -left-20 w-[500px] h-[500px] rounded-full blur-[130px] pointer-events-none"
           style="background: rgba(61,31,107,0.22);" />
      <div class="absolute bottom-1/3 -right-20 w-[400px] h-[400px] rounded-full blur-[110px] pointer-events-none"
           style="background: rgba(45,90,39,0.2);" />

      <!-- Hojas cayendo -->
      <ForestLeaves />

      <!-- Luciérnagas canvas -->
      <FirefliesCanvas />

      <!-- Contenido hero -->
      <div class="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-16 pb-14 md:pb-20">

        <p class="hero-label text-xs tracking-[0.4em] uppercase mb-7 opacity-0"
           style="color: var(--gold);">
          ✦ &nbsp; Nos casamos &nbsp; ✦
        </p>

        <div class="overflow-hidden">
          <h1 class="hero-name-1 opacity-0"
              style="font-family: var(--font-serif); font-weight: 300; color: var(--cream);
                     font-size: clamp(3.2rem, 8.5vw, 8.5rem); line-height: 0.88; letter-spacing: -0.01em;">
            {{ wedding?.couple_name_1 || 'Jennifer Alondra' }}
          </h1>
        </div>

        <div class="hero-amp opacity-0 my-2 md:my-3">
          <span style="font-family: var(--font-serif); font-style: italic; color: var(--gold);
                       font-size: clamp(1.5rem, 3vw, 3rem); font-weight: 300;">
            &amp;
          </span>
        </div>

        <div class="overflow-hidden">
          <h1 class="hero-name-2 opacity-0"
              style="font-family: var(--font-serif); font-weight: 300; color: var(--cream);
                     font-size: clamp(3.2rem, 8.5vw, 8.5rem); line-height: 0.88; letter-spacing: -0.01em;">
            {{ wedding?.couple_name_2 || 'Guido Ambiorix' }}
          </h1>
        </div>

        <!-- Divider dorado -->
        <div class="my-7 flex items-center gap-4 max-w-xs">
          <div class="flex-1 h-px" style="background: linear-gradient(to right, transparent, var(--gold-muted));" />
          <span style="color: var(--gold); font-size: 0.75rem;">✦</span>
          <div class="flex-1 h-px" style="background: linear-gradient(to left, transparent, var(--gold-muted));" />
        </div>

        <!-- Fecha + venue -->
        <div class="hero-date opacity-0 flex flex-wrap items-center gap-3 mb-8">
          <span style="font-family: var(--font-serif); font-style: italic; color: var(--cream-muted); font-size: clamp(0.95rem, 1.8vw, 1.2rem);">
            {{ wedding?.wedding_date ? formatDate(wedding.wedding_date) : '15 de Noviembre, 2026' }}
          </span>
          <span style="color: var(--gold-muted);">·</span>
          <span class="text-xs tracking-[0.18em] uppercase" style="color: var(--forest-light);">
            {{ wedding?.venue || 'Bosque San Miguel' }}
          </span>
        </div>

        <!-- Countdown hero -->
        <div v-if="countdown" class="hero-countdown flex items-start gap-5 md:gap-8 mb-10">
          <div v-for="(val, key) in countdown" :key="key" class="cd-item opacity-0 text-center">
            <div class="tabular-nums leading-none mb-1"
                 style="font-family: var(--font-serif); font-size: clamp(2rem, 4.5vw, 3.8rem); color: var(--cream);">
              {{ String(val).padStart(2,'0') }}
            </div>
            <div class="text-[9px] tracking-[0.3em] uppercase" style="color: var(--gold-muted);">{{ key }}</div>
          </div>
        </div>

        <!-- CTA -->
        <a href="#confirmar-info" class="hero-cta opacity-0 btn-forest inline-block">
          Confirmar Asistencia
        </a>
      </div>

      <!-- Scroll arrow -->
      <div class="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2" style="animation: scrollBounce 2s ease-in-out infinite;">
        <span class="text-[9px] tracking-[0.3em] uppercase" style="color: var(--gold-muted);">scroll</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" style="color: var(--gold-muted);" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
        </svg>
      </div>
    </section>

    <!-- ══════════════════════════════════════
         TICKER — Guarda la fecha
    ═══════════════════════════════════════ -->
    <div class="overflow-hidden py-3 border-y" style="background: var(--violet-deep); border-color: rgba(201,166,86,0.15);">
      <div class="std-text whitespace-nowrap flex gap-0 w-[200%]">
        <span v-for="n in 12" :key="n"
              class="inline-block text-xs tracking-[0.25em] uppercase px-8"
              style="color: var(--gold-light);">
          Guarda la fecha &nbsp;✦&nbsp;
          {{ wedding?.wedding_date
              ? new Date(wedding.wedding_date+'T00:00:00').toLocaleDateString('es-ES', {day:'numeric',month:'long',year:'numeric'})
              : '15 · Noviembre · 2026' }}
          &nbsp;✦&nbsp; {{ wedding?.venue || 'Bosque San Miguel' }} &nbsp;
        </span>
      </div>
    </div>

    <!-- ══════════════════════════════════════
         HISTORIA preview
    ═══════════════════════════════════════ -->
    <section class="story-section relative py-28 px-6 overflow-hidden" style="background: var(--forest-dark);">
      <!-- Glow de fondo -->
      <div class="absolute top-0 right-0 w-96 h-96 rounded-full blur-[120px] pointer-events-none"
           style="background: rgba(61,31,107,0.18);" />
      <div class="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-[90px] pointer-events-none"
           style="background: rgba(45,90,39,0.12);" />

      <div class="relative z-10 max-w-3xl mx-auto">
        <!-- Badge -->
        <div class="story-badge inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-white/10"
             style="background: rgba(201,166,86,0.08);">
          <span style="color: var(--gold); font-size: 0.7rem;">✦</span>
          <span class="text-xs tracking-[0.25em] uppercase" style="color: var(--gold-muted);">Con amor</span>
        </div>

        <h2 class="story-heading mb-6"
            style="font-family: var(--font-serif); font-weight: 300; font-size: clamp(2.2rem, 5vw, 4rem); color: var(--cream); line-height: 1.05;">
          Nuestra Historia
        </h2>

        <div class="divider-ornament max-w-xs mb-8"><span>✦</span></div>

        <div class="story-text">
          <p v-if="wedding?.story"
             class="leading-relaxed mb-8 line-clamp-4"
             style="font-family: var(--font-serif); font-size: 1.2rem; font-weight: 300; color: var(--cream-muted); font-style: italic; line-height: 1.8;">
            "{{ wedding.story }}"
          </p>
          <p v-else class="text-sm mb-8 italic" style="color: var(--cream-dim);">
            Próximamente compartiremos nuestra historia...
          </p>

          <RouterLink to="/nuestra-historia" class="btn-forest">Leer más</RouterLink>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════
         COUNTDOWN grande (sección separada)
    ═══════════════════════════════════════ -->
    <section v-if="countdown" class="big-countdown relative py-24 px-6 overflow-hidden"
             style="background: var(--forest-deep); border-top: 1px solid rgba(201,166,86,0.08);">

      <div class="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span style="font-family: var(--font-serif); font-size: 30vw; color: rgba(255,255,255,0.015); font-weight: 300; line-height: 1;">
          {{ wedding?.couple_name_1?.[0] }}{{ wedding?.couple_name_2?.[0] }}
        </span>
      </div>

      <div class="relative z-10 max-w-4xl mx-auto text-center">
        <p class="countdown-block text-xs tracking-[0.3em] uppercase mb-10" style="color: var(--forest-light);">
          Faltan exactamente
        </p>
        <div class="flex items-start justify-center gap-6 md:gap-14 mb-10">
          <div v-for="(val, key) in countdown" :key="key" class="countdown-block text-center">
            <div class="tabular-nums leading-none"
                 style="font-family: var(--font-serif); font-size: clamp(3.5rem, 8vw, 7rem); color: var(--cream); font-weight: 300;">
              {{ String(val).padStart(2,'0') }}
            </div>
            <div class="text-[10px] tracking-[0.3em] uppercase mt-2" style="color: var(--gold-muted);">{{ key }}</div>
          </div>
        </div>
        <p class="countdown-block text-xs tracking-[0.2em] uppercase" style="color: var(--cream-dim);">
          {{ wedding?.wedding_date ? formatDate(wedding.wedding_date) : '' }}
          <span v-if="wedding?.venue" style="color: var(--gold-muted);"> · {{ wedding.venue }}</span>
        </p>
      </div>
    </section>

    <!-- ══════════════════════════════════════
         CARDS — Navegación
    ═══════════════════════════════════════ -->
    <section class="py-28 px-6" style="background: var(--forest-dark);">
      <div class="max-w-6xl mx-auto">

        <div class="text-center mb-16">
          <p class="text-xs tracking-[0.3em] uppercase mb-4" style="color: var(--forest-light);">Explora</p>
          <h2 style="font-family: var(--font-serif); font-weight: 300; font-size: clamp(2rem, 4vw, 3rem); color: var(--cream);">
            Todo sobre nuestra boda
          </h2>
        </div>

        <div class="cards-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <RouterLink
            v-for="card in cards"
            :key="card.to"
            :to="card.to"
            class="nav-card group block p-8 no-underline relative overflow-hidden rounded-2xl transition-all duration-400 border border-white/5 hover:border-white/15"
            style="background: rgba(255,255,255,0.03);"
          >
            <!-- Glow al hacer hover -->
            <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"
                 :style="`background: radial-gradient(ellipse at 30% 40%, ${card.color}22 0%, transparent 65%);`" />
            <!-- Borde top de color -->
            <div class="absolute top-0 left-6 right-6 h-px transition-all duration-300 group-hover:left-0 group-hover:right-0"
                 :style="`background: ${card.color}66;`" />

            <div class="relative z-10">
              <p class="text-3xl mb-5" :style="`color: ${card.color};`">{{ card.icon }}</p>
              <h3 class="mb-2 transition-colors duration-300"
                  style="font-family: var(--font-serif); font-weight: 400; font-size: 1.4rem; color: var(--cream);"
                  :style="``">
                {{ card.label }}
              </h3>
              <p class="text-xs tracking-wider uppercase" style="color: var(--cream-dim);">{{ card.desc }}</p>
              <div class="mt-5 h-px transition-all duration-400 group-hover:w-full w-8"
                   :style="`background: ${card.color}88;`" />
            </div>
          </RouterLink>
        </div>
      </div>
    </section>

    <TheFooter />
  </div>
</template>

<style scoped>
@keyframes scrollBounce {
  0%, 100% { transform: translate(-50%, 0); }
  50%       { transform: translate(-50%, 8px); }
}
</style>
