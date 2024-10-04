export type DataKey = '原始数据' | '对比数据'
export type SimilarKey = `相似${number}`
export type ColmunKey = '序号' | DataKey | SimilarKey

export type TableData = {
	序号?: number
} & {
	最相似项?: string
} & {
	[key in DataKey]: string
} & {
	[key in SimilarKey]?: string
}
