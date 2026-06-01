<template>
  <div class="fixed z-[70] bottom-4 left-4 font-serif">
    <button v-if="!open" @click="open = true"
            class="w-11 h-11 rounded-full bg-forest-800 text-ondark border border-white/20 shadow-lg flex items-center justify-center text-lg"
            title="Personalizar">&#10022;</button>

    <div v-else class="w-[260px] bg-forest-800 text-ondark rounded-xl border border-white/15 shadow-2xl p-4 backdrop-blur">
      <div class="flex justify-between items-center mb-3">
        <span class="text-[11px] tracking-[.24em] uppercase text-ondark-soft">Personalizar</span>
        <button @click="open = false" class="text-ondark/70 text-xl leading-none">&times;</button>
      </div>

      <label class="block text-[10px] tracking-[.2em] uppercase text-ondark-soft mb-1.5">Portada</label>
      <div class="grid grid-cols-3 gap-1 mb-3 bg-forest-900/60 p-1 rounded-lg">
        <button v-for="o in COVER_OPTS" :key="o.value" @click="t.cover = o.value"
                :class="['text-[11px] py-1.5 rounded-md transition', t.cover === o.value ? 'bg-sage-400 text-forest-900' : 'text-ondark-soft']">{{ o.label }}</button>
      </div>

      <label class="block text-[10px] tracking-[.2em] uppercase text-ondark-soft mb-1.5">Acento</label>
      <div class="flex gap-2 mb-3">
        <button v-for="(a, i) in ACCENTS" :key="i" @click="t.accent = a"
                :class="['w-7 h-7 rounded-full border-2 transition', sameAccent(a) ? 'border-white' : 'border-transparent']"
                :style="{ background: a[0] }"></button>
      </div>

      <label class="block text-[10px] tracking-[.2em] uppercase text-ondark-soft mb-1.5">Letra script</label>
      <div class="grid grid-cols-3 gap-1 mb-3 bg-forest-900/60 p-1 rounded-lg">
        <button v-for="s in SCRIPTS" :key="s.value" @click="t.script = s.value"
                :class="['text-[10px] py-1.5 rounded-md transition leading-tight', t.script === s.value ? 'bg-sage-400 text-forest-900' : 'text-ondark-soft']">{{ s.label }}</button>
      </div>

      <label class="flex items-center justify-between py-1.5 text-[12px]">
        <span class="text-ondark-soft">Cuenta regresiva</span>
        <input type="checkbox" v-model="t.countdown" class="accent-sage-400 w-4 h-4">
      </label>
      <label class="flex items-center justify-between py-1.5 text-[12px]">
        <span class="text-ondark-soft">Animaciones</span>
        <input type="checkbox" v-model="t.animations" class="accent-sage-400 w-4 h-4">
      </label>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useTweaks, COVER_OPTS, ACCENTS, SCRIPTS } from '@/composables/useTweaks.js';
const t = useTweaks();
const open = ref(false);
function sameAccent(a) { return t.accent[0] === a[0] && t.accent[1] === a[1]; }
</script>
