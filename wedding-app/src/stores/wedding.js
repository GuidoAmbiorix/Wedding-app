import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import { applyTheme } from '@/lib/applyTheme'

export const useWeddingStore = defineStore('wedding', () => {
  const wedding = ref(null)
  const loading = ref(false)

  async function fetchWedding() {
    if (wedding.value || loading.value) return  // ya cargado o en progreso
    loading.value = true
    const { data } = await supabase.from('wedding_info').select('*').limit(1).single()
    if (data) { wedding.value = data; applyTheme(data) }
    loading.value = false
  }

  async function updateWedding(payload) {
    if (wedding.value?.id) {
      const { data } = await supabase
        .from('wedding_info')
        .update(payload)
        .eq('id', wedding.value.id)
        .select()
        .single()
      if (data) { wedding.value = data; applyTheme(data) }
    } else {
      const { data } = await supabase
        .from('wedding_info')
        .insert(payload)
        .select()
        .single()
      if (data) { wedding.value = data; applyTheme(data) }
    }
  }

  return { wedding, loading, fetchWedding, updateWedding }
})
