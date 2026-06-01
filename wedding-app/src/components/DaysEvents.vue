<template>
  <section class="bg-forest-700 text-ondark py-20">
    <div class="wrap">
      <p v-reveal class="text-center text-[11px] tracking-[.34em] uppercase text-ondark-soft font-semibold mb-1">Los eventos del día</p>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 mt-8">
        <div v-for="(e, i) in cards" :key="e.key" v-reveal="i*0.06" class="text-center">
          <svg viewBox="0 0 48 48" class="w-12 h-12 mx-auto mb-4 stroke-ondark" style="stroke-width:1.1" fill="none" v-html="e.icon"></svg>
          <h4 class="font-serif font-semibold text-[11px] tracking-[.2em] uppercase mb-2">{{ e.title }}</h4>
          <p class="text-[.92rem] leading-snug text-ondark-soft">{{ e.sub }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({ events: { type: Array, default: () => [] } });

const ICONS = {
  ceremony: '<path d="M10 42V20c0-7 6-13 14-13s14 6 14 13v22"/><path d="M6 42h36"/><path d="M24 7v-3"/><path d="M18 42V26a6 6 0 0112 0v16"/>',
  photo:    '<rect x="6" y="14" width="36" height="26" rx="3"/><path d="M16 14l4-6h8l4 6"/><circle cx="24" cy="27" r="8"/>',
  cocktail: '<path d="M12 10h24l-10 14v12"/><path d="M18 40h12"/><path d="M14 16h20"/>',
  reception:'<path d="M6 42V22l18-12 18 12v20"/><path d="M6 42h36"/><rect x="20" y="30" width="8" height="12"/><path d="M14 24h6M28 24h6"/>',
};

const DEFAULTS = [
  { key:'ceremony',  keywords:['ceremon'],           title:'Ceremonia',  fallback:'5:00 PM · El momento del «sí»',      icon: ICONS.ceremony  },
  { key:'photo',     keywords:['foto','photo','graf'],title:'Fotografía', fallback:'Capturando cada instante',           icon: ICONS.photo     },
  { key:'cocktail',  keywords:['cóctel','coctel','cock','brindis'], title:'Cóctel', fallback:'6:00 PM · Brindis al aire libre', icon: ICONS.cocktail  },
  { key:'reception', keywords:['recep','cena','baile','bienvenida'],title:'Recepción', fallback:'7:30 PM · Cena & baile',   icon: ICONS.reception },
];

function fmt(t) {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  const ap = h >= 12 ? 'PM' : 'AM';
  const hh = ((h + 11) % 12) + 1;
  return `${hh}:${String(m).padStart(2,'0')} ${ap}`;
}

const cards = computed(() =>
  DEFAULTS.map(d => {
    const match = props.events.find(e =>
      d.keywords.some(k => e.name.toLowerCase().includes(k))
    );
    return { ...d, sub: match ? `${fmt(match.event_time)} · ${match.notes || match.name}` : d.fallback };
  })
);
</script>
