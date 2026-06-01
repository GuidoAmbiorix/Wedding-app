<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  delay: { type: Number, default: 0 },
  direction: { type: String, default: 'up' }, // up | left | right | fade
  once: { type: Boolean, default: true },
})

const el = ref(null)
const visible = ref(false)

const directionMap = {
  up:    'translateY(40px)',
  left:  'translateX(-40px)',
  right: 'translateX(40px)',
  fade:  'translateY(0)',
}

let observer = null

onMounted(() => {
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        visible.value = true
        if (props.once) observer.disconnect()
      } else if (!props.once) {
        visible.value = false
      }
    },
    { threshold: 0.12 }
  )
  if (el.value) observer.observe(el.value)
})

onUnmounted(() => observer?.disconnect())
</script>

<template>
  <div
    ref="el"
    class="scroll-reveal"
    :class="{ visible }"
    :style="{
      '--from': directionMap[direction],
      '--delay': `${delay}ms`,
    }"
  >
    <slot />
  </div>
</template>

<style scoped>
.scroll-reveal {
  opacity: 0;
  transform: var(--from, translateY(40px));
  transition:
    opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) var(--delay, 0ms),
    transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) var(--delay, 0ms);
}
.scroll-reveal.visible {
  opacity: 1;
  transform: translateX(0) translateY(0);
}
</style>
