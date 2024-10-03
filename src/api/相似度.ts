/**
 * 计算两个数组之间的Jaccard相似度
 * Jaccard相似度是通过两个集合的交集大小除以并集大小得到的，用于衡量两个集合的相似性
 *
 * @param arr1 第一个数组
 * @param arr2 第二个数组
 * @returns 返回一个对象，包含相似度、交集和并集
 */
export function jaccardSimilarity<T>(arr1: Array<T>, arr2: Array<T>) {
	// 计算两个数组的交集大小
	const intersectionSize = new Set([...arr1].filter((x) => arr2.includes(x)))
	// 计算两个数组的并集大小
	const unionSize = new Set([...arr1, ...arr2])

	return {
		相似度: unionSize.size === 0 ? 0 : intersectionSize.size / unionSize.size,
		arr2,
		arr1
	}
}

export function jaccardSimilarityWithArrays<T>(arr1: Array<T>, arr2: Array<Array<T>>) {
	return arr2.map((item) => jaccardSimilarity(arr1, item)).sort((a, b) => b.相似度 - a.相似度)
}

export function rendHtml<T>(
	arr1: Array<T>,
	arr2: Array<T>,
	color: 'red' | 'green' | 'blue' | 'yellow' = 'red'
): `<div>${string}</div>` {
	// 计算并返回借卡相似度
	const str = arr2
		.map((item) => (arr1.includes(item) ? `<span style="color: ${color};">${item}</span>` : item))
		.join('')
	return `<div>${str}</div>`
}
