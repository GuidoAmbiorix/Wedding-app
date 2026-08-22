<template>
  <section v-if="items.length" class="relative py-20 md:py-24 px-6 text-ondark overflow-hidden"
           style="background:linear-gradient(rgba(20,20,12,.55),rgba(20,20,12,.75)), radial-gradient(ellipse at 30% 20%, #5c684a 0%, #33392a 50%, #1c2016 100%)">
    <h2 v-reveal class="font-script-var text-center leading-none mb-16" style="font-size:clamp(2.2rem,4.5vw,3rem)">Our love story</h2>

    <div class="relative max-w-xl mx-auto">
      <div class="tl-dashed absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2"></div>

      <div v-for="(item, i) in items" :key="item.id"
           v-reveal="i*0.06"
           :class="['flex items-center mb-14 relative', i % 2 === 0 ? 'justify-start' : 'justify-end']">
        <div v-if="i % 2 === 0" class="polaroid w-[140px] shrink-0 relative" :style="{ transform: 'rotate(-3deg)' }">
          <div class="w-full h-[130px] bg-center bg-cover" :style="{ backgroundImage: `url('${item.url}')` }"></div>
          <span class="cap">{{ item.year || '' }}</span>
        </div>
        <p v-if="i % 2 === 0" class="text-[.85rem] italic text-ondark-soft ml-6 w-[130px]">{{ item.caption }}</p>

        <p v-if="i % 2 !== 0" class="text-[.85rem] italic text-ondark-soft mr-6 w-[130px] text-right">{{ item.caption }}</p>
        <div v-if="i % 2 !== 0" class="polaroid w-[140px] shrink-0 relative" :style="{ transform: 'rotate(3deg)' }">
          <div class="w-full h-[130px] bg-center bg-cover" :style="{ backgroundImage: `url('${item.url}')` }"></div>
          <span class="cap">{{ item.year || '' }}</span>
        </div>

        <span class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gold"></span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({ photos: { type: Array, default: () => [] } });
const items = computed(() => [...props.photos]
  .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
  .slice(0, 6));
</script>

<style scoped>
.tl-dashed {
  background-image: repeating-linear-gradient(180deg, rgba(241,233,214,.5) 0 6px, transparent 6px 12px);
}
</style>
