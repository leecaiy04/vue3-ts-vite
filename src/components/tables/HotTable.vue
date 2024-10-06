<template>
	<div id="example1">
		<hot-table ref="hotTableRef" :data="data" :settings="hotSettings"></hot-table>
	</div>
	<div>
		<span>选择最相似值最小的数字</span>
		<el-input-number v-model="最小最大相似度" :min="0.3" :max="1" :step="0.1" />
		<span>相似值显示最小的数字</span>
		<el-input-number v-model="最小相似度" :min="0" :max="0.9" :step="0.1" />
		<el-button type="primary" size="default" @click="设置为第一个()">空白的都选择第一个</el-button>
		<el-button type="primary" size="default" @click="Example数据展示()">Example数据展示</el-button>
		<el-button type="primary" size="default" @click="清空()">清空</el-button>
	</div>
</template>

<script lang="ts" setup>
/// <reference path="handsontable/handsontable.full.d.ts">
import { ref, watch, reactive, onMounted } from 'vue'
import { HotTable } from '@handsontable/vue3'
import Handsontable from 'handsontable'
import { registerAllModules } from 'handsontable/registry'
import { registerLanguageDictionary, zhCN } from 'handsontable/i18n'
import 'handsontable/dist/handsontable.full.css'
import { debounce } from 'lodash'
import { 综合处理两个字符串, 数据处理先归一后分组词分词, 对两个字符串数组取余弦相似度 } from './tools'
import { ContextMenu } from 'handsontable/plugins/contextMenu'

// #region Handsontable 的初始化
registerAllModules()
registerLanguageDictionary(zhCN)

