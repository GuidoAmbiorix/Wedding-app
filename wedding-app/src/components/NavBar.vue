<template>
  <nav :class="['fixed top-0 left-0 right-0 z-40 flex items-center justify-between gap-4 px-6 md:px-10 py-4 transition-all duration-500',
                isSolid ? 'bg-ivory/95 backdrop-blur shadow-[0_1px_0_rgba(0,0,0,.05)]' : 'bg-transparent']">
    <a href="#" @click.prevent="go('home')" :class="['font-script-var text-2xl leading-none px-1', isSolid ? 'text-olive-800' : 'text-ondark drop-shadow']">{{ initials }}</a>

    <div class="hidden md:flex gap-8">
      <a v-for="l in menu" :key="l.id" href="#" @click.prevent="go(l.id)" :class="linkCls(l.id)">{{ l.label }}</a>
    </div>

    <div class="flex items-center gap-3">
      <a href="#" @click.prevent="go('rsvp')"
         :class="['hidden sm:inline-flex items-center gap-2 font-serif text-[11px] tracking-[.2em] uppercase border px-5 py-2 transition',
                  isSolid ? 'border-olive-800 text-olive-800 hover:bg-olive-800 hover:text-ivory' : 'border-ondark text-ondark hover:bg-ondark hover:text-ink']">
        RSVP <span>&rarr;</span>
      </a>
      <button class="flex flex-col gap-1 items-end p-1.5 md:hidden" aria-label="Menú" @click="open = true">
        <span class="block w-[18px] h-px" :class="isSolid ? 'bg-olive-800' : 'bg-ondark'"></span>
        <span class="block w-3 h-px" :class="isSolid ? 'bg-olive-800' : 'bg-ondark'"></span>
      </button>
    </div>
  </nav>

  <teleport to="body">
    <div :class="['fixed inset-0 z-[60] transition-opacity duration-300 bg-forest-900/60 backdrop-blur-sm',
                  open ? 'opacity-100' : 'opacity-0 pointer-events-none']" @click.self="open = false">
      <div :class="['absolute top-0 left-0 right-0 bg-forest-800 px-8 pt-16 pb-10 transition-transform duration-500 max-w-xl',
                    open ? 'translate-y-0' : '-translate-y-full']"
           style="transition-timing-function:cubic-bezier(.2,.8,.2,1)">
        <button class="absolute top-5 right-6 text-ondark text-3xl leading-none" @click="open = false">&times;</button>
        <a v-for="m in menu" :key="m.id" href="#" @click.prevent="goMenu(m)"
           class="block py-3.5 font-serif text-lg tracking-[.18em] uppercase text-ondark border-b border-white/10">{{ m.label }}</a>
        <router-link to="/admin" class="block py-3.5 font-serif text-lg tracking-[.18em] uppercase text-sage-300">Panel de administración →</router-link>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { scrollToId } from '@/composables/scroll.js';

const props = defineProps({
  active:     { type: String,  default: 'home' },
  forceSolid: { type: Boolean, default: false },
  wedding:    { type: Object,  default: () => ({}) },
});
const open   = ref(false);
const solid  = ref(false);
const isSolid = computed(() => props.forceSolid || solid.value);
const initials = computed(() => {
  const a = (props.wedding.couple_name_1 || 'J').trim().charAt(0);
  const b = (props.wedding.couple_name_2 || 'G').trim().charAt(0);
  return `${a}&${b}`.toUpperCase();
});

const menu = [
  { id:'home',    label:'Inicio' },
  { id:'venue',   label:'Lugar' },
  { id:'details', label:'Detalles' },
  { id:'party',   label:'Cortejo' },
  { id:'faqs',    label:'Preguntas' },
];

function go(id) { scrollToId(id); }
function goMenu(m) { open.value = false; setTimeout(() => scrollToId(m.id), 120); }
function linkCls(id) {
  const activeColor = isSolid.value ? 'text-olive-800' : 'text-ondark';
  const idleColor = isSolid.value ? 'text-ink-mute hover:text-olive-800' : 'text-ondark/85 hover:text-ondark';
  return ['font-display text-[12px] tracking-[.2em] uppercase no-underline transition',
    props.active === id ? activeColor : idleColor];
}

function onScroll() { solid.value = window.scrollY > 80; }
onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }));
onUnmounted(() => window.removeEventListener('scroll', onScroll));
</script>
