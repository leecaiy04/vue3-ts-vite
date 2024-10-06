function 标点归一化(str: string | null): string {
	if (!str) return ''
	// 创建一个映射表，中文标点 -> 英文标点
	const punctuationMap: { [key: string]: string } = {
		'，': ',',
		'。': '.',
		'！': '!',
		'？': '?',
		'：': ':',
		'；': ';',
		'“': '"',
		'”': '"',
		'‘': "'",
		'’': "'",
		'（': '(',
		'）': ')',
		'【': '[',
		'】': ']',
		'《': '<',
		'》': '>',
		'、': ',',
		'——': '-',
		'…': '...',
		'～': '~'
	}

	// 使用正则表达式替换字符串中的中文标点为英文标点
	return str.replace(/[，。！？：；“”‘’（）【】《》、——…～]/g, (match) => punctuationMap[match] || match)
}
function 根据正则分词为数组(str: string, keywords: string[] = ['杭政储出']): string[] {
	// 1. 将自定义关键词转义并组合成正则表达式的一部分
	const keywordsPattern = keywords
		.map((k) => k.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')) // eslint-disable-line
		.sort((a, b) => b.length - a.length) // 按照长度从大到小排序，防止子串干扰
		.join('|') // 用 '|' 连接为一个正则表达式

	// 2. 定义正则表达式，匹配自定义关键词、连续数字、单个非空字符
	const regex = new RegExp(`(${keywordsPattern})|([0-9]+)|([^0-9\\s])`, 'g')

	// 3. 使用正则表达式进行匹配并返回结果
	return str.match(regex) || []
}

/**
 * 对给定字符串进行分词处理，先将标点符号归一化，然后根据关键词进行分组
 *
 * @param str 待处理的字符串
 * @param keywords 关键词数组，用于分词的依据，默认为  ['杭政储出']
 * @returns 返回分词后的字符串数组
 */
export function 数据处理先归一后分组词分词(str: string | null, keywords?: string[]): string[] {
	// 根据正则表达式对字符串进行分词，这里调用了另一个函数，该函数可能包含了分词逻辑的具体实现
	// 参数1：已经进行了标点符号归一化的字符串
	// 参数2：用于分词的关键词数组
	return 根据正则分词为数组(标点归一化(str), keywords)
}

export function 对两个字符串数组取余弦相似度(arr1: string[], arr2: string[], rate: boolean = false): number {
	// 1. 构建词汇表（去重）
	const wordSet = new Set([...arr1, ...arr2])
	const wordList = Array.from(wordSet)

	// 2. 词频向量化
	function getFrequencyVector(arr: string[], wordList: string[]): number[] {
		return wordList.map((word) => arr.filter((item) => item === word).length * (rate ? word.length : 1))
	}

	const vector1 = getFrequencyVector(arr1, wordList)
	const vector2 = getFrequencyVector(arr2, wordList)

	// 3. 计算向量点积
	function dotProduct(vec1: number[], vec2: number[]): number {
		return vec1.reduce((sum, val, index) => sum + val * vec2[index], 0)
	}

	// 4. 计算向量的模（长度）
	function vectorMagnitude(vec: number[]): number {
		return Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0))
	}

	const dotProd = dotProduct(vector1, vector2)
	const magnitude1 = vectorMagnitude(vector1)
	const magnitude2 = vectorMagnitude(vector2)

	// 5. 计算余弦相似度
	if (magnitude1 === 0 || magnitude2 === 0) {
		return 0 // 如果其中一个向量的长度为0，相似度为0
	}

	// 返回两位有效数字

	return parseFloat((dotProd / (magnitude1 * magnitude2)).toFixed(2))
}

export function 综合处理两个字符串(str1: string | null, str2: string | null, keywords?: string[]) {
	if (!str1 || !str2)
		return {
			str1: '',
			str2: '',
			similarity: 0
		}
	const str1_list = 数据处理先归一后分组词分词(str1, keywords)
	const str2_list = 数据处理先归一后分组词分词(str2, keywords)
	return {
		str1,
		str2,
		similarity: 对两个字符串数组取余弦相似度(str1_list, str2_list)
	}
}
// console.log(对两个字符串数组取余弦相似度(['杭政储出', '6'], ['杭政储出', '7']))
