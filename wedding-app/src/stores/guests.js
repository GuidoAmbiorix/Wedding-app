import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'

export const useGuestsStore = defineStore('guests', () => {
  const guests  = ref([])
  const loading = ref(false)

  const stats = computed(() => {
    const total        = guests.value.length
    const confirmado   = guests.value.filter(g => g.status === 'confirmado').length
    const no_seguro    = guests.value.filter(g => g.status === 'no_seguro').length
    const no_puede_ir  = guests.value.filter(g => g.status === 'no_puede_ir').length
    const enviada      = guests.value.filter(g => g.status === 'enviada').length
    const sin_enviar   = guests.value.filter(g => g.status === 'sin_enviar').length
    const lista_espera = guests.value.filter(g => g.status === 'lista_de_espera').length
    const totalAdults    = guests.value.reduce((s, g) => s + (g.adults_count ?? 1), 0)
    const totalChildren  = guests.value.reduce((s, g) => s + (g.children_count ?? 0), 0)
    const totalPeople    = totalAdults + totalChildren
    const sin_respuesta  = sin_enviar + enviada
    return {
      total, confirmado, no_seguro, no_puede_ir,
      enviada, sin_enviar, lista_espera, sin_respuesta,
      totalAdults, totalChildren, totalPeople,
      // compat con código que usa estos nombres
      attending: confirmado,
      declined:  no_puede_ir,
      pending:   sin_respuesta,
    }
  })

  async function fetchGuests() {
    if (loading.value) return
    loading.value = true
    const { data } = await supabase
      .from('wedding_guests')
      .select('*, wedding_rsvps(*)')
      .order('guest_display_name')
    if (data) guests.value = data
    loading.value = false
  }

  async function addGuest(guest) {
    // Asegurar que guest_display_name tenga valor
    if (!guest.guest_display_name) {
      guest.guest_display_name = `${guest.first_name || ''} ${guest.last_name || ''}`.trim()
    }
    const { data, error } = await supabase
      .from('wedding_guests')
      .insert({ ...guest, status: guest.status || 'sin_enviar' })
      .select('*, wedding_rsvps(*)')
      .single()
    if (error) throw error
    await fetchGuests()
    return data
  }

  async function updateGuest(id, payload) {
    // Strip virtual/joined fields that are not real DB columns
    const { wedding_rsvps, id: _id, ...clean } = payload
    if (!clean.guest_display_name) {
      clean.guest_display_name = `${clean.first_name || ''} ${clean.last_name || ''}`.trim()
    }
    // Also remove guest_type if column doesn't exist yet in DB (will be re-added after migration)
    // Uncomment the line below if you haven't run the migration yet:
    // delete clean.guest_type
    const { data, error } = await supabase
      .from('wedding_guests')
      .update(clean)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    const idx = guests.value.findIndex(g => g.id === id)
    if (idx !== -1) guests.value[idx] = { ...guests.value[idx], ...data }
    return data
  }

  async function updateStatus(id, status) {
    const { data, error } = await supabase
      .from('wedding_guests')
      .update({ status })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    const idx = guests.value.findIndex(g => g.id === id)
    if (idx !== -1) guests.value[idx] = { ...guests.value[idx], status }
    return data
  }

  async function deleteGuest(id) {
    const { error } = await supabase.from('wedding_guests').delete().eq('id', id)
    if (error) throw error
    guests.value = guests.value.filter(g => g.id !== id)
  }

  async function fetchGuestByToken(token) {
    const { data, error } = await supabase
      .from('wedding_guests')
      .select('*, wedding_rsvps(*)')
      .eq('rsvp_token', token)
      .single()
    if (error) return null
    return data
  }

  async function markInvitationSent(guestId) {
    const now = new Date().toISOString()
    const { data, error } = await supabase
      .from('wedding_guests')
      .update({ invitation_sent_at: now, status: 'enviada' })
      .eq('id', guestId)
      .select()
      .single()
    if (error) throw error
    const idx = guests.value.findIndex(g => g.id === guestId)
    if (idx !== -1) guests.value[idx] = { ...guests.value[idx], invitation_sent_at: now, status: 'enviada' }
    return data
  }

  return {
    guests, loading, stats,
    fetchGuests, addGuest, updateGuest, updateStatus, deleteGuest,
    fetchGuestByToken, markInvitationSent,
  }
})
