// handsontable.d.ts
import Handsontable from 'handsontable'
import type { CellChange } from 'handsontable/common'

declare module 'handsontable' {
	interface Handsontable {
		// 扩展 ChangeSource 类型，添加自定义 source
		setDataAtCell(
			row: number,
			col: number,
			value: any,
			source?: Handsontable.ChangeSource | 'afterChange后修改的hook'
		): void
	}
}
