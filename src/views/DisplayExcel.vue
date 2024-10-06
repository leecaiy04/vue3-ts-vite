<template>
	<div class="flex flex-col h-full">
		<!-- 标题部分，使用 flex 布局居中 -->
		<h3 class="flex items-center justify-center text-4xl h-[4vh]">相似度比较工具</h3>
		<div class="h-[75%] flex flex-row">
			<!-- 左边部分，占固定宽度，垂直显示文字 -->
			<div class="w-[4%] flex flex-col items-center justify-center h-[80vh]">
				<div v-for="str in '相似度表格'" :key="str">{{ str }}</div>
			</div>
			<!-- 右边部分，占剩余宽度 -->
			<div class="flex-1 overflow-auto h-[80vh]">
				<hot-table ref="hotTableRef" :data="data" :settings="hotSettings" class="h-[85%] overflow-auto">
					<hot-column title="原始数据" data="原始数据" />
					<hot-column title="对比数据" data="对比数据" />
					<hot-column title="最相似项" data="最相似项" :settings="最相似项列hotSettings" read-only="true" />
					<hot-column
						v-for="i in 6"
						:title="`相似${i}`"
						:key="`相似${i}`"
						:prop="`相似${i}`"
						:settings="数字相似列hotSettings"
						read-only="true"
					/>
				</hot-table>
				<el-space class="h-[15%] w-[40%] flex justify-around">
					<el-button type="primary" size="default" @click="设置为第一个()">空白设置为第一个</el-button>
					<el-button type="primary" size="default" @click="Example数据展示()">导入Example数据</el-button>
					<el-button type="primary" size="default" @click="清空()">清空数据</el-button>
				</el-space>
			</div>
		</div>
		<div></div>
		<div class="flex items-center space-x-2 mt-4 h-[4%]">
			<span>选择最相似值最小的数字</span>
			<el-input-number v-model="最小最大相似度" :min="0.3" :max="1" :step="0.1" />
			<span>相似值显示最小的数字</span>
			<el-input-number v-model="最小相似度" :min="0" :max="0.9" :step="0.1" />
		</div>
		<div class="flex mt-4 h-[10%]">
			<!-- 左边文本显示区 -->
			<el-space class="w-1/2 overflow-auto">
				<el-tag type="success" v-for="tagItem in 整体看待的词组" :key="tagItem">{{ tagItem }}</el-tag>
			</el-space>
			<!-- 右边多样文本输入区 -->
			<div class="w-1/2">
				<el-input v-model="多行文本字符串整体看待" :autosize="true" type="textarea" placeholder="请输入" />
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
/// <reference path="handsontable/handsontable.full.d.ts">
import { ref, watch, reactive, onMounted, computed } from 'vue'
import { HotTable, HotColumn } from '@handsontable/vue3'
import Handsontable from 'handsontable'
import { registerAllModules } from 'handsontable/registry'
import { registerLanguageDictionary, zhCN } from 'handsontable/i18n'
import 'handsontable/dist/handsontable.full.css'
import { ElNotification } from 'element-plus'

import { 综合处理两个字符串, 数据处理先归一后分组词分词, 对两个字符串数组取余弦相似度 } from '@/utils/tools'
import { ContextMenu } from 'handsontable/plugins/contextMenu'

registerAllModules()
registerLanguageDictionary(zhCN)

const data = [
	{
		原始数据: '这是一串很长的字符串99',
		对比数据: '这是一串很短的字符串99',
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
const 最小最大相似度 = ref(0.9)
const 最小相似度 = ref(0.1)
const 多行文本字符串整体看待 = ref('杭政储出\n杭政工出')
const 整体看待的词组 = computed(() => {
	return Array.from(new Set(多行文本字符串整体看待.value.split('\n'))).filter(Boolean)
})

onMounted(() => watch([最小最大相似度, 最小相似度], () => 重新计算相似度(), { immediate: true }))
onMounted(() => (document.title = '相似度在线页面'))
const hotTableRef = ref<(HTMLDivElement & { hotInstance: Handsontable }) | null>(null)
const hotSettings = reactive<Handsontable.GridSettings>({
	maxCols: 9,
	startRows: 8,
	startCols: 9,
	minRows: 8,
	colHeaders: true,
	colWidths: document.documentElement.clientWidth / 10,
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
				// @ts-ignore
				return !this.undoRedo.isUndoAvailable()
			},
			callback: function () {
				this.undo()
			}
		},
		redo: {
			name: '恢复-Redo',
			disabled: function () {
				// @ts-ignore
				return !this.undoRedo.isRedoAvailable()
			},
			callback: function () {
				this.redo()
			}
		}
	}
}
const 最相似项列hotSettings = reactive<Handsontable.ColumnSettings>({
	renderer: (
		instance: Handsontable,
		td: HTMLTableCellElement,
		row: number,
		col: number,
		prop: string | number,
		value: string,
		cellProperties: Handsontable.CellProperties
	) => {
		Handsontable.renderers.BaseRenderer.call(this, instance, td, row, col, prop, value, cellProperties)
		// 清空单元格内容
		Handsontable.dom.empty(td)

		const 原始数据Instance = instance.getDataAtRowProp(row, '原始数据') as string
		const 当前单元格instance = instance.getDataAtCell(row, col) as string

		const splited原始数据Instance = 数据处理先归一后分组词分词(原始数据Instance, 整体看待的词组.value) as string[]
		const splited当前单元格instance = 数据处理先归一后分组词分词(当前单元格instance, 整体看待的词组.value) as string[]

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
		if (相似度 >= 最小相似度.value && 相似度 !== 0 && col >= 3) {
			const 相似度Text = document.createElement('div')
			相似度Text.textContent = `${相似度}`
			td.appendChild(相似度Text)
		}
	}
})
const 数字相似列hotSettings = reactive<Handsontable.ColumnSettings>({
	renderer: (
		instance: Handsontable,
		td: HTMLTableCellElement,
		row: number,
		col: number,
		prop: string | number,
		value: string,
		cellProperties: Handsontable.CellProperties
	) => {
		Handsontable.renderers.BaseRenderer.call(this, instance, td, row, col, prop, value, cellProperties)
		// 清空单元格内容
		Handsontable.dom.empty(td)

		const 原始数据Instance = instance.getDataAtRowProp(row, '原始数据') as string
		const 当前单元格instance = instance.getDataAtCell(row, col) as string

		const splited原始数据Instance: string[] = 数据处理先归一后分组词分词(原始数据Instance, 整体看待的词组.value)
		const splited当前单元格instance: string[] = 数据处理先归一后分组词分词(当前单元格instance, 整体看待的词组.value)

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
		const 相似度 = 综合处理两个字符串(原始数据Instance, 当前单元格instance, 整体看待的词组.value)
		if (相似度.similarity >= 最小相似度.value && 相似度 !== 0) {
			const 相似度Text = document.createElement('div')
			相似度Text.textContent = `${相似度.similarity}`
			td.appendChild(相似度Text)
		}
	}
})

