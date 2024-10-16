import { ref, onMounted, onUnmounted, type Ref } from 'vue'
import Handsontable from 'handsontable'
import { debounce } from 'lodash'
import stringSimilarity from 'string-similarity'
import { ElMessage } from 'element-plus'

function numberFixed(num: number, fixed: number = 2) {
	return parseFloat(num.toFixed(fixed))
}
export function useSimilarity(
	hotTableInstance: Ref<Handsontable | null>,
	maxLikelihood: Ref<number>,
	minThreshold: Ref<number>
) {
	// if (!hotTableInstance.value) return

	function getSimilarityTotal() {
		if (!hotTableInstance.value) {
			console.error('请确保 Handsontable 实例有效')
			return
		}

		// 获取第一列和第二列的数据
		const originColDatas = hotTableInstance.value.getSourceData() as string[][]
		const firstColumn = originColDatas.map((row) => row[0])
		const secondColumn = originColDatas.map((row) => row[1])

		// 记录开始时间
		const startTime = performance.now()

		// 计算第一列与第二列中所有项的相似度并展平相似度数组
		const Results = firstColumn.map((item, index) => {
			return secondColumn
				.map((secondItem) => {
					return {
						firstValue: item,
						secondValue: secondItem,
						similarity: numberFixed(
							stringSimilarity.compareTwoStrings(item?.toString() || '', secondItem?.toString() || ''),
							2
						),
						firstIndex: index
					}
				})
				.sort((a, b) => b.similarity - a.similarity)
				.slice(0, 6)
		})
		// 批量设置数据以减少渲染频率，提升用户体验
		hotTableInstance.value.batch(() => {
			Results.forEach((items, idx) => {
				hotTableInstance.value?.setDataAtCell(idx, 2, [
					items[0].secondValue,
					items[0].similarity,
					items[0].similarity >= maxLikelihood.value
				])
				for (let i = 3; i <= 8; i++) {
					hotTableInstance.value?.setDataAtCell(idx, i, [
						items[i - 3].secondValue,
						items[i - 3].similarity,
						items[i - 3].similarity >= minThreshold.value
					])
				}
			})
		})

		// 记录结束时间并计算总时间
		const endTime = performance.now()
		const timeTaken = ((endTime - startTime) / 1000).toFixed(2)
		ElMessage.success(`计算完成，耗时 ${timeTaken} 秒`)
	}

	const debounceGetSimilarityTotal = debounce(getSimilarityTotal, 800)
	return { getSimilarityTotal, debounceGetSimilarityTotal }
}
