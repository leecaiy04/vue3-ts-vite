import { ref, type Ref } from 'vue'
import Handsontable from 'handsontable'
import { ElMessage } from 'element-plus'
import { utils, writeFile } from 'xlsx'

export function useDataHandle(hotTableInstance: Ref<Handsontable | null>) {
	function saveCurrentDataToPersistentState() {
		if (!hotTableInstance.value) {
			ElMessage.error('请确保 Handsontable 实例有效')
			return
		}

		// 获取表格中的所有数据
		const currentData = hotTableInstance.value.getData()

		// 使用 persistentState 将数据存储到本地存储中
		const hotSettings = hotTableInstance.value.getSettings()
		if (hotSettings.persistentState) {
			const key = 'hot_currentData' // 存储数据的唯一键值
			hotTableInstance.value.updateSettings({
				persistentState: true
			})

			// 将当前数据保存到 localStorage
			const persistentStorage = hotTableInstance.value.getPlugin('persistentState')
			if (persistentStorage) {
				persistentStorage.saveValue(key, currentData)
				ElMessage.success('表格数据已保存到 persistentState。')
			} else {
				ElMessage.error('persistentState 插件未能成功初始化。')
			}
		} else {
			ElMessage.error('persistentState 未启用，请启用该插件。')
		}
	}

	// 读取持久化数据的函数
	function loadPersistentDataToTable() {
		if (!hotTableInstance.value) {
			ElMessage.error('请确保 Handsontable 实例有效')
			return
		}

		const hotSettings = hotTableInstance.value.getSettings()
		if (hotSettings.persistentState) {
			const key = 'hot_currentData' // 存储数据的唯一键值
			hotTableInstance.value.updateSettings({
				persistentState: true
			})
			// 从 localStorage 中读取数据
			const persistentStorage = hotTableInstance.value.getPlugin('persistentState')
			if (persistentStorage) {
				const data = ref()
				persistentStorage.loadValue(key, data)
				console.log(data)
				if (data.value) hotTableInstance.value?.loadData(data.value, '恢复数据')
			} else {
				ElMessage.error('persistentState 插件未能成功初始化。')
			}
		} else {
			ElMessage.error('persistentState 未启用，请启用该插件。')
		}
	}
	function exampleData() {
		ElMessage.success('生成一组示例数据')
		hotTableInstance.value?.loadData(Handsontable.helper.createSpreadsheetData(10, 9), '恢复数据')
	}
	function clearData() {
		ElMessage.warning('clearData')
		hotTableInstance.value?.loadData([], '恢复数据')
	}

	// 清除前两列以外的数据
	function clearDataExceptFirstTwoColumns() {
		if (!hotTableInstance.value) {
			ElMessage.error('请确保 Handsontable 实例有效')
			return
		}

		const currentData = hotTableInstance.value.getData()
		const clearedData = currentData.map((row) => {
			return row.map((cell: any[], index: number) => {
				return index < 2 ? cell : null
			})
		})
		hotTableInstance.value.loadData(clearedData)
		ElMessage.success('前两列以外的数据已清除')
	}
	// 导出所有数据为 Excel 文件
	function exportDataToExcel() {
		if (!hotTableInstance.value) {
			ElMessage.error('请确保 Handsontable 实例有效')
			return
		}

		// 获取表格中的所有数据
		const currentData = hotTableInstance.value
			.getData()
			.map((row: Array<[string, number] | number>) =>
				row.map((cell) => (Array.isArray(cell) ? `${cell[0]}|${cell[1]}` : cell))
			)
		const worksheet = utils.aoa_to_sheet(currentData)
		const workbook = utils.book_new()
		utils.book_append_sheet(workbook, worksheet, 'Sheet1')

		// 导出 Excel 文件
		writeFile(workbook, '相似度表格.xlsx')
		ElMessage.success('数据已导出为 Excel 文件。')
	}
	return {
		saveCurrentDataToPersistentState,
		loadPersistentDataToTable,
		clearData,
		clearDataExceptFirstTwoColumns,
		exampleData,
		exportDataToExcel
	}
}
