<script setup>
// Hojas cayendo — animación pura CSS
const leaves = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  delay: `${Math.random() * 12}s`,
  duration: `${8 + Math.random() * 10}s`,
  size: `${10 + Math.random() * 16}px`,
  rotate: Math.random() > 0.5 ? 1 : -1,
  opacity: 0.25 + Math.random() * 0.35,
  // alterna formas
  shape: ['leaf', 'leaf2', 'petal'][Math.floor(Math.random() * 3)],
}))
</script>

<template>
  <div class="leaves-container" aria-hidden="true">
    <div
      v-for="leaf in leaves"
      :key="leaf.id"
      class="leaf"
      :class="`leaf--${leaf.shape}`"
      :style="{
        left: leaf.left,
        animationDelay: leaf.delay,
        animationDuration: leaf.duration,
        width: leaf.size,
        height: leaf.size,
        opacity: leaf.opacity,
        '--rotate-dir': leaf.rotate,
      }"
    />
  </div>
</template>

<style scoped>
.leaves-container {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 1;
}

.leaf {
  position: absolute;
  top: -40px;
  animation: leafFall linear infinite;
  will-change: transform;
}

/* Hoja simple — forma con border-radius */
.leaf--leaf {
  background: radial-gradient(ellipse at 30% 30%, #5a8a52, #2d5a27);
  border-radius: 0 80% 0 80%;
  transform-origin: center;
}

/* Hoja alternativa */
.leaf--leaf2 {
  background: radial-gradient(ellipse at 60% 40%, #7b4fa6, #3d1f6b);
  border-radius: 80% 0 80% 0;
}

/* Pétalo suave */
.leaf--petal {
  background: radial-gradient(ellipse at 50% 50%, #c9a656, #8a6f3a);
  border-radius: 50% 0 50% 50%;
}

@keyframes leafFall {
  0% {
    transform: translateY(-40px) rotate(0deg) translateX(0);
    opacity: 0;
  }
  5% {
    opacity: var(--leaf-opacity, 0.4);
  }
  50% {
    transform: translateY(50vh) rotate(calc(180deg * var(--rotate-dir))) translateX(60px);
  }
  95% {
    opacity: var(--leaf-opacity, 0.4);
  }
  100% {
    transform: translateY(105vh) rotate(calc(360deg * var(--rotate-dir))) translateX(-30px);
    opacity: 0;
  }
}
</style>
