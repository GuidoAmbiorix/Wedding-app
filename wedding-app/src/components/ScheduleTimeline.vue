<template>
  <section id="details" class="relative py-20 px-6 flex justify-center"
           :style="{ backgroundImage: `linear-gradient(rgba(20,16,10,.6),rgba(20,16,10,.35)), url('${image}')`, backgroundSize:'cover', backgroundPosition:'center' }">
    <div v-reveal class="lace-card w-full max-w-[300px] px-7 py-8 shadow-2xl">
      <span class="font-script-var block text-center text-olive-800 mb-5" style="font-size:1.4rem">Itinerario</span>
      <div v-for="e in events" :key="e.id" class="flex justify-between gap-4 py-2.5 border-b border-line last:border-none text-[.92rem]">
        <span class="italic text-ink-mute whitespace-nowrap">{{ fmt(e.event_time) }}</span>
        <span class="text-ink tracking-[.02em] text-right">{{ e.name }}</span>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  events: { type: Array, default: () => [] },
  image:  { type: String, default: '/img/forest.jpg' },
});
function fmt(t) {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  const ap = h >= 12 ? 'PM' : 'AM';
  const hh = ((h + 11) % 12) + 1;
  return `${hh}:${String(m).padStart(2,'0')} ${ap}`;
}
</script>
