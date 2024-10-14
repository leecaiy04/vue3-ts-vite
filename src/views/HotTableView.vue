<template>
	<div class="flex flex-col h-screen">
		<!-- Header -->
		<header class="flex flex-col items-center justify-between p-4 h-20 bg-gray-200">
			<h1 class="text-4xl font-bold text-center w-full">相似度比较工具</h1>
			<p class="text-xl text-right w-[95%]">——在第一、二列传入文字，点击按钮</p>
		</header>

		<!-- Main -->
		<main class="flex-grow flex flex-col p-4">
			<!-- 表格区 -->
			<section class="flex-grow mb-4 overflow-auto">
				<div ref="hotContainer" class="h-full w-full"></div>
			</section>

			<!-- 设置区 -->
			<section class="flex flex-wrap md:flex-nowrap justify-start items-start gap-8 pl-6">
				<el-text class="block text-lg font-semibold mb-4">最相似值阈值</el-text>
				<el-input-number
					v-model="maxLikelihood"
					label="最相似值阈值"
					:min="0.3"
					:max="1"
					:step="0.05"
					:controls="true"
					@change="debounceGetSimilarityTotal"
				>
				</el-input-number>
				<el-text class="block text-lg font-semibold mb-4">其他相似阈值</el-text>
				<el-input-number
					v-model="minThreshold"
					label="其他相似阈值"
					:min="0"
					:max="0.8"
					:step="0.1"
					:controls="true"
					@change="debounceGetSimilarityTotal"
				>
				</el-input-number>
			</section>
			<section class="flex flex-wrap md:flex-nowrap justify-between items-start gap-8">
				<div class="right-section w-full md:w-2/7 bg-white p-6 rounded-lg shadow-md">
					<el-text class="block text-lg font-semibold mb-4">比较操作区</el-text>
					<div class="flex flex-wrap gap-4">
						<el-button type="success" @click="debounceGetSimilarityTotal" class="btn-success">计算相似度</el-button>
						<el-button type="success" @click="显示所有数据;" class="btn-primary">控制台输出</el-button>
					</div>
				</div>
				<div class="left-section w-full md:w-5/7 bg-white p-6 rounded-lg shadow-md">
					<el-text class="block text-lg font-semibold mb-4">数据操作区</el-text>
					<div class="flex flex-wrap gap-4">
						<el-button type="primary" @click="exampleData" class="btn-success">示例数据</el-button>
						<el-button type="success" @click="loadPersistentDataToTable" class="btn-success">加载数据</el-button>
						<el-button type="success" @click="saveCurrentDataToPersistentState" class="btn-primary">保存数据</el-button>
						<el-button type="success" @click="clearDataExceptFirstTwoColumns" class="btn-success"> 保留两列 </el-button>
						<el-button type="success" @click="clearData" class="btn-success">清除所有</el-button>
						<el-button type="success" @click="exportDataToExcel" class="btn-success">导出excel</el-button>
					</div>
				</div>
			</section>
		</main>

		<!-- Footer -->
		<footer class="flex items-center justify-center h-8 bg-gray-200">
			<p class="text-sm">版权没有 &copy; 2024</p>
		</footer>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import 'handsontable/dist/handsontable.full.min.css'
import Handsontable from 'handsontable'
import { HotTable } from '@handsontable/vue3'
import { ElInput, ElButton } from 'element-plus'
import { useWindowWidth } from '@/hooks/useDynamicColumnWidth'
import { useInitTable } from '@/hooks/useInitTable'
import { useSimilarity } from '../hooks/useSimilarity'
import { useDataHandle } from '../hooks/useDataHandle'

const hotContainer = ref<HTMLDivElement | null>(null)
const hotInstance = ref<Handsontable | null>(null)

const { maxLikelihood, minThreshold } = useInitTable(hotContainer, hotInstance)
// 设置动态列宽
useWindowWidth(hotInstance)
const { getSimilarityTotal, debounceGetSimilarityTotal } = useSimilarity(hotInstance, maxLikelihood, minThreshold)
const {
	saveCurrentDataToPersistentState,
	loadPersistentDataToTable,
	clearData,
	clearDataExceptFirstTwoColumns,
	exampleData,
	exportDataToExcel
} = useDataHandle(hotInstance)
// 执行按钮的处理函数
const 显示所有数据 = () => {
	console.log('执行操作1:', hotInstance.value?.getData())
}
</script>

<style scoped>
/* 这里可以添加一些自定义样式 */
</style>
