import { createRouter, createWebHistory } from 'vue-router'

import staticRoutes from './staticsRoutes'

const routes = [...staticRoutes]
const router = createRouter({
	history: createWebHistory(),
	routes,
	scrollBehavior: () => ({
		top: 0,
	}),
})

export default router
