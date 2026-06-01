import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    tailwindcss(),
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    rollupOptions: {
      output: {
        // Función requerida en Vite 8 (rolldown)
        manualChunks(id) {
          if (id.includes('@supabase')) return 'supabase';
          if (id.includes('node_modules/vue') || id.includes('node_modules/pinia') || id.includes('vue-router')) return 'vendor';
        }
      }
    }
  }
})
