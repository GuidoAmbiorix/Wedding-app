<template>
  <section id="schedule" class="bg-cream text-ink py-20">
    <div class="wrap">
      <h2 v-reveal class="font-script-var text-center text-accent-var leading-[.92] mb-12"
          style="font-size:clamp(2.8rem,4vw,4.5rem)">El Horario</h2>
      <div class="tl-line relative max-w-2xl mx-auto">
        <div v-for="(e, i) in events" :key="e.id" v-reveal="i*0.04"
             :class="['tl-item relative w-1/2 pb-10', i % 2 === 0 ? 'left text-right pr-8' : 'right ml-[50%] text-left pl-8']">
          <p class="font-serif font-bold text-[11px] tracking-[.12em] uppercase text-ink mb-1">{{ fmt(e.event_time) }} · {{ e.name }}</p>
          <p class="text-[.9rem] leading-snug text-ink-mute">{{ e.notes }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({ events: { type: Array, default: () => [] } });
function fmt(t) {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  const ap = h >= 12 ? 'PM' : 'AM';
  const hh = ((h + 11) % 12) + 1;
  return `${hh}:${String(m).padStart(2,'0')} ${ap}`;
}
</script>
