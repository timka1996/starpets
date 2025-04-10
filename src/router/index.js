import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import ConvertPage from '../views/ConvertPage.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage
  },
  {
    path: '/convert',
    name: 'convert',
    component: ConvertPage
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;