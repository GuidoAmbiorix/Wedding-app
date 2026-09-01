<template>
  <div class="w-full min-h-screen overflow-x-hidden">

      <NavBar :active="active" :wedding="w" />

      <HeroCover :wedding="w" />

      <SaveTheDate :wedding="w" />

      <InvitedIntro :wedding="w" />

      <DateCountdown :wedding="w" />

      <RsvpTeaser :wedding="w" @rsvp="goRsvp" />

      <LoveStoryTimeline :photos="state.gallery" />

      <!-- Venue -->
      <section id="venue" class="bg-forest-900 text-ondark py-20">
        <div class="wrap">
          <p class="text-center text-[11px] tracking-[.34em] uppercase text-ondark-soft mb-2">Venue</p>
          <span class="font-script-var block text-center leading-none mb-10" style="font-size:clamp(2rem,4vw,2.8rem)">{{ w.venue }}</span>
          <div class="flex flex-col md:flex-row gap-10 md:gap-16 items-center">
            <div v-if="state.venuePhotos.length" class="relative w-full md:w-[46%] flex-shrink-0" style="min-height:230px">
              <div v-for="(p, i) in state.venuePhotos.slice(0, 3)" :key="p.id"
                   class="absolute w-[62%] border-4 border-ivory shadow-xl"
                   :style="venuePhotoStyle(i)">
                <img :src="p.url" :alt="p.caption || w.venue" class="block w-full h-[160px] object-cover" loading="lazy">
              </div>
            </div>
            <img v-else :src="img('venue.jpg')" :alt="w.venue" class="w-full md:w-[46%] flex-shrink-0 h-auto" loading="lazy">
            <div class="w-full md:flex-1">
              <p class="text-[1.02rem] leading-relaxed text-ondark-soft">{{ w.venue_description }}</p>
            </div>
          </div>
        </div>
      </section>

      <DirectionsMap :wedding="w" />

      <ScheduleTimeline :events="state.events" />

      <DressCode :wedding="w" />

      <!-- Mesa de regalos -->
      <section class="bg-cream text-ink py-20">
        <div class="wrap">
          <EditorialBlock :image="w.registry_photo_url || img('hands.jpg')" alt="Detalle" frame="tl">
            <h3 class="font-display font-medium tracking-[.12em] uppercase text-2xl">Mesa de</h3>
            <span class="block font-script-var leading-[.8] mb-3.5 text-olive-800" style="font-size:clamp(2.2rem,4vw,3.2rem)">Regalos</span>
            <p class="text-[1.06rem] leading-relaxed text-ink-mute">Tu presencia es nuestro mejor regalo. Si deseas tener un detalle con nosotros, aquí puedes hacerlo por transferencia bancaria.</p>
            <div class="flex flex-col gap-3.5 mt-4">
              <div v-for="b in state.bankAccounts" :key="b.id" class="bg-cream border border-line px-[18px] py-4">
                <div class="flex justify-between items-start gap-3.5">
                  <div class="flex-1 min-w-0">
                    <h5 class="font-serif font-semibold text-[1.12rem]">{{ b.bank_name }}</h5>
                    <p class="text-[11px] tracking-[.14em] uppercase text-green mt-0.5">{{ b.holder_name }} · {{ b.account_type === 'corriente' ? 'Corriente' : 'Ahorros' }}</p>
                  </div>
                  <button type="button" @click="copyAccount(b)"
                    class="font-serif text-[11px] tracking-[.14em] uppercase text-olive-800 no-underline border-b border-current pb-0.5 whitespace-nowrap flex-shrink-0">
                    {{ copiedId === b.id ? '¡Copiado!' : 'Copiar' }}
                  </button>
                </div>
                <p class="font-display text-[1.15rem] tracking-[.04em] text-ink mt-2.5">{{ b.account_number }}</p>
                <p v-if="b.holder_id" class="text-[.8rem] text-ink-mute mt-1">Cédula/RNC: {{ b.holder_id }}</p>
                <p v-if="b.note" class="text-[.82rem] italic text-ink-mute mt-1.5">{{ b.note }}</p>
              </div>
              <p v-if="!state.bankAccounts.length" class="text-[.92rem] text-ink-mute italic">Pronto compartiremos los datos de la cuenta.</p>
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

</template>

<script setup>
import { ref, computed, defineAsyncComponent, onMounted, onUnmounted } from 'vue';
import { useData } from '@/composables/useData.js';
import { scrollToId } from '@/composables/scroll.js';
// Above-fold: carga inmediata
import NavBar from '@/components/NavBar.vue';
import HeroCover from '@/components/HeroCover.vue';
import SaveTheDate from '@/components/SaveTheDate.vue';
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

function goRsvp() { scrollToId('rsvp'); }

const VENUE_PHOTO_POS = [
  { top: '0',    left: '0',    rotate: '-6deg', z: 1 },
  { top: '55px', left: '34%',  rotate: '4deg',  z: 2 },
  { top: '110px',left: '4%',   rotate: '-3deg', z: 3 },
];
function venuePhotoStyle(i) {
  const p = VENUE_PHOTO_POS[i] || VENUE_PHOTO_POS[0];
  return { top: p.top, left: p.left, transform: `rotate(${p.rotate})`, zIndex: p.z };
}

const copiedId = ref(null);
async function copyAccount(b) {
  try {
    await navigator.clipboard.writeText(b.account_number);
    copiedId.value = b.id;
    setTimeout(() => { if (copiedId.value === b.id) copiedId.value = null; }, 2000);
  } catch (e) { /* clipboard no disponible, ignorar */ }
}

const active = ref('home');
const ids = ['home', 'save-the-date', 'venue', 'details', 'party', 'faqs', 'rsvp'];

// offsetTop no fuerza layout reflow (getBoundingClientRect sí lo hace en cada scroll)
let rafId = null;
function onScroll() {
  if (rafId) return;
  rafId = requestAnimationFrame(() => {
    rafId = null;
    const y = window.scrollY;
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
