import { createRouter, createWebHashHistory } from 'vue-router'

import DisplayExcel from '@/views/DisplayExcel.vue'
import HotTableView from '@/views/HotTableView.vue'
import HomePage from '@/views/HomePage.vue'

const router = createRouter({
	history: createWebHashHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: HomePage
		},
		{
			path: '/excel',
			name: 'excel',
			component: DisplayExcel
		},
		{
			path: '/hottable',
			name: 'hottable',
			component: HotTableView
		}
	]
})

export default router
