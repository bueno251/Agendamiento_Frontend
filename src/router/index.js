import Vue from 'vue'
import vuex from "@/store";
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
	{
		path: '/admin',
		component: () => import('@/components/baseApp.vue'),
		redirect: { name: 'reservasApp' },
		beforeEnter: (to, from, next) => {
			if (!vuex.state.token) {
				next({ name: 'login' })
			} else {
				next()
			}
		},
		children: [
			{
				path: 'reservas/interno',
				name: 'reservas',
				component: () => import('@/modules/reservas/ReservasInterno.vue'),
			},
			{
				path: 'reservas/app',
				name: 'reservasApp',
				component: () => import('@/modules/reservas/ReservasApp.vue'),
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
		path: '/',
		component: () => import('@/components/baseUser.vue'),
		redirect: { name: 'viewRooms' },
		children: [
			{
				path: '/rooms',
				name: 'viewRooms',
				component: () => import('@/modules/reservas/ViewRooms.vue'),
			},
			{
				path: '/room/:id(\\d+)',
				name: 'room',
				component: () => import('@/modules/reservas/RoomInfo.vue'),
				props: true,
			},
		],
	},
	{
		path: '/user',
		component: () => import('@/components/baseUser.vue'),
		redirect: { name: 'viewRooms' },
		beforeEnter: (to, from, next) => {
			if (!vuex.state.token) {
				next({ name: 'login' })
			} else {
				next()
			}
		},
		children: [
			{
				path: '/reservas',
				name: 'myReservas',
				component: () => import('@/modules/user/myReservasApp.vue'),
			},
		],
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
