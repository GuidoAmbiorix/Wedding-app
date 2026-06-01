<template>
  <section class="relative text-center text-ondark py-24"
           style="background:linear-gradient(rgba(22,32,22,.78),rgba(22,32,22,.86)),url('/img/forest.jpg') center/cover">
    <div class="wrap">
      <p class="font-display font-medium tracking-[.12em] uppercase text-xl leading-relaxed mb-4">
        No podemos esperar<br>para celebrar contigo
      </p>
      <div class="w-14 h-px bg-ondark/40 mx-auto my-4"></div>
      <a href="#" @click.prevent="$emit('rsvp')"
         class="inline-flex items-center justify-center font-serif font-medium text-[13px] tracking-[.22em] uppercase px-8 py-3.5 border border-white/60 text-ondark rounded-full transition hover:bg-white hover:text-forest-800 mt-2">
        Confirmar aquí
      </a>
    </div>
  </section>

  <footer class="bg-forest-900 text-ondark-soft py-10">
    <div class="wrap text-center">
      <div class="font-script-var text-4xl text-ondark mb-2">J&amp;G</div>
      <p class="text-[11px] tracking-[.16em] uppercase my-1.5">{{ names }} · {{ longDate }}</p>
      <p class="text-[11px] tracking-[.04em] opacity-70">
        Hecho con cariño ·
        <router-link to="/admin" class="text-sage-300 underline">Panel de administración</router-link>
      </p>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue';
defineEmits(['rsvp']);
const props = defineProps({ wedding: { type: Object, required: true } });
const names = computed(() => `${props.wedding.couple_name_1} & ${props.wedding.couple_name_2}`);
const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const longDate = computed(() => {
  const d = new Date(props.wedding.wedding_date + 'T00:00:00');
  return `${d.getDate()} de ${MESES[d.getMonth()]}, ${d.getFullYear()}`;
});
</script>
