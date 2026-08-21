/** EMU per inch — `presLayout` reports size in EMU, every `addX` option is in inches */
const EMU = 914400

export interface GridProps {
	/** Slide width in inches @default 10 (LAYOUT_16x9) */
	w?: number
	/** Slide height in inches @default 5.625 (LAYOUT_16x9) */
	h?: number
	/** Column count @default 12 */
	cols?: number
	/** Row count @default 6 */
	rows?: number
	/** Space between cells, inches @default 0.2 */
	gutter?: number
	/** Space outside the grid, inches @default 0.5 */
	margin?: number
}

/** Position and size of one grid area, ready to spread into any `addX` options object */
export interface GridArea {
	x: number
	y: number
	w: number
	h: number
}

/**
 * Build a cell-placement function over a slide-sized grid.
 *
 * @example
 * const at = grid() // 12x6 over a 16:9 slide
 * slide.addText('Title', { ...at(0, 0, 12, 1), fontSize: 32 })
 * slide.addChart('bar', data, at(0, 1, 6, 5))
 */
export function grid (props: GridProps = {}): (col: number, row: number, colSpan?: number, rowSpan?: number) => GridArea {
	const { w = 10, h = 5.625, cols = 12, rows = 6, gutter = 0.2, margin = 0.5 } = props

	if (cols < 1 || rows < 1) throw new Error(`grid: cols and rows must be >= 1 (got ${cols}x${rows})`)

	const usableW = w - margin * 2 - gutter * (cols - 1)
	const usableH = h - margin * 2 - gutter * (rows - 1)
	if (usableW <= 0 || usableH <= 0) throw new Error(`grid: margin ${margin} and gutter ${gutter} leave no room in ${w}x${h}`)

	const colW = usableW / cols
	const rowH = usableH / rows

	return function at (col: number, row: number, colSpan = 1, rowSpan = 1): GridArea {
		if (!Number.isInteger(col) || !Number.isInteger(row)) throw new Error(`grid: col and row must be integers (got ${col},${row})`)
		if (colSpan < 1 || rowSpan < 1) throw new Error(`grid: spans must be >= 1 (got ${colSpan}x${rowSpan})`)
		if (col < 0 || row < 0) throw new Error(`grid: col and row must be >= 0 (got ${col},${row})`)
		if (col + colSpan > cols) throw new Error(`grid: col ${col} span ${colSpan} exceeds ${cols} columns`)
		if (row + rowSpan > rows) throw new Error(`grid: row ${row} span ${rowSpan} exceeds ${rows} rows`)

		return {
			x: margin + col * (colW + gutter),
			y: margin + row * (rowH + gutter),
			w: colSpan * colW + (colSpan - 1) * gutter,
			h: rowSpan * rowH + (rowSpan - 1) * gutter,
		}
	}
}

/** Grid sized from a live presentation's layout, so it tracks `defineLayout`/`layout` changes */
export function gridFor (pres: { presLayout: { width: number, height: number } }, props: Omit<GridProps, 'w' | 'h'> = {}): ReturnType<typeof grid> {
	return grid({ ...props, w: pres.presLayout.width / EMU, h: pres.presLayout.height / EMU })
}
