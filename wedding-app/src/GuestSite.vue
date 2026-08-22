<template>
  <div class="w-full min-h-screen overflow-x-hidden">

      <NavBar :active="active" />

      <HeroCover :wedding="w" />

      <InvitedIntro :wedding="w" />

      <DateCountdown :wedding="w" />

      <RsvpTeaser :wedding="w" @rsvp="goRsvp" />

      <LoveStoryTimeline :photos="state.gallery" />

      <!-- Where to stay -->
      <section class="bg-forest-800 text-ondark py-20">
        <div class="wrap text-center">
          <span class="font-script-var block leading-none" style="font-size:clamp(1.8rem,3.5vw,2.4rem)">Where to</span>
          <h3 class="font-display tracking-[.2em] uppercase text-2xl mt-1">Stay</h3>
          <p v-reveal="0.05" class="text-[1.02rem] leading-relaxed text-ondark-soft text-center max-w-[48ch] mx-auto mt-5">
            Reservamos tarifas especiales para nuestros invitados. Menciona el código
            <b class="text-sage-300">{{ promo }}</b> al reservar.
          </p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-9 max-w-xl mx-auto">
            <a v-for="(a, i) in state.accommodations" :key="a.id" v-reveal="i*0.05"
               class="border border-white/25 px-5 py-6 text-center no-underline transition hover:bg-white/5"
               :href="a.url" target="_blank" rel="noopener">
              <h5 class="font-display tracking-[.1em] uppercase text-[.95rem]">{{ a.hotel_name }}</h5>
              <p class="text-[.8rem] text-ondark-soft mt-1.5">{{ a.address }} · {{ a.distance_km }} km del lugar</p>
            </a>
          </div>
        </div>
      </section>

      <!-- Venue -->
      <section id="venue" class="bg-forest-900 text-ondark py-20">
        <div class="wrap">
          <p class="text-center text-[11px] tracking-[.34em] uppercase text-ondark-soft mb-2">Venue</p>
          <span class="font-script-var block text-center leading-none mb-8" style="font-size:clamp(2rem,4vw,2.8rem)">{{ w.venue }}</span>
          <EditorialBlock :image="w.venue_photo_url || img('venue.jpg')" alt="El lugar" frame="tl">
            <p class="text-[1.02rem] leading-relaxed text-ondark-soft">{{ w.venue_description }}</p>
          </EditorialBlock>
        </div>
      </section>

      <DirectionsMap :wedding="w" />

      <ScheduleTimeline :events="state.events" :image="w.details_photo_url || img('lake.jpg')" />

      <DressCode :wedding="w" />

      <!-- Mesa de regalos -->
      <section class="bg-cream text-ink py-20">
        <div class="wrap">
          <EditorialBlock :image="w.registry_photo_url || img('hands.jpg')" alt="Detalle" frame="tl">
            <h3 class="font-display font-medium tracking-[.12em] uppercase text-2xl">Mesa de</h3>
            <span class="block font-script-var leading-[.8] mb-3.5 text-olive-800" style="font-size:clamp(2.2rem,4vw,3.2rem)">Regalos</span>
            <p class="text-[1.06rem] leading-relaxed text-ink-mute">Tu presencia es nuestro mejor regalo. Si deseas tener un detalle con nosotros, te dejamos algunas opciones.</p>
            <div class="flex flex-col gap-3.5 mt-4">
              <div v-for="r in state.registry" :key="r.id" class="bg-cream border border-line px-[18px] py-4 flex justify-between items-center gap-3.5">
                <div class="flex-1 min-w-0">
                  <h5 class="font-serif font-semibold text-[1.12rem]">{{ r.store_name }}</h5>
                  <p class="text-[11px] tracking-[.14em] uppercase text-green mt-0.5">{{ r.description }}</p>
                </div>
                <a class="font-serif text-[12px] tracking-[.16em] uppercase text-olive-800 no-underline border-b border-current pb-0.5 whitespace-nowrap"
                   :href="r.store_url" target="_blank" rel="noopener">Ver lista</a>
              </div>
            </div>
          </EditorialBlock>
        </div>
      </section>

      <WeddingParty :members="state.weddingParty" />

      <PhotoGallery :photos="state.gallery" />

      <GuestBook />

      <FaqList :faq="state.faq" />

      <RsvpForm :wedding="w" />

      <ClosingFooter :wedding="w" :photos="state.gallery.slice(0, 3)" @rsvp="goRsvp" />
    </div>

    <!-- FAB confirmar -->
    <a href="#" @click.prevent="goRsvp"
       :class="['fixed z-[35] bottom-5 left-1/2 -translate-x-1/2 bg-forest-900 text-ondark border border-white/20 font-display text-[12px] tracking-[.22em] uppercase px-6 py-3 shadow-xl transition-all duration-500',
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
import InvitedIntro from '@/components/InvitedIntro.vue';
import DateCountdown from '@/components/DateCountdown.vue';
import RsvpTeaser from '@/components/RsvpTeaser.vue';
import EditorialBlock from '@/components/EditorialBlock.vue';
// Below-fold: lazy load (chunks separados, no bloquean carga inicial)
const LoveStoryTimeline = defineAsyncComponent(() => import('@/components/LoveStoryTimeline.vue'));
const DirectionsMap     = defineAsyncComponent(() => import('@/components/DirectionsMap.vue'));
const ScheduleTimeline  = defineAsyncComponent(() => import('@/components/ScheduleTimeline.vue'));
const DressCode         = defineAsyncComponent(() => import('@/components/DressCode.vue'));
const WeddingParty      = defineAsyncComponent(() => import('@/components/WeddingParty.vue'));
const PhotoGallery      = defineAsyncComponent(() => import('@/components/PhotoGallery.vue'));
const GuestBook         = defineAsyncComponent(() => import('@/components/GuestBook.vue'));
const FaqList           = defineAsyncComponent(() => import('@/components/FaqList.vue'));
const RsvpForm          = defineAsyncComponent(() => import('@/components/RsvpForm.vue'));
const ClosingFooter     = defineAsyncComponent(() => import('@/components/ClosingFooter.vue'));

const { state, load } = useData();
load();

const w = computed(() => state.wedding);
const img = (f) => '/img/' + f;
const promo = computed(() => (state.accommodations[0] && state.accommodations[0].promo_code) || 'JENNIFER&GUIDO');

function goRsvp() { scrollToId('rsvp'); }

const active = ref('home');
const showFab = ref(false);
const ids = ['home', 'venue', 'details', 'party', 'faqs', 'rsvp'];

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
