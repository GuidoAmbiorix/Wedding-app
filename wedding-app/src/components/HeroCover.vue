<template>
  <header id="home" class="relative min-h-[100svh] flex flex-col justify-end overflow-hidden">
    <video v-if="wedding.cover_video_url && !reduceMotion"
           class="absolute inset-0 w-full h-full object-cover"
           :poster="wedding.cover_photo_url || undefined"
           autoplay muted loop playsinline preload="auto">
      <source :src="wedding.cover_video_url" type="video/mp4">
    </video>
    <img v-else
         :src="wedding.cover_photo_url || wedding.couple_photo_url"
         :alt="names"
         class="absolute inset-0 w-full h-full object-cover"
         loading="eager" fetchpriority="high" />
    <!-- Overlay: oscurece arriba (nav) y abajo (texto) para legibilidad -->
    <div class="absolute inset-0"
         style="background:linear-gradient(180deg, rgba(20,18,10,.4) 0%, rgba(20,18,10,.05) 32%, rgba(20,18,10,.18) 62%, rgba(20,18,10,.62) 100%)"></div>

    <div class="relative z-10 text-center px-6 pb-14 pt-32">
      <p class="text-[11px] tracking-[.32em] uppercase text-ondark/90 mb-4">La boda de</p>
      <h1 class="font-script-var text-ondark leading-[.9] flex items-center justify-center gap-4 flex-wrap drop-shadow-[0_2px_20px_rgba(0,0,0,.3)]"
          style="font-size:clamp(3rem,10vw,6rem)">
        <span>{{ wedding.couple_name_1 }}</span>
        <span class="font-display italic text-ondark/85" style="font-size:.42em;font-weight:300">&amp;</span>
        <span>{{ wedding.couple_name_2 }}</span>
      </h1>
    </div>

    <div class="relative z-10 flex justify-between items-center px-6 md:px-12 pb-8 text-[11px] tracking-[.22em] uppercase text-ondark/90">
      <span>{{ shortDate }}</span>
      <span class="hidden sm:block h-6 w-px bg-ondark/30"></span>
      <span>{{ wedding.venue }}</span>
    </div>

    <!-- Scroll cue -->
    <div class="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 cue-bar" style="background:linear-gradient(#f1e9d6,transparent)"></div>
  </header>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({ wedding: { type: Object, required: true } });
const names  = computed(() => `${props.wedding.couple_name_1} & ${props.wedding.couple_name_2}`);
const reduceMotion = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
const shortDate = computed(() => {
  const d = new Date(props.wedding.wedding_date + 'T00:00:00');
  return `${d.getDate()} de ${MESES[d.getMonth()]}, ${d.getFullYear()}`;
});
</script>
