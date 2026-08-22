<template>
  <section id="faqs" class="bg-cream text-ink px-8 py-20">
    <h2 v-reveal class="font-script-var text-center text-olive-800 leading-none mb-14" style="font-size:clamp(2.2rem,4vw,3rem)">Preguntas Frecuentes</h2>

    <div class="wrap max-w-3xl">
      <div v-for="group in groups" :key="group.name" class="mb-11">
        <h4 v-if="groups.length > 1" class="font-display text-[13px] tracking-[.2em] uppercase text-olive-800 border-b border-line pb-2.5 mb-6">{{ group.name }}</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-7">
          <div v-for="f in group.items" :key="f.id">
            <p class="font-serif font-semibold text-[1rem] mb-1.5">{{ f.question }}</p>
            <p class="text-[.94rem] leading-relaxed text-ink-mute">{{ f.answer }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({ faq: { type: Array, default: () => [] } });

const groups = computed(() => {
  const sorted = [...props.faq].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  const hasCategories = sorted.some(f => f.category);
  if (!hasCategories) return [{ name: 'General', items: sorted }];
  const byCat = new Map();
  for (const f of sorted) {
    const cat = f.category || 'General';
    if (!byCat.has(cat)) byCat.set(cat, []);
    byCat.get(cat).push(f);
  }
  return [...byCat.entries()].map(([name, items]) => ({ name, items }));
});
</script>
