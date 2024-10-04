<template>
	<hot-table ref="hotTableRef" :data="data" :settings="hotSettings"></hot-table>
	<button @click="getTableInfo">获取表格信息</button>
</template>

<script setup lang="ts">
/// <reference path="handsontable/handsontable.full.d.ts">
import { defineComponent, ref } from 'vue'
import { HotTable } from '@handsontable/vue3'
import { registerAllModules } from 'handsontable/registry'
import 'handsontable/dist/handsontable.full.css'
import { registerLanguageDictionary, zhCN } from 'handsontable/i18n'
import Handsontable from 'handsontable'
import { 分词函数, jaccardSimilarity } from '@/api/ExcelViewMethods'
registerAllModules()
registerLanguageDictionary(zhCN)

const hotTableRef = ref<>()
const data = ref(
	((item) => [item, item, item, item, item])({
		原始数据: '',
		对比数据: '',
		最相似项: '',
		相似1: '',
		相似2: '',
		相似3: '',
		相似4: '',
		相似5: '',
		相似6: ''
	})
)
const 分词 = ref<Record<string, string[]>>({})
const 相似度 = ref<{
	[x: string]: {
		str2: string
		similarity: number
	}[]
}>({})
// 自定义渲染器

const columns: Handsontable.GridSettings['columns'] = (index) => {
	const columnProperties: Handsontable.ColumnSettings = {
		title: '',
		type: 'text',
		data: ''
	}
	if (index == 0) {
		columnProperties.title = '原始数据'
		columnProperties.data = '原始数据'
	} else if (index == 1) {
		columnProperties.title = '对比数据'
		columnProperties.data = '对比数据'
	} else if (index == 2) {
		columnProperties.title = '最相似项'
		columnProperties.data = '最相似项'
		columnProperties.readOnly = true
	} else if (index >= 3) {
		columnProperties.title = `相似${index - 2}`
		columnProperties.data = `相似${index - 2}`
		columnProperties.readOnly = true
	}
	return columnProperties
}
const cells: Handsontable.GridSettings['cells'] = (row, col) => {
	const cellProperties: Handsontable.CellProperties = {}
	if (col >= 2) {
		cellProperties.renderer = function customCellRenderer(
			hotInstance: Handsontable,
			td: HTMLTableCellElement,
			row: number,
			col: number,
			prop: string | number,
			value: any,
			cellProperties: Handsontable.CellProperties
		) {
			Handsontable.renderers.TextRenderer.apply(this, arguments) // 使用默认的文本渲染器
			td.innerHTML = '' // 清空单元格内容
			// 设置不同颜色的文本
			const redText = document.createElement('div')
			redText.textContent = cellProperties.title
			redText.style.color = 'red'

			const blueText = document.createElement('div')
			blueText.textContent = cellProperties.type
			blueText.style.color = 'blue'

			// 插入文本到单元格中
			td.appendChild(redText)
			td.appendChild(blueText)
		}
	}
	return cellProperties
}

const beforeChange: Handsontable.GridSettings['beforeChange'] = async (changes, source) => {
	const 没分词的新增词语 = []
	changes.forEach(([row, col, oldValue, newValue]) => {
		if (['原始数据', '对比数据'].includes(col)) {
			没分词的新增词语.push(newValue)
		}
	})
	if (没分词的新增词语.length) {
		const 网络返回分词结果 = await 分词函数(没分词的新增词语)
		console.log('没分词的新增词语:', 网络返回分词结果)
		Object.assign(分词.value, 网络返回分词结果)
		console.log(分词.value)
		console.log(data.value)
	}
}
const hotSettings = ref<Handsontable.GridSettings>({
	data: data.value,
	maxCols: 9,
	rowHeaders: true,
	width: '100%',
	height: '100%',
	rowHeights: 28,
	colWidths: 120,
	filters: true,
	manualRowMove: true,
	language: 'zh-CN', // 设置中文语言
	contextMenu: true, // 启用上下文菜单
	licenseKey: 'non-commercial-and-evaluation',
	columns,
	cells,
	beforeChange
})

const getTableInfo = () => {
	if (hotTableRef.value) {
		console.log('表格数据:', hotTableRef.value.hotInstance.getData())
		console.log('表格设置:', hotTableRef.value.hotInstance.getSettings())
	}
}
</script>

<style lang="less">
.handsontable td {
	white-space: normal !important; /* 强制单元格内容允许换行 */
	word-wrap: break-word; /* 长词也会换行 */
}
</style>
