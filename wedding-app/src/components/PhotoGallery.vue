<template>
  <section id="gallery" class="bg-cream text-ink px-8 py-16">
    <h2 v-reveal class="font-script-var text-center text-accent-var leading-[.92]" style="font-size:clamp(3rem,15vw,4.4rem)">Galería</h2>
    <p v-reveal="0.05" class="text-[1.06rem] leading-relaxed text-ink-mute text-center max-w-[34ch] mx-auto mt-2.5">
      Algunos de nuestros momentos favoritos. Pronto sumaremos las fotos del gran día.
    </p>

    <div v-if="photos.length" v-reveal="0.1" class="grid grid-cols-2 gap-2 mt-6">
      <button v-for="(p, i) in photos" :key="p.id" @click="open(i)"
              :class="['overflow-hidden cursor-pointer', i === 0 ? 'col-span-2' : '']"
              :style="{ aspectRatio: i === 0 ? '2/1.1' : '1/1' }">
        <img :src="p.url" :alt="p.caption" class="w-full h-full object-cover transition-transform duration-700 hover:scale-105" loading="lazy">
      </button>
    </div>
    <p v-else v-reveal="0.1" class="text-center text-ink-mute text-sm mt-6 italic">Las fotos se añadirán pronto.</p>

    <teleport to="body">
      <div v-if="idx !== null" class="fixed inset-0 z-[80] bg-[rgba(15,22,15,.94)] flex flex-col items-center justify-center gap-4 p-6"
           @click.self="idx = null">
        <button class="absolute top-4 right-5 text-white text-3xl" @click="idx = null">&times;</button>
        <button class="absolute top-1/2 left-1 -translate-y-1/2 text-white text-4xl px-3 opacity-70 hover:opacity-100" @click="step(-1)">&#8249;</button>
        <img :src="photos[idx].url" :alt="photos[idx].caption" class="max-w-full max-h-[78vh] shadow-2xl">
        <button class="absolute top-1/2 right-1 -translate-y-1/2 text-white text-4xl px-3 opacity-70 hover:opacity-100" @click="step(1)">&#8250;</button>
        <div class="text-ondark-soft text-[13px] tracking-[.14em] uppercase">{{ photos[idx].caption }}</div>
      </div>
    </teleport>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
const props = defineProps({ photos: { type: Array, default: () => [] } });
const idx = ref(null);
function open(i) { idx.value = i; }
function step(d) { idx.value = (idx.value + d + props.photos.length) % props.photos.length; }
function onKey(e) {
  if (idx.value === null) return;
  if (e.key === 'Escape') idx.value = null;
  if (e.key === 'ArrowLeft') step(-1);
  if (e.key === 'ArrowRight') step(1);
}
onMounted(() => window.addEventListener('keydown', onKey));
onUnmounted(() => window.removeEventListener('keydown', onKey));
</script>
