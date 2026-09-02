<template>
  <header id="home" class="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden" style="background:var(--color-forest-900);">
    <video v-if="wedding.cover_video_url && (!reduceMotion || !(wedding.cover_photo_url || wedding.couple_photo_url))"
           :key="wedding.cover_video_url"
           :class="['absolute inset-0 w-full h-full object-cover transition-opacity duration-700', mediaLoaded ? 'opacity-100' : 'opacity-0']"
           :poster="wedding.cover_photo_url || undefined"
           autoplay muted loop playsinline preload="auto"
           @loadeddata="mediaLoaded = true">
      <source :src="wedding.cover_video_url" type="video/mp4">
    </video>
    <img v-else
         :src="wedding.cover_photo_url || wedding.couple_photo_url"
         :alt="names"
         :class="['absolute inset-0 w-full h-full object-cover transition-opacity duration-700', mediaLoaded ? 'opacity-100' : 'opacity-0']"
         loading="eager" fetchpriority="high" decoding="async"
         @load="mediaLoaded = true" />
    <!-- Filtro verde boscoso (cálido, no frío) + oscurecido para que el texto resalte -->
    <div class="absolute inset-0" style="background:var(--color-primary); mix-blend-mode:color; opacity:.28"></div>
    <div class="absolute inset-0" style="background:var(--color-heading); mix-blend-mode:overlay; opacity:.15"></div>
    <div class="absolute inset-0"
         style="background:linear-gradient(180deg, rgba(10,14,4,.55) 0%, rgba(10,14,4,.35) 40%, rgba(10,14,4,.4) 60%, rgba(10,14,4,.68) 100%)"></div>
    <div class="absolute inset-0" style="background:radial-gradient(ellipse 60% 45% at 50% 50%, rgba(10,14,4,.3), transparent 70%)"></div>

    <div class="relative z-10 text-center px-6">
      <p class="text-[14px] tracking-[.34em] uppercase text-ondark mb-6 drop-shadow-[0_2px_10px_rgba(0,0,0,.6)]">La boda de</p>
      <h1 class="font-script-var text-ondark leading-[.9] flex items-center justify-center gap-5 flex-wrap drop-shadow-[0_2px_28px_rgba(0,0,0,.6)]"
          style="font-size:clamp(4rem,14vw,9rem)">
        <span>{{ wedding.couple_name_1 }}</span>
        <span class="font-display italic text-ondark/90" style="font-size:.42em;font-weight:300">&amp;</span>
        <span>{{ wedding.couple_name_2 }}</span>
      </h1>

      <div class="flex justify-center items-center gap-4 mt-9 text-[13px] tracking-[.22em] uppercase text-ondark drop-shadow-[0_2px_10px_rgba(0,0,0,.6)]">
        <span>{{ shortDate }}</span>
        <span class="h-3.5 w-px bg-ondark/40"></span>
        <span>{{ wedding.venue }}</span>
      </div>
    </div>

    <!-- Scroll cue -->
    <div class="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 cue-bar" style="background:linear-gradient(#f1e9d6,transparent)"></div>
  </header>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({ wedding: { type: Object, required: true } });
const mediaLoaded = ref(false);
const names  = computed(() => `${props.wedding.couple_name_1} & ${props.wedding.couple_name_2}`);
const reduceMotion = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
const shortDate = computed(() => {
  const d = new Date(props.wedding.wedding_date + 'T00:00:00');
  return `${d.getDate()} de ${MESES[d.getMonth()]}, ${d.getFullYear()}`;
});
</script>