const data = [
	{
		原始数据: '这是一串很长的字符串',
		对比数据: '这是一串很短的字符串',
		最相似项: '',
		相似1: '',
		相似2: '',
		相似3: '',
		相似4: '',
		相似5: '',
		相似6: ''
	},
	{
		原始数据: '可以直接Excel数据到原始数据',
		对比数据: '可以直接Excel数据到对比数据',
		最相似项: '',
		相似1: '',
		相似2: '',
		相似3: '',
		相似4: '',
		相似5: '',
		相似6: ''
	},
	{
		原始数据: '完成后直接复制回Excel',
		对比数据: '完成后可以列\\t行\\n',
		最相似项: '',
		相似1: '',
		相似2: '',
		相似3: '',
		相似4: '',
		相似5: '',
		相似6: ''
	}
]
const example = [
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

const hotTableRef = ref<(HTMLDivElement & { hotInstance: Handsontable }) | null>(null)
const hotSettings = reactive<Handsontable.GridSettings>({
	maxCols: 9,
	startRows: 8,
	startCols: 9,
	minRows: 8,
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

// 设置单元格样式
hotSettings.cells = function (row, col, prop) {
	const cellProperties: Partial<Handsontable.CellProperties> = {}
	if (col >= 3) {
		cellProperties.renderer = function customCellRenderer(
			hotInstance: Handsontable,
			td: HTMLTableCellElement,
			row: number,
			col: number,
			prop: string | number,
			value: string,
			cellProperties: Handsontable.CellProperties
		) {
			Handsontable.renderers.TextRenderer.apply(this, arguments)
			td.innerHTML = ''
			// 根据当前单元格分词后显示不同颜色
			if (col >= 3) {
				const 原始数据Instance = hotInstance.getDataAtRowProp(row, '原始数据') as string
				const 当前单元格instance = hotInstance.getDataAtCell(row, col) as string

				const splited原始数据Instance = 数据处理先归一后分组词分词(原始数据Instance)
				const splited当前单元格instance = 数据处理先归一后分组词分词(当前单元格instance)

				splited当前单元格instance.forEach((item, idx) => {
					const divText = document.createElement('span')
					divText.textContent = `${item}`
					if (!splited原始数据Instance.includes(item)) {
						divText.style.color = 'red'
					} else {
						divText.style.color = 'blue'
					}
					td.appendChild(divText)
				})
				// 显示相似度
				const 相似度 = 对两个字符串数组取余弦相似度(splited原始数据Instance, splited当前单元格instance)
				if (相似度 >= 最小相似度.value && 相似度 !== 0) {
					const 相似度Text = document.createElement('div')
					相似度Text.textContent = `${相似度}`
					td.appendChild(相似度Text)
				}
			}
		}
	}
	return cellProperties
}
// 设置列
hotSettings.columns = function (index) {
	const columnProperties: Handsontable.ColumnSettings = {}
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
// 设置右键菜单
hotSettings.contextMenu = {
	items: {
		customMenuItem: {
			name: '添加至‘最相似项’',
			callback: function (key, selection, clickEvent) {
				this.setDataAtRowProp(
					selection[0].start.row,
					'最相似项',
					this.getDataAtCell(selection[0].start.row, selection[0].start.col),
					'自动修改'
				)
			}
		},
		分割线: ContextMenu.SEPARATOR,
		undo: {
			name: '撤销-Undo',
			disabled: function () {
				return !this.undoRedo.isUndoAvailable()
			},
			callback: function () {
				this.undo()
			}
		},
		redo: {
			name: '恢复-Redo',
			disabled: function () {
				return !this.undoRedo.isRedoAvailable()
			},
			callback: function () {
				this.redo()
			}
		}
	}
}

function 重新计算相似度() {
	if (!hotTableRef.value) throw new Error('hotTableRef.value is null')
	if (!hotTableRef.value.hotInstance) throw new Error('hotInstance is undefined')
	// 数据初始化开始操作
	const tasks = []
	const hotInstance = hotTableRef.value.hotInstance
	const 对比数据Array = hotInstance.getDataAtProp('对比数据')
	for (let i = 0; i < hotInstance.countRows(); i++) {
		const 对比后的相似度数组 = 对比数据Array
			.map((item) => 综合处理两个字符串(hotInstance.getDataAtRowProp(i, '原始数据'), item))
			// 降序
			.sort((a, b) => b.similarity - a.similarity)
		// 给第三列，单独设置
		tasks.push([
			i,
			2,
			对比后的相似度数组[0]?.similarity >= 最小最大相似度.value ? 对比后的相似度数组[0]?.str2 : null,
			'自动修改'
		])
		for (let j = 3; j < hotInstance.countCols(); j++) {
			tasks.push([
				i,
				j,
				对比后的相似度数组[j - 3]?.similarity >= 最小相似度.value?.similarity !== 0
					? 对比后的相似度数组[j - 3]?.str2
					: null,
				'自动修改'
			])
		}
	}
	hotInstance.batch(() => {
		tasks.forEach(([row, col, value, source]) => {
			hotInstance.setDataAtCell(row, col, value, source)
		})
	})
}
// 数据初始化完成，所有工作在这里展开
hotSettings.afterInit = function onAfterInit() {
	const hotInstance = hotTableRef.value.hotInstance as Handsontable
	hotInstance.addHook('afterChange', function (changes, source) {
		if (['loadData', '自动修改'].includes(source)) return
		重新计算相似度()
	})
}
//#endregion
//#region 相似度处理
const 最小最大相似度 = ref(0.9)
const 最小相似度 = ref(0.1)

onMounted(() => watch([最小最大相似度, 最小相似度], () => 重新计算相似度(), { immediate: true }))
onMounted(() => (document.title = '相似度在线页面'))
function 设置为第一个() {
	if (!hotTableRef.value) throw new Error('hotTableRef.value is null')
	if (!hotTableRef.value.hotInstance) throw new Error('hotInstance is undefined')
	// 数据初始化开始操作
	const tasks = []
	const hotInstance = hotTableRef.value.hotInstance
	const 对比数据Array = hotInstance.getDataAtProp('对比数据')
	for (let i = 0; i < hotInstance.countRows(); i++) {
		const 对比后的相似度数组 = 对比数据Array
			.map((item) => 综合处理两个字符串(hotInstance.getDataAtRowProp(i, '原始数据'), item))
			// 降序
			.sort((a, b) => b.similarity - a.similarity)
		// 给第三列，单独设置
		tasks.push([i, 2, 对比后的相似度数组[0]?.str2, '自动修改'])

		hotInstance.batch(() => {
			tasks.forEach(([row, col, value, source]) => {
				hotInstance.setDataAtCell(row, col, value, source)
			})
		})
	}
}
function 清空() {
	if (!hotTableRef.value) throw new Error('hotTableRef.value is null')
	if (!hotTableRef.value.hotInstance) throw new Error('hotInstance is undefined')
	const hotInstance = hotTableRef.value.hotInstance
	hotInstance.clear()
}

function Example数据展示() {
	if (!hotTableRef.value) throw new Error('hotTableRef.value is null')
	if (!hotTableRef.value.hotInstance) throw new Error('hotInstance is undefined')
	const hotInstance = hotTableRef.value.hotInstance
	hotInstance.loadData(example)
	重新计算相似度()
}

//#endregion
</script>

<style lang="less">
.handsontable td {
	white-space: normal !important;
	/* 强制单元格内容允许换行 */
	word-wrap: break-word;
	/* 长词也会换行 */
}
</style>
