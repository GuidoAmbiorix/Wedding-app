<template>
  <section class="bg-cream text-ink py-20">
    <div class="wrap text-center">
      <h3 v-reveal class="font-display font-medium tracking-[.12em] uppercase" style="font-size:clamp(1.5rem,2.5vw,2.2rem)">Código de Vestimenta</h3>
      <p v-reveal="0.05" class="text-[1.06rem] leading-relaxed text-ink-mute mt-4 max-w-[52ch] mx-auto">
        {{ text }}
      </p>
      <div v-reveal="0.1" class="flex justify-center gap-4 my-8">
        <span v-for="c in palette" :key="c" class="w-12 h-12 rounded-full shadow-md" :style="{ background: c }"></span>
      </div>
      <div v-reveal="0.15" class="flex justify-center gap-16">
        <!-- Vestido -->
        <svg viewBox="0 0 80 150" class="h-32 w-auto" fill="none" stroke="#243a24" stroke-width="2">
          <path d="M40 8c-9 0-15 5-15 12v8l-15 10v104h60V38L55 28v-8c0-7-6-12-15-12z"/>
          <path d="M40 30v100"/><path d="M28 40l12 14 12-14"/>
          <path d="M40 54l-5 76M40 54l5 76"/>
          <circle cx="40" cy="70" r="1.6" fill="#243a24"/>
          <circle cx="40" cy="84" r="1.6" fill="#243a24"/>
        </svg>
        <!-- Traje -->
        <svg viewBox="0 0 80 150" class="h-32 w-auto" fill="none" stroke="#243a24" stroke-width="2">
          <path d="M40 8c-6 0-10 4-10 9 0 3 1 5 3 7l-8 12c8 5 22 5 30 0l-8-12c2-2 3-4 3-7 0-5-4-9-10-9z"/>
          <path d="M25 36C14 64 8 110 6 142h68c-2-32-8-78-19-106"/>
          <path d="M40 36v106"/>
        </svg>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({ wedding: { type: Object, default: () => ({}) } });
const DEFAULT_TEXT = 'Etiqueta formal. Nos inspira la paleta del bosque: verdes profundos, salvia y tonos tierra. Te pedimos reservar el blanco, marfil y crema para la novia.';
const text = props.wedding?.dress_code || DEFAULT_TEXT;
const palette = ['#1b2c1c', '#2c4628', '#4f7142', '#7e9667', '#a8bd92'];
</script>
