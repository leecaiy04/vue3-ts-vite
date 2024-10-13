import { ref, onMounted, onUnmounted, type Ref } from 'vue'
import Handsontable from 'handsontable'
import { debounce } from 'lodash'

export function useSimilarity(hotTableInstance: Ref<Handsontable | null>) {
	if (!hotTableInstance.value) return
}
