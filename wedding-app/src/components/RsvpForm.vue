<template>
  <section id="rsvp" class="bg-ivory text-ink px-8 py-20">
    <h2 v-reveal class="font-script-var text-center text-olive-800 leading-none" style="font-size:clamp(2.4rem,5vw,3.2rem)">Confirma tu Asistencia</h2>
    <p v-reveal="0.05" class="text-center text-[1rem] text-ink-mute max-w-[34ch] mx-auto mt-3 mb-9">
      Por favor responde antes del {{ deadline }}.
    </p>

    <div v-reveal="0.1">
      <!-- Paso 1: buscar nombre -->
      <div v-if="step === 1" class="animate-fade">
        <div class="mb-6">
          <label class="block text-[12px] tracking-[.08em] italic text-ink-mute mb-2">¿Cómo aparece tu nombre en la invitación?</label>
          <input v-model="query" type="text" placeholder="Nombre, apellido o nombre familiar" :class="inputCls" @keyup.enter="findMe">
          <p v-if="err.find" class="text-[#8a4a3a] text-sm italic mt-1.5">{{ err.find }}</p>
        </div>
        <button :class="btnLight" @click="findMe">Buscar mi invitación</button>
      </div>

      <!-- Paso 2: formulario -->
      <form v-else-if="step === 2" class="animate-fade" @submit.prevent="send">
        <p class="text-[1.02rem] text-ink mb-5">
          Hola <b>{{ displayName }}</b>, ¿podrán acompañarnos?
        </p>

        <!-- Attending / Declined -->
        <div class="flex gap-2.5 mb-6">
          <label v-for="opt in statusOpts" :key="opt.v" class="flex-1">
            <input type="radio" name="status" :value="opt.v" v-model="form.status" class="sr-only peer">
            <span class="block text-center py-3.5 px-2 border border-line bg-paper text-ink-mute text-xs tracking-[.14em] uppercase cursor-pointer peer-checked:bg-green peer-checked:text-ivory peer-checked:border-green transition">{{ opt.l }}</span>
          </label>
        </div>

        <!-- If attending and guest has members — per-member meal selection -->
        <div v-if="form.status === 'attending' && hasMembers">
          <p class="text-[12px] tracking-[.08em] italic text-ink-mute mb-3">Elección de menú por persona</p>
          <div v-for="(mr, i) in form.members_responses" :key="i" class="mb-4 p-4 border border-line bg-paper/60">
            <p class="text-[.95rem] font-semibold text-ink mb-2">{{ mr.name }}</p>
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
          <div class="mb-6">
            <label class="block text-[12px] tracking-[.08em] italic text-ink-mute mb-2">Elección de menú</label>
            <select v-model="form.meal_choice" :class="inputCls">
              <option value="">Selecciona…</option>
              <option v-for="m in meals" :key="m.v" :value="m.v">{{ m.l }}</option>
            </select>
          </div>
          <div class="mb-6">
            <label class="block text-[12px] tracking-[.08em] italic text-ink-mute mb-2">Restricción alimentaria (opcional)</label>
            <input v-model="form.dietary" type="text" placeholder="Alergias, etc." :class="inputCls">
          </div>
        </div>

        <div class="mb-6">
          <label class="block text-[12px] tracking-[.08em] italic text-ink-mute mb-2">Un mensaje para los novios (opcional)</label>
          <textarea v-model="form.message" placeholder="¡Felicidades!…" :class="[inputCls, 'resize-none']" style="min-height:80px"></textarea>
        </div>
        <p v-if="err.status" class="text-[#8a4a3a] text-sm italic mb-3">{{ err.status }}</p>
        <button type="submit" :class="btnLight">Enviar confirmación</button>
      </form>

      <!-- Paso 3: gracias -->
      <div v-else class="text-center animate-fade">
        <h3 class="font-script-var text-olive-800" style="font-size:2.6rem">{{ thanks.title }}</h3>
        <p class="text-[1.02rem] text-ink-mute mt-2">{{ thanks.msg }}</p>
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

const inputCls = 'w-full font-serif text-[1.02rem] text-ink bg-paper border border-line px-3.5 py-3 focus:border-olive-800 outline-none';
const btnLight  = 'w-full inline-flex items-center justify-center font-display text-[13px] tracking-[.2em] uppercase px-7 py-3.5 bg-green text-ivory transition hover:bg-olive-800';

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
