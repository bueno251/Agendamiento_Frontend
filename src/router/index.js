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
				path: 'reservas/aprovadas',
				name: 'reservasAprovadas',
				component: () => import('@/modules/reservas/ReservasAprovadas.vue'),
			},
			{
				path: 'reservas/pendientes',
				name: 'reservasPendientes',
				component: () => import('@/modules/reservas/ReservasPendientes.vue'),
			},
			{
				path: 'reservas/canceladas',
				name: 'reservasCanceladas',
				component: () => import('@/modules/reservas/ReservasCanceladas.vue'),
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
				path: 'habitaciones/tarifas',
				name: 'habitacionesTarifas',
				component: () => import('@/modules/room/roomTarifas.vue')
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
			{
				path: 'caracteristicas',
				name: 'caracteristicas',
				component: () => import('@/modules/room/caracteristicasApp.vue')
			},
			{
				path: 'impuestos',
				name: 'impuestos',
				component: () => import('@/modules/impuestos/impuestosApp.vue')
			},
		]
	},
	{
		path: '/',
		component: () => import('@/components/baseUser.vue'),
		redirect: { name: 'viewRooms' },
		children: [
			{
				path: '/reservas_clientes',
				name: 'viewRooms',
				component: () => import('@/modules/reservas/ViewRooms.vue'),
			},
			{
				path: '/reservas_clientes/:id(\\d+)',
				name: 'room',
				component: () => import('@/modules/reservas/RoomInfo.vue'),
				props: true,
			},
			{
				path: '/pagar',
				name: 'pagar',
				component: () => import('@/modules/reservas/PagarReserva.vue'),
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
