type WeightedTerm = {
	term: string
	weight: number
}

/**
 * 将字符串利用指定词组数组拆分为数组，数组中值的长度作为权重
 * @param str 字符串
 * @param terms 词组数组（可选）
 * @returns WeightedTerm 数组
 */
function splitStringWithTerms(str: string, terms?: string[]): WeightedTerm[] {
	if (!str) return []
	if (str.length === 0) return []
	let matches: string[] = []
	if (!terms || terms.length === 0) return str.split('').map((char) => ({ term: char, weight: 1 }))
	const regex = new RegExp('(' + terms.join('|') + ')', 'g')
	matches = str.match(regex) || []
	const remainingStr = str.replace(regex, '')
	matches = matches.concat(remainingStr.split('').filter((char) => char.trim() !== ''))
	return matches.map((match) => ({ term: match, weight: match.length }))
}

/**
 * 计算两个字符串数组的余弦相似度
 * @param array1 WeightedTerm 数组
 * @param array2 WeightedTerm 数组
 * @returns 余弦相似度
 */
function cosineSimilarity(array1: WeightedTerm[], array2: WeightedTerm[]): number {
	const termFrequencyMap1: Record<string, number> = {}
	const termFrequencyMap2: Record<string, number> = {}

	array1.forEach(({ term, weight }) => {
		termFrequencyMap1[term] = (termFrequencyMap1[term] || 0) + weight
	})

	array2.forEach(({ term, weight }) => {
		termFrequencyMap2[term] = (termFrequencyMap2[term] || 0) + weight
	})

	const allTerms = new Set([...array1.map((t) => t.term), ...array2.map((t) => t.term)])

	let dotProduct = 0
	let magnitude1 = 0
	let magnitude2 = 0

	allTerms.forEach((term) => {
		const freq1 = termFrequencyMap1[term] || 0
		const freq2 = termFrequencyMap2[term] || 0

		dotProduct += freq1 * freq2
		magnitude1 += freq1 * freq1
		magnitude2 += freq2 * freq2
	})

	if (magnitude1 === 0 || magnitude2 === 0) {
		return 0
	}

	return parseFloat((dotProduct / Math.sqrt(magnitude1 * magnitude2)).toFixed(2))
}

/**
 * 主函数：比较两个字符串的余弦相似度
 * @param str1 第一个字符串
 * @param str2 第二个字符串
 * @param terms 用于拆分字符串的词组数组（可选）
 * @returns 余弦相似度
 */
function compareStringsCosineSimilarity(str1: string, str2: string, terms?: string[]): number {
	const weightedTerms1 = splitStringWithTerms(str1, terms)
	const weightedTerms2 = splitStringWithTerms(str2, terms)

	return cosineSimilarity(weightedTerms1, weightedTerms2)
}

export { compareStringsCosineSimilarity }
// 示例用法
// const str1 = "我是中国人";
// const str2 = "他是美国人";
// const terms: string[] = ["中国人"];

// const similarity = compareStringsCosineSimilarity(str1, str2, terms);
// console.log("Cosine Similarity:", similarity);

// // 示例用法（无词组数组）
// const similarityNoTerms = compareStringsCosineSimilarity(str1, str2);
// console.log("Cosine Similarity (No Terms):", similarityNoTerms);
