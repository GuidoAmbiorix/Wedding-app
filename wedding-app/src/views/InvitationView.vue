<template>
  <div class="stage relative flex justify-center min-h-screen"
       style="background:linear-gradient(180deg,rgba(20,30,20,.55),rgba(30,42,30,.7)),url('/img/forest.jpg') center/cover">
    <div class="relative z-10 w-full min-h-screen bg-cream overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,.45)]" style="max-width:560px">

      <!-- Nav mínima -->
      <nav class="flex items-center justify-center px-6 py-4 bg-forest-900/90 backdrop-blur">
        <span class="font-script-var text-3xl text-ondark">J<span class="text-[.7em] opacity-70">&</span>G</span>
      </nav>

      <!-- Loading -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-32 text-ink-mute gap-4">
        <div class="w-8 h-8 border-4 border-line border-t-accent-var rounded-full animate-spin"></div>
        <p class="text-sm tracking-widest uppercase">Cargando tu invitación…</p>
      </div>

      <!-- No encontrado -->
      <div v-else-if="!guest" class="text-center px-8 py-20">
        <p class="font-script-var text-[3rem] text-accent-var leading-none mb-4">Oops</p>
        <p class="text-ink-mute text-[1.06rem]">No encontramos esta invitación. Verifica el enlace o contacta a los novios.</p>
        <router-link to="/" class="inline-block mt-8 font-serif text-[13px] tracking-[.22em] uppercase border-b border-accent-var text-accent-var pb-0.5">
          Ver sitio de la boda →
        </router-link>
      </div>

      <!-- Invitación encontrada -->
      <template v-else>

        <!-- Hero -->
        <section class="bg-forest-800 text-ondark text-center px-8 py-16 relative overflow-hidden">
          <div class="absolute inset-0 opacity-10" style="background:url('/img/forest.jpg') center/cover"></div>
          <div class="relative">
            <p class="text-[11px] tracking-[.34em] uppercase text-ondark-soft mb-3">Tienes una invitación especial</p>
            <h1 class="font-script-var leading-[.88] text-white drop-shadow-[0_2px_20px_rgba(0,0,0,.5)]"
                style="font-size:clamp(2.6rem,13vw,4rem)">
              {{ displayName }}
            </h1>
            <div class="w-12 h-px bg-ondark/30 mx-auto my-5"></div>
            <p class="text-ondark-soft text-[1.04rem] leading-relaxed max-w-[28ch] mx-auto">
              <b class="text-ondark">Jennifer &amp; Guido</b> te invitan a celebrar su boda el
              <b class="text-ondark">{{ weddingDate }}</b>.
            </p>

            <!-- Cupos -->
            <div class="flex justify-center gap-6 mt-7">
              <div v-if="totalAdults > 0" class="text-center">
                <div class="font-display text-[2.2rem] font-medium text-ondark leading-none">{{ totalAdults }}</div>
                <p class="text-[10px] tracking-[.22em] uppercase text-ondark-soft mt-1">{{ totalAdults === 1 ? 'adulto' : 'adultos' }}</p>
              </div>
              <div v-if="totalChildren > 0" class="w-px bg-ondark/20 self-stretch mx-2"></div>
              <div v-if="totalChildren > 0" class="text-center">
                <div class="font-display text-[2.2rem] font-medium text-ondark leading-none">{{ totalChildren }}</div>
                <p class="text-[10px] tracking-[.22em] uppercase text-ondark-soft mt-1">{{ totalChildren === 1 ? 'niño' : 'niños' }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Detalles del evento -->
        <section class="bg-cream px-8 py-10 border-b border-line">
          <div class="flex flex-col gap-4">
            <div class="flex items-start gap-4">
              <div class="w-8 h-8 rounded-full bg-forest-700/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-accent-var" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
              <div>
                <p class="text-[11px] tracking-[.2em] uppercase text-ink-mute mb-0.5">Fecha</p>
                <p class="font-serif font-semibold text-ink text-[1.06rem]">{{ weddingDate }}</p>
                <p class="text-ink-mute text-sm">Ceremonia a las 5:00 PM</p>
              </div>
            </div>
            <div class="flex items-start gap-4">
              <div class="w-8 h-8 rounded-full bg-forest-700/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-accent-var" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
              <div>
                <p class="text-[11px] tracking-[.2em] uppercase text-ink-mute mb-0.5">Lugar</p>
                <p class="font-serif font-semibold text-ink text-[1.06rem]">{{ wedding.venue }}</p>
                <p class="text-ink-mute text-sm">{{ wedding.venue_address }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- RSVP -->
        <section class="bg-forest-700 text-ondark px-8 py-12">
          <h2 class="font-script-var text-center leading-[.9] mb-2" style="font-size:clamp(2.4rem,12vw,3.6rem)">
            ¿Podrán acompañarnos?
          </h2>
          <p class="text-center text-ondark-soft text-[.94rem] mb-8">
            Por favor confirma antes del {{ deadline }}.
          </p>

          <!-- Ya respondió -->
          <div v-if="alreadyRsvped" class="text-center animate-fade">
            <div class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold mb-4"
                 :class="existingRsvp.status === 'attending'
                   ? 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/40'
                   : 'bg-red-500/20 text-red-300 ring-1 ring-red-400/40'">
              {{ existingRsvp.status === 'attending' ? '✓ Ya confirmaron su asistencia' : '✗ Ya indicaron que no podrán ir' }}
            </div>
            <p class="text-ondark-soft text-sm mb-6">¿Cambió algo? Pueden actualizar la respuesta.</p>
            <button @click="alreadyRsvped = false" class="font-serif text-[13px] tracking-[.22em] uppercase border-b border-white/50 text-ondark pb-0.5">
              Actualizar respuesta
            </button>
          </div>

          <!-- Formulario -->
          <form v-else-if="step === 1" @submit.prevent="send" class="animate-fade">
            <!-- Opciones asistencia -->
            <div class="flex gap-3 mb-6">
              <label class="flex-1 cursor-pointer">
                <input type="radio" v-model="form.status" value="attending" class="sr-only peer">
                <span class="flex flex-col items-center gap-2 py-4 border border-white/20 rounded-xl text-center transition peer-checked:bg-sage-400/20 peer-checked:border-sage-400">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span class="text-xs tracking-[.14em] uppercase font-semibold">Sí, allí estaremos</span>
                </span>
              </label>
              <label class="flex-1 cursor-pointer">
                <input type="radio" v-model="form.status" value="declined" class="sr-only peer">
                <span class="flex flex-col items-center gap-2 py-4 border border-white/20 rounded-xl text-center transition peer-checked:bg-red-500/20 peer-checked:border-red-400/60">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span class="text-xs tracking-[.14em] uppercase font-semibold">No podremos ir</span>
                </span>
              </label>
            </div>

            <div v-if="form.status === 'attending'" class="space-y-5 mb-5">
              <!-- Menú por miembro (si hay members definidos) -->
              <div v-if="members.length > 0">
                <p class="text-[11px] tracking-[.2em] uppercase text-ondark-soft mb-3">Elección de menú por persona</p>
                <div v-for="(m, i) in form.membersData" :key="i" class="mb-4">
                  <p class="text-sm font-semibold text-ondark mb-1.5">{{ m.name }}</p>
                  <div class="grid grid-cols-2 gap-2 mb-1.5">
                    <select v-model="m.meal_choice" :class="inputCls" class="text-sm">
                      <option value="">Menú…</option>
                      <option v-for="ml in meals" :key="ml.v" :value="ml.v">{{ ml.l }}</option>
                    </select>
                    <input v-model="m.dietary" type="text" placeholder="Restricción (opcional)" :class="inputCls" class="text-sm">
                  </div>
                </div>
              </div>

              <!-- Menú general (si no hay members individuales) -->
              <div v-else>
                <label class="block text-[11px] tracking-[.2em] uppercase text-ondark-soft mb-2">Elección de menú</label>
                <select v-model="form.meal_choice" :class="inputCls">
                  <option value="">Selecciona…</option>
                  <option v-for="m in meals" :key="m.v" :value="m.v">{{ m.l }}</option>
                </select>
              </div>
            </div>

            <!-- Mensaje -->
            <div class="mb-5">
              <label class="block text-[11px] tracking-[.2em] uppercase text-ondark-soft mb-2">Un mensaje para los novios (opcional)</label>
              <textarea v-model="form.message" :class="inputCls" rows="3" class="resize-none" placeholder="¡Felicidades!…"></textarea>
            </div>

            <p v-if="err" class="text-[#f0b9b0] text-sm italic mb-3">{{ err }}</p>

            <button type="submit" :disabled="sending"
                    class="w-full flex items-center justify-center gap-2 font-serif font-medium text-[13px] tracking-[.22em] uppercase px-7 py-4 border border-white/60 text-ondark rounded-full transition hover:bg-white hover:text-forest-800 disabled:opacity-50">
              <svg v-if="sending" class="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Enviar confirmación
            </button>
          </form>

          <!-- Gracias -->
          <div v-else class="text-center animate-fade">
            <h3 class="font-script-var mb-3" style="font-size:3rem">
              {{ form.status === 'attending' ? '¡Nos vemos pronto!' : 'Los extrañaremos' }}
            </h3>
            <p class="text-ondark text-[1.06rem] max-w-[30ch] mx-auto">
              {{ form.status === 'attending'
                ? `Gracias, ${displayName}. ¡No podemos esperar a celebrar con ustedes!`
                : `Gracias por avisarnos. Lamentamos que no puedan acompañarnos.` }}
            </p>
            <p class="text-ondark-soft text-sm mt-3">El equipo organizador confirmará su asistencia en breve.</p>
            <router-link to="/"
              class="inline-block mt-8 font-serif text-[13px] tracking-[.22em] uppercase border-b border-white/50 text-ondark pb-0.5">
              Ver sitio completo →
            </router-link>
          </div>
        </section>

        <!-- Footer -->
        <footer class="bg-forest-900 text-ondark-soft text-center px-8 py-8">
          <div class="font-script-var text-3xl text-ondark mb-1">J&amp;G</div>
          <p class="text-[11px] tracking-[.14em] uppercase opacity-60">Jennifer &amp; Guido · 15.11.2026</p>
        </footer>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { supabase, isLive } from '@/lib/supabase.js';
import { useData } from '@/composables/useData.js';

const route = useRoute();
const { state, load, submitRsvp } = useData();
load();

const loading       = ref(true);
const guest         = ref(null);
const sending       = ref(false);
const step          = ref(1);
const err           = ref('');
const alreadyRsvped = ref(false);
const existingRsvp  = ref(null);

const form = reactive({
  status: '', meal_choice: '', message: '',
  membersData: [],  // [{name, meal_choice, dietary}]
});

const meals = [
  { v:'beef', l:'Res' }, { v:'chicken', l:'Pollo' },
  { v:'fish', l:'Pescado' }, { v:'vegetarian', l:'Vegetariano' }, { v:'vegan', l:'Vegano' },
];
const inputCls = 'w-full font-serif text-[1.04rem] text-ink bg-cream border border-line px-3.5 py-3 rounded-sm focus:border-accent-var outline-none';

const wedding     = computed(() => state.wedding);
const displayName = computed(() => guest.value?.guest_display_name || guest.value?.first_name || '');
const totalAdults   = computed(() => guest.value?.adults_count   ?? 1);
const totalChildren = computed(() => guest.value?.children_count ?? 0);
const members       = computed(() => guest.value?.members || []);

const weddingDate = computed(() => {
  const d = new Date((state.wedding.wedding_date || '2026-11-15') + 'T00:00:00');
  const M = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  return `${d.getDate()} de ${M[d.getMonth()]} de ${d.getFullYear()}`;
});
const deadline = computed(() => {
  const d = new Date((state.wedding.rsvp_deadline || '2026-10-01') + 'T00:00:00');
  const M = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  return `${d.getDate()} de ${M[d.getMonth()]}`;
});

async function fetchGuest() {
  const token = route.params.token;
  if (!token) { loading.value = false; return; }

  if (isLive) {
    const { data } = await supabase.from('guests').select('*').eq('rsvp_token', token).single();
    guest.value = data || null;
    if (guest.value) {
      // Sin auto-tracking — el admin actualiza el status manualmente
      const { data: rsvp } = await supabase.from('rsvps').select('*').eq('guest_id', guest.value.id).maybeSingle();
      if (rsvp && rsvp.status !== 'pending') {
        existingRsvp.value = rsvp;
        alreadyRsvped.value = true;
      }
    }
  } else {
    guest.value = state.guests.find(g => g.rsvp_token === token) || null;
    if (guest.value) {
      const rsvp = state.rsvps?.find(r => r.guest_id === guest.value.id);
      if (rsvp && rsvp.status !== 'pending') {
        existingRsvp.value = rsvp;
        alreadyRsvped.value = true;
      }
    }
  }

  // Inicializar membersData con los miembros del guest
  if (guest.value?.members?.length) {
    form.membersData = guest.value.members.map(m => ({
      name: m.name, meal_choice: m.meal_choice || '', dietary: m.dietary || '',
    }));
  }

  loading.value = false;
}

async function send() {
  if (!form.status) { err.value = 'Por favor elige una opción.'; return; }
  err.value = '';
  sending.value = true;
  try {
    // Guarda en rsvps — no cambia guests.status (el admin lo hace manualmente)
    await submitRsvp(guest.value, {
      status: form.status,
      meal_choice: form.meal_choice || null,
      message: form.message || null,
      members_responses: members.value.length ? form.membersData : [],
    });
    step.value = 2;
  } catch (e) {
    err.value = 'Hubo un error. Por favor intenta de nuevo.';
  } finally {
    sending.value = false;
  }
}

onMounted(fetchGuest);
</script>
