<template>
  <div>
    <div class="flex items-stretch gap-2">
      <input :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"
        :placeholder="placeholder"
        class="flex-1 min-w-0 rounded-xl border border-[#e8e1d3] bg-[#faf7f0] px-4 py-3 text-sm text-[#2a2620] placeholder-[#a8a08f] focus:outline-none focus:ring-2 focus:ring-[#c9a24b]/40 focus:bg-white focus:border-[#c9a24b] transition" />
      <label class="flex-shrink-0 flex items-center justify-center px-4 rounded-xl border border-[#e8e1d3] bg-white text-[12px] font-semibold text-[#8a6a24] uppercase tracking-wider cursor-pointer hover:bg-[#faf7f0] transition">
        {{ loading ? '...' : 'Subir' }}
        <input type="file" :accept="accept" class="hidden" @change="onFile" :disabled="loading" />
      </label>
    </div>
    <p v-if="error" class="text-xs text-[#b3665a] mt-1.5">{{ error }}</p>
    <p v-else class="text-xs text-gray-400 mt-1.5">Pega una URL, o sube el archivo directo (se guarda incrustado, sin necesitar un bucket externo).</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  modelValue: { type: String, default: '' },
  accept: { type: String, default: 'image/*' },
  maxSizeMB: { type: Number, default: 5 },
  placeholder: { type: String, default: 'https://...' },
});
const emit = defineEmits(['update:modelValue']);

const loading = ref(false);
const error = ref('');

function onFile(e) {
  const file = e.target.files?.[0];
  e.target.value = '';
  if (!file) return;
  error.value = '';
  if (file.size > props.maxSizeMB * 1024 * 1024) {
    error.value = `El archivo pesa ${(file.size / 1024 / 1024).toFixed(1)}MB, el máximo es ${props.maxSizeMB}MB. Comprímelo o usa una URL externa.`;
    return;
  }
  loading.value = true;
  const reader = new FileReader();
  reader.onload = () => {
    emit('update:modelValue', reader.result);
    loading.value = false;
  };
  reader.onerror = () => {
    error.value = 'No se pudo leer el archivo.';
    loading.value = false;
  };
  reader.readAsDataURL(file);
}
</script>
