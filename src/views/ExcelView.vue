<template>
	<div class="flex flex-col w-full h-full">
		<h3 class="bg-yellow-700 text-4xl h-1/10 text-center flex items-center justify-center">这是一个比较相似度的工具</h3>
		<el-table :data="tableData" style="height: 75%">
			<el-table-column prop="序号" label="序号" width="72" align="center" />
			<el-table-column prop="原始数据" label="原始数据" :width="columnsWidth" align="center" />
			<el-table-column prop="最相似项" label="最相似项" :width="columnsWidth" align="center" />
			<el-table-column label="相似度" align="center">
				<el-table-column
					v-for="i in 6"
					:key="`相似${i}`"
					:prop="`相似${i}`"
					:label="`相似${i}`"
					:width="columnsWidth"
					align="center"
				>
					<template #default="{ row }: { row: TableData, $index: number }">
						<span v-html="row[`相似${i}`]" @click="confirm最相似项(row, i)" />
					</template>
				</el-table-column>
				<el-table-column prop="对比数据" label="对比数据" :width="columnsWidth" align="center" />
			</el-table-column>
		</el-table>
		<div class="flex-1 bg-cyan-500 h-1/7"></div>
	</div>
</template>

<script lang="ts" setup>
import { 分词并对比相似度, rendHtml } from '@/api/ExcelViewMethods'
import { ref, onBeforeMount } from 'vue'
import type { SimilarKey, TableData } from '@/@types/ExcelView'
const tableData = ref<TableData[]>((await import('./data.json')).default)
const userConfig = ref({
	minMostSimilarRate: 0.9,
	minSilimilarity: 0.4
})

const columnsWidth = ref(Math.round((window.innerWidth - 72) / 9))
const 分词数组 = ref<Record<string, string[]>>({})
const 相似度 = ref<{
	[x: string]: {
		str2: string
		similarity: number
	}[]
}>({})
async function initData() {
	const res = await 分词并对比相似度(
		tableData.value.map((x) => x.原始数据 || ''),
		tableData.value.map((x) => x.对比数据 || '')
	)
	分词数组.value = res.分词数组
	相似度.value = res.相似度
	tableData.value.forEach((v, i) => {
		v.序号 = i + 1
		if (相似度.value[v.原始数据 || ''][0].similarity >= userConfig.value.minMostSimilarRate) {
			v.最相似项 = 相似度.value[v.原始数据 || ''][0].str2
		}
		for (let i = 1; i <= 6; i++) {
			const key = ('相似' + i) as SimilarKey
			if (相似度.value[v.原始数据 || ''][i].similarity >= userConfig.value.minSilimilarity) {
				v[key] =
					rendHtml(分词数组.value[v.原始数据], 分词数组.value[相似度.value[v.原始数据 || ''][i].str2]) +
					`<span>@${相似度.value[v.原始数据 || ''][i].similarity}</span>`
			}
		}
	})
}
function autoWidth() {
	let timeoutId: number | undefined
	window.addEventListener('resize', () => {
		if (timeoutId) {
			clearTimeout(timeoutId)
		}
		timeoutId = window.setTimeout(() => {
			columnsWidth.value = Math.round((window.innerWidth - 72) / 9)
		}, 1000) // 1000ms 延迟
	})
}
onBeforeMount(() => {
	initData()
	autoWidth()
})

function confirm最相似项(row: TableData, i: number) {
	if (相似度.value[row.原始数据][i].similarity) {
		row.最相似项 = 相似度.value[row.原始数据][i].str2
	}
}
</script>
../@types/ExcelView.js
