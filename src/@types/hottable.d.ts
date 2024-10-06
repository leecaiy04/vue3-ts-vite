// handsontable.d.ts
import Handsontable from 'handsontable'
import type { CellChange } from 'handsontable/common'

declare module 'handsontable' {
	interface Handsontable {
		setDataAtCell(
			row: number,
			col: number,
			value: any,
			source?: Handsontable.ChangeSource | 'afterChange后修改的hook'
		): void
	}
}
