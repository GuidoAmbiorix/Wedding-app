<template>
  <section id="guestbook" class="bg-ivory text-ink px-8 py-16">
    <h2 v-reveal class="font-script-var text-center text-accent-var leading-[.92]" style="font-size:clamp(3rem,15vw,4.4rem)">Libro de Visitas</h2>

    <div class="flex flex-col gap-3.5 my-6">
      <div v-for="n in approved" :key="n.id" v-reveal class="bg-cream border border-line px-[18px] py-4">
        <p class="italic text-[1.04rem] leading-snug text-ink mb-2.5">«{{ n.message }}»</p>
        <cite class="not-italic text-[11px] tracking-[.18em] uppercase text-accent-var">— {{ n.guest_name }}</cite>
      </div>
      <p v-if="justSent" class="text-center text-sm italic text-ink-mute">¡Gracias! Tu mensaje aparecerá tras la aprobación de los novios.</p>
    </div>

    <button v-if="!showForm && !justSent" v-reveal
            class="w-full inline-flex items-center justify-center font-display text-[13px] tracking-[.2em] uppercase px-7 py-3.5 border border-olive-800 text-olive-800 transition hover:bg-olive-800 hover:text-ivory"
            @click="showForm = true">Dejar un mensaje</button>

    <form v-if="showForm" class="mt-2" @submit.prevent="submit">
      <div class="mb-4">
        <label class="block text-[12px] tracking-[.08em] italic text-ink-mute mb-2">Tu nombre</label>
        <input v-model="name" type="text" required class="w-full font-serif text-[1.02rem] bg-paper border border-line px-3.5 py-3 focus:border-olive-800 outline-none">
      </div>
      <div class="mb-4">
        <label class="block text-[12px] tracking-[.08em] italic text-ink-mute mb-2">Mensaje</label>
        <textarea v-model="message" required class="w-full font-serif text-[1.02rem] bg-paper border border-line px-3.5 py-3 min-h-[90px] focus:border-olive-800 outline-none resize-none"></textarea>
      </div>
      <button type="submit"
              class="w-full inline-flex items-center justify-center font-display text-[13px] tracking-[.2em] uppercase px-7 py-3.5 bg-green text-ivory transition hover:bg-olive-800">
        Publicar mensaje
      </button>
    </form>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useData } from '@/composables/useData.js';

const { state, addGuestbook } = useData();
const approved  = computed(() => state.guestbook.filter(n => n.approved));
const showForm  = ref(false);
const justSent  = ref(false);
const name      = ref('');
const message   = ref('');

async function submit() {
  if (!name.value.trim() || !message.value.trim()) return;
  await addGuestbook(name.value.trim(), message.value.trim());
  name.value = ''; message.value = '';
  showForm.value = false; justSent.value = true;
}
</script>
