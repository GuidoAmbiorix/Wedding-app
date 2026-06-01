import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', component: () => import('@/GuestSite.vue') },
  { path: '/i/:token', component: () => import('@/views/InvitationView.vue') },
  {
    path: '/admin',
    component: () => import('@/views/admin/AdminLayout.vue'),
    children: [
      { path: '', redirect: '/admin/invitados' },
      { path: 'invitados',       component: () => import('@/views/admin/GuestsView.vue') },
      { path: 'confirmaciones',  component: () => import('@/views/admin/RsvpsView.vue') },
      { path: 'configuracion',   component: () => import('@/views/admin/SettingsView.vue') },
    ],
  },
]

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to) {
    if (to.hash) return { el: to.hash, behavior: 'smooth', top: 60 };
    return { top: 0 };
  },
})
