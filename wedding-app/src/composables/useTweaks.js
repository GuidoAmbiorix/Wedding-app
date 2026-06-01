import { reactive, watchEffect } from 'vue';

const KEY = 'jg-tweaks';
const defaults = {
  cover: 'boat',
  accent: ['#2c4628', '#4f7142'],
  script: "'Pinyon Script', cursive",
  countdown: true,
  animations: true,
};

// Fuentes opcionales: se cargan solo cuando el usuario las selecciona
const OPTIONAL_FONTS = {
  "'Great Vibes', cursive":  'https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap',
  "'Tangerine', cursive":    'https://fonts.googleapis.com/css2?family=Tangerine:wght@400;700&display=swap',
};

function loadFontIfNeeded(fontValue) {
  const url = OPTIONAL_FONTS[fontValue];
  if (!url || document.querySelector(`link[data-jg-font="${CSS.escape(fontValue)}"]`)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = url;
  link.setAttribute('data-jg-font', fontValue);
  document.head.appendChild(link);
}

let saved = {};
try { saved = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) {}
const tweaks = reactive({ ...defaults, ...saved });

watchEffect(() => {
  const r = document.documentElement.style;
  r.setProperty('--accent', tweaks.accent[0]);
  r.setProperty('--accent-soft', tweaks.accent[1]);
  r.setProperty('--script-font', tweaks.script);
  document.body.classList.toggle('no-anim', !tweaks.animations);
  loadFontIfNeeded(tweaks.script);
  try { localStorage.setItem(KEY, JSON.stringify(tweaks)); } catch (e) {}
});

export const COVER_OPTS = [
  { value: 'boat',   label: 'Foto full' },
  { value: 'split',  label: 'Dividida' },
  { value: 'framed', label: 'Marco' },
];
export const ACCENTS = [
  ['#2c4628', '#4f7142'], ['#1b2c1c', '#3a5733'],
  ['#566b3a', '#7e9667'], ['#3d4f2c', '#6b7d44'],
];
export const SCRIPTS = [
  { value: "'Pinyon Script', cursive",  label: 'Pinyon' },
  { value: "'Great Vibes', cursive",    label: 'Great Vibes' },
  { value: "'Tangerine', cursive",      label: 'Tangerine' },
];

export function useTweaks() { return tweaks; }
