<template>
  <section class="bg-ivory py-20 md:py-24 px-8 relative overflow-hidden flex items-center justify-center">
    <svg class="absolute left-0 top-0 w-28 md:w-36 opacity-60" viewBox="0 0 160 400" fill="none" stroke="var(--color-green,#6b6640)" stroke-width="1">
      <path d="M10 0 C20 40 5 60 15 100 C25 140 5 160 15 200 C25 240 8 260 18 300"/>
      <path d="M40 0 C50 30 35 55 45 90 C55 125 38 150 48 190"/>
      <ellipse cx="18" cy="60" rx="6" ry="10"/><ellipse cx="12" cy="120" rx="6" ry="10"/><ellipse cx="20" cy="180" rx="6" ry="10"/>
    </svg>
    <svg class="absolute right-0 top-0 w-28 md:w-36 opacity-60" viewBox="0 0 160 400" fill="none" stroke="var(--color-green,#6b6640)" stroke-width="1" style="transform:scaleX(-1)">
      <path d="M10 0 C20 40 5 60 15 100 C25 140 5 160 15 200 C25 240 8 260 18 300"/>
      <path d="M40 0 C50 30 35 55 45 90 C55 125 38 150 48 190"/>
      <ellipse cx="18" cy="60" rx="6" ry="10"/><ellipse cx="12" cy="120" rx="6" ry="10"/><ellipse cx="20" cy="180" rx="6" ry="10"/>
    </svg>

    <div v-reveal class="relative z-10 text-center">
      <div class="relative w-[220px] h-[164px] mx-auto mb-6">
        <div class="absolute inset-0 bg-green" style="box-shadow:0 20px 40px -10px rgba(0,0,0,.25)"></div>
        <div class="absolute top-0 left-0 right-0 h-0"
             style="border-left:110px solid transparent;border-right:110px solid transparent;border-top:86px solid var(--color-sage-400,#8a8354)"></div>
        <div class="absolute top-3.5 left-1/2 -translate-x-1/2 w-[140px] h-[140px] bg-ivory flex flex-col items-center justify-center text-center shadow-lg"
             style="clip-path:path('M70 136 C10 94 5 52 33 28 C51 11 70 23 70 42 C70 23 89 11 107 28 C135 52 130 94 70 136 Z')">
          <span class="font-script-var text-olive-800" style="font-size:1.15rem">Kindly Respond</span>
          <span class="text-[9px] tracking-[.14em] uppercase text-ink-mute mt-1.5">Antes del {{ deadline }}</span>
        </div>
        <div class="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-11 h-11 rounded-full flex items-center justify-center text-[13px] text-forest-900 font-display font-semibold"
             style="background:radial-gradient(circle at 35% 30%, var(--color-gold,#c9a24b), #8a6a24 75%); box-shadow:0 4px 10px rgba(0,0,0,.3)">
          {{ initials }}
        </div>
      </div>
      <a href="#" @click.prevent="$emit('rsvp')"
         class="inline-block font-display text-[12px] tracking-[.2em] uppercase border border-olive-800 text-olive-800 px-9 py-3 bg-paper transition hover:bg-olive-800 hover:text-ivory">
        RSVP
      </a>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
defineEmits(['rsvp']);
const props = defineProps({ wedding: { type: Object, default: () => ({}) } });

const initials = computed(() => {
  const a = (props.wedding.couple_name_1 || '').charAt(0);
  const b = (props.wedding.couple_name_2 || '').charAt(0);
  return `${a}${b}`.toUpperCase() || '♥';
});

const MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
const deadline = computed(() => {
  const d = props.wedding.rsvp_deadline
    ? new Date(props.wedding.rsvp_deadline + 'T00:00:00')
    : new Date('2026-10-01T00:00:00');
  return `${d.getDate()} de ${MESES[d.getMonth()]}`;
});
</script>
