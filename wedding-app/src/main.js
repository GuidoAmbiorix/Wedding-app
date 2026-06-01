import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './style.css'

const app = createApp(App)

// Directiva global v-reveal (scroll animation)
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

app.directive('reveal', {
  mounted(el, binding) {
    if (document.body.classList.contains('no-anim')) return;
    el.classList.add('reveal');
    if (binding.value) el.style.transitionDelay = binding.value + 's';
    io.observe(el);
  },
});

app.use(createPinia())
app.use(router)
app.mount('#app')
