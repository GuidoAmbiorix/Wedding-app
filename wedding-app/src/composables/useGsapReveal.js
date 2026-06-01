import { onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Fade+slide reveal on scroll for a ref element or CSS selector.
 * Usage: useGsapReveal(elRef, { y: 40, delay: 0.1 })
 */
export function useGsapReveal(target, opts = {}) {
  let ctx

  onMounted(() => {
    ctx = gsap.context(() => {
      const el = typeof target === 'string' ? target : target.value
      if (!el) return
      gsap.fromTo(
        el,
        { opacity: 0, y: opts.y ?? 50, x: opts.x ?? 0, scale: opts.scale ?? 1 },
        {
          opacity: 1, y: 0, x: 0, scale: 1,
          duration: opts.duration ?? 0.9,
          delay: opts.delay ?? 0,
          ease: opts.ease ?? 'power3.out',
          scrollTrigger: {
            trigger: typeof target === 'string' ? target : target.value,
            start: opts.start ?? 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      )
    })
  })

  onUnmounted(() => ctx?.revert())
}

/**
 * Stagger reveal for multiple children.
 * Usage: useGsapStagger(containerRef, '.card', { stagger: 0.1 })
 */
export function useGsapStagger(container, childSelector, opts = {}) {
  let ctx

  onMounted(() => {
    ctx = gsap.context(() => {
      const el = typeof container === 'string' ? container : container.value
      if (!el) return
      gsap.fromTo(
        childSelector,
        { opacity: 0, y: opts.y ?? 40 },
        {
          opacity: 1, y: 0,
          duration: opts.duration ?? 0.7,
          ease: opts.ease ?? 'power3.out',
          stagger: opts.stagger ?? 0.08,
          scrollTrigger: {
            trigger: el,
            start: opts.start ?? 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      )
    }, container.value)
  })

  onUnmounted(() => ctx?.revert())
}

export { gsap, ScrollTrigger }
