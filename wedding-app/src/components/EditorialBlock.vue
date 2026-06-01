<template>
  <div class="flex flex-col md:flex-row gap-10 md:gap-16 items-center">
    <!-- Imagen -->
    <div v-reveal class="w-full md:w-[46%] flex-shrink-0 relative"
         :class="reverse ? 'md:order-2' : 'md:order-1'">
      <span class="absolute bg-accent-var -z-10" :class="frameCls"></span>
      <img :src="image" :alt="alt" class="block w-full h-auto relative" loading="lazy">
    </div>
    <!-- Texto -->
    <div v-reveal="0.08" class="w-full md:flex-1"
         :class="reverse ? 'md:order-1' : 'md:order-2'">
      <slot />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  image:   String,
  alt:     { type: String, default: '' },
  frame:   { type: String, default: 'tl' },
  reverse: { type: Boolean, default: false },
});
const frameCls = props.frame === 'tl'
  ? 'top-[-16px] left-[-14px] w-[64%] h-[78%]'
  : 'bottom-[-16px] right-[-14px] w-[64%] h-[78%]';
</script>
