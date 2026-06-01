<template>
  <nav :class="['sticky top-0 z-40 grid grid-cols-[1fr_auto_1fr] items-center px-6 py-3 transition-all duration-500',
                isSolid ? 'bg-forest-900/95 backdrop-blur shadow-[0_1px_0_rgba(255,255,255,.06)]' : 'bg-transparent']">
    <div class="flex gap-4">
      <a v-for="l in left" :key="l.id" href="#" @click.prevent="go(l.id)" :class="linkCls(l.id)">{{ l.label }}</a>
    </div>
    <a href="#" @click.prevent="go('home')"
       class="font-script-var text-3xl leading-none text-ondark text-center px-1 drop-shadow">J<span class="text-[.7em] opacity-80">&amp;</span>G</a>
    <div class="flex gap-4 justify-end items-center">
      <a v-for="l in right" :key="l.id" href="#" @click.prevent="go(l.id)" :class="linkCls(l.id)">{{ l.label }}</a>
      <button class="flex flex-col gap-1 items-end p-1.5" aria-label="Más" @click="open = true">
        <span class="block w-[18px] h-px bg-ondark"></span>
        <span class="block w-3 h-px bg-ondark"></span>
      </button>
    </div>
  </nav>

  <teleport to="body">
    <div :class="['fixed inset-0 z-[60] transition-opacity duration-300 bg-forest-900/60 backdrop-blur-sm',
                  open ? 'opacity-100' : 'opacity-0 pointer-events-none']" @click.self="open = false">
      <div :class="['absolute top-0 left-0 right-0 bg-forest-700 px-8 pt-16 pb-10 transition-transform duration-500 max-w-xl',
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
});
const open   = ref(false);
const solid  = ref(false);
// forceSolid: layout split → el nav siempre oscuro para que resalte sobre ambas mitades
const isSolid = computed(() => props.forceSolid || solid.value);

const left  = [ { id:'home', label:'Inicio' }, { id:'details', label:'Detalles' } ];
const right = [ { id:'schedule', label:'Horario' } ];
const menu  = [
  { id:'home',      label:'Inicio' },
  { id:'details',   label:'Los Detalles' },
  { id:'schedule',  label:'El Horario' },
  { id:'gallery',   label:'Galería' },
  { id:'guestbook', label:'Libro de Visitas' },
  { id:'faqs',      label:'Preguntas Frecuentes' },
  { id:'rsvp',      label:'Confirmar Asistencia' },
];

function go(id) { scrollToId(id); }
function goMenu(m) { open.value = false; setTimeout(() => scrollToId(m.id), 120); }
function linkCls(id) {
  return ['font-serif font-medium text-[11px] tracking-[.22em] uppercase no-underline transition',
    props.active === id ? 'text-gold' : 'text-ondark/90 hover:text-white'];
}

function onScroll() { solid.value = window.scrollY > 80; }
onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }));
onUnmounted(() => window.removeEventListener('scroll', onScroll));
</script>
