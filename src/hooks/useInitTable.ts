// Handsontable 的设置
import { ref, onMounted, onUnmounted, type Ref, readonly } from 'vue'
import Handsontable from 'handsontable'
import 'handsontable/dist/handsontable.full.min.css'
import { ContextMenu } from 'handsontable/plugins/contextMenu'
import { registerAllModules } from 'handsontable/registry'
import { registerLanguageDictionary, zhCN } from 'handsontable/i18n'

const minThreshold = ref(0.1) // 相似度的最小阈值
const maxLikelihood = ref(0.9) // 最相似值的阈值
function renderer_最相似(
	instance: Handsontable,
	td: HTMLTableCellElement,
	row: number,
	col: number,
	prop: string | number,
	value: string | [string, number, boolean]
) {
	if (!(value instanceof Array)) {
		td.innerText = value
		return td
	}
	td.innerText = ''
	const compareStringInRow = instance.getDataAtCell(row, 0) as string | null
	if (!compareStringInRow) return td
	if (!value[2]) return td
	value[0].split('').forEach((item: string) => {
		const divText = document.createElement('span')
		divText.textContent = `${item}`
		if (!compareStringInRow.includes(item)) {
			divText.style.color = 'red'
		} else {
			divText.style.color = 'blue'
		}
		td.appendChild(divText)
	})

	return td
}
const renderer_idx = (idx: number) => {
	const renderer = function (
		instance: Handsontable,
		td: HTMLTableCellElement,
		row: number,
		col: number,
		prop: string | number,
		value: string | [string, number, boolean]
	) {
		if (!(value instanceof Array)) {
			td.innerText = value
			return td
		}
		td.innerText = ''
		if (!value[2]) {
			return td
		}
		if (value[1] < minThreshold.value && value[2]) {
			td.innerText = `${value[1]}`
			return td
		}

		const compareStringInRow: string = instance.getDataAtCell(row, 0)
		if (!value[0] || !compareStringInRow) return td
		value[0].split('').forEach((item: string) => {
			const divText = document.createElement('span')
			divText.textContent = `${item}`
			if (!compareStringInRow.includes(item)) {
				divText.style.color = 'red'
			} else {
				divText.style.color = 'blue'
			}
			td.appendChild(divText)
		})
		// 增加一行相似度的div
		const divLikelihood = document.createElement('div')
		divLikelihood.textContent = `${value[1]}`
		td.appendChild(divLikelihood)
		return td
	}
	return { renderer, readonly: true }
}
export function useInitTable(hotContainer: Ref<HTMLDivElement | null>, hotInstance: Ref<Handsontable | null>) {
	function reRender() {
		// 不重新计算，仅设置是否显示，然后刷新
		const datasIn3_8 = hotInstance.value?.getSourceData() as Array<Array<string | [string, number, boolean]>>
		datasIn3_8.map((row, rowIdx) => {
			const rewRow = row
			rewRow.map((cell, cellIdx) => {
				if (cell instanceof Array && cellIdx === 2) cell[2] = cell[1] >= maxLikelihood.value
				if (cell instanceof Array && cellIdx >= 3) cell[2] = cell[1] >= minThreshold.value
			})
			return rewRow
		})
		hotInstance.value?.loadData(datasIn3_8)
	}
	onMounted(() => {
		registerAllModules()
		registerLanguageDictionary(zhCN)
		if (hotContainer.value) {
			hotInstance.value = new Handsontable(hotContainer.value, {
				data: Handsontable.helper.createSpreadsheetData(30, 9),
				colHeaders: ['原始数据', '对比数据', '最相似', '相似1', '相似2', '相似3', '相似4', '相似5', '相似6'],
				maxCols: 9,
				startRows: 8,
				startCols: 9,
				minRows: 8,
				width: '100%',
				height: '100%',
				columns: [
					{},
					{},
					{ renderer: renderer_最相似 },
					renderer_idx(1),
					renderer_idx(2),
					renderer_idx(3),
					renderer_idx(4),
					renderer_idx(5),
					renderer_idx(6)
				],
				contextMenu: {
					items: {
						copy: {
							name: '复制'
						},
						customMenuItem: {
							name: '添加至‘最相似项’',
							callback: function (key, selection) {
								if (selection[0].start.col < 2) return
								const firstCellValue: [string, number] | string = this.getDataAtCell(
									selection[0].start.row,
									selection[0].start.col
								)
								this.setDataAtCell(
									selection[0].start.row,
									2,
									firstCellValue instanceof Array ? firstCellValue[0] : firstCellValue,
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
				},
				autoWrapRow: true,
				autoWrapCol: true,
				wordWrap: true,
				filters: true,
				dropdownMenu: true,
				language: 'zh-CN',
				persistentState: true,
				licenseKey: 'non-commercial-and-evaluation' // handsontable需要设置许可证
			})
		}
	})
	onUnmounted(() => {
		hotInstance.value?.destroy()
	})
	return {
		minThreshold,
		maxLikelihood,
		reRender
	}
}
// 设置动态列宽
