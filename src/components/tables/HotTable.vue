<template>
	<div id="example1">
		<hot-table ref="hotTableRef" :settings="hotSettings"></hot-table>
	</div>
	<div>
		<span>选择最相似值最小的数字</span>
		<el-input-number v-model="最小最大相似度" :min="0.3" :max="1" :step="0.1" />
		<span>相似值显示最小的数字</span>
		<el-input-number v-model="最小相似度" :min="0" :max="0.9" :step="0.1" />
		<el-button type="primary" size="default" @click="设置为第一个()">空白的都选择第一个</el-button>
		<el-button type="primary" size="default" @click="重新计算相似度()">清空</el-button>
	</div>
</template>

<script lang="ts" setup>
/// <reference path="handsontable/handsontable.full.d.ts">
import { ref, reactive, onMounted } from 'vue'
import { HotTable } from '@handsontable/vue3'
import Handsontable from 'handsontable'
import { registerAllModules } from 'handsontable/registry'
import { registerLanguageDictionary, zhCN } from 'handsontable/i18n'
import 'handsontable/dist/handsontable.full.css'
import { debounce } from 'lodash'
// #region Handsontable 的初始化

registerAllModules()
registerLanguageDictionary(zhCN)

const hotTableRef = ref<HTMLDivElement | null>(null)
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
		相似3: {
			str: '西湖大学建设工程三期',
			similar: 0.5
		},
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
	const cellProperties: Partial<Handsontable.CellProperties> = {}
	if (col >= 3) {
		cellProperties.renderer = function customCellRenderer(
			hotInstance: Handsontable,
			td: HTMLTableCellElement,
			row: number,
			col: number,
			prop: string | number,
			value:
				| string
				| {
						strArray?: Array<[string, boolean]>
						similar: number
						raw: string
				  },
			cellProperties: Handsontable.CellProperties
		) {
			Handsontable.renderers.TextRenderer.apply(this, arguments)
			td.innerHTML = ''
			if (value?.strArray instanceof Array) {
				let count = 1
				for (const [str, isSame] of value.strArray) {
					const divText = document.createElement('div')
					divText.textContent = `${count}. ${str}`
					if (!isSame) {
						divText.style.color = 'red'
					} else {
						divText.style.color = 'blue'
					}
					td.appendChild(divText)
					count++
				}
				if (value.similar > 最小相似度.value) {
					const buleText = document.createElement('div')
					buleText.textContent = `相似度：${parseInt(value.similar * 100)}%`
					td.appendChild(buleText)
				}
			} else {
				const divText = document.createElement('div')
				divText.textContent = value
				td.appendChild(divText)
			}
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
hotSettings.afterInit = function onAfterInit() {
	console.log('Hottable初始化完成', hotTableRef.value.hotInstance)
}
//#endregion

//#region 相似度处理
import { 分词函数, jaccardSimilarity, jaccardSimilarityWithRate, rendHtml } from '@/api/ExcelViewMethods'
import { async } from '../../api/ExcelViewMethods'
const 最小相似度 = ref(0.1)
const 最小最大相似度 = ref(0.5)

const 分词对象: Record<string, string[]> = { '': [] }
const 相似度对象: Record<
	string,
	Array<{
		strArray: Array<[string, boolean]>
		similar: number
		raw?: string
	}>
> = { '': { str: '', similar: 0, strArray: [] } }

// hotTableInstance 需要在 mounted 后才能使用
onMounted(async () => {
	console.log('mounted')
	const hotTableInstance: Handsontable = hotTableRef.value.hotInstance
	async function 速度分词() {
		const hotTableInstance: Handsontable = hotTableRef.value.hotInstance
		const 原始数据Data = hotTableInstance.getDataAtProp('原始数据') as string[]
		const 对比数据Data = hotTableInstance.getDataAtProp('对比数据') as string[]
		const 新增数据Data = Array.from(new Set(原始数据Data.concat(对比数据Data))).filter((item) => !(item in 分词对象))
		// console.log(原始数据Data, 对比数据Data, 新增数据Data)
		Object.assign(分词对象, await 分词函数(新增数据Data))
	}
	async function 相似度处理() {
		await 速度分词()
		const 原始数据Data = (hotTableInstance.getDataAtProp('原始数据') as string[]) || []
		const 对比数据Data = (hotTableInstance.getDataAtProp('对比数据') as string[]) || []
		for (let i = 0; i < 原始数据Data.length; i++) {
			if (!原始数据Data[i]) {
				// console.log('原始数据Data[i]', i, 原始数据Data[i])
				break
			}
			// 对非空原始数据进行处理
			对比数据Data
				.map((对比数据, j) => {
					if (!对比数据) {
						// console.log('对比数据', j, 原始数据Data[i], 对比数据)
						return { str: '', similar: 0 }
					}
					// 对非对比空数据进行处理
					const similar = jaccardSimilarity(分词对象[原始数据Data[i]], 分词对象[对比数据])
					if (similar == 0) {
						// console.log('similar是0； 对比数据', j, 分词对象[原始数据Data[i]], 分词对象[对比数据])
						return { raw: '', similar: 0, strArray: [] }
					}
					return {
						raw: 对比数据,
						similar
					}
				})
				.sort((a, b) => b.similar - a.similar)
				.slice(0, 6)
				.forEach(
					(
						item: {
							strArray?: Array<[string, boolean]>
							similar: number
							raw: string
						},
						idx
					) => {
						// console.log(i, `相似${idx + 1}`, item, 'afterChange后修改的hook')
						item.strArray = 分词对象[item.raw].map((v) => [v, 原始数据Data[i].includes(v)])
						if (item.similar >= 最小最大相似度.value) {
							hotTableInstance.setDataAtRowProp(i, `最相似项`, item.raw, 'afterChange后修改的hook')
						}
						hotTableInstance.setDataAtRowProp(i, `相似${idx + 1}`, item, 'afterChange后修改的hook')
					}
				)
		}
	}
	await 相似度处理()
	// 加载时 执行一次
	hotTableInstance.addHook('afterChange', async (changes, source) => {
		if (source === 'loadData') return
		if (source === 'afterChange后修改的hook') return
		if (source === '重置') {
			for (let row = 0; row < 6; row++) {
				for (let col = 0; col < 9; col++) {
					hotTableInstance.setDataAtCell(row, col, '', 'afterChange后修改的hook')
				}
			}
			return
		}
		debounce(相似度处理, 300)()
	})
	// 添加分词的 hover 提示
	hotTableInstance.addHook(
		'afterOnCellMouseOver',
		debounce(function (event, coords, TD) {
			// console.log(coords, hotTableInstance)
		}, 500)
	)
	// 单击事件
	hotTableInstance.addHook('afterOnCellMouseDown', function (event, coords, TD) {
		if (coords.col >= 3) {
			console.log(coords.row, 2, hotTableInstance.getDataAtCell(coords.row, coords.col).raw, 'afterChange后修改的hook')
			hotTableInstance.setDataAtCell(
				coords.row,
				2,
				hotTableInstance.getDataAtCell(coords.row, coords.col).raw,
				'afterChange后修改的hook'
			)
		}
	})
})
function 设置为第一个() {
	// 如果html还没有生成，那么直接返回
	if (!hotTableRef.value) {
		console.log('hotTableRef 还没完成初始化')
		return
	}
	const hotTableInstance: Handsontable = hotTableRef.value.hotInstance
	const 最相似项Data = hotTableInstance.getDataAtProp('最相似项')
	for (let idx in 最相似项Data) {
		if (!最相似项Data[idx]) {
			const rowIdx = hotTableInstance.propToCol('相似1')
			hotTableInstance.setDataAtCell(
				idx,
				2,
				hotTableInstance.getDataAtCell(idx, rowIdx)?.raw,
				'afterChange后修改的hook'
			)
		}
	}
}
function 重新计算相似度() {
	const hotTableInstance: Handsontable = hotTableRef.value.hotInstance
	hotTableInstance.runHooks('afterChange', [], '重置')
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
