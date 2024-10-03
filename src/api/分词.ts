import axios from 'axios'
import type { AxiosResponse, AxiosRequestConfig } from 'axios'

export function 分词_字符数组<T>(str: string[], callback: (data: string[][]) => T): Promise<T>
export function 分词_字符数组(str: string[]): Promise<string[][]>
export function 分词_字符数组<T = string[][]>(arr: string[], callback?: (data: string[][]) => T) {
	// 使用 AxiosRequestConfig 明确指定请求配置的类型
	const config: AxiosRequestConfig = {
		method: 'post',
		url: 'http://nest.leecaiy.top:11111/cutword/words',
		headers: {
			'Content-Type': 'application/json'
		},
		data: JSON.stringify({
			data: arr
		})
	}

	return axios(config)
		.then((response: AxiosResponse<string[][]>) => {
			// 调用 callback 对数据进行处理，并返回处理后的结果
			if (callback) return callback(response.data)
			return response.data
		})
		.catch((error) => {
			console.error(error)
			throw error
		})
}

export function 分词_字符<T>(str: string, callback: (data: string[]) => T): Promise<T>
export function 分词_字符(str: string): Promise<string[]>
export function 分词_字符<T = string[]>(str: string, callback?: (data: string[]) => T) {
	const config: AxiosRequestConfig = {
		method: 'post',
		url: 'http://nest.leecaiy.top:11111/cutword',
		headers: {
			'Content-Type': 'application/json'
		},
		data: JSON.stringify({
			data: str
		})
	}

	return axios(config)
		.then((response: AxiosResponse<string[]>) => {
			// 调用 callback 对数据进行处理，并返回处理后的结果
			if (callback) return callback(response.data)
			return response.data
		})
		.catch((error) => {
			console.error(error)
			throw error
		})
}

// 分词_字符('你好世界!!!', (strarr) => strarr.join('~')).then((res) => {
// 	console.log(res)
// })
