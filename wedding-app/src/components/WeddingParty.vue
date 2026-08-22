<template>
  <section v-if="members.length" id="party" class="bg-forest-900 text-ondark py-20 px-6 text-center">
    <p class="font-display text-lg tracking-[.05em] mb-2">Meet the BEST people</p>
    <div class="w-px h-10 mx-auto mb-8" style="background:linear-gradient(var(--color-ondark-soft,#c9bd9c),transparent)"></div>

    <template v-for="group in groups" :key="group.key">
      <h3 class="font-display text-[13px] tracking-[.3em] uppercase mb-8 mt-14 text-gold">{{ group.label }}</h3>
      <div class="flex flex-wrap justify-center gap-6">
        <div v-for="m in group.items" :key="m.id" class="w-[130px]">
          <div class="w-[130px] h-[150px] bg-center bg-cover border-[6px] border-ivory shadow-lg mx-auto"
               :style="{ backgroundImage: `url('${m.photo_url}')` }"></div>
          <p class="font-display text-[14px] mt-3">{{ m.name }}</p>
          <p v-if="m.role_label" class="text-[10px] tracking-[.12em] uppercase text-gold mt-0.5">{{ m.role_label }}</p>
        </div>
      </div>
    </template>
  </section>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({ members: { type: Array, default: () => [] } });

const GROUP_LABELS = {
  honor:      'Nuestra pareja de honor',
  bridesmaid: 'Damas de honor',
  groomsman:  'Padrinos',
};
const ORDER = ['honor', 'bridesmaid', 'groomsman'];

const groups = computed(() => {
  const sorted = [...props.members].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  return ORDER
    .map(key => ({ key, label: GROUP_LABELS[key], items: sorted.filter(m => (m.role_group || 'bridesmaid') === key) }))
    .filter(g => g.items.length);
});
</script>
