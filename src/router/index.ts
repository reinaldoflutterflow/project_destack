import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/profissional/:id',
    name: 'ProfilePage',
    component: () => import('../views/ProfilePage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
