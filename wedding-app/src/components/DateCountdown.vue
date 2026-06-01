<template>
  <section v-reveal class="bg-cream text-ink py-14">
    <div class="wrap text-center">
      <h2 class="font-display font-medium tracking-[.06em]" style="font-size:clamp(1.8rem,3vw,2.8rem)">{{ longDate }}</h2>
      <p class="text-xs tracking-[.3em] uppercase text-ink-mute mt-2.5">{{ place }}</p>

      <div v-if="tweaks.countdown" class="flex justify-center gap-6 mt-10">
        <template v-for="(cell, i) in cells" :key="cell.l">
          <div class="text-center min-w-[64px]">
            <div class="font-display font-medium leading-none text-accent-var" style="font-size:clamp(2rem,3.5vw,3rem)">{{ cell.v }}</div>
            <span class="block text-[9px] tracking-[.24em] uppercase text-ink-mute mt-2">{{ cell.l }}</span>
          </div>
          <span v-if="i < 3" class="font-display text-2xl text-sage-400 self-start mt-1">·</span>
        </template>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useTweaks } from '@/composables/useTweaks.js';

const props = defineProps({ wedding: { type: Object, required: true } });
const tweaks = useTweaks();
const target = computed(() => new Date(props.wedding.wedding_date + 'T17:00:00-04:00'));

const MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
const longDate = computed(() => {
  const d = new Date(props.wedding.wedding_date + 'T00:00:00');
  return `${d.getDate()} de ${MESES[d.getMonth()].charAt(0).toUpperCase()+MESES[d.getMonth()].slice(1)}, ${d.getFullYear()}`;
});
const place = computed(() => {
  const addr = props.wedding.venue_address || '';
  const parts = addr.split(',');
  return parts.length > 1 ? parts.slice(1).join(',').trim() : (addr || 'Santo Domingo · Rep. Dominicana');
});

const now = ref(Date.now());
let timer;
const cells = computed(() => {
  let diff = Math.max(0, target.value - now.value);
  const d = Math.floor(diff / 864e5); diff -= d * 864e5;
  const h = Math.floor(diff / 36e5); diff -= h * 36e5;
  const m = Math.floor(diff / 6e4); diff -= m * 6e4;
  const s = Math.floor(diff / 1e3);
  const p = n => String(n).padStart(2, '0');
  return [ { v:d, l:'Días' }, { v:p(h), l:'Horas' }, { v:p(m), l:'Min' }, { v:p(s), l:'Seg' } ];
});
onMounted(() => { timer = setInterval(() => now.value = Date.now(), 1000); });
onUnmounted(() => clearInterval(timer));
</script>
