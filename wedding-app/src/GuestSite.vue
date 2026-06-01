<template>
  <div class="w-full min-h-screen overflow-x-hidden">

      <NavBar :active="active" :force-solid="true" />

      <HeroCover :wedding="w" />

      <DateCountdown :wedding="w" />

      <!-- Nuestra historia -->
      <section class="bg-cream text-ink py-20">
        <div class="wrap">
          <EditorialBlock :image="w.couple_photo_url || img('couple.jpg')" alt="Jennifer y Guido" frame="tl">
            <p class="text-[11px] tracking-[.34em] uppercase text-ink-mute font-semibold mb-3.5">{{ w.couple_name_1 }} &amp; {{ w.couple_name_2 }}</p>
            <span class="block font-script-var leading-[.8] mb-3.5 text-accent-var" style="font-size:clamp(2rem,4vw,3rem)">Nuestra historia</span>
            <p class="text-[1.06rem] leading-relaxed text-ink-mute">{{ w.story }}</p>
            <p v-if="w.invitation_text" class="text-[1.06rem] leading-relaxed text-ink-mute mt-3.5">{{ w.invitation_text }}</p>
          </EditorialBlock>
        </div>
      </section>

      <!-- Dónde -->
      <section class="bg-cream text-ink py-20">
        <div class="wrap">
          <EditorialBlock :image="w.venue_photo_url || img('venue.jpg')" alt="El lugar" frame="br" reverse>
            <p class="text-[11px] tracking-[.34em] uppercase text-ink-mute font-semibold mb-3.5">Dónde sucede todo</p>
            <span class="block font-script-var leading-[.8] mb-3.5 text-accent-var" style="font-size:clamp(2rem,4vw,3rem)">{{ w.venue }}</span>
            <p class="text-[1.06rem] leading-relaxed text-ink-mute">{{ w.venue_description }}</p>
          </EditorialBlock>
        </div>
      </section>

      <DaysEvents :events="state.events" />

      <ScheduleTimeline :events="state.events" />

      <SectionImageHeading title="Los Detalles" :image="w.details_photo_url || img('lake.jpg')" anchor="details" />

      <DressCode :wedding="w" />

      <!-- Mesa de regalos -->
      <section class="bg-cream text-ink py-20">
        <div class="wrap">
          <EditorialBlock :image="w.registry_photo_url || img('hands.jpg')" alt="Detalle" frame="tl">
            <h3 class="font-display font-medium tracking-[.12em] uppercase text-2xl">Mesa de</h3>
            <span class="block font-script-var leading-[.8] mb-3.5 text-accent-var" style="font-size:clamp(2.2rem,4vw,3.2rem)">Regalos</span>
            <p class="text-[1.06rem] leading-relaxed text-ink-mute">Tu presencia es nuestro mejor regalo. Si deseas tener un detalle con nosotros, te dejamos algunas opciones.</p>
            <div class="flex flex-col gap-3.5 mt-4">
              <div v-for="r in state.registry" :key="r.id" class="bg-cream border border-line px-[18px] py-4 flex justify-between items-center gap-3.5">
                <div class="flex-1 min-w-0">
                  <h5 class="font-serif font-semibold text-[1.12rem]">{{ r.store_name }}</h5>
                  <p class="text-[11px] tracking-[.14em] uppercase text-green mt-0.5">{{ r.description }}</p>
                </div>
                <a class="font-serif text-[12px] tracking-[.16em] uppercase text-accent-var no-underline border-b border-current pb-0.5 whitespace-nowrap"
                   :href="r.store_url" target="_blank" rel="noopener">Ver lista</a>
              </div>
            </div>
          </EditorialBlock>
        </div>
      </section>

      <!-- Viaje y hospedaje -->
      <section class="bg-forest-700 text-ondark py-20">
        <div class="wrap">
          <h3 v-reveal class="font-display font-medium tracking-[.12em] uppercase text-3xl text-center">Viaje &amp; Hospedaje</h3>
          <p v-reveal="0.05" class="text-[1.06rem] leading-relaxed text-ondark-soft text-center max-w-[48ch] mx-auto mt-3">
            Reservamos tarifas especiales para nuestros invitados. Menciona el código
            <b class="text-sage-300">{{ promo }}</b> al reservar.
          </p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <div v-for="(a, i) in state.accommodations" :key="a.id" v-reveal="i*0.05"
                 class="bg-white/[.06] border border-white/15 px-[18px] py-5 flex justify-between items-center gap-3.5">
              <div class="flex-1 min-w-0">
                <h5 class="font-serif font-semibold text-[1.12rem]">{{ a.hotel_name }}</h5>
                <p class="text-[.86rem] text-ondark-soft mt-0.5">{{ a.address }} · {{ a.distance_km }} km del lugar</p>
              </div>
              <a class="font-serif text-[12px] tracking-[.16em] uppercase text-sage-300 no-underline border-b border-current pb-0.5 whitespace-nowrap"
                 :href="a.url" target="_blank" rel="noopener">Reservar</a>
            </div>
          </div>
        </div>
      </section>

      <DirectionsMap :wedding="w" />

      <PhotoGallery :photos="state.gallery" />

      <GuestBook />

      <SectionImageHeading title="Preguntas Frecuentes" :image="img('forest.jpg')" anchor="faqs" min="220px" />
      <FaqList :faq="state.faq" />

      <RsvpForm :wedding="w" />

      <ClosingFooter :wedding="w" @rsvp="goRsvp" />
    </div>

    <!-- FAB confirmar -->
    <a href="#" @click.prevent="goRsvp"
       :class="['fixed z-[35] bottom-5 left-1/2 -translate-x-1/2 bg-forest-800 text-ondark border border-white/20 font-serif text-[12px] tracking-[.24em] uppercase px-6 py-3 rounded-full shadow-xl transition-all duration-500',
                showFab ? 'translate-y-0' : 'translate-y-[140px]']"
       style="transition-timing-function:cubic-bezier(.2,.8,.2,1)">Confirmar asistencia</a>

