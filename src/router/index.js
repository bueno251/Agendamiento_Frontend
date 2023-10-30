import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('@/components/baseApp.vue'),
    redirect: { name: 'login' },
    children: [
      {
        path: 'calendario',
        name: 'calendario',
        component: ()=>import('@/modules/calendar/calendarApp.vue'),
      },
      {
        path: 'clientes',
        name: 'clientes',
        component: () => import('@/modules/client/clientApp.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/modules/auth/loginApp.vue')
  },
  {
    path: '*',
    name: '',
    redirect: { name: 'login' }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
