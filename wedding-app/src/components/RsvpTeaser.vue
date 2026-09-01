<template>
  <section class="bg-forest-800 py-24 md:py-28 px-8 flex items-center justify-center">
    <div v-reveal class="peel-card relative w-full max-w-[400px] bg-ivory text-center px-9 pt-16 pb-11 shadow-2xl">
      <div class="tape absolute -top-[18px] right-7 w-24 h-14 flex items-center justify-center">
        <span class="font-display text-[11px] tracking-[.2em] uppercase text-forest-900">Abrir</span>
      </div>

      <p class="text-[11px] tracking-[.3em] uppercase text-ink-mute mb-3.5">Por favor, respóndenos</p>
      <div class="font-script-var text-olive-800 leading-none" style="font-size:2.4rem">{{ wedding.couple_name_1 }} &amp; {{ wedding.couple_name_2 }}</div>
      <p class="font-display text-[1.05rem] tracking-[.08em] text-ink mt-3.5">te esperan antes del {{ deadline }}</p>

      <a href="#" @click.prevent="$emit('rsvp')"
         class="inline-block mt-7 font-display text-[13px] tracking-[.2em] uppercase bg-green text-ivory px-9 py-3.5 transition hover:bg-olive-800">
        RSVP
      </a>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
defineEmits(['rsvp']);
const props = defineProps({ wedding: { type: Object, default: () => ({}) } });

const MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
const deadline = computed(() => {
  const d = props.wedding.rsvp_deadline
    ? new Date(props.wedding.rsvp_deadline + 'T00:00:00')
    : new Date('2026-10-01T00:00:00');
  return `${d.getDate()} de ${MESES[d.getMonth()]}`;
});
</script>

<style scoped>
.tape{
  background:linear-gradient(135deg, #e8c877, var(--color-gold,#c9a24b) 55%, #8a6a24);
  box-shadow:0 10px 18px rgba(0,0,0,.35);
  clip-path: polygon(0 0, 100% 0, 100% 78%, 78% 100%, 0 100%);
  transform:rotate(-8deg);
  transform-origin: top left;
  transition:transform .35s cubic-bezier(.2,.8,.2,1);
}
.tape span{ transform:rotate(8deg); }
.peel-card:hover .tape{ transform:rotate(-18deg) translate(-6px,-4px); }
.tape::after{
  content:""; position:absolute; right:0; bottom:0; width:22px; height:22px;
  background:linear-gradient(135deg, transparent 50%, rgba(0,0,0,.18) 50%);
}
</style>
