<template>
  <section id="rsvp" class="bg-forest-700 text-ondark px-8 py-16">
    <h2 v-reveal class="font-script-var text-center leading-[.92]" style="font-size:clamp(3rem,5vw,4.4rem)">Confirma tu Asistencia</h2>
    <p v-reveal="0.05" class="text-center text-[1.06rem] text-ondark-soft max-w-[34ch] mx-auto mt-2.5 mb-6">
      Por favor responde antes del {{ deadline }}.
    </p>

    <div v-reveal="0.1">
      <!-- Paso 1: buscar nombre -->
      <div v-if="step === 1" class="animate-fade">
        <div class="mb-4">
          <label class="block text-[11px] tracking-[.2em] uppercase text-ondark-soft mb-2">¿Cómo aparece tu nombre en la invitación?</label>
          <input v-model="query" type="text" placeholder="Nombre, apellido o nombre familiar" :class="inputCls" @keyup.enter="findMe">
          <p v-if="err.find" class="text-[#f0b9b0] text-sm italic mt-1.5">{{ err.find }}</p>
        </div>
        <button :class="btnLight" @click="findMe">Buscar mi invitación</button>
      </div>

      <!-- Paso 2: formulario -->
      <form v-else-if="step === 2" class="animate-fade" @submit.prevent="send">
        <p class="text-[1.06rem] text-ondark mb-4">
          Hola <b>{{ displayName }}</b>, ¿podrán acompañarnos?
        </p>

        <!-- Attending / Declined -->
        <div class="flex gap-2.5 mb-5">
          <label v-for="opt in statusOpts" :key="opt.v" class="flex-1">
            <input type="radio" name="status" :value="opt.v" v-model="form.status" class="sr-only peer">
            <span class="block text-center py-3.5 px-2 border border-line bg-cream text-ink-mute text-xs tracking-[.14em] uppercase cursor-pointer rounded-sm peer-checked:bg-accent-var peer-checked:text-cream peer-checked:border-accent-var transition">{{ opt.l }}</span>
          </label>
        </div>

        <!-- If attending and guest has members — per-member meal selection -->
        <div v-if="form.status === 'attending' && hasMembers">
          <p class="text-[11px] tracking-[.2em] uppercase text-ondark-soft mb-3">Elección de menú por persona</p>
          <div v-for="(mr, i) in form.members_responses" :key="i" class="mb-4 p-4 rounded-sm border border-line/30 bg-white/5">
            <p class="text-[.95rem] font-semibold text-ondark mb-2">{{ mr.name }}</p>
            <div class="space-y-2">
              <select v-model="mr.meal_choice" :class="inputCls">
                <option value="">Selecciona un menú…</option>
                <option v-for="m in meals" :key="m.v" :value="m.v">{{ m.l }}</option>
              </select>
              <input v-model="mr.dietary" type="text" placeholder="Restricción alimentaria (opcional)" :class="inputCls">
            </div>
          </div>
        </div>

        <!-- If attending, no members — single meal selection -->
        <div v-else-if="form.status === 'attending'">
          <div class="mb-4">
            <label class="block text-[11px] tracking-[.2em] uppercase text-ondark-soft mb-2">Elección de menú</label>
            <select v-model="form.meal_choice" :class="inputCls">
              <option value="">Selecciona…</option>
              <option v-for="m in meals" :key="m.v" :value="m.v">{{ m.l }}</option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block text-[11px] tracking-[.2em] uppercase text-ondark-soft mb-2">Restricción alimentaria (opcional)</label>
            <input v-model="form.dietary" type="text" placeholder="Alergias, etc." :class="inputCls">
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-[11px] tracking-[.2em] uppercase text-ondark-soft mb-2">Un mensaje para los novios (opcional)</label>
          <textarea v-model="form.message" placeholder="¡Felicidades!…" :class="inputCls" style="min-height:80px" class="resize-none"></textarea>
        </div>
        <p v-if="err.status" class="text-[#f0b9b0] text-sm italic mb-3">{{ err.status }}</p>
        <button type="submit" :class="btnLight">Enviar confirmación</button>
      </form>

      <!-- Paso 3: gracias -->
      <div v-else class="text-center animate-fade">
        <h3 class="font-script-var" style="font-size:3rem">{{ thanks.title }}</h3>
        <p class="text-[1.06rem] text-ondark mt-2">{{ thanks.msg }}</p>
        <button :class="[btnLight, 'mt-6 !w-auto px-8']" @click="step = 2">Editar respuesta</button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useData } from '@/composables/useData.js';

