import { createRouter, createWebHistory } from 'vue-router';
import NewMenuView from '../views/NewMenuView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Novo Menu',
      component: NewMenuView,
      alias: '/novo',
    },
    {
      path: '/:catchAll(.*)',
      name: 'asd Anteriores',
      component: NewMenuView,
    },
  ],
});

export default router;
