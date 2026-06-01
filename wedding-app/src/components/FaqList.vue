<template>
  <section class="bg-cream text-ink px-8 py-16">
    <div class="border-t border-line">
      <div v-for="(f, i) in faq" :key="f.id" class="border-b border-line">
        <button class="w-full text-left flex justify-between items-center gap-3.5 py-4 font-serif font-semibold text-[1.06rem] tracking-[.04em]"
                @click="toggle(i)">
          <span>{{ f.question }}</span>
          <span class="font-display text-[1.4rem] text-green transition-transform duration-300" :class="open === i ? 'rotate-45' : ''">+</span>
        </button>
        <div class="grid transition-all duration-400" :style="{ gridTemplateRows: open === i ? '1fr' : '0fr' }">
          <div class="overflow-hidden">
            <p class="pb-5 pr-1 text-[.98rem] leading-relaxed text-ink-mute">{{ f.answer }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
defineProps({ faq: { type: Array, default: () => [] } });
const open = ref(0);
function toggle(i) { open.value = open.value === i ? null : i; }
</script>
