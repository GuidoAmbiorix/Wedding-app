<template>
  <div v-if="photos.length" class="grid grid-cols-3">
    <div v-for="p in photos" :key="p.id" class="h-40 bg-center bg-cover" :style="{ backgroundImage: `url('${p.url}')` }"></div>
  </div>

  <footer class="bg-forest-900 text-ondark-soft py-10">
    <div class="wrap text-center">
      <div class="font-script-var text-4xl text-ondark mb-2">{{ names }}</div>
      <p class="text-[11px] tracking-[.16em] uppercase my-1.5">{{ longDate }} &middot; {{ wedding.venue }}</p>
      <p class="text-[11px] tracking-[.04em] opacity-70">
        Hecho con cariño ·
        <router-link to="/admin" class="text-sage-300 underline">Panel de administración</router-link>
      </p>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({
  wedding: { type: Object, required: true },
  photos:  { type: Array,  default: () => [] },
});
const names = computed(() => `${props.wedding.couple_name_1} & ${props.wedding.couple_name_2}`);
const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const longDate = computed(() => {
  const d = new Date(props.wedding.wedding_date + 'T00:00:00');
  return `${d.getDate()} de ${MESES[d.getMonth()]}, ${d.getFullYear()}`;
});
</script>
