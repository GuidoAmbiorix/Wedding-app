<template>
  <!-- SPLIT: imagen izquierda + nombres derecha -->
  <header id="home" class="-mt-[54px] flex min-h-[100svh]">
    <!-- Foto izquierda -->
    <div class="w-[45%] flex-shrink-0 relative overflow-hidden">
      <img :src="wedding.couple_photo_url || wedding.cover_photo_url"
           :alt="names"
           class="absolute inset-0 w-full h-full object-cover object-top"
           loading="eager" fetchpriority="high" />
      <!-- velo de blend hacia el lado crema -->
      <div class="absolute inset-y-0 right-0 w-12"
           style="background:linear-gradient(to right,transparent,#faf7ec)"></div>
    </div>

    <!-- Nombres derecha -->
    <div class="flex-1 bg-cream flex flex-col justify-center px-[clamp(2rem,5vw,5rem)] pt-[54px] pb-16 relative">
      <p class="text-[10px] tracking-[.28em] uppercase text-ink-mute mb-6">
        Acompáñanos en la boda de
      </p>
      <h1 class="font-script-var text-accent-var leading-[.85]"
          style="font-size:clamp(3rem,5vw,6rem)">
        {{ wedding.couple_name_1 }}
      </h1>
      <div class="flex items-center gap-3 my-4 max-w-[200px]">
        <span class="h-px flex-1 bg-line"></span>
        <span class="font-serif text-[11px] tracking-[.28em] text-ink-mute uppercase">&amp;</span>
        <span class="h-px flex-1 bg-line"></span>
      </div>
      <h1 class="font-script-var text-accent-var leading-[.85]"
          style="font-size:clamp(3rem,5vw,6rem)">
        {{ wedding.couple_name_2 }}
      </h1>
      <p class="font-serif text-[11px] tracking-[.28em] uppercase text-ink-mute mt-7">
        {{ shortDate }}
      </p>
      <p v-if="wedding.venue" class="font-serif text-[11px] tracking-[.18em] uppercase text-ink-mute/60 mt-1.5">
        {{ wedding.venue }}
      </p>
      <!-- Scroll cue -->
      <div class="absolute bottom-8 left-[clamp(2rem,5vw,5rem)] flex flex-col items-start gap-2 text-ink-mute/40 text-[9px] tracking-[.28em] uppercase">
        <i class="cue-bar" style="background:linear-gradient(#6c705f,transparent)"></i>
        <span>Desliza</span>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({ wedding: { type: Object, required: true } });
const names  = computed(() => `${props.wedding.couple_name_1} & ${props.wedding.couple_name_2}`);
const shortDate = computed(() => {
  const d = new Date(props.wedding.wedding_date + 'T00:00:00');
  return `${String(d.getDate()).padStart(2,'0')} · ${String(d.getMonth()+1).padStart(2,'0')} · ${String(d.getFullYear()).slice(2)}`;
});
</script>
