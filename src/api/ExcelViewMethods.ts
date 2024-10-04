import axios from 'axios'
export async function 分词函数(strArr: Array<string>) {
	const axiosConfig = {
		method: 'post',
		url: 'http://nest.leecaiy.top:11111/cutword/words',
		headers: {
			'Content-Type': 'application/json'
		},
		data: JSON.stringify({
			data: Array.from(new Set([...strArr])),
			dict: ['杭政工出', '杭政储出'],
			synonym: [],
			stripPunctuation: true
		})
	}
	return await axios<Record<string, string[]>>(axiosConfig).then((item) => item.data)
}
// 分词函数(['你好', '啊哈，中国']).then(console.log)
// // { '你好': [ '你好' ], '啊哈，中国': [ '啊哈', '，', '中国' ] }
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
	if (arr1.length == 0) return 0
	if (arr2.length == 0) return 0
	// 计算两个数组的交集大小
	const intersectionSize = new Set([...arr1].filter((x) => arr2.includes(x)))
	// 计算后一个数组的并集大小
	const unionSize = new Set([...arr2])
	return unionSize.size === 0 ? 0 : parseFloat((intersectionSize.size / unionSize.size).toFixed(2))
}

export function jaccardSimilarityWithRate<T extends { length: number }>(arr1: Array<T>, arr2: Array<T>) {
	// 计算交集的长度总和
	const intersectionSize = [...arr1].filter((x) => arr2.includes(x)).reduce((sum, element) => sum + element.length, 0)

	// 计算后一个数组的并集大小
	const unionElements = new Set([...arr2])
	const unionSize = [...unionElements].reduce((sum, element) => sum + element.length, 0)

	// 返回相似度结果，保留两位小数
	return unionSize === 0 ? 0 : parseFloat((intersectionSize / unionSize).toFixed(2))
}

export function rendHtml<T>(
	arr1: Array<T>,
	arr2: Array<T>,
	color: 'red' | 'green' | 'blue' | 'yellow' = 'red'
): string {
	const str = arr2
		.map((item) => (!arr1.includes(item) ? `<div style="color: ${color};">${item}</div>` : `<div>${item}</div>`))
		.join('')
	return `${str}`
}
