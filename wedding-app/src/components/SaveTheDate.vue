<template>
  <section id="save-the-date" class="std-section relative py-20 px-6 text-center overflow-hidden">
    <svg class="vine vine-l" viewBox="0 0 160 400" fill="none" stroke="#8a8354" stroke-width="1">
      <path d="M10 0 C20 40 5 60 15 100 C25 140 5 160 15 200"/>
      <ellipse cx="18" cy="60" rx="6" ry="10"/><ellipse cx="12" cy="120" rx="6" ry="10"/>
    </svg>
    <svg class="vine vine-r" viewBox="0 0 160 400" fill="none" stroke="#8a8354" stroke-width="1">
      <path d="M10 0 C20 40 5 60 15 100 C25 140 5 160 15 200"/>
      <ellipse cx="18" cy="60" rx="6" ry="10"/><ellipse cx="12" cy="120" rx="6" ry="10"/>
    </svg>

    <p class="eyebrow">No te lo pierdas</p>
    <h2 class="font-script-var std-title">Guarda la fecha</h2>
    <p class="sub">Rompe el sello y deja que el bosque revele la fecha.</p>

    <div class="envelope-zone">
      <div class="envelope" :class="{ cracking, open: envOpen, used }" @click="reveal">
        <div class="env-back"></div>
        <div class="env-pocket"></div>
        <div class="card-peek"></div>
        <div class="env-flap"></div>
        <div class="seal-wrap">
          <div class="seal-glow"></div>
          <div class="seal"><div class="inner">{{ initials }}</div></div>
          <div class="shard" v-for="i in 5" :key="i"></div>
        </div>
      </div>
    </div>

    <div class="hint" :style="{ opacity: hintVisible ? 1 : 0 }">
      Toca el sello
      <svg width="14" height="10" viewBox="0 0 14 10" fill="none" stroke="#6e6552" stroke-width="1.4"><path d="M1 1l6 7 6-7"/></svg>
    </div>

    <!-- Bosque encantado -->
    <div class="forest-root" :class="{ active, shake: shaking, open: forestOpen, burst }">
      <div class="forest-dim"></div>

      <!-- Ráfaga de hojas -->
      <div class="leaf-burst" v-for="l in burstLeaves" :key="'b'+l.id"
           :style="{ left: l.left, '--dur': l.dur, '--delay': l.delay, '--drift': l.drift, '--spin': l.spin, background: `linear-gradient(135deg, ${l.color}, ${l.color}bb)` }"></div>

      <div class="glade">
        <div class="firefly" style="left:22%; top:30%; --dur:5.2s; --delay:.2s"></div>
        <div class="firefly" style="left:70%; top:22%; --dur:6.1s; --delay:1.1s"></div>
        <div class="firefly" style="left:78%; top:60%; --dur:4.8s; --delay:.6s"></div>
        <div class="firefly" style="left:16%; top:65%; --dur:5.7s; --delay:1.6s"></div>
        <div class="firefly" style="left:50%; top:15%; --dur:6.4s; --delay:.9s"></div>
        <div class="firefly" style="left:85%; top:40%; --dur:5.4s; --delay:.3s"></div>

        <div class="leaf-fall" style="left:10%; --dur:8s;  --delay:0s;   --drift:60px;"></div>
        <div class="leaf-fall" style="left:30%; --dur:9.5s;--delay:1.5s; --drift:-40px;"></div>
        <div class="leaf-fall" style="left:55%; --dur:7.2s;--delay:.8s;  --drift:50px;"></div>
        <div class="leaf-fall" style="left:72%; --dur:10s; --delay:2.2s; --drift:-30px;"></div>
        <div class="leaf-fall" style="left:88%; --dur:8.6s; --delay:.4s; --drift:35px;"></div>
        <div class="leaf-fall" style="left:45%; --dur:9s;  --delay:3s;   --drift:-55px;"></div>

        <div class="magic-burst"></div>

        <div class="sparkle gold" style="left:38%; top:28%; --dur:2.1s; --delay:.1s"></div>
        <div class="sparkle blue" style="left:64%; top:24%; --dur:2.6s; --delay:.6s"></div>
        <div class="sparkle gold" style="left:70%; top:55%; --dur:2.3s; --delay:1.1s"></div>
        <div class="sparkle blue" style="left:30%; top:60%; --dur:2.8s; --delay:.3s"></div>
        <div class="sparkle gold" style="left:50%; top:70%; --dur:2.2s; --delay:1.4s"></div>
        <div class="sparkle blue" style="left:20%; top:38%; --dur:2.5s; --delay:.9s"></div>
        <div class="sparkle gold" style="left:80%; top:35%; --dur:2.4s; --delay:1.7s"></div>

        <div class="std-card">
          <button class="modal-close" @click="close">&times;</button>

          <template v-if="wedding.save_the_date_image_url">
            <img :src="wedding.save_the_date_image_url" :alt="names" class="std-image" />
          </template>
          <template v-else>
            <svg class="std-flourish" viewBox="0 0 60 30" fill="none" stroke="#3a3623" stroke-width="1">
              <path d="M30 28 C30 18 30 10 30 4"/>
              <path d="M30 12 C22 8 16 4 18 0"/>
              <path d="M30 12 C38 8 44 4 42 0"/>
            </svg>
            <p class="eyebrow" style="margin-bottom:16px">Guarda la fecha</p>
            <div class="monogram">{{ initials }}</div>
            <div class="script-big">{{ wedding.couple_name_1 }}</div>
            <div class="amp">&amp;</div>
            <div class="script-big">{{ wedding.couple_name_2 }}</div>
            <div class="divider"></div>
            <div class="date-big">{{ longDate }}</div>
            <div class="venue">{{ wedding.venue }}</div>
            <div class="divider"></div>
            <p class="foot">La invitación con todos los detalles llegará próximamente</p>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue';

