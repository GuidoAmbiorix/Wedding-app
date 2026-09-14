<template>
  <section class="bg-forest-700 text-ondark py-20 px-6">
    <p class="text-center text-[11px] tracking-[.34em] uppercase text-ondark-soft mb-14">Información adicional</p>
    <div class="wrap grid grid-cols-1 md:grid-cols-2 gap-12 text-center max-w-2xl">
      <div v-reveal>
        <span class="font-script-var block mb-4" style="font-size:1.7rem">Ceremonia</span>
        <p class="text-[.92rem] leading-relaxed text-ondark-soft">{{ ceremonyText }}</p>
      </div>
      <div v-reveal="0.06">
        <span class="font-script-var block mb-4" style="font-size:1.7rem">Vestimenta</span>
        <p class="text-[.92rem] leading-relaxed text-ondark-soft">{{ text }}</p>
        <div class="flex flex-wrap justify-center gap-3 mt-5">
          <div v-for="(c, i) in displayPalette" :key="c.id || i" class="flex flex-col items-center gap-1.5" style="width:58px">
            <span class="w-7 h-7 rounded-full border border-white/25 flex-shrink-0" :style="{ background: c.color }" :title="c.label"></span>
            <span v-if="c.label" class="text-[9px] leading-tight text-center text-ondark-soft">{{ c.label }}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-reveal="0.16" class="text-center mt-16">
      <span class="font-script-var block mb-3" style="font-size:1.4rem">Bebidas y Fumar</span>
      <p class="text-[.9rem] leading-relaxed text-ondark-soft max-w-[52ch] mx-auto">{{ drinkingText }}</p>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  wedding: { type: Object, default: () => ({}) },
  palette: { type: Array, default: () => [] },
});
const text = props.wedding?.dress_code
  || 'Etiqueta formal. Nos inspira la paleta del bosque: verdes profundos, salvia y tonos tierra. Te pedimos reservar el blanco, marfil y crema para la novia.';
const ceremonyText = props.wedding?.ceremony_info
  || `La ceremonia se realizará en ${props.wedding?.venue || 'nuestro venue'}. Te pedimos llegar con anticipación para acomodarte antes de que comience.`;
const drinkingText = props.wedding?.drinking_note
  || 'Por favor usa las áreas designadas si deseas fumar. Anima a quienes beban a hacerlo con responsabilidad y a planear transporte seguro.';

// Mientras no haya paleta configurada (o antes de correr migration_v9.sql),
// se ve algo razonable derivado del tema en vez de una sección vacía.
const fallbackPalette = [
  { color: 'var(--color-forest-900)' },
  { color: 'var(--color-heading)' },
  { color: 'var(--color-primary)' },
  { color: 'var(--color-forest-600)' },
  { color: 'var(--color-ondark-soft)' },
];
const displayPalette = computed(() => props.palette?.length ? props.palette : fallbackPalette);
</script>
