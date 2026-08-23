<template>
  <section id="details" class="sched-section relative py-20 px-6 overflow-hidden">
    <div class="sched-vignette absolute inset-0"></div>

    <svg class="sched-vine sched-vine-l" viewBox="0 0 160 400" fill="none" stroke="#8a8354" stroke-width="1">
      <path d="M10 0 C20 40 5 60 15 100 C25 140 5 160 15 200 C25 240 8 260 18 300"/>
      <ellipse cx="18" cy="60" rx="6" ry="10"/><ellipse cx="12" cy="120" rx="6" ry="10"/><ellipse cx="20" cy="180" rx="6" ry="10"/>
    </svg>
    <svg class="sched-vine sched-vine-r" viewBox="0 0 160 400" fill="none" stroke="#8a8354" stroke-width="1">
      <path d="M10 0 C20 40 5 60 15 100 C25 140 5 160 15 200 C25 240 8 260 18 300"/>
      <ellipse cx="18" cy="60" rx="6" ry="10"/><ellipse cx="12" cy="120" rx="6" ry="10"/><ellipse cx="20" cy="180" rx="6" ry="10"/>
    </svg>

    <div class="relative z-10 max-w-[420px] mx-auto">
      <div v-reveal class="text-center mb-14">
        <p class="text-[11px] tracking-[.34em] uppercase text-ondark-soft mb-3">El día, paso a paso</p>
        <span class="font-script-var block leading-none text-ondark" style="font-size:clamp(2.2rem,5vw,2.8rem)">Itinerario</span>
      </div>

      <div class="sched-line relative">
        <div v-for="(e, i) in events" :key="e.id" v-reveal="i*0.06" class="sched-row relative flex gap-5 pb-11 last:pb-0">
          <div class="sched-dot-wrap relative flex-shrink-0 w-10 flex justify-center">
            <span class="sched-dot"></span>
          </div>
          <div class="flex-1 -mt-1">
            <p class="font-display font-medium text-gold leading-none" style="font-size:1.5rem">{{ fmt(e.event_time) }}</p>
            <p class="text-[13px] tracking-[.18em] uppercase text-ondark mt-1.5">{{ e.name }}</p>
            <p v-if="e.notes" class="text-[.86rem] text-ondark-soft leading-relaxed mt-1.5 max-w-[26ch]">{{ e.notes }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  events: { type: Array, default: () => [] },
});
function fmt(t) {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  const ap = h >= 12 ? 'PM' : 'AM';
  const hh = ((h + 11) % 12) + 1;
  return `${hh}:${String(m).padStart(2,'0')} ${ap}`;
}
</script>

<style scoped>
.sched-section{
  background:
    radial-gradient(circle at 15% 0%, rgba(140,131,84,.16), transparent 55%),
    radial-gradient(circle at 100% 100%, rgba(201,162,75,.08), transparent 45%),
    linear-gradient(165deg, #241d16 0%, #1c170f 55%, #17130c 100%);
}
.sched-vignette{
  background: radial-gradient(ellipse 70% 60% at 50% 40%, rgba(0,0,0,0) 0%, rgba(0,0,0,.35) 100%);
  pointer-events: none;
}
.sched-vine{ position:absolute; top:-10px; width:120px; opacity:.35; }
.sched-vine-l{ left:0; }
.sched-vine-r{ right:0; transform:scaleX(-1); }

.sched-line::before{
  content:"";
  position:absolute; left:20px; top:8px; bottom:8px; width:0;
  border-left:1px dashed rgba(201,162,75,.4);
}
.sched-dot{
  position:relative; z-index:1; display:block; width:11px; height:11px; border-radius:50%;
  background:radial-gradient(circle at 32% 28%, #e8c877, #8a6a24 90%);
  box-shadow:0 0 0 4px #241d16, 0 0 10px rgba(201,162,75,.5);
  margin-top:6px;
}
.sched-row:last-child .sched-dot{ box-shadow:0 0 0 4px #241d16, 0 0 14px rgba(201,162,75,.7); }
</style>