const props = defineProps({ wedding: { type: Object, default: () => ({}) } });

const names = computed(() => `${props.wedding.couple_name_1} & ${props.wedding.couple_name_2}`);
const initials = computed(() => {
  const a = (props.wedding.couple_name_1 || 'J').trim().charAt(0);
  const b = (props.wedding.couple_name_2 || 'G').trim().charAt(0);
  return `${a}&${b}`.toUpperCase();
});
const MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
const longDate = computed(() => {
  if (!props.wedding.wedding_date) return '';
  const d = new Date(props.wedding.wedding_date + 'T00:00:00');
  return `${d.getDate()} de ${MESES[d.getMonth()]}, ${d.getFullYear()}`;
});

const cracking    = ref(false);
const envOpen     = ref(false);
const used        = ref(false);
const hintVisible = ref(true);
const active      = ref(false);
const shaking     = ref(false);
const forestOpen  = ref(false);
const burst       = ref(false);
const burstLeaves = ref([]);

const FOREST_LEAF_COLORS = ['#3a5228', '#4f6e38', '#6b8f4a', '#8a8354', '#c9a24b', '#8a6a24'];

function makeBurstLeaves() {
  const leaves = [];
  for (let i = 0; i < 18; i++) {
    leaves.push({
      id: i,
      left: `${Math.random()*100}%`,
      dur: `${(1.3 + Math.random()*1.1).toFixed(2)}s`,
      delay: `${(Math.random()*.8).toFixed(2)}s`,
      drift: `${Math.round((Math.random() < .5 ? -1 : 1) * (30 + Math.random()*90))}px`,
      spin: `${Math.round(300 + Math.random()*400)}deg`,
      color: FOREST_LEAF_COLORS[Math.floor(Math.random() * FOREST_LEAF_COLORS.length)],
    });
  }
  return leaves;
}

let timers = [];
function after(ms, fn) { timers.push(setTimeout(fn, ms)); }
function clearTimers() { timers.forEach(clearTimeout); timers = []; }

function reveal() {
  if (envOpen.value) return;
  clearTimers();
  cracking.value = true;
  hintVisible.value = false;
  after(250, () => { envOpen.value = true; });
  after(700, () => { active.value = true; shaking.value = true; burstLeaves.value = makeBurstLeaves(); });
  after(900, () => { used.value = true; });
  after(1500, () => { shaking.value = false; forestOpen.value = true; });
  after(1650, () => { burst.value = true; });
}

function close() {
  clearTimers();
  forestOpen.value = false;
  burst.value = false;
  shaking.value = true;
  burstLeaves.value = makeBurstLeaves();
  after(900, () => {
    shaking.value = false;
    active.value = false;
    envOpen.value = false;
    cracking.value = false;
    used.value = false;
    hintVisible.value = true;
    burstLeaves.value = [];
  });
}

onUnmounted(clearTimers);
</script>

