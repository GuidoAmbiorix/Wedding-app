<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useGuestsStore } from '@/stores/guests'
import { useWeddingStore } from '@/stores/wedding'
import { storeToRefs } from 'pinia'
import TheNavbar from '@/components/TheNavbar.vue'

const route = useRoute()
const guestsStore = useGuestsStore()
const { wedding } = storeToRefs(useWeddingStore())

const guest = ref(null)
const loading = ref(true)
const submitting = ref(false)
const submitted = ref(false)
const error = ref(null)

const form = ref({
  status: '',
  plus_one_confirmed: false,
  plus_one_name: '',
  meal_choice: '',
  message: ''
})

onMounted(async () => {
  const token = route.params.token
  if (!token) { error.value = 'Enlace inválido.'; loading.value = false; return }
  guest.value = await guestsStore.fetchGuestByToken(token)
  if (!guest.value) { error.value = 'No encontramos tu invitación. Verifica el enlace.'; loading.value = false; return }
  // Pre-fill if already responded
  const existing = guest.value.rsvps?.[0]
  if (existing) {
    form.value = {
      status: existing.status || '',
      plus_one_confirmed: existing.plus_one_confirmed || false,
      plus_one_name: existing.plus_one_name || '',
      meal_choice: existing.meal_choice || '',
      message: existing.message || ''
    }
    if (existing.status && existing.status !== 'pending') submitted.value = true
  }
  loading.value = false
})

async function submit() {
  if (!form.value.status) return
  submitting.value = true
  try {
    await guestsStore.submitRsvp(guest.value.id, form.value)
    submitted.value = true
  } catch (e) {
    error.value = 'Ocurrió un error. Por favor intenta de nuevo.'
  } finally {
    submitting.value = false
  }
}

function editAgain() { submitted.value = false }

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('es-ES', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })
}
</script>

