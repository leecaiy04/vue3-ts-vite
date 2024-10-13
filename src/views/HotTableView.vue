<template>
	<div class="flex flex-col h-screen">
		<!-- Header -->
		<header class="flex items-center justify-between p-4 h-16 bg-gray-200">
			<h1 class="text-2xl font-bold">标题</h1>
		</header>

		<!-- Main -->
		<main class="flex-grow flex flex-col p-4">
			<!-- 表格区 -->
			<section class="flex-grow mb-4 overflow-auto">
				<div ref="hotContainer" class="h-full w-full"></div>
			</section>

			<!-- 设置区 -->
			<section class="mb-4">
				<div class="mb-2">
					<el-input v-model="inputValue" placeholder="请输入参数"></el-input>
				</div>
				<div>
					<el-input type="textarea" v-model="textAreaValue" placeholder="请输入详细信息"></el-input>
				</div>
			</section>

			<!-- 执行区 -->
			<section class="mb-4">
				<el-button type="primary" @click="handleExecute1">执行操作1</el-button>
				<el-button type="success" @click="handleExecute2" class="ml-2">执行操作2</el-button>
			</section>
		</main>

		<!-- Footer -->
		<footer class="flex items-center justify-center h-8 bg-gray-200">
			<p class="text-sm">版权所有 &copy; 2024</p>
		</footer>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import 'handsontable/dist/handsontable.full.min.css'
import Handsontable from 'handsontable'
import { HotTable } from '@handsontable/vue'
import { ElInput, ElButton } from 'element-plus'
import { useWindowWidth } from '@/hooks/useDynamicColumnWidth'
import { useInitTable } from '@/hooks/useInitTable'

const inputValue = ref('inputValue')
const textAreaValue = ref('textAreaValue')

const hotContainer = ref<HTMLDivElement | null>(null)
const hotInstance = ref<Handsontable | null>(null)

const { maxLikelihood, minThreshold } = useInitTable(hotContainer, hotInstance)
// 设置动态列宽
useWindowWidth(hotInstance)
console.log(hotInstance)
// 执行按钮的处理函数
const handleExecute1 = () => {
	console.log('执行操作1:', inputValue.value, textAreaValue.value)
}

const handleExecute2 = () => {
	console.log('执行操作2:', inputValue.value, textAreaValue.value)
}
</script>

<style scoped>
/* 这里可以添加一些自定义样式 */
</style>