<style scoped>
.std-section{
  --ivory:var(--color-ivory, #f8f3e7); --cream:var(--color-cream, #f3ecdc); --paper:#ece3cd;
  --olive-800:var(--color-olive-800, #3a3623); --olive-600:#6b6640; --sage:#8a8354;
  --gold:#c9a24b; --gold-dark:#8a6a24; --gold-glow:#e8c877;
  --forest-1:#0e1a0d; --forest-2:#1c3018; --forest-3:#2c4622;
  --ink:#2a2620; --ink-mute:#6e6552; --line:#c9bd9c;
  background:
    radial-gradient(ellipse 70% 50% at 50% 0%, #eee3c4 0%, transparent 60%),
    linear-gradient(180deg, var(--cream), var(--ivory));
}

.vine{ position:absolute; opacity:.55; width:130px; }
.vine-l{ left:0; top:10px; transform:scaleX(-1); }
.vine-r{ right:0; top:10px; }

.eyebrow{ font-family:var(--font-display); font-size:12px; letter-spacing:.32em; text-transform:uppercase; color:var(--ink-mute); margin-bottom:10px; }
.std-title{ display:block; color:var(--olive-800); font-size:clamp(2.4rem,6vw,3.4rem); line-height:1; margin-bottom:14px; }
.sub{ color:var(--ink-mute); max-width:38ch; font-size:1.02rem; line-height:1.65; margin:0 auto 46px; }

.envelope-zone{ perspective:1400px; }
.envelope{
  position:relative; width:250px; height:168px; margin:0 auto; cursor:pointer;
  filter:drop-shadow(0 18px 30px rgba(40,30,10,.28));
}
.envelope.used{ pointer-events:none; }
.env-back{ position:absolute; inset:0; border-radius:2px; background:linear-gradient(160deg, #f6f0dd, var(--paper)); border:1px solid #ddd0ab; }
.env-pocket{
  position:absolute; left:0; right:0; bottom:0; height:118px;
  background:linear-gradient(180deg, transparent, rgba(0,0,0,.05));
  border-top:1px solid #ddd0ab;
  clip-path:polygon(0 0, 50% 46%, 100% 0, 100% 100%, 0 100%);
}
.env-flap{
  position:absolute; top:0; left:0; width:100%; height:84px;
  clip-path:polygon(0 0, 100% 0, 50% 92%);
  background:linear-gradient(200deg, #efe6ca, #e2d4a8);
  transform-origin:50% 0%; transform-style:preserve-3d;
  transition:transform 1s cubic-bezier(.65,0,.35,1);
  z-index:4;
}
.envelope.open .env-flap{ transform:rotateX(-172deg); }
.card-peek{ position:absolute; left:8px; right:8px; bottom:8px; height:120px; border-radius:1px; background:var(--ivory); box-shadow:0 -2px 8px rgba(0,0,0,.08); z-index:2; }

.seal-wrap{ position:absolute; top:38px; left:50%; transform:translate(-50%,-50%); width:74px; height:74px; z-index:6; }
.seal-glow{
  position:absolute; inset:-10px; border-radius:50%;
  background:radial-gradient(circle, rgba(232,200,119,.55), rgba(232,200,119,0) 70%);
  animation:seal-breathe 2.6s ease-in-out infinite;
  pointer-events:none;
}
.envelope.cracking .seal-glow, .envelope.open .seal-glow{ animation:none; opacity:0; }
@keyframes seal-breathe{
  0%,100%{ transform:scale(.85); opacity:.55; }
  50%{ transform:scale(1.25); opacity:.95; }
}
.seal{
  position:relative;
  width:100%; height:100%; border-radius:50%;
  background:radial-gradient(circle at 32% 26%, #e6c17a, var(--gold) 45%, var(--gold-dark) 100%);
  box-shadow:0 8px 16px rgba(0,0,0,.3), inset 0 2px 5px rgba(255,255,255,.4), inset 0 -5px 9px rgba(0,0,0,.28);
  display:flex; align-items:center; justify-content:center;
  transition:transform .5s cubic-bezier(.34,1.56,.64,1), opacity .4s ease;
  animation:seal-nudge 2.6s ease-in-out infinite;
}
.envelope.cracking .seal, .envelope.open .seal{ animation:none; }
@keyframes seal-nudge{
  0%,72%,100%{ transform:scale(1) rotate(0deg); }
  84%{ transform:scale(1.08) rotate(-3deg); }
}
.seal .inner{ width:80%; height:80%; border-radius:50%; border:1.2px solid rgba(58,54,35,.5); display:flex; align-items:center; justify-content:center; font-family:var(--font-script,'Pinyon Script',cursive); color:#3a3623; font-size:1.3rem; line-height:1; }
.envelope:not(.open):hover .seal{ transform:scale(1.05) rotate(-2deg); }

.shard{ position:absolute; top:50%; left:50%; width:16px; height:16px; margin:-8px; background:radial-gradient(circle at 30% 25%, #e6c17a, var(--gold-dark)); border-radius:3px; opacity:0; pointer-events:none; }
.envelope.cracking .seal{ transform:scale(.4) rotate(12deg); opacity:0; transition:transform .35s ease-in, opacity .3s ease-in .05s; }
.envelope.cracking .shard{ animation:fly .55s ease-out forwards; }
.shard:nth-child(1){ --tx:-46px; --ty:-38px; --r:-70deg; }
.shard:nth-child(2){ --tx:44px;  --ty:-42px; --r:60deg;  }
.shard:nth-child(3){ --tx:-52px; --ty:30px;  --r:140deg; }
.shard:nth-child(4){ --tx:50px;  --ty:34px;  --r:-120deg;}
.shard:nth-child(5){ --tx:2px;   --ty:-56px; --r:20deg;  }
@keyframes fly{ 0%{ opacity:1; transform:translate(0,0) rotate(0deg) scale(1); } 100%{ opacity:0; transform:translate(var(--tx),var(--ty)) rotate(var(--r)) scale(.4); } }

.hint{ margin-top:20px; font-family:var(--font-display); font-size:11px; letter-spacing:.22em; text-transform:uppercase; color:var(--ink-mute); transition:opacity .3s; }
.hint svg{ display:block; margin:6px auto 0; animation:bob 1.8s ease-in-out infinite; }
@keyframes bob{ 0%,100%{ transform:translateY(0) } 50%{ transform:translateY(5px) } }

.forest-root{ position:fixed; inset:0; z-index:90; pointer-events:none; }
.forest-root.active{ pointer-events:auto; }

.forest-dim{
  position:absolute; inset:0;
  background:radial-gradient(ellipse 80% 70% at 50% 50%, rgba(10,16,8,.55), rgba(6,10,5,.82));
  opacity:0; transition:opacity .5s ease;
}
.forest-root.active .forest-dim{ opacity:1; }

/* Ráfaga de hojas cayendo */
.leaf-burst{
  position:absolute; top:-6%; width:13px; height:17px; border-radius:70% 10% 70% 10%;
  background:linear-gradient(135deg, var(--gold-glow), var(--olive-600));
  opacity:0;
}
.forest-root.shake .leaf-burst{ animation:leaf-burst-fly var(--dur,1.4s) ease-out forwards; animation-delay:var(--delay,0s); }
@keyframes leaf-burst-fly{
  0%{ opacity:1; transform:translate(0,0) rotate(0deg); }
  100%{ opacity:0; transform:translate(var(--drift,60px), 90vh) rotate(var(--spin,380deg)); }
}

.glade{
  position:absolute; inset:0; display:flex; align-items:center; justify-content:center;
  opacity:0; transition:opacity .6s ease;
}
.forest-root.open .glade{ opacity:1; }

.firefly{
  position:absolute; width:5px; height:5px; border-radius:50%;
  background:var(--gold-glow); box-shadow:0 0 8px 3px rgba(232,200,119,.9), 0 0 18px 8px rgba(232,200,119,.35);
  opacity:0; animation:firefly-float var(--dur,6s) ease-in-out infinite;
  animation-delay:var(--delay,0s);
}
.forest-root.open .firefly{ opacity:1; }
@keyframes firefly-float{
  0%,100%{ transform:translate(0,0); opacity:.2; }
  25%{ transform:translate(14px,-18px); opacity:1; }
  50%{ transform:translate(-10px,-30px); opacity:.5; }
  75%{ transform:translate(-18px,-6px); opacity:1; }
}

.leaf-fall{
  position:absolute; top:-30px; width:12px; height:16px; border-radius:70% 10% 70% 10%;
  background:linear-gradient(135deg, var(--gold-glow), var(--olive-600));
  opacity:0; animation:leaf-drop var(--dur,7s) linear infinite; animation-delay:var(--delay,0s);
}
.leaf-fall:nth-child(6n+2){ background:linear-gradient(135deg, #6b8f4a, #3a5228); }
.leaf-fall:nth-child(6n+3){ background:linear-gradient(135deg, #c9a24b, #8a6a24); }
.leaf-fall:nth-child(6n+4){ background:linear-gradient(135deg, #8a8354, #4f6e38); }
.leaf-fall:nth-child(6n+5){ background:linear-gradient(135deg, #4f6e38, #243a1d); }
.forest-root.open .leaf-fall{ opacity:.85; }
@keyframes leaf-drop{
  0%{ transform:translate(0,-10vh) rotate(0deg); }
  100%{ transform:translate(var(--drift,40px), 110vh) rotate(380deg); }
}

.sparkle{
  position:absolute; width:10px; height:10px; opacity:0;
  animation:twinkle var(--dur,2.4s) ease-in-out infinite; animation-delay:var(--delay,0s);
}
.sparkle.gold{ background:radial-gradient(circle, var(--gold-glow) 0%, rgba(232,200,119,0) 70%); }
.sparkle.blue{ background:radial-gradient(circle, #bfe0ff 0%, rgba(191,224,255,0) 70%); }
@keyframes twinkle{
  0%,100%{ opacity:0; transform:scale(.2) rotate(0deg); }
  50%{ opacity:1; transform:scale(1.3) rotate(90deg); }
}

.magic-burst{
  position:absolute; top:50%; left:50%; width:10px; height:10px; border-radius:50%;
  background:radial-gradient(circle, rgba(255,247,214,.95), rgba(232,200,119,.5) 40%, transparent 72%);
  transform:translate(-50%,-50%) scale(0); opacity:0; pointer-events:none;
}
.forest-root.burst .magic-burst{ animation:burst-out .9s cubic-bezier(.2,.8,.2,1) forwards; }
@keyframes burst-out{
  0%{ transform:translate(-50%,-50%) scale(0); opacity:1; }
  70%{ transform:translate(-50%,-50%) scale(22); opacity:.5; }
  100%{ transform:translate(-50%,-50%) scale(30); opacity:0; }
}

.std-card{
  position:relative; width:min(88vw, 380px); background:var(--ivory);
  padding:46px 30px 38px; text-align:center; z-index:2;
  box-shadow:0 0 0 1px rgba(232,200,119,.4), 0 30px 70px rgba(0,0,0,.5), 0 0 60px 10px rgba(232,200,119,.15);
  transform:translateY(40px) scale(.85); opacity:0;
  transition:transform .8s cubic-bezier(.16,1,.3,1) .15s, opacity .6s ease .15s;
}
.forest-root.open .std-card{ transform:translateY(0) scale(1); opacity:1; }
.std-card::before{ content:""; position:absolute; inset:10px; border:1px solid var(--gold); opacity:.6; pointer-events:none; }
.std-flourish{ width:46px; margin:0 auto 18px; opacity:.85; }
.monogram{
  font-family:var(--font-display); font-weight:600; letter-spacing:.08em;
  font-size:2rem; color:var(--gold-dark);
  text-shadow:0 1px 0 rgba(255,255,255,.6);
  margin-bottom:6px;
}
.std-image{ display:block; width:100%; max-height:65vh; object-fit:contain; }
.script-big{ font-family:var(--font-script,'Pinyon Script',cursive); color:var(--olive-800); font-size:2.7rem; line-height:1; margin-bottom:6px; }
.amp{ font-family:var(--font-display); font-style:italic; color:var(--sage); font-size:1.1rem; margin:2px 0 6px; }
.date-big{ font-family:var(--font-display); font-size:1.7rem; letter-spacing:.05em; color:var(--ink); margin:14px 0 4px; }
.venue{ font-size:12px; letter-spacing:.2em; text-transform:uppercase; color:var(--ink-mute); }
.divider{ width:36px; height:1px; background:var(--gold); margin:18px auto; }
.foot{ font-size:11px; color:var(--ink-mute); font-style:italic; }

.modal-close{
  position:absolute; top:-18px; right:-18px; width:38px; height:38px; border-radius:50%;
  background:var(--olive-800); color:#fff; border:2px solid var(--ivory); font-size:19px; cursor:pointer;
  display:flex; align-items:center; justify-content:center; box-shadow:0 6px 14px rgba(0,0,0,.35);
  transition:transform .2s;
}
.modal-close:hover{ transform:scale(1.08) rotate(90deg); }
</style>
