<template>
  <section class="bg-cream text-ink px-8 py-16">
    <h3 v-reveal class="font-display font-medium tracking-[.12em] uppercase text-2xl text-center">Cómo llegar</h3>

    <div v-reveal="0.05" class="relative border border-line overflow-hidden mt-6" style="aspect-ratio:4/3;background:#e8e4d4">
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" class="absolute inset-0 w-full h-full">
        <rect width="400" height="300" fill="#e7e3d2"/>
        <rect width="400" height="300" fill="#dfe6d3" opacity=".5"/>
        <path d="M-20 90 L420 60" stroke="#cfd3c0" stroke-width="14"/>
        <path d="M-20 200 L420 230" stroke="#cfd3c0" stroke-width="10"/>
        <path d="M120 -20 L150 320" stroke="#cfd3c0" stroke-width="12"/>
        <path d="M280 -20 L250 320" stroke="#cfd3c0" stroke-width="9"/>
        <path d="M-20 150 L420 150" stroke="#e9e6d6" stroke-width="6"/>
        <rect x="30" y="100" width="60" height="40" fill="#d3dac6"/>
        <rect x="170" y="70" width="70" height="55" fill="#d3dac6"/>
        <rect x="300" y="170" width="64" height="48" fill="#d3dac6"/>
        <path d="M300 30 q40 40 30 90 q-10 50 60 70" fill="none" stroke="#bcd0c0" stroke-width="20" opacity=".6"/>
      </svg>
      <div class="absolute top-[46%] left-[52%] -translate-x-1/2 -translate-y-full text-center">
        <svg viewBox="0 0 24 24" class="w-[30px] h-[30px] mx-auto" fill="#2c4628">
          <path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z"/><circle cx="12" cy="9" r="2.5" fill="#fff"/>
        </svg>
        <b class="block bg-forest-700 text-white text-[9px] tracking-[.14em] uppercase px-2 py-0.5 mt-0.5">El lugar</b>
      </div>
    </div>

    <div v-reveal="0.1" class="text-center mt-5">
      <p class="text-base text-ink">{{ wedding.venue }}</p>
      <p class="text-[.86rem] text-ink-mute mt-1">{{ wedding.venue_address }}</p>
      <a class="inline-flex items-center justify-center font-serif font-medium text-[13px] tracking-[.22em] uppercase px-7 py-3.5 border border-accent-var text-accent-var rounded-full mt-6 transition hover:bg-accent-var hover:text-cream"
         :href="mapUrl" target="_blank" rel="noopener">Abrir en Mapas</a>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({ wedding: { type: Object, required: true } });
const mapUrl = computed(() => 'https://maps.google.com/?q=' + encodeURIComponent(props.wedding.venue_address || props.wedding.venue || 'Santo Domingo'));
</script>
