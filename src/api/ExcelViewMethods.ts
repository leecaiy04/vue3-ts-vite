import axios from 'axios'

export async function 分词并对比相似度(strArr1: Array<string>, strArr2: Array<string>) {
	const axiosConfig = {
		method: 'post',
		url: 'http://nest.leecaiy.top:11111/cutword/words',
		headers: {
			'Content-Type': 'application/json'
		},
		data: JSON.stringify({
			data: Array.from(new Set([...strArr1, ...strArr2]))
		})
	}
	const res = await axios<Record<string, string[]>>(axiosConfig).then((item) => item.data)
	const result: { [str1 in string]: { str2: string; similarity: number }[] } = {}
	for (const str1 of strArr1) {
		if (!str1) break
		result[str1] = []
		for (const str2 of strArr2) {
			if (!str2) break
			const obj = { similarity: jaccardSimilarity(res[str1], res[str2]), str2: str2 }
			result[str1].push(obj)
		}
		result[str1].sort((a, b) => b.similarity - a.similarity)
	}
	return { 分词数组: res, 相似度: result }
}

export function jaccardSimilarity<T>(arr1: Array<T>, arr2: Array<T>) {
	// 计算两个数组的交集大小
	const intersectionSize = new Set([...arr1].filter((x) => arr2.includes(x)))
	// 计算两个数组的并集大小
	const unionSize = new Set([...arr1, ...arr2])
	return unionSize.size === 0 ? 0 : parseFloat((intersectionSize.size / unionSize.size).toFixed(2))
}

export function rendHtml<T>(
	arr1: Array<T>,
	arr2: Array<T>,
	color: 'red' | 'green' | 'blue' | 'yellow' = 'red'
): string {
	// 计算并返回借卡相似度
	const str = arr2
		.map((item) => (!arr1.includes(item) ? `<span style="color: ${color};">${item}</span>` : item))
		.join('')
	return `${str}`
}
