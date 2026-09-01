// Aplica los colores de marca (primary/secondary/texto) configurados en
// Configuración como variables CSS en :root. Las utilidades de Tailwind
// bg-primary/text-primary/border-primary (etc., definidas en @theme en
// style.css) usan var(--color-primary) internamente, así que sobreescribir
// la variable actualiza toda la app (sitio público y administración) sin
// tener que recompilar ni recargar la página.
export function applyTheme(wedding) {
  if (!wedding || typeof document === 'undefined') return;
  const root = document.documentElement.style;
  if (wedding.theme_primary) {
    root.setProperty('--color-primary', wedding.theme_primary);
    // "green" es el color base de botones/CTA en todo el sitio público
    // (bg-green en RsvpForm, RsvpTeaser, GuestBook, etc.): reapuntarlo
    // hace que el primary configurado se vea en esas pantallas sin
    // tener que editar cada componente uno por uno.
    root.setProperty('--color-green', wedding.theme_primary);
  }
  if (wedding.theme_secondary) {
    root.setProperty('--color-secondary', wedding.theme_secondary);
    root.setProperty('--color-ivory', wedding.theme_secondary);
    root.setProperty('--color-cream', wedding.theme_secondary);
  }
  if (wedding.theme_text) {
    root.setProperty('--color-heading', wedding.theme_text);
    // "olive-800" es el verde oscuro que ya usan los títulos en script
    // (FaqList, InvitedIntro, RsvpForm, NavBar activo, hover de botones):
    // ese es el "otro verde" para letras que se configura por separado.
    root.setProperty('--color-olive-800', wedding.theme_text);
  }
}
