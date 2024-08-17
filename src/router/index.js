import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import EditorialView from '../views/editorial/EditorialView'
import LibroView from '../views/libro/LibroView'
import AutorView from '../views/autor/AutorView'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/editorial',
    name: 'editorial',
    component: EditorialView
  },
  {
    path: '/libro',
    name: 'libro',
    component: LibroView
  },
  {
    path: '/autor',
    name: 'autor',
    component: AutorView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