const props = defineProps({ wedding: { type: Object, default: () => ({}) } });
const { findGuest, submitRsvp } = useData();

const step  = ref(1);
const query = ref('');
const guest = ref(null);
const err   = reactive({ find: '', status: '' });
const form  = reactive({
  status: '', meal_choice: '', dietary: '', message: '',
  members_responses: [],
});
const thanks = reactive({ title: '', msg: '' });

const statusOpts = [
  { v: 'attending', l: 'Sí, allí estaremos' },
  { v: 'declined',  l: 'No podremos ir' },
];
const meals = [
  { v: 'beef',       l: 'Res' },
  { v: 'chicken',    l: 'Pollo' },
  { v: 'fish',       l: 'Pescado' },
  { v: 'vegetarian', l: 'Vegetariano' },
  { v: 'vegan',      l: 'Vegano' },
];

const displayName = computed(() => {
  if (!guest.value) return query.value.trim().split(' ')[0] || '';
  return guest.value.guest_display_name || guest.value.first_name || '';
});

const hasMembers = computed(() => (guest.value?.members?.length ?? 0) > 0);

const deadline = computed(() => {
  const d = props.wedding.rsvp_deadline
    ? new Date(props.wedding.rsvp_deadline + 'T00:00:00')
    : new Date('2026-10-01T00:00:00');
  const M = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  return `${d.getDate()} de ${M[d.getMonth()]} de ${d.getFullYear()}`;
});

const inputCls = 'w-full font-serif text-[1.04rem] text-ink bg-cream border border-line px-3.5 py-3 rounded-sm focus:border-accent-var outline-none';
const btnLight  = 'w-full inline-flex items-center justify-center font-serif font-medium text-[13px] tracking-[.22em] uppercase px-7 py-3.5 border border-white/60 text-ondark rounded-full transition hover:bg-white hover:text-forest-800';

async function findMe() {
  if (!query.value.trim()) { err.find = 'Por favor ingresa tu nombre.'; return; }
  err.find = '';
  guest.value = await findGuest(query.value);
  // Pre-fill members_responses from guest.members
  if (guest.value?.members?.length) {
    form.members_responses = guest.value.members.map(m => ({
      name: m.name,
      meal_choice: m.meal_choice || '',
      dietary: m.dietary || '',
    }));
  } else {
    form.members_responses = [];
  }
  step.value = 2;
}

async function send() {
  if (!form.status) { err.status = 'Elige una opción para continuar.'; return; }
  err.status = '';
  await submitRsvp(guest.value, {
    status: form.status,
    meal_choice: form.meal_choice || null,
    message: form.message || null,
    members_responses: hasMembers.value ? form.members_responses : [],
  });
  if (form.status === 'attending') {
    thanks.title = '¡Nos vemos pronto!';
    thanks.msg = `Gracias, ${displayName.value}. Hemos registrado su asistencia. ¡No podemos esperar a celebrar con ustedes!`;
  } else {
    thanks.title = 'Los extrañaremos';
    thanks.msg = `Gracias por avisarnos, ${displayName.value}. Lamentamos que no puedan acompañarnos, pero los tendremos presentes en nuestro gran día.`;
  }
  step.value = 3;
}
</script>
