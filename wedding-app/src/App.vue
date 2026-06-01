<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useWeddingStore } from '@/stores/wedding'

const weddingStore = useWeddingStore()
onMounted(() => weddingStore.fetchWedding())
</script>

<template>
  <RouterView v-slot="{ Component }">
    <Transition name="fade" mode="out-in">
      <component :is="Component" />
    </Transition>
  </RouterView>
</template>
