<template>
  <section class="bg-ivory text-ink py-20 md:py-24 px-8 relative overflow-hidden">
    <svg class="absolute right-4 bottom-2 w-32 md:w-40 opacity-90" viewBox="0 0 150 150" fill="none" stroke="var(--color-olive-800,#3a3623)" stroke-width="1.1">
      <path d="M75 140 C75 100 75 60 75 30" />
      <path d="M75 60 C55 45 40 30 45 15 C50 2 65 5 68 20 C70 32 75 45 75 60Z"/>
      <path d="M75 55 C90 38 105 22 100 8 C96 -3 82 2 78 16 C75 28 75 42 75 55Z"/>
      <path d="M78 75 C95 65 112 58 112 45 C112 34 100 32 93 42 C88 50 82 62 78 75Z"/>
      <path d="M72 80 C55 72 38 68 35 55 C33 45 45 41 52 50 C58 58 66 68 72 80Z"/>
    </svg>

    <div v-reveal class="wrap text-center relative z-10 max-w-[560px]">
      <span class="font-script-var block text-olive-800 leading-none mb-7" style="font-size:clamp(2.4rem,5vw,3.4rem)">You are invited</span>
      <p class="text-[1.05rem] leading-relaxed text-ink-mute italic">
        Estamos muy felices de que estés aquí y no podemos esperar a celebrar este momento especial contigo.
      </p>
      <p class="text-[1.05rem] leading-relaxed text-ink-mute italic mt-4">
        {{ wedding.invitation_text || 'Este espacio fue creado con cariño para guiarte a través de todos los detalles a medida que se acerca nuestra boda — desde la información del lugar y RSVP hasta el itinerario del día.' }}
      </p>
      <p class="text-[1.05rem] leading-relaxed text-ink-mute italic mt-4">
        {{ wedding.story }}
      </p>
      <p class="text-sm tracking-[.05em] text-ink mt-7">Con todo nuestro amor,</p>
      <p class="font-script-var text-olive-800 mt-1" style="font-size:1.8rem">{{ wedding.couple_name_1 }} y {{ wedding.couple_name_2 }}</p>
    </div>
  </section>
</template>

<script setup>
defineProps({ wedding: { type: Object, required: true } });
</script>
