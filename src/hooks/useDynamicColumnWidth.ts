import { ref, onMounted, onUnmounted, type Ref } from 'vue'
import Handsontable from 'handsontable'
import { debounce } from 'lodash'

export function useWindowWidth(hotTableInstance: Ref<Handsontable | null>) {
	const newWidth = ref((document.documentElement.clientWidth - 60) / 9) // 宽度/10

	const updateColumnWidth = () => {
		newWidth.value = (document.documentElement.clientWidth - 60) / 9
		if (!hotTableInstance.value) return
		hotTableInstance.value.updateSettings({
			colWidths: newWidth.value
		})
	}

	const handleResize = debounce(() => {
		updateColumnWidth()
	}, 300) // 使用 lodash 防抖，延迟 300ms

	onMounted(() => {
		window.addEventListener('resize', handleResize)
		updateColumnWidth() // 初始设置
	})

	onUnmounted(() => {
		window.removeEventListener('resize', handleResize)
	})

	return { updateColumnWidth, ColWidth: newWidth }
}
