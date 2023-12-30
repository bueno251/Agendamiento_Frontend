import Vue from 'vue'
import vuex from "@/store";
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		component: () => import('@/components/baseApp.vue'),
		beforeEnter: (to, from, next) => {
			if (!vuex.state.token) {
				next({ name: 'viewRooms' })
			} else {
				next()
			}
		},
		children: [
			{
				path: 'reservas/interno',
				name: 'reservas',
				component: () => import('@/modules/calendar/ReservasInterno.vue'),
			},
			{
				path: 'clientes',
				name: 'clientes',
				component: () => import('@/modules/client/clientApp.vue')
			},
			{
				path: 'habitaciones/consultar',
				name: 'habitaciones',
				component: () => import('@/modules/room/roomApp.vue')
			},
			{
				path: 'habitaciones/configuracion',
				name: 'habitacionesConfig',
				component: () => import('@/modules/room/roomSettings.vue')
			},
			{
				path: 'configuracion',
				name: 'configuracion',
				component: () => import('@/modules/settings/settingsApp.vue')
			},
			{
				path: 'desayunos',
				name: 'desayunos',
				component: () => import('@/modules/room/desayunosApp.vue')
			},
			{
				path: 'decoraciones',
				name: 'decoraciones',
				component: () => import('@/modules/room/decoracionesApp.vue')
			},
		]
	},
	{
		path: '/login',
		name: 'login',
		component: () => import('@/modules/auth/loginApp.vue'),
		beforeEnter: (to, from, next) => {
			if (vuex.state.token) {
				next({ name: 'reservas' })
			} else {
				next()
			}
		},
	},
	{
		path: '/rooms',
		name: 'viewRooms',
		component: () => import('@/modules/calendar/ViewRooms.vue'),
	},
	{
		path: '/room/:id(\\d+)',
		name: 'room',
		component: () => import('@/modules/calendar/RoomInfo.vue'),
		props: true,
	},
	{
		path: '*',
		name: '',
		redirect: { name: 'viewRooms' }
	}
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

export default router
