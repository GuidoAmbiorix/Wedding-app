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

function readAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('No se pudo leer el archivo.'));
    reader.readAsDataURL(file);
  });
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => { resolve(img); URL.revokeObjectURL(url); };
    img.onerror = () => { reject(new Error('No se pudo procesar la imagen.')); URL.revokeObjectURL(url); };
    img.src = url;
  });
}

// Redimensiona/recomprime en el navegador antes de convertir a base64: las fotos de
// cámara (4-12MB) rompían el insert en Supabase (proxy/límite de payload) y además
// inflaban el HTML con strings enormes, causando el lag al cargar el sitio.
async function compressImage(file, maxDim = 1920, quality = 0.82) {
  const img = await loadImage(file);
  const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', quality);
}

async function onFile(e) {
  const file = e.target.files?.[0];
  e.target.value = '';
  if (!file) return;
  error.value = '';
  if (file.size > props.maxSizeMB * 1024 * 1024) {
    error.value = `El archivo pesa ${(file.size / 1024 / 1024).toFixed(1)}MB, el máximo es ${props.maxSizeMB}MB. Comprímelo o usa una URL externa.`;
    return;
  }
  loading.value = true;
  try {
    const dataUrl = file.type.startsWith('image/')
      ? await compressImage(file)
      : await readAsDataURL(file);
    emit('update:modelValue', dataUrl);
  } catch (err) {
    error.value = err.message || 'No se pudo procesar el archivo.';
  } finally {
    loading.value = false;
  }
}
</script>
