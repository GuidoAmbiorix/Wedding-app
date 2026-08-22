<template>
  <section v-reveal class="bg-forest-900 text-ondark py-16 relative overflow-hidden">
    <div class="absolute inset-0 pointer-events-none" style="background:radial-gradient(ellipse at 50% 0%, rgba(255,255,255,.05), transparent 60%)"></div>
    <div class="wrap text-center relative">
      <span class="font-script-var block leading-[.9] mb-2" style="font-size:clamp(2rem,4vw,2.8rem)">Nuestro para siempre comienza en</span>
      <p class="text-xs tracking-[.3em] uppercase text-ondark-soft mt-1">{{ longDate }} &middot; {{ place }}</p>

      <div v-if="tweaks.countdown" class="flex justify-center gap-8 md:gap-14 mt-10">
        <div v-for="cell in cells" :key="cell.l" class="text-center min-w-[54px]">
          <div class="font-display font-medium leading-none" style="font-size:clamp(1.8rem,3.5vw,2.8rem)">{{ cell.v }}</div>
          <span class="block text-[10px] tracking-[.24em] uppercase text-ondark-soft mt-2">{{ cell.l }}</span>
        </div>
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
  return [ { v:d, l:'Días' }, { v:p(h), l:'Horas' }, { v:p(m), l:'Minutos' }, { v:p(s), l:'Segundos' } ];
});
onMounted(() => { timer = setInterval(() => now.value = Date.now(), 1000); });
onUnmounted(() => clearInterval(timer));
</script>