function 重新计算相似度() {
	if (!hotTableRef.value) throw new Error('hotTableRef.value is null')
	if (!hotTableRef.value.hotInstance) throw new Error('hotInstance is undefined')
	// 数据初始化开始操作
	const tasks: [number, number, string | null, '自动修改'][] = []
	const hotInstance = hotTableRef.value.hotInstance
	const 对比数据Array = hotInstance.getDataAtProp('对比数据')
	for (let i = 0; i < hotInstance.countRows(); i++) {
		const 对比后的相似度数组 = 对比数据Array
			.map((item) => 综合处理两个字符串(hotInstance.getDataAtRowProp(i, '原始数据'), item, 整体看待的词组.value))
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
				对比后的相似度数组[j - 3]?.similarity >= 最小相似度.value ? 对比后的相似度数组[j - 3]?.str2 : null,
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
	const hotInstance = hotTableRef.value!.hotInstance as Handsontable
	hotInstance.addHook('afterChange', function (changes, source) {
		if (['自动修改'].includes(source)) return
		重新计算相似度()
	})

	hotInstance.addHook('afterOnCellMouseDown', (event, coords, TD) => {
		if (coords.col !== 2) return
		ElNotification({
			title: `哈哈`,
			message: `${coords.row}行${coords.col}列`,
			type: 'success',
			duration: 2000
		})
	})
}

function 设置为第一个() {
	if (!hotTableRef.value) throw new Error('hotTableRef.value is null')
	if (!hotTableRef.value.hotInstance) throw new Error('hotInstance is undefined')
	// 数据初始化开始操作
	const tasks: [number, number, string | null, '自动修改'][] = []
	const hotInstance = hotTableRef.value.hotInstance
	const 对比数据Array = hotInstance.getDataAtProp('对比数据')
	for (let i = 0; i < hotInstance.countRows(); i++) {
		const 对比后的相似度数组 = 对比数据Array
			.map((item) => 综合处理两个字符串(hotInstance.getDataAtRowProp(i, '原始数据'), item, 整体看待的词组.value))
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
	hotInstance.loadData(
		example.map((item) => ({
			原始数据: '',
			对比数据: '',
			最相似项: '',
			相似1: '',
			相似2: '',
			相似3: '',
			相似4: '',
			相似5: '',
			相似6: ''
		})),
		'自动修改'
	)
	console.log('清空完成', hotInstance.getData())
}

function Example数据展示() {
	if (!hotTableRef.value) throw new Error('hotTableRef.value is null')
	if (!hotTableRef.value.hotInstance) throw new Error('hotInstance is undefined')
	const hotInstance = hotTableRef.value.hotInstance
	hotInstance.loadData(example, '自动修改')
	console.log('Example数据展示', hotInstance.getData())
}

//#endregion
</script>

<style>
/* 美化扇面表格的样式 */
.table-fan {
	border-collapse: collapse;
	width: 100%;
	margin-top: 20px;
	font-size: 16px;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.table-fan th,
.table-fan td {
	border: 1px solid #ddd;
	padding: 12px;
	text-align: center;
}

.table-fan th {
	background-color: #f5f5f5;
	color: #333;
	font-weight: bold;
}

.table-fan tr:nth-child(even) {
	background-color: #f9f9f9;
}

.table-fan tr:hover {
	background-color: #f1f1f1;
}
</style>
