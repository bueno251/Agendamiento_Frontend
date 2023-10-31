import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		component: () => import('@/components/baseApp.vue'),
		redirect: { name: 'login' },
		beforeEnter: (to, from, next) => {
			if (!localStorage.token) {
				next({ name: 'login' })
			} else {
				next()
			}
		},
		children: [
			{
				path: 'calendario',
				name: 'calendario',
				component: () => import('@/modules/calendar/calendarApp.vue'),
			},
			{
				path: 'clientes',
				name: 'clientes',
				component: () => import('@/modules/client/clientApp.vue')
			},
			{
				path: 'habitaciones',
				name: 'habitaciones',
				component: () => import('@/modules/room/roomApp.vue')
			},
			{
				path: 'configuracion',
				name: 'configuracion',
				component: () => import('@/modules/settings/settingsApp.vue')
			},
		]
	},
	{
		path: '/login',
		name: 'login',
		component: () => import('@/modules/auth/loginApp.vue'),
		beforeEnter: (to, from, next) => {
			if (localStorage.token) {
				next({ name: 'calendario' })
			} else {
				next()
			}
		},
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