</template>

<script setup>
import { ref, computed, defineAsyncComponent, onMounted, onUnmounted } from 'vue';
import { useData } from '@/composables/useData.js';
import { scrollToId } from '@/composables/scroll.js';
// Above-fold: carga inmediata
import NavBar from '@/components/NavBar.vue';
import HeroCover from '@/components/HeroCover.vue';
import DateCountdown from '@/components/DateCountdown.vue';
import EditorialBlock from '@/components/EditorialBlock.vue';
import DaysEvents from '@/components/DaysEvents.vue';
import ScheduleTimeline from '@/components/ScheduleTimeline.vue';
import SectionImageHeading from '@/components/SectionImageHeading.vue';
import DressCode from '@/components/DressCode.vue';
// Below-fold: lazy load (chunks separados, no bloquean carga inicial)
const DirectionsMap  = defineAsyncComponent(() => import('@/components/DirectionsMap.vue'));
const PhotoGallery   = defineAsyncComponent(() => import('@/components/PhotoGallery.vue'));
const GuestBook      = defineAsyncComponent(() => import('@/components/GuestBook.vue'));
const FaqList        = defineAsyncComponent(() => import('@/components/FaqList.vue'));
const RsvpForm       = defineAsyncComponent(() => import('@/components/RsvpForm.vue'));
const ClosingFooter  = defineAsyncComponent(() => import('@/components/ClosingFooter.vue'));

const { state, load } = useData();
load();

const w = computed(() => state.wedding);
const img = (f) => '/img/' + f;
const promo = computed(() => (state.accommodations[0] && state.accommodations[0].promo_code) || 'JENNIFER&GUIDO');

function goRsvp() { scrollToId('rsvp'); }

const active = ref('home');
const showFab = ref(false);
const ids = ['home', 'details', 'schedule', 'gallery', 'guestbook', 'faqs', 'rsvp'];

// offsetTop no fuerza layout reflow (getBoundingClientRect sí lo hace en cada scroll)
let rafId = null;
function onScroll() {
  if (rafId) return;
  rafId = requestAnimationFrame(() => {
    rafId = null;
    const y = window.scrollY;
    showFab.value = y > window.innerHeight * 0.8;
    let cur = 'home';
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el && el.offsetTop - 120 <= y) cur = id;
    }
    active.value = cur;
  });
}
onMounted(() => { window.addEventListener('scroll', onScroll, { passive: true }); onScroll(); });
onUnmounted(() => { window.removeEventListener('scroll', onScroll); if (rafId) cancelAnimationFrame(rafId); });
</script>
