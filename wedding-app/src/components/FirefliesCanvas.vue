<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const canvas = ref(null)
let ctx, animId
const fireflies = []
const COUNT = 55

class Firefly {
  constructor(w, h) { this.reset(w, h) }
  reset(w, h) {
    this.x = Math.random() * w
    this.y = Math.random() * h
    this.r = 0.8 + Math.random() * 1.8
    this.vx = (Math.random() - 0.5) * 0.4
    this.vy = (Math.random() - 0.5) * 0.4
    this.alpha = 0
    this.maxAlpha = 0.3 + Math.random() * 0.55
    this.phase = Math.random() * Math.PI * 2
    this.speed = 0.008 + Math.random() * 0.018
    // warm gold or soft violet
    this.hue = Math.random() > 0.35 ? `${48 + Math.random() * 20}, ${75 + Math.random() * 20}%, ${60 + Math.random() * 20}%` : `${270 + Math.random() * 30}, 60%, 70%`
  }
}

onMounted(() => {
  const el = canvas.value
  if (!el) return
  ctx = el.getContext('2d')

  const resize = () => {
    el.width = el.offsetWidth
    el.height = el.offsetHeight
  }
  resize()
  window.addEventListener('resize', resize)

  for (let i = 0; i < COUNT; i++) fireflies.push(new Firefly(el.width, el.height))

  const draw = () => {
    ctx.clearRect(0, 0, el.width, el.height)
    const now = performance.now() / 1000

    for (const f of fireflies) {
      f.phase += f.speed
      f.alpha = f.maxAlpha * (0.5 + 0.5 * Math.sin(f.phase))
      f.x += f.vx
      f.y += f.vy
      if (f.x < -10 || f.x > el.width + 10 || f.y < -10 || f.y > el.height + 10) f.reset(el.width, el.height)

      // glow
      const grd = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * 6)
      grd.addColorStop(0, `hsla(${f.hue}, ${f.alpha})`)
      grd.addColorStop(1, `hsla(${f.hue}, 0)`)
      ctx.beginPath()
      ctx.arc(f.x, f.y, f.r * 6, 0, Math.PI * 2)
      ctx.fillStyle = grd
      ctx.fill()

      // core dot
      ctx.beginPath()
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2)
      ctx.fillStyle = `hsla(${f.hue}, ${f.alpha * 1.5 > 1 ? 1 : f.alpha * 1.5})`
      ctx.fill()
    }
    animId = requestAnimationFrame(draw)
  }
  draw()

  onUnmounted(() => {
    cancelAnimationFrame(animId)
    window.removeEventListener('resize', resize)
  })
})
</script>

<template>
  <canvas
    ref="canvas"
    class="absolute inset-0 w-full h-full pointer-events-none"
    style="z-index: 2;"
  />
</template>
