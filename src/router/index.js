import {createRouter, createWebHistory} from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: '/',
			redirect: {name: 'tests'}
		},
		{
			path: '/tests',
			name: 'tests',
			meta: {requiresAuth: true},
			component: () => import('../views/Tests.vue')
		},
		{
			path: '/students',
			name: 'students',
			meta: {requiresAuth: true},
			component: () => import('../views/Students.vue')
		},
		{
			path: '/form',
			name: 'form',
			meta: {requiresAuth: true},
			component: () => import('../views/Form.vue')
		},
		{
			path: '/quiz/:testId?',
			name: 'quiz',
			meta: {requiresAuth: true},
			props: true,
			component: () => import('../views/Quiz.vue'),
		},
		{
			path: '/login',
			name: 'login',
			component: () => import('../views/Login.vue')
		},
		{
			path: '/:notFound(.*)',
			component: () => import('../views/NotFound.vue'),
		}
	],
	linkActiveClass: 'active',
	linkExactActiveClass: 'active',
})

router.beforeEach((to, from, next) => {
	const userStore = useUserStore()

	if (to.meta.requiresAuth) {
		if (userStore.user) {
			next()
		} else {
			next({name: 'login'})
		}
	} else if (to.name === 'login' && userStore.user) {
		next('/')
	} else {
		next()
	}
})

export default router
