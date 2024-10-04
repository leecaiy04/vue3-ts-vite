<template>
	<div id="example1">
		<hot-table ref="hotTableRef" :settings="hotSettings"></hot-table>
	</div>
</template>

<script lang="ts" setup>
/// <reference path="handsontable/handsontable.full.d.ts">
import { ref, reactive } from 'vue'
import { HotTable } from '@handsontable/vue3'
import Handsontable from 'handsontable'
import { registerAllModules } from 'handsontable/registry'
import { registerLanguageDictionary, zhCN } from 'handsontable/i18n'
import 'handsontable/dist/handsontable.full.css'

// register Handsontable's modules
registerAllModules()
registerLanguageDictionary(zhCN)

const hotTableRef = ref()
let hotTableInstance: Handsontable
const hotSettings = reactive<Handsontable.GridSettings>({
	maxCols: 9,
	startRows: 20,
	startCols: 9,
	colHeaders: true,
	manualColumnResize: true,
	stretchH: 'all',
	autoWrapRow: true,
	autoWrapCol: true,
	wordWrap: true,
	filters: true,
	dropdownMenu: true,
	contextMenu: true, // 启用上下文菜单
	language: 'zh-CN',
	persistentState: true,
	licenseKey: 'non-commercial-and-evaluation'
})
// 设置表头
// 设置数据
hotSettings.data = JSON.parse(sessionStorage.getItem('handsontableData')!) || [
	{
		原始数据: '杭政储出【2022】68号地块商品住宅及商业（设配套幼儿园）项目',
		对比数据: '杭政储出【2022】68号地块商品住宅及商业（设配套幼儿园）项目',
		最相似项: '',
		相似1: '',
		相似2: '',
		相似3: '',
		相似4: '',
		相似5: '',
		相似6: ''
	},
	{
		原始数据: '杭政储出【2022】63号地块商品住宅及商业商务（设配套幼儿园）项目',
		对比数据: '杭政储出【2022】60号地块商品住宅及商业办公项目（含配套设施',
		最相似项: '',
		相似1: '',
		相似2: '',
		相似3: '',
		相似4: '',
		相似5: '',
		相似6: ''
	},
	{
		原始数据: '西湖大学建设工程三期',
		对比数据: '西湖大学校园建设四期工程',
		最相似项: '',
		相似1: '',
		相似2: '',
		相似3: '',
		相似4: '',
		相似5: '',
		相似6: ''
	},
	{
		原始数据: '杭政工出【2020】8号菜鸟云谷园区项目',
		对比数据: '杭政工出【2020】10号阿里云智慧园区项目',
		最相似项: '',
		相似1: '',
		相似2: '',
		相似3: '',
		相似4: '',
		相似5: '',
		相似6: ''
	},
	{
		原始数据: '杭政储出【2021】51号地块商业、住宅及服务设施项目',
		对比数据: '杭政储出【2021】55号地块商业综合体及住宅项目（含社区服务设施）',
		最相似项: '',
		相似1: '',
		相似2: '',
		相似3: '',
		相似4: '',
		相似5: '',
		相似6: ''
	}
]
// 设置单元格样式
hotSettings.cells = function (row, col, prop) {
	const cellProperties: Handsontable.CellProperties = {}
	if (col >= 2 && col <= 8) {
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
			redText.textContent = value
			redText.style.color = 'red'

			const blueText = document.createElement('div')
			blueText.textContent = `${prop}+${cellProperties.type}`
			blueText.style.color = 'blue'

			// 插入文本到单元格中
			td.appendChild(redText)
			td.appendChild(blueText)
		}
	}
	return cellProperties
}
// 设置列
hotSettings.columns = function (index) {
	const columnProperties: Handsontable.ColumnSettings = {
		title: '',
		type: 'text',
		data: ''
	}
	if (index == 0) {
		columnProperties.title = '原始数据'
		columnProperties.data = '原始数据'
		columnProperties.wordWrap = true
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
// 设置列宽
hotSettings.colWidths = function colWidths(visualColumnIndex) {
	return document.documentElement.clientWidth / 9
}

// 单元格修改事件
hotSettings.afterChange = function (changes, source) {
	if (source === 'loadData') return
	// @ts-ignore
	if (source === 'afterChange后修改的hook') return
	if (changes === null) return
	console.log(changes)
	for (let i = 0; i < changes.length; i++) {
		const [row, prop, oldValue, newValue] = changes[i]
		hotTableInstance.setDataAtRowProp(row, '相似2', newValue, 'afterChange后修改的hook')
	}
	sessionStorage.setItem('handsontableData', JSON.stringify(hotSettings.data))
	console.log('Data saved to localStorage')
}

hotSettings.afterInit = function () {
	hotTableInstance = hotTableRef.value.hotInstance
	console.log('afterInit')
	console.log(hotTableInstance)
	console.log(hotTableRef.value.hotInstance)
}

hotSettings.afterOnCellMouseDown = function (...args) {
	// console.log('afterOnCellCornerMouseDown', ...args)
}
</script>

<style lang="less">
.handsontable td {
	white-space: normal !important; /* 强制单元格内容允许换行 */
	word-wrap: break-word; /* 长词也会换行 */
}
</style>
