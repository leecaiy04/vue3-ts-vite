import { createRouter, createWebHashHistory } from 'vue-router'

import ExcelViewDemo from '@/views/ExcelViewDemo.vue'
import DisplayExcel from '@/views/DisplayExcel.vue'

import ExcelView from '@/views/ExcelView.vue'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
	history: createWebHashHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: HomeView
		},
		{
			path: '/excel',
			name: 'excel',
			component: ExcelView
		},
		{
			path: '/displayexcel',
			name: 'displayexcel',
			component: DisplayExcel
		},
		{
			path: '/hottable',
			name: 'hottable',
			component: ExcelViewDemo
		},
		{
			path: '/about',
			name: 'about',
			component: () => import('@/views/AboutView.vue')
		}
	]
})

export default router
