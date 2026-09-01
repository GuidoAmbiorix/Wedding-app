<template>
  <div class="bg-white rounded-2xl border border-[#ece5d6] shadow-[0_1px_3px_rgba(58,54,35,0.05)] overflow-hidden">
    <div class="px-6 py-4 border-b border-[#f2ecdf] flex items-center gap-3">
      <div class="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" :style="{ background: iconBg }">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" :style="{ color: iconColor }" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
          <path stroke-linecap="round" stroke-linejoin="round" :d="icon"/>
        </svg>
      </div>
      <div>
        <p class="font-serif text-[16px] font-semibold text-[#2a2620] tracking-wide">{{ title }}</p>
        <p v-if="description" class="text-[12px] text-[#9a9280] mt-0.5">{{ description }}</p>
      </div>
      <span class="ml-auto text-[11px] font-semibold text-[#9a9280] uppercase tracking-wider">{{ sortedItems.length }}</span>
    </div>

    <div class="divide-y divide-[#f2ecdf]">
      <div v-for="(item, idx) in sortedItems" :key="item.id">
        <!-- Fila compacta -->
        <div v-if="editingId !== item.id" class="px-5 py-3.5 flex items-center gap-3">
          <div v-if="sortable" class="flex flex-col -my-1 flex-shrink-0">
            <button type="button" :disabled="idx === 0" @click="move(item, -1)"
              class="text-[#c2b89e] hover:text-[#8a6a24] disabled:opacity-25 disabled:hover:text-[#c2b89e] leading-none px-0.5">▲</button>
            <button type="button" :disabled="idx === sortedItems.length - 1" @click="move(item, 1)"
              class="text-[#c2b89e] hover:text-[#8a6a24] disabled:opacity-25 disabled:hover:text-[#c2b89e] leading-none px-0.5">▼</button>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-[#2a2620] truncate">{{ item[titleField] || '(sin título)' }}</p>
            <p v-if="subtitleField && item[subtitleField]" class="text-[12px] text-[#9a9280] truncate mt-0.5">{{ item[subtitleField] }}</p>
          </div>
          <button type="button" @click="startEdit(item)"
            class="text-[12px] font-medium text-[#8a6a24] hover:text-[#3a3623] px-2 py-1 flex-shrink-0">Editar</button>
          <button type="button" @click="confirmRemove(item)"
            class="text-[12px] font-medium text-[#b3665a] hover:text-[#8a3a2e] px-2 py-1 flex-shrink-0">Borrar</button>
        </div>

        <!-- Formulario inline -->
        <div v-else class="px-5 py-4 bg-[#faf7f0] space-y-3">
          <div v-for="f in fields" :key="f.key">
            <label class="block text-[11px] font-semibold text-[#9a9280] uppercase tracking-wider mb-1.5">{{ f.label }}</label>
            <textarea v-if="f.type === 'textarea'" v-model="draft[f.key]" rows="2" :placeholder="f.placeholder"
              class="w-full rounded-xl border border-[#e8e1d3] bg-white px-3.5 py-2.5 text-sm text-[#2a2620] placeholder-[#a8a08f] focus:outline-none focus:ring-2 focus:ring-[#c9a24b]/40 focus:border-[#c9a24b] transition resize-none"></textarea>
            <select v-else-if="f.type === 'select'" v-model="draft[f.key]"
              class="w-full rounded-xl border border-[#e8e1d3] bg-white px-3.5 py-2.5 text-sm text-[#2a2620] focus:outline-none focus:ring-2 focus:ring-[#c9a24b]/40 focus:border-[#c9a24b] transition">
              <option v-for="o in f.options" :key="o.value" :value="o.value">{{ o.label }}</option>
            </select>
            <FileToBase64Input v-else-if="f.type === 'image'" v-model="draft[f.key]" accept="image/*" :max-size-m-b="12" :placeholder="f.placeholder" />
            <input v-else :type="f.type === 'time' ? 'time' : f.type === 'number' ? 'number' : 'text'"
              v-model="draft[f.key]" :placeholder="f.placeholder"
              class="w-full rounded-xl border border-[#e8e1d3] bg-white px-3.5 py-2.5 text-sm text-[#2a2620] placeholder-[#a8a08f] focus:outline-none focus:ring-2 focus:ring-[#c9a24b]/40 focus:border-[#c9a24b] transition" />
          </div>
          <div class="flex items-center gap-2 pt-1">
            <button type="button" @click="saveEdit" :disabled="saving"
              class="px-4 py-2 rounded-lg text-sm font-semibold text-[#faf7f0] transition disabled:opacity-60" style="background:#3a3623">{{ saving ? 'Guardando...' : 'Guardar' }}</button>
            <button type="button" @click="cancelEdit" :disabled="saving" class="px-4 py-2 rounded-lg text-sm font-medium text-[#9a9280] hover:text-[#5a5442] transition disabled:opacity-60">Cancelar</button>
          </div>
        </div>
      </div>

      <p v-if="!sortedItems.length && editingId !== 'new'" class="px-5 py-6 text-sm text-[#9a9280] text-center italic">Todavía no hay elementos.</p>

      <!-- Nuevo item -->
      <div v-if="editingId === 'new'" class="px-5 py-4 bg-[#faf7f0] space-y-3">
        <div v-for="f in fields" :key="f.key">
          <label class="block text-[11px] font-semibold text-[#9a9280] uppercase tracking-wider mb-1.5">{{ f.label }}</label>
          <textarea v-if="f.type === 'textarea'" v-model="draft[f.key]" rows="2" :placeholder="f.placeholder"
            class="w-full rounded-xl border border-[#e8e1d3] bg-white px-3.5 py-2.5 text-sm text-[#2a2620] placeholder-[#a8a08f] focus:outline-none focus:ring-2 focus:ring-[#c9a24b]/40 focus:border-[#c9a24b] transition resize-none"></textarea>
          <select v-else-if="f.type === 'select'" v-model="draft[f.key]"
            class="w-full rounded-xl border border-[#e8e1d3] bg-white px-3.5 py-2.5 text-sm text-[#2a2620] focus:outline-none focus:ring-2 focus:ring-[#c9a24b]/40 focus:border-[#c9a24b] transition">
            <option v-for="o in f.options" :key="o.value" :value="o.value">{{ o.label }}</option>
          </select>
          <FileToBase64Input v-else-if="f.type === 'image'" v-model="draft[f.key]" accept="image/*" :max-size-m-b="12" :placeholder="f.placeholder" />
          <input v-else :type="f.type === 'time' ? 'time' : f.type === 'number' ? 'number' : 'text'"
            v-model="draft[f.key]" :placeholder="f.placeholder"
            class="w-full rounded-xl border border-[#e8e1d3] bg-white px-3.5 py-2.5 text-sm text-[#2a2620] placeholder-[#a8a08f] focus:outline-none focus:ring-2 focus:ring-[#c9a24b]/40 focus:border-[#c9a24b] transition" />
        </div>
        <div class="flex items-center gap-2 pt-1">
          <button type="button" @click="saveNew" :disabled="saving"
            class="px-4 py-2 rounded-lg text-sm font-semibold text-[#faf7f0] transition disabled:opacity-60" style="background:#3a3623">{{ saving ? 'Agregando...' : 'Agregar' }}</button>
          <button type="button" @click="cancelEdit" :disabled="saving" class="px-4 py-2 rounded-lg text-sm font-medium text-[#9a9280] hover:text-[#5a5442] transition disabled:opacity-60">Cancelar</button>
        </div>
      </div>
    </div>

    <Transition name="fade">
      <p v-if="feedback" :class="['px-5 py-2.5 text-[13px] font-medium border-t', feedback.type === 'success' ? 'text-emerald-600 border-[#f2ecdf] bg-emerald-50/40' : 'text-[#b3665a] border-[#f2ecdf] bg-[#fdf3f1]']">
        {{ feedback.message }}
      </p>
    </Transition>

    <div class="px-5 py-3.5 border-t border-[#f2ecdf]">
      <button v-if="editingId === null" type="button" @click="startNew"
        class="text-[13px] font-semibold text-[#8a6a24] hover:text-[#3a3623] transition">+ Agregar {{ itemLabel }}</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import FileToBase64Input from '@/components/admin/FileToBase64Input.vue';

const props = defineProps({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  icon: { type: String, default: 'M12 4v16m8-8H4' },
  iconBg: { type: String, default: '#f2ecdf' },
  iconColor: { type: String, default: '#8a6a24' },
  items: { type: Array, default: () => [] },
  fields: { type: Array, required: true },
  titleField: { type: String, required: true },
  subtitleField: { type: String, default: '' },
  itemLabel: { type: String, default: 'elemento' },
  emptyDefaults: { type: Object, default: () => ({}) },
  sortable: { type: Boolean, default: false },
  add: { type: Function, required: true },
  update: { type: Function, required: true },
  remove: { type: Function, required: true },
});

const sortedItems = computed(() => {
  if (!props.sortable) return props.items;
  return [...props.items].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
});

const editingId = ref(null);
const draft = ref({});
const saving = ref(false);
const feedback = ref(null); // { type: 'success' | 'error', message }
let feedbackTimer = null;

function showFeedback(type, message) {
  clearTimeout(feedbackTimer);
  feedback.value = { type, message };
  if (type === 'success') {
    feedbackTimer = setTimeout(() => { feedback.value = null; }, 2500);
  }
}

function describeError(e) {
  console.error(e);
  return e?.message || e?.error_description || e?.details || e?.hint
    || (typeof e === 'string' ? e : 'revisa la consola del navegador para más detalle');
}

function startEdit(item) {
  draft.value = { ...item };
  editingId.value = item.id;
}
function startNew() {
  draft.value = { ...props.emptyDefaults };
  editingId.value = 'new';
}
function cancelEdit() {
  editingId.value = null;
  draft.value = {};
}
async function saveEdit() {
  const { id, ...patch } = draft.value;
  saving.value = true;
  try {
    await props.update(id, patch);
    cancelEdit();
    showFeedback('success', 'Guardado');
  } catch (e) {
    showFeedback('error', `No se pudo guardar: ${describeError(e)}`);
  } finally {
    saving.value = false;
  }
}
async function saveNew() {
  const rec = { ...draft.value };
  if (props.sortable && rec.sort_order === undefined) {
    rec.sort_order = props.items.length;
  }
  saving.value = true;
  try {
    await props.add(rec);
    cancelEdit();
    showFeedback('success', 'Agregado');
  } catch (e) {
    showFeedback('error', `No se pudo agregar: ${describeError(e)}`);
  } finally {
    saving.value = false;
  }
}
async function confirmRemove(item) {
  try {
    await props.remove(item.id);
    showFeedback('success', 'Eliminado');
  } catch (e) {
    showFeedback('error', `No se pudo borrar: ${describeError(e)}`);
  }
}
async function move(item, dir) {
  const list = sortedItems.value;
  const idx = list.findIndex(x => x.id === item.id);
  const swapWith = list[idx + dir];
  if (!swapWith) return;
  const a = item.sort_order ?? idx;
  const b = swapWith.sort_order ?? (idx + dir);
  try {
    await Promise.all([
      props.update(item.id, { sort_order: b }),
      props.update(swapWith.id, { sort_order: a }),
    ]);
  } catch (e) {
    showFeedback('error', `No se pudo reordenar: ${describeError(e)}`);
  }
}
</script>
