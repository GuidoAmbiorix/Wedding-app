<template>
  <section :id="anchor" v-reveal class="relative flex items-center justify-center text-center text-white px-8"
           :style="{ minHeight: min, backgroundImage: `linear-gradient(rgba(20,30,20,.45),rgba(20,30,20,.5)), url('${image}')`, backgroundSize:'cover', backgroundPosition:'center' }">
    <h2 class="font-script-var drop-shadow-[0_2px_18px_rgba(0,0,0,.45)]" :style="{ fontSize: size }">{{ title }}</h2>
  </section>
</template>

<script setup>
defineProps({
  title:  String,
  image:  String,
  anchor: String,
  min:    { type: String, default: '280px' },
  size:   { type: String, default: 'clamp(2.8rem,4vw,5rem)' },
});
</script>
