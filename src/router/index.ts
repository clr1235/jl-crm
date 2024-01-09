import { createRouter, createWebHistory } from 'vue-router'

import Layout from '@/views/layout/index.vue'
import staticRoutes from './staticsRoutes'

export const constantRouterMap = staticRoutes

export const asyncRouterMap = [
	{
		path: '/',
		component: Layout,
		redirect: '/home',
		name: 'home',
		children: [
			{
				path: '/home',
				component: () => import('@/views/home/index.vue'),
				name: 'homeIndex',
				meta: { title: '首页', icon: 'iconfont iconshouye-xianxing', noCache: true, affix: true },
			},
		],
	},
]

const routes = [...staticRoutes]

const router = createRouter({
	history: createWebHistory(),
	routes,
	scrollBehavior: () => ({
		top: 0,
	}),
})

export default router