<template>
  <div class="min-h-screen bg-[var(--ivory)]">
    <TheNavbar />

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="w-8 h-8 border-2 border-[var(--dusty-rose)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p class="text-xs tracking-widest uppercase text-[var(--text-muted)]">Cargando...</p>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error && !guest" class="flex items-center justify-center min-h-screen px-6">
      <div class="text-center max-w-md">
        <p class="text-5xl mb-6" style="font-family: var(--font-serif);">&#10007;</p>
        <h2 class="text-xl mb-3" style="font-family: var(--font-serif); font-weight: 400;">
          Enlace no válido
        </h2>
        <p class="text-sm text-[var(--text-muted)]">{{ error }}</p>
      </div>
    </div>

    <!-- Main content -->
    <div v-else-if="guest" class="pt-24 pb-20 px-6">
      <div class="max-w-lg mx-auto">

        <!-- Header -->
        <div class="text-center mb-12">
          <p class="text-xs tracking-[0.3em] uppercase text-[var(--text-muted)] mb-4">Confirmación de asistencia</p>
          <h1
            class="mb-2"
            style="font-family: var(--font-serif); font-weight: 300; font-size: clamp(2rem, 5vw, 3.5rem); color: var(--charcoal);"
          >
            <span v-if="wedding">
              {{ wedding.couple_name_1 }} &amp; {{ wedding.couple_name_2 }}
            </span>
          </h1>
          <p
            v-if="wedding?.wedding_date"
            class="text-sm text-[var(--text-muted)]"
            style="font-family: var(--font-serif); font-style: italic;"
          >
            {{ formatDate(wedding.wedding_date) }}
          </p>

          <div class="divider-ornament max-w-xs mx-auto mt-6">
            <span>&#10022;</span>
          </div>
        </div>

        <!-- Submitted confirmation -->
        <Transition name="slide-up">
          <div v-if="submitted" class="text-center py-12">
            <div
              class="text-6xl mb-6"
              :class="form.status === 'attending' ? 'text-[var(--sage)]' : 'text-[var(--dusty-rose)]'"
              style="font-family: var(--font-serif);"
            >
              {{ form.status === 'attending' ? '♡' : '◇' }}
            </div>

            <h2
              class="mb-3"
              style="font-family: var(--font-serif); font-weight: 400; font-size: 1.8rem;"
            >
              <span v-if="form.status === 'attending'">
                ¡Nos alegra mucho, {{ guest.first_name }}!
              </span>
              <span v-else>
                Lo sentimos, {{ guest.first_name }}
              </span>
            </h2>

            <p class="text-sm text-[var(--text-muted)] mb-2">
              <span v-if="form.status === 'attending'">
                Te esperamos el {{ wedding?.wedding_date ? formatDate(wedding.wedding_date) : '' }}
                <span v-if="wedding?.venue">en {{ wedding.venue }}</span>.
              </span>
              <span v-else>
                Gracias por avisarnos. Te echaremos de menos.
              </span>
            </p>

            <p v-if="form.status === 'attending' && form.plus_one_confirmed && form.plus_one_name" class="text-xs text-[var(--text-muted)] mb-6">
              También esperamos a {{ form.plus_one_name }}.
            </p>

            <button
              @click="editAgain"
              class="text-xs tracking-widest uppercase text-[var(--text-muted)] hover:text-[var(--charcoal)] transition-colors underline-offset-4 hover:underline cursor-pointer border-none bg-transparent mt-4"
            >
              Modificar respuesta
            </button>
          </div>
        </Transition>

        <!-- Form -->
        <Transition name="slide-up">
          <form v-if="!submitted" @submit.prevent="submit" class="space-y-8">

            <!-- Guest name -->
            <div class="text-center border border-[var(--champagne)] bg-white p-6">
              <p class="text-xs tracking-widest uppercase text-[var(--text-muted)] mb-1">Invitado</p>
              <p
                class="text-2xl text-[var(--charcoal)]"
                style="font-family: var(--font-serif); font-weight: 400;"
              >
                {{ guest.first_name }} {{ guest.last_name }}
              </p>
            </div>

            <!-- Attending? -->
            <div>
              <p class="text-xs tracking-[0.2em] uppercase text-[var(--text-muted)] mb-4 text-center">
                ¿Podrás acompañarnos?
              </p>
              <div class="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  @click="form.status = 'attending'"
                  class="py-4 text-sm tracking-widest uppercase border-2 transition-all duration-200 cursor-pointer"
                  :class="form.status === 'attending'
                    ? 'border-[var(--sage)] bg-[var(--sage)] text-white'
                    : 'border-[var(--champagne)] bg-white text-[var(--charcoal)] hover:border-[var(--sage)]'"
                >
                  &#10003; &nbsp; Asistiré
                </button>
                <button
                  type="button"
                  @click="form.status = 'declined'"
                  class="py-4 text-sm tracking-widest uppercase border-2 transition-all duration-200 cursor-pointer"
                  :class="form.status === 'declined'
                    ? 'border-[var(--dusty-rose)] bg-[var(--dusty-rose)] text-white'
                    : 'border-[var(--champagne)] bg-white text-[var(--charcoal)] hover:border-[var(--dusty-rose)]'"
                >
                  &#10007; &nbsp; No podré ir
                </button>
              </div>
            </div>

            <!-- Attending extras -->
            <Transition name="slide-up">
              <div v-if="form.status === 'attending'" class="space-y-6">

                <!-- Meal choice -->
                <div>
                  <p class="text-xs tracking-[0.2em] uppercase text-[var(--text-muted)] mb-3">Preferencia de menú</p>
                  <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <button
                      v-for="meal in [
                        { value: 'chicken', label: 'Pollo' },
                        { value: 'beef', label: 'Res' },
                        { value: 'fish', label: 'Pescado' },
                        { value: 'vegetarian', label: 'Vegetariano' },
                        { value: 'vegan', label: 'Vegano' },
                      ]"
                      :key="meal.value"
                      type="button"
                      @click="form.meal_choice = meal.value"
                      class="py-2.5 text-xs tracking-widest uppercase border transition-all duration-200 cursor-pointer"
                      :class="form.meal_choice === meal.value
                        ? 'border-[var(--charcoal)] bg-[var(--charcoal)] text-white'
                        : 'border-[var(--champagne)] bg-white text-[var(--charcoal)] hover:border-[var(--charcoal)]'"
                    >
                      {{ meal.label }}
                    </button>
                  </div>
                </div>

                <!-- Plus one -->
                <div v-if="guest.plus_one_allowed">
                  <label class="flex items-center gap-3 cursor-pointer group">
                    <div
                      class="w-5 h-5 border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0"
                      :class="form.plus_one_confirmed
                        ? 'border-[var(--sage)] bg-[var(--sage)]'
                        : 'border-[var(--champagne-dark)] group-hover:border-[var(--sage)]'"
                      @click="form.plus_one_confirmed = !form.plus_one_confirmed"
                    >
                      <span v-if="form.plus_one_confirmed" class="text-white text-xs">&#10003;</span>
                    </div>
                    <span class="text-sm text-[var(--charcoal)]">Llevaré acompañante</span>
                  </label>

                  <Transition name="slide-up">
                    <div v-if="form.plus_one_confirmed" class="mt-3">
                      <input
                        v-model="form.plus_one_name"
                        type="text"
                        :placeholder="guest.plus_one_name || 'Nombre del acompañante'"
                        class="w-full border border-[var(--champagne)] bg-white px-4 py-3 text-sm text-[var(--charcoal)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--charcoal)] transition-colors"
                      />
                    </div>
                  </Transition>
                </div>

              </div>
            </Transition>

            <!-- Message -->
            <div v-if="form.status">
              <p class="text-xs tracking-[0.2em] uppercase text-[var(--text-muted)] mb-3">
                Mensaje para los novios <span class="text-[var(--champagne-dark)]">(opcional)</span>
              </p>
              <textarea
                v-model="form.message"
                rows="3"
                placeholder="Escribe algo lindo..."
                class="w-full border border-[var(--champagne)] bg-white px-4 py-3 text-sm text-[var(--charcoal)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--charcoal)] transition-colors resize-none"
              />
            </div>

            <!-- Error -->
            <p v-if="error" class="text-xs text-red-500 text-center">{{ error }}</p>

            <!-- Submit -->
            <button
              type="submit"
              :disabled="!form.status || submitting"
              class="w-full py-4 text-sm tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer"
              :class="form.status
                ? 'bg-[var(--charcoal)] text-white hover:bg-[var(--dusty-rose)] border-2 border-[var(--charcoal)] hover:border-[var(--dusty-rose)]'
                : 'bg-[var(--champagne)] text-[var(--text-muted)] border-2 border-[var(--champagne)] cursor-not-allowed'"
            >
              <span v-if="submitting" class="flex items-center justify-center gap-2">
                <span class="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin" />
                Enviando...
              </span>
              <span v-else>Confirmar respuesta</span>
            </button>
          </form>
        </Transition>

      </div>
    </div>
  </div>
</template>
