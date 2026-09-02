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
        <div class="flex justify-center gap-2.5 mt-4">
          <span v-for="c in palette" :key="c" class="w-6 h-6 rounded-full border border-white/25" :style="{ background: c }"></span>
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
const props = defineProps({ wedding: { type: Object, default: () => ({}) } });
const text = props.wedding?.dress_code
  || 'Etiqueta formal. Nos inspira la paleta del bosque: verdes profundos, salvia y tonos tierra. Te pedimos reservar el blanco, marfil y crema para la novia.';
const ceremonyText = props.wedding?.ceremony_info
  || `La ceremonia se realizará en ${props.wedding?.venue || 'nuestro venue'}. Te pedimos llegar con anticipación para acomodarte antes de que comience.`;
const drinkingText = props.wedding?.drinking_note
  || 'Por favor usa las áreas designadas si deseas fumar. Anima a quienes beban a hacerlo con responsabilidad y a planear transporte seguro.';
const palette = [
  'var(--color-forest-900)',
  'var(--color-heading)',
  'var(--color-primary)',
  'var(--color-forest-600)',
  'var(--color-ondark-soft)',
];
</script>
