/**
 * PptxGenJS: Table Generation
 */

import { DEF_FONT_SIZE, DEF_SLIDE_MARGIN_IN, EMU, LINEH_MODIFIER, ONEPT, SLIDE_OBJECT_TYPES } from './core-enums'
import { PresLayout, SlideLayout, TableCell, TableToSlidesProps, TableRow, TableRowSlide, TableCellProps, BorderProps } from './core-interfaces'
import { debugLog, getSmartParseNumber, inch2Emu, isDebugEnabled, rgbToHex, valToPts } from './gen-utils'
import PptxGenJS from './pptxgen'

/**
 * Break cell text into lines based upon table column width (e.g.: Magic Happens Here(tm))
 * @param {TableCell} cell - table cell
 * @param {number} colWidth - table column width (inches)
 * @return {TableRow[]} - cell's text objects grouped into lines
 */
function parseTextToLines(cell: TableCell, colWidth: number): TableCell[][] {
	// FYI: CPL = Width / (font-size / font-constant)
	// FYI: CHAR:2.3, colWidth:10, fontSize:12 => CPL=138, (actual chars per line in PPT)=145 [14.5 CPI]
	// FYI: CHAR:2.3, colWidth:7 , fontSize:12 => CPL= 97, (actual chars per line in PPT)=100 [14.3 CPI]
	// FYI: CHAR:2.3, colWidth:9 , fontSize:16 => CPL= 96, (actual chars per line in PPT)=84  [ 9.3 CPI]
	const FOCO = 2.3 + (cell.options?.autoPageCharWeight ? cell.options.autoPageCharWeight : 0) // Character Constant
	const CPL = Math.floor((colWidth / ONEPT) * EMU) / ((cell.options?.fontSize ? cell.options.fontSize : DEF_FONT_SIZE) / FOCO) // Chars-Per-Line

	const parsedLines: TableCell[][] = []
	let inputCells: TableCell[] = []
	const inputLines1: TableCell[][] = []
	const inputLines2: TableCell[][] = []
	/*
		if (cell.options && cell.options.autoPageCharWeight) {
			let CHR1 = 2.3 + (cell.options && cell.options.autoPageCharWeight ? cell.options.autoPageCharWeight : 0) // Character Constant
			let CPL1 = ((colWidth / ONEPT) * EMU) / ((cell.options && cell.options.fontSize ? cell.options.fontSize : DEF_FONT_SIZE) / CHR1) // Chars-Per-Line
			debugLog(`cell.options.autoPageCharWeight: '${cell.options.autoPageCharWeight}' => CPL: ${CPL1}`)
			let CHR2 = 2.3 + 0
			let CPL2 = ((colWidth / ONEPT) * EMU) / ((cell.options && cell.options.fontSize ? cell.options.fontSize : DEF_FONT_SIZE) / CHR2) // Chars-Per-Line
			debugLog(`cell.options.autoPageCharWeight: '0' => CPL: ${CPL2}`)
		}
	*/

	/**
	 * EX INPUTS: `cell.text`
	 * - string....: "Account Name Column"
	 * - object....: { text:"Account Name Column" }
	 * - object[]..: [{ text:"Account Name", options:{ bold:true } }, { text:" Column" }]
	 * - object[]..: [{ text:"Account Name", options:{ breakLine:true } }, { text:"Input" }]
	 */

	/**
	 * EX OUTPUTS:
	 * - string....: [{ text:"Account Name Column" }]
	 * - object....: [{ text:"Account Name Column" }]
	 * - object[]..: [{ text:"Account Name", options:{ breakLine:true } }, { text:"Input" }]
	 * - object[]..: [{ text:"Account Name", options:{ breakLine:true } }, { text:"Input" }]
	 */

	// STEP 1: Ensure inputCells is an array of TableCells
	if (cell.text && cell.text.toString().trim().length === 0) {
		// Allow a single space/whitespace as cell text (user-requested feature)
		inputCells.push({ _type: SLIDE_OBJECT_TYPES.tablecell, text: ' ' })
	} else if (typeof cell.text === 'number' || typeof cell.text === 'string') {
		inputCells.push({ _type: SLIDE_OBJECT_TYPES.tablecell, text: (cell.text || '').toString().trim() })
	} else if (Array.isArray(cell.text)) {
		inputCells = cell.text
	}
	if (isDebugEnabled()) {
		debugLog('[1/4] inputCells')
		inputCells.forEach((cell, idx) => debugLog(`[1/4] [${idx + 1}] cell: ${JSON.stringify(cell)}`))
		// debugLog('...............................................\n\n')
	}

	// STEP 2: Group table cells into lines based on "\n" or `breakLine` prop
	/**
	 * - EX: `[{ text:"Input Output" }, { text:"Extra" }]`                       == 1 line
	 * - EX: `[{ text:"Input" }, { text:"Output", options:{ breakLine:true } }]` == 1 line
	 * - EX: `[{ text:"Input\nOutput" }]`                                        == 2 lines
	 * - EX: `[{ text:"Input", options:{ breakLine:true } }, { text:"Output" }]` == 2 lines
	 */
	let newLine: TableCell[] = []
	inputCells.forEach(cell => {
		// (this is always true, we just constructed them above, but we need to tell typescript b/c type is still string||Cell[])
		if (typeof cell.text === 'string') {
			if (cell.text.split('\n').length > 1) {
				cell.text.split('\n').forEach(textLine => {
					newLine.push({
						_type: SLIDE_OBJECT_TYPES.tablecell,
						text: textLine,
						options: { ...cell.options, ...{ breakLine: true } },
					})
				})
			} else {
				newLine.push({
					_type: SLIDE_OBJECT_TYPES.tablecell,
					text: cell.text.trim(),
					options: cell.options,
				})
			}

			if (cell.options?.breakLine) {
				if (isDebugEnabled()) debugLog(`inputCells: new line > ${JSON.stringify(newLine)}`)
				inputLines1.push(newLine)
				newLine = []
			}
		}

		// Flush buffer
		if (newLine.length > 0) {
			inputLines1.push(newLine)
			newLine = []
		}
	})
	if (isDebugEnabled()) {
		debugLog(`[2/4] inputLines1 (${inputLines1.length})`)
		inputLines1.forEach((line, idx) => debugLog(`[2/4] [${idx + 1}] line: ${JSON.stringify(line)}`))
		// debugLog('...............................................\n\n')
	}

	// STEP 3: Tokenize every text object into words (then it's really easy to assemble lines below without having to break text, add its `options`, etc.)
	inputLines1.forEach(line => {
		line.forEach(cell => {
			const lineCells: TableCell[] = []
			const cellTextStr = String(cell.text) // force convert to string (compiled JS is better with this than a cast)
			const lineWords = cellTextStr.split(' ')

			lineWords.forEach((word, idx) => {
				const cellProps = { ...cell.options }
				// IMPORTANT: Handle `breakLine` prop - we cannot apply to each word - only apply to very last word!
				if (cellProps?.breakLine) cellProps.breakLine = idx + 1 === lineWords.length
				lineCells.push({ _type: SLIDE_OBJECT_TYPES.tablecell, text: word + (idx + 1 < lineWords.length ? ' ' : ''), options: cellProps })
			})

			inputLines2.push(lineCells)
		})
	})
	if (isDebugEnabled()) {
		debugLog(`[3/4] inputLines2 (${inputLines2.length})`)
		inputLines2.forEach(line => debugLog(`[3/4] line: ${JSON.stringify(line)}`))
		// debugLog('...............................................\n\n')
	}

	// STEP 4: Group cells/words into lines based upon space consumed by word letters
	inputLines2.forEach(line => {
		let lineCells: TableCell[] = []
		let strCurrLine = ''

		line.forEach(word => {
			const wordText = word.text ?? ''
			// A: create new line when horizontal space is exhausted
			if (strCurrLine.length + wordText.length > CPL) {
				// debugLog(`STEP 4: New line added: (${strCurrLine.length} + ${word.text.length} > ${CPL})`);
				parsedLines.push(lineCells)
				lineCells = []
				strCurrLine = ''
			}

			// B: add current word to line cells
			lineCells.push(word)

			// C: add current word to `strCurrLine` which we use to keep track of line's char length
			strCurrLine += wordText.toString()
		})

		// Flush buffer: Only create a line when there's text to avoid empty row
		if (lineCells.length > 0) parsedLines.push(lineCells)
	})
	if (isDebugEnabled()) {
		debugLog(`[4/4] parsedLines (${parsedLines.length})`)
		parsedLines.forEach((line, idx) => debugLog(`[4/4] [Line ${idx + 1}]:\n${JSON.stringify(line)}`))
		debugLog('...............................................\n\n')
	}

	// Done:
	return parsedLines
}

/**
 * Takes an array of table rows and breaks into an array of slides, which contain the calculated amount of table rows that fit on that slide
 * @param {TableCell[][]} tableRows - table rows
 * @param {TableToSlidesProps} tableProps - table2slides properties
 * @param {PresLayout} presLayout - presentation layout
 * @param {SlideLayout} masterSlide - master slide
 * @return {TableRowSlide[]} array of table rows
 */
export function getSlidesForTableRows(tableRows: TableCell[][] = [], tableProps: TableToSlidesProps = {}, presLayout: PresLayout, masterSlide?: SlideLayout): TableRowSlide[] {
	let arrInchMargins = DEF_SLIDE_MARGIN_IN
	let emuSlideTabW = EMU * 1
	let emuSlideTabH = EMU * 1
	let emuTabCurrH = 0
	let numCols = 0
	const tableRowSlides: TableRowSlide[] = []
	const tablePropX = getSmartParseNumber(tableProps.x, 'X', presLayout)
	const tablePropY = getSmartParseNumber(tableProps.y, 'Y', presLayout)
	const tablePropW = getSmartParseNumber(tableProps.w, 'X', presLayout)
	const tablePropH = getSmartParseNumber(tableProps.h, 'Y', presLayout)
	let tableCalcW = tablePropW

	function calcSlideTabH(): void {
		let emuStartY = 0
		if (tableRowSlides.length === 0) emuStartY = tablePropY || inch2Emu(arrInchMargins[0])
		if (tableRowSlides.length > 0) emuStartY = inch2Emu(tableProps.autoPageSlideStartY || tableProps.newSlideStartY || arrInchMargins[0])
		emuSlideTabH = (tablePropH || presLayout.height) - emuStartY - inch2Emu(arrInchMargins[2])
		// debugLog(`| startY .......................................... = ${(emuStartY / EMU).toFixed(1)}`)
		// debugLog(`| emuSlideTabH .................................... = ${(emuSlideTabH / EMU).toFixed(1)}`)
		if (tableRowSlides.length > 1) {
			// D: RULE: Use margins for starting point after the initial Slide, not `opt.y` (ISSUE #43, ISSUE #47, ISSUE #48)
			if (typeof tableProps.autoPageSlideStartY === 'number') {
				emuSlideTabH = (tablePropH || presLayout.height) - inch2Emu(tableProps.autoPageSlideStartY + arrInchMargins[2])
			} else if (typeof tableProps.newSlideStartY === 'number') {
				// @deprecated v3.3.0
				emuSlideTabH = (tablePropH || presLayout.height) - inch2Emu(tableProps.newSlideStartY + arrInchMargins[2])
			} else if (tablePropY) {
				emuSlideTabH = (tablePropH || presLayout.height) - inch2Emu((tablePropY / EMU < arrInchMargins[0] ? tablePropY / EMU : arrInchMargins[0]) + arrInchMargins[2])
				// Use whichever is greater: area between margins or the table H provided (dont shrink usable area - the whole point of over-riding Y on paging is to *increase* usable space)
				if (emuSlideTabH < tablePropH) emuSlideTabH = tablePropH
			}
		}
	}

	if (isDebugEnabled()) {
		debugLog('[[VERBOSE MODE]]')
		debugLog('|-- TABLE PROPS --------------------------------------------------------|')
		debugLog(`| presLayout.width ................................ = ${(presLayout.width / EMU).toFixed(1)}`)
		debugLog(`| presLayout.height ............................... = ${(presLayout.height / EMU).toFixed(1)}`)
		debugLog(`| tableProps.x .................................... = ${typeof tableProps.x === 'number' ? (tableProps.x / EMU).toFixed(1) : tableProps.x}`)
		debugLog(`| tableProps.y .................................... = ${typeof tableProps.y === 'number' ? (tableProps.y / EMU).toFixed(1) : tableProps.y}`)
		debugLog(`| tableProps.w .................................... = ${typeof tableProps.w === 'number' ? (tableProps.w / EMU).toFixed(1) : tableProps.w}`)
		debugLog(`| tableProps.h .................................... = ${typeof tableProps.h === 'number' ? (tableProps.h / EMU).toFixed(1) : tableProps.h}`)
		debugLog(`| tableProps.slideMargin .......................... = ${tableProps.slideMargin ? String(tableProps.slideMargin) : ''}`)
		debugLog(`| tableProps.margin ............................... = ${String(tableProps.margin)}`)
		debugLog(`| tableProps.colW ................................. = ${String(tableProps.colW)}`)
		debugLog(`| tableProps.autoPageSlideStartY .................. = ${tableProps.autoPageSlideStartY}`)
		debugLog(`| tableProps.autoPageCharWeight ................... = ${tableProps.autoPageCharWeight}`)
		debugLog('|-- CALCULATIONS -------------------------------------------------------|')
		debugLog(`| tablePropX ...................................... = ${tablePropX / EMU}`)
		debugLog(`| tablePropY ...................................... = ${tablePropY / EMU}`)
		debugLog(`| tablePropW ...................................... = ${tablePropW / EMU}`)
		debugLog(`| tablePropH ...................................... = ${tablePropH / EMU}`)
		debugLog(`| tableCalcW ...................................... = ${tableCalcW / EMU}`)
	}

	// STEP 1: Calculate margins
	{
		// Important: Use default size as zero cell margin is causing our tables to be too large and touch bottom of slide!
		if (!tableProps.slideMargin && tableProps.slideMargin !== 0) tableProps.slideMargin = DEF_SLIDE_MARGIN_IN[0]

		if (masterSlide && typeof masterSlide._margin !== 'undefined') {
			if (Array.isArray(masterSlide._margin)) arrInchMargins = masterSlide._margin
			else if (!isNaN(Number(masterSlide._margin))) { arrInchMargins = [Number(masterSlide._margin), Number(masterSlide._margin), Number(masterSlide._margin), Number(masterSlide._margin)] }
		} else if (tableProps.slideMargin || tableProps.slideMargin === 0) {
			if (Array.isArray(tableProps.slideMargin)) arrInchMargins = tableProps.slideMargin
			else if (!isNaN(tableProps.slideMargin)) arrInchMargins = [tableProps.slideMargin, tableProps.slideMargin, tableProps.slideMargin, tableProps.slideMargin]
		}

		if (isDebugEnabled()) debugLog(`| arrInchMargins .................................. = [${arrInchMargins.join(', ')}]`)
	}

	// STEP 2: Calculate number of columns
	{
		// NOTE: Cells may have a colspan, so merely taking the length of the [0] (or any other) row is not
		// ....: sufficient to determine column count. Therefore, check each cell for a colspan and total cols as reqd
		const firstRow = tableRows[0] || []
		firstRow.forEach(cell => {
			if (!cell) cell = { _type: SLIDE_OBJECT_TYPES.tablecell }
			const cellOpts = cell.options || null
			numCols += Number(cellOpts?.colspan ? cellOpts.colspan : 1)
		})
		if (isDebugEnabled()) debugLog(`| numCols ......................................... = ${numCols}`)
	}

	// STEP 3: Calculate width using tableProps.colW if possible
	if (!tablePropW && tableProps.colW) {
		tableCalcW = Array.isArray(tableProps.colW) ? tableProps.colW.reduce((p, n) => p + n) * EMU : tableProps.colW * numCols || 0
		if (isDebugEnabled()) debugLog(`| tableCalcW ...................................... = ${tableCalcW / EMU}`)
	}

	// STEP 4: Calculate usable width now that total usable space is known (`emuSlideTabW`)
	{
		emuSlideTabW = tableCalcW || inch2Emu((tablePropX ? tablePropX / EMU : arrInchMargins[1]) + arrInchMargins[3])
		if (isDebugEnabled()) debugLog(`| emuSlideTabW .................................... = ${(emuSlideTabW / EMU).toFixed(1)}`)
	}

	// STEP 5: Calculate column widths if not provided (emuSlideTabW will be used below to determine lines-per-col)
	if (!tableProps.colW || !Array.isArray(tableProps.colW)) {
		if (tableProps.colW && !isNaN(Number(tableProps.colW))) {
			const arrColW: number[] = []
			const firstRow = tableRows[0] || []
			firstRow.forEach(() => arrColW.push(Number(tableProps.colW)))
			tableProps.colW = []
			arrColW.forEach(val => {
				if (Array.isArray(tableProps.colW)) tableProps.colW.push(val)
			})
		} else {
			// No column widths provided? Then distribute cols.
			tableProps.colW = []
			for (let iCol = 0; iCol < numCols; iCol++) {
				tableProps.colW.push(emuSlideTabW / EMU / numCols)
			}
		}
	}

	// STEP 6: **MAIN** Iterate over rows, add table content, create new slides as rows overflow
	let newTableRowSlide: TableRowSlide = { rows: [] }
	tableRows.forEach((row, iRow) => {
		// A: Row variables
		const rowCellLines: TableCell[] = []
		let maxCellMarTopEmu = 0
		let maxCellMarBtmEmu = 0

		// B: Create new row in data model, calc `maxCellMar*`
		let currTableRow: TableRow = []
		row.forEach(cell => {
			currTableRow.push({
				_type: SLIDE_OBJECT_TYPES.tablecell,
				text: [],
				options: cell.options,
			})

			/** FUTURE: DEPRECATED:
			 * - Backwards-Compat: Oops! Discovered we were still using points for cell margin before v3.8.0 (UGH!)
			 * - We cant introduce a breaking change before v4.0, so...
			 */
			if (cell.options?.margin && cell.options.margin[0] >= 1) {
				if (cell.options?.margin && cell.options.margin[0] && valToPts(cell.options.margin[0]) > maxCellMarTopEmu) maxCellMarTopEmu = valToPts(cell.options.margin[0])
				else if (tableProps?.margin && tableProps.margin[0] && valToPts(tableProps.margin[0]) > maxCellMarTopEmu) maxCellMarTopEmu = valToPts(tableProps.margin[0])
				if (cell.options?.margin && cell.options.margin[2] && valToPts(cell.options.margin[2]) > maxCellMarBtmEmu) maxCellMarBtmEmu = valToPts(cell.options.margin[2])
				else if (tableProps?.margin && tableProps.margin[2] && valToPts(tableProps.margin[2]) > maxCellMarBtmEmu) maxCellMarBtmEmu = valToPts(tableProps.margin[2])
			} else {
				if (cell.options?.margin && cell.options.margin[0] && inch2Emu(cell.options.margin[0]) > maxCellMarTopEmu) maxCellMarTopEmu = inch2Emu(cell.options.margin[0])
				else if (tableProps?.margin && tableProps.margin[0] && inch2Emu(tableProps.margin[0]) > maxCellMarTopEmu) maxCellMarTopEmu = inch2Emu(tableProps.margin[0])
				if (cell.options?.margin && cell.options.margin[2] && inch2Emu(cell.options.margin[2]) > maxCellMarBtmEmu) maxCellMarBtmEmu = inch2Emu(cell.options.margin[2])
				else if (tableProps?.margin && tableProps.margin[2] && inch2Emu(tableProps.margin[2]) > maxCellMarBtmEmu) maxCellMarBtmEmu = inch2Emu(tableProps.margin[2])
			}
		})

		// C: Calc usable vertical space/table height. Set default value first, adjust below when necessary.
		calcSlideTabH()
		emuTabCurrH += maxCellMarTopEmu + maxCellMarBtmEmu // Start row height with margins
		if (isDebugEnabled() && iRow === 0) debugLog(`| SLIDE [${tableRowSlides.length}]: emuSlideTabH ...... = ${(emuSlideTabH / EMU).toFixed(1)} `)

		// D: --==[[ BUILD DATA SET ]]==-- (iterate over cells: split text into lines[], set `lineHeight`)
		row.forEach((cell, iCell) => {
			const newCell: TableCell = {
				_type: SLIDE_OBJECT_TYPES.tablecell,
				_lines: undefined,
				_lineHeight: inch2Emu(
					((cell.options?.fontSize ? cell.options.fontSize : tableProps.fontSize ? tableProps.fontSize : DEF_FONT_SIZE) *
						(LINEH_MODIFIER + (tableProps.autoPageLineWeight ? tableProps.autoPageLineWeight : 0))) /
					100
				),
				text: [],
				options: cell.options,
			}

			// E-1: Exempt cells with `rowspan` from increasing lineHeight (or we could create a new slide when unecessary!)
			if (newCell.options?.rowspan) newCell._lineHeight = 0

			// E-2: The parseTextToLines method uses `autoPageCharWeight`, so inherit from table options
			if (newCell.options) newCell.options.autoPageCharWeight = tableProps.autoPageCharWeight ? tableProps.autoPageCharWeight : (undefined)

			// E-3: **MAIN** Parse cell contents into lines based upon col width, font, etc
			let totalColW = Array.isArray(tableProps.colW) ? tableProps.colW[iCell] : tableProps.colW ?? 0
			if (cell.options?.colspan && Array.isArray(tableProps.colW)) {
				const colspan = cell.options.colspan
				totalColW = tableProps.colW.filter((_cell, idx) => idx >= iCell && idx < idx + colspan).reduce((prev, curr) => prev + curr)
			}

			// E-4: Create lines based upon available column width
			newCell._lines = parseTextToLines(cell, totalColW)

			// E-5: Add cell to array
			rowCellLines.push(newCell)
		})

		/** E: --==[[ PAGE DATA SET ]]==--
		 * Add text one-line-a-time to this row's cells until: lines are exhausted OR table height limit is hit
		 *
		 * Design:
		 * - Building cells L-to-R/loop style wont work as one could be 100 lines and another 1 line
		 * - Therefore, build the whole row, one-line-at-a-time, across each table columns
		 * - Then, when the vertical size limit is hit is by any of the cells, make a new slide and continue adding any remaining lines
		 *
		 * Implementation:
		 * - `rowCellLines` is an array of cells, one for each column in the table, with each cell containing an array of lines
		 *
		 * Sample Data:
		 * - `rowCellLines` ..: [ TableCell, TableCell, TableCell ]
		 * - `TableCell` .....: { _type: 'tablecell', _lines: TableCell[], _lineHeight: 10 }
		 * - `_lines` ........: [ {_type: 'tablecell', text: 'cell-1,line-1', options: {…}}, {_type: 'tablecell', text: 'cell-1,line-2', options: {…}} }
		 * - `_lines` is TableCell[] (the 1-N words in the line)
		 * {
		 *    _lines: [{ text:'cell-1,line-1' }, { text:'cell-1,line-2' }],                                                     // TOTAL-CELL-HEIGHT = 2
		 *    _lines: [{ text:'cell-2,line-1' }, { text:'cell-2,line-2' }],                                                     // TOTAL-CELL-HEIGHT = 2
		 *    _lines: [{ text:'cell-3,line-1' }, { text:'cell-3,line-2' }, { text:'cell-3,line-3' }, { text:'cell-3,line-4' }], // TOTAL-CELL-HEIGHT = 4
		 * }
		 *
		 * Example: 2 rows, with the firstrow overflowing onto a new slide
		 * SLIDE 1:
		 *  |--------|--------|--------|--------|
		 *  | line-1 | line-1 | line-1 | line-1 |
		 *  |        |        | line-2 |        |
		 *  |        |        | line-3 |        |
		 *  |--------|--------|--------|--------|
		 *
		 * SLIDE 2:
		 *  |--------|--------|--------|--------|
		 *  |        |        | line-4 |        |
		 *  |--------|--------|--------|--------|
		 *  | line-1 | line-1 | line-1 | line-1 |
		 *  |--------|--------|--------|--------|
		 */
		if (isDebugEnabled()) debugLog(`\n| SLIDE [${tableRowSlides.length}]: ROW [${iRow}]: START...`)
		let currCellIdx = 0
		let emuLineMaxH = 0
		let isDone = false
		while (!isDone) {
			const srcCell: TableCell = rowCellLines[currCellIdx]
			let tgtCell: TableCell = currTableRow[currCellIdx] // NOTE: may be redefined below (a new row may be created, thus changing this value)

			// 1: calc emuLineMaxH
			rowCellLines.forEach(cell => {
				const lh = cell._lineHeight ?? 0
				if (lh >= emuLineMaxH) emuLineMaxH = lh
			})

			// 2: create a new slide if there is insufficient room for the current row
			if (emuTabCurrH + emuLineMaxH > emuSlideTabH) {
				if (isDebugEnabled()) {
					debugLog('\n|-----------------------------------------------------------------------|')
					// prettier-ignore
					debugLog(`|-- NEW SLIDE CREATED (currTabH+currLineH > maxH) => ${(emuTabCurrH / EMU).toFixed(2)} + ${((srcCell._lineHeight ?? 0) / EMU).toFixed(2)} > ${emuSlideTabH / EMU}`)
					debugLog('|-----------------------------------------------------------------------|\n\n')
				}

				// A: add current row slide or it will be lost (only if it has rows and text)
				if (currTableRow.length > 0 && currTableRow.map(cell => cell.text?.length ?? 0).reduce((p, n) => p + n) > 0) newTableRowSlide.rows.push(currTableRow)

				// B: add current slide to Slides array
				tableRowSlides.push(newTableRowSlide)

				// C: reset working/curr slide to hold rows as they're created
				const newRows: TableRow[] = []
				newTableRowSlide = { rows: newRows }

				// D: reset working/curr row
				currTableRow = []
				row.forEach(cell => currTableRow.push({ _type: SLIDE_OBJECT_TYPES.tablecell, text: [], options: cell.options }))

				// E: Calc usable vertical space/table height now as we may still be in the same row and code above ("C: Calc usable vertical space/table height.") calc may now be invalid
				calcSlideTabH()
				if (isDebugEnabled()) debugLog(`| SLIDE [${tableRowSlides.length}]: emuSlideTabH ...... = ${(emuSlideTabH / EMU).toFixed(1)} `)

				// F: reset current table height for this new Slide, starting the row off with its cell margins
				emuTabCurrH = maxCellMarTopEmu + maxCellMarBtmEmu

				// G: handle repeat headers option /or/ Add new empty row to continue current lines into
				if ((tableProps.addHeaderToEach || tableProps.autoPageRepeatHeader) && tableProps._arrObjTabHeadRows) {
					tableProps._arrObjTabHeadRows.forEach(row => {
						const newHeadRow: TableRow = []
						let maxLineHeight = 0
						row.forEach(cell => {
							newHeadRow.push(cell)
							const lh = cell._lineHeight ?? 0
							if (lh > maxLineHeight) maxLineHeight = lh
						})
						newTableRowSlide.rows.push(newHeadRow)
						emuTabCurrH += maxLineHeight + maxCellMarTopEmu + maxCellMarBtmEmu // repeated header rows carry cell margins too
					})
				}

				tgtCell = currTableRow[currCellIdx]
			}

			// 3: set array of words that comprise this line
			const currLine = srcCell._lines?.shift()

			// 4: create new line by adding all words from curr line (or add empty if there are no words to avoid "needs repair" issue triggered when cells have null content)
			if (Array.isArray(tgtCell.text)) {
				if (currLine) tgtCell.text = tgtCell.text.concat(currLine)
				else if (tgtCell.text.length === 0) tgtCell.text = tgtCell.text.concat({ _type: SLIDE_OBJECT_TYPES.tablecell, text: '' })
				// IMPORTANT: ^^^ add empty if there are no words to avoid "needs repair" issue triggered when cells have null content
			}

			// 5: increase table height by the curr line height (if we're on the last column)
			if (currCellIdx === rowCellLines.length - 1) emuTabCurrH += emuLineMaxH

			// 6: advance column/cell index (or circle back to first one to continue adding lines)
			currCellIdx = currCellIdx < rowCellLines.length - 1 ? currCellIdx + 1 : 0

			// 7: WIP: done?
			const brent = rowCellLines.map(cell => cell._lines?.length ?? 0).reduce((prev, next) => prev + next)
			if (brent === 0) isDone = true
		}

		// F: Flush/capture row buffer before it resets at the top of this loop
		if (currTableRow.length > 0) newTableRowSlide.rows.push(currTableRow)

		if (isDebugEnabled()) {
			debugLog(
				`- SLIDE [${tableRowSlides.length}]: ROW [${iRow}]: ...COMPLETE ...... emuTabCurrH = ${(emuTabCurrH / EMU).toFixed(2)} ( emuSlideTabH = ${(
					emuSlideTabH / EMU
				).toFixed(2)} )`
			)
		}
	})

	// STEP 7: Flush buffer / add final slide
	tableRowSlides.push(newTableRowSlide)

	if (isDebugEnabled()) {
		debugLog('\n|================================================|')
		debugLog(`| FINAL: tableRowSlides.length = ${tableRowSlides.length}`)
		tableRowSlides.forEach(slide => debugLog(slide))
		debugLog('|================================================|\n\n')
	}

	// LAST:
	return tableRowSlides
}

/**
 * Reproduces an HTML table as a PowerPoint table - including column widths, style, etc. - creates 1 or more slides as needed
 * @param {PptxGenJS} pptx - pptxgenjs instance
 * @param {string} tabEleId - HTMLElementID of the table
 * @param {ITableToSlidesOpts} options - array of options (e.g.: tabsize)
 * @param {SlideLayout} masterSlide - masterSlide
 */
export function genTableToSlides(pptx: PptxGenJS, tabEleId: string, options: TableToSlidesProps = {}, masterSlide?: SlideLayout): void {
	const opts = options || {}
	opts.slideMargin = opts.slideMargin || opts.slideMargin === 0 ? opts.slideMargin : 0.5
	let emuSlideTabW = opts.w || pptx.presLayout.width
	const arrObjTabHeadRows: TableRow[] = []
	const arrObjTabBodyRows: TableRow[] = []
	const arrObjTabFootRows: TableRow[] = []
	const arrColW: number[] = []
	const arrTabColW: number[] = []
	let arrInchMargins: [number, number, number, number] = [0.5, 0.5, 0.5, 0.5] // TRBL-style
	let intTabW = 0

	// REALITY-CHECK:
	if (!document.getElementById(tabEleId)) throw new Error('tableToSlides: Table ID "' + tabEleId + '" does not exist!')

	// STEP 1: Set margins
	if (masterSlide?._margin) {
		if (Array.isArray(masterSlide._margin)) arrInchMargins = masterSlide._margin
		else if (!isNaN(masterSlide._margin)) arrInchMargins = [masterSlide._margin, masterSlide._margin, masterSlide._margin, masterSlide._margin]
		opts.slideMargin = arrInchMargins
	} else if (opts?.slideMargin) {
		if (Array.isArray(opts.slideMargin)) arrInchMargins = opts.slideMargin
		else if (!isNaN(opts.slideMargin)) arrInchMargins = [opts.slideMargin, opts.slideMargin, opts.slideMargin, opts.slideMargin]
	}
	emuSlideTabW = (opts.w ? inch2Emu(opts.w) : pptx.presLayout.width) - inch2Emu(arrInchMargins[1] + arrInchMargins[3])

	if (isDebugEnabled()) {
		debugLog('[[VERBOSE MODE]]')
		debugLog('|-- `tableToSlides` ----------------------------------------------------|')
		debugLog(`| tableProps.h .................................... = ${opts.h}`)
		debugLog(`| tableProps.w .................................... = ${opts.w}`)
		debugLog(`| pptx.presLayout.width ........................... = ${(pptx.presLayout.width / EMU).toFixed(1)}`)
		debugLog(`| pptx.presLayout.height .......................... = ${(pptx.presLayout.height / EMU).toFixed(1)}`)
		debugLog(`| emuSlideTabW .................................... = ${(emuSlideTabW / EMU).toFixed(1)}`)
	}

	// STEP 2: Grab table col widths - just find the first availble row, either thead/tbody/tfoot, others may have colspans, who cares, we only need col widths from 1
	let firstRowCells = document.querySelectorAll(`#${tabEleId} tr:first-child th`)
	if (firstRowCells.length === 0) firstRowCells = document.querySelectorAll(`#${tabEleId} tr:first-child td`)
	firstRowCells.forEach(cell => {
		if (!(cell instanceof HTMLTableCellElement)) return
		if (cell.getAttribute('colspan')) {
			// Guesstimate (divide evenly) col widths
			// NOTE: both j$query and vanilla selectors return {0} when table is not visible)
			for (let idxc = 0; idxc < Number(cell.getAttribute('colspan')); idxc++) {
				arrTabColW.push(Math.round(cell.offsetWidth / Number(cell.getAttribute('colspan'))))
			}
		} else {
			arrTabColW.push(cell.offsetWidth)
		}
	})
	arrTabColW.forEach(colW => {
		intTabW += colW
	})

	// STEP 3: Calc/Set column widths by using same column width percent from HTML table
	arrTabColW.forEach((colW, idxW) => {
		const intCalcWidth = Number(((Number(emuSlideTabW) * ((colW / intTabW) * 100)) / 100 / EMU).toFixed(2))
		const colSelector = document.querySelector(`#${tabEleId} thead tr:first-child th:nth-child(${idxW + 1})`)
		// NOTE: a missing attribute yields null -> keep 0 so the calculated width is used (issue #24)
		const intMinWidth = Number(colSelector?.getAttribute('data-pptx-min-width')) || 0
		const intSetWidth = Number(colSelector?.getAttribute('data-pptx-width')) || 0
		arrColW.push(intSetWidth || (intMinWidth > intCalcWidth ? intMinWidth : intCalcWidth))
	})
	if (isDebugEnabled()) {
		debugLog(`| arrColW ......................................... = [${arrColW.join(', ')}]`)
	}

	// STEP 4: Iterate over each table element and create data arrays (text and opts)
	// NOTE: We create 3 arrays instead of one so we can loop over body then show header/footer rows on first and last page
	const tableParts = ['thead', 'tbody', 'tfoot']
	tableParts.forEach(part => {
		document.querySelectorAll(`#${tabEleId} ${part} tr`).forEach(htmlRow => {
			if (!(htmlRow instanceof HTMLTableRowElement)) return
			const arrObjTabCells: TableCell[] = []
			Array.from(htmlRow.cells).forEach(cell => {
				// A: Get RGB text/bkgd colors
				const arrRGB1 = window.getComputedStyle(cell).getPropertyValue('color').replace(/\s+/gi, '').replace('rgba(', '').replace('rgb(', '').replace(')', '').split(',')
				let arrRGB2 = window
					.getComputedStyle(cell)
					.getPropertyValue('background-color')
					.replace(/\s+/gi, '')
					.replace('rgba(', '')
					.replace('rgb(', '')
					.replace(')', '')
					.split(',')
				if (
					// NOTE: (ISSUE#57): Default for unstyled tables is black bkgd, so use white instead
					window.getComputedStyle(cell).getPropertyValue('background-color') === 'rgba(0, 0, 0, 0)' ||
					window.getComputedStyle(cell).getPropertyValue('transparent')
				) {
					arrRGB2 = ['255', '255', '255']
				}

				// B: Create option object
				const cellOpts: TableCellProps = {
					align: undefined,
					bold:
						!!(window.getComputedStyle(cell).getPropertyValue('font-weight') === 'bold' ||
							Number(window.getComputedStyle(cell).getPropertyValue('font-weight')) >= 500),
					border: undefined,
					color: rgbToHex(Number(arrRGB1[0]), Number(arrRGB1[1]), Number(arrRGB1[2])),
					fill: { color: rgbToHex(Number(arrRGB2[0]), Number(arrRGB2[1]), Number(arrRGB2[2])) },
					fontFace:
						(window.getComputedStyle(cell).getPropertyValue('font-family') || '').split(',')[0].replace(/"/g, '').replace('inherit', '').replace('initial', '') ||
						(undefined),
					fontSize: Number(window.getComputedStyle(cell).getPropertyValue('font-size').replace(/[a-z]/gi, '')),
					margin: undefined,
					colspan: Number(cell.getAttribute('colspan')) || (undefined),
					rowspan: Number(cell.getAttribute('rowspan')) || (undefined),
					valign: undefined,
				}

				if (['left', 'center', 'right', 'start', 'end'].includes(window.getComputedStyle(cell).getPropertyValue('text-align'))) {
					const align = window.getComputedStyle(cell).getPropertyValue('text-align').replace('start', 'left').replace('end', 'right')
					cellOpts.align = align === 'center' ? 'center' : align === 'left' ? 'left' : align === 'right' ? 'right' : (undefined)
				}
				if (['top', 'middle', 'bottom'].includes(window.getComputedStyle(cell).getPropertyValue('vertical-align'))) {
					const valign = window.getComputedStyle(cell).getPropertyValue('vertical-align')
					cellOpts.valign = valign === 'top' ? 'top' : valign === 'middle' ? 'middle' : valign === 'bottom' ? 'bottom' : (undefined)
				}

				// C: Add padding [margin] (if any)
				// NOTE: Margins translate: px->pt 1:1 (e.g.: a 20px padded cell looks the same in PPTX as 20pt Text Inset/Padding)
				if (window.getComputedStyle(cell).getPropertyValue('padding-left')) {
					const margin: [number, number, number, number] = [0, 0, 0, 0]
					cellOpts.margin = margin
					const sidesPad = ['padding-top', 'padding-right', 'padding-bottom', 'padding-left']
					sidesPad.forEach((val, idxs) => {
						margin[idxs] = Math.round(Number(window.getComputedStyle(cell).getPropertyValue(val).replace(/\D/gi, '')))
					})
				}

				// D: Add border (if any)
				if (
					window.getComputedStyle(cell).getPropertyValue('border-top-width') ||
					window.getComputedStyle(cell).getPropertyValue('border-right-width') ||
					window.getComputedStyle(cell).getPropertyValue('border-bottom-width') ||
					window.getComputedStyle(cell).getPropertyValue('border-left-width')
				) {
					// all four sides are assigned unconditionally in the loop below
					const border: [BorderProps, BorderProps, BorderProps, BorderProps] = [{}, {}, {}, {}]
					cellOpts.border = border
					const sidesBor = ['top', 'right', 'bottom', 'left']
					sidesBor.forEach((val, idxb) => {
						const intBorderW = Math.round(
							Number(
								window
									.getComputedStyle(cell)
									.getPropertyValue('border-' + val + '-width')
									.replace('px', '')
							)
						)
						let arrRGB: string[] = []
						arrRGB = window
							.getComputedStyle(cell)
							.getPropertyValue('border-' + val + '-color')
							.replace(/\s+/gi, '')
							.replace('rgba(', '')
							.replace('rgb(', '')
							.replace(')', '')
							.split(',')
						const strBorderC = rgbToHex(Number(arrRGB[0]), Number(arrRGB[1]), Number(arrRGB[2]))
						border[idxb] = { pt: intBorderW, color: strBorderC }
					})
				}

				// LAST: Add cell
				arrObjTabCells.push({
					_type: SLIDE_OBJECT_TYPES.tablecell,
					text: cell.innerText, // `innerText` returns <br> as "\n", so linebreak etc. work later!
					options: cellOpts,
				})
			})
			switch (part) {
				case 'thead':
					arrObjTabHeadRows.push(arrObjTabCells)
					break
				case 'tbody':
					arrObjTabBodyRows.push(arrObjTabCells)
					break
				case 'tfoot':
					arrObjTabFootRows.push(arrObjTabCells)
					break
				default:
					console.warn(`table parsing: unexpected table part: ${part}`)
					break
			}
		})
	})

	// STEP 5: Break table into Slides as needed
	// Pass head-rows as there is an option to add to each table and the parse func needs this data to fulfill that option
	opts._arrObjTabHeadRows = arrObjTabHeadRows || (undefined)
	opts.colW = arrColW
	getSlidesForTableRows([...arrObjTabHeadRows, ...arrObjTabBodyRows, ...arrObjTabFootRows], opts, pptx.presLayout, masterSlide).forEach((slide, idxTr) => {
		// A: Create new Slide
		const newSlide = pptx.addSlide({ masterName: opts.masterSlideName || (undefined) })

		// B: DESIGN: Reset `y` to startY or margin after first Slide (ISSUE#43, ISSUE#47, ISSUE#48)
		if (idxTr === 0) opts.y = opts.y || arrInchMargins[0]
		if (idxTr > 0) opts.y = opts.autoPageSlideStartY || opts.newSlideStartY || arrInchMargins[0]
		if (isDebugEnabled()) debugLog(`| opts.autoPageSlideStartY: ${opts.autoPageSlideStartY} / arrInchMargins[0]: ${arrInchMargins[0]} => opts.y = ${opts.y}`)

		// C: Add table to Slide
		newSlide.addTable(slide.rows, { x: opts.x || arrInchMargins[3], y: opts.y, w: Number(emuSlideTabW) / EMU, colW: arrColW, autoPage: false })

		// D: Add any additional objects
		if (opts.addImage) {
			opts.addImage.options = opts.addImage.options || {}
			if (!opts.addImage.image || (!opts.addImage.image.path && !opts.addImage.image.data)) {
				console.warn('Warning: tableToSlides.addImage requires either `path` or `data`')
			} else {
				newSlide.addImage({
					path: opts.addImage.image.path,
					data: opts.addImage.image.data,
					x: opts.addImage.options.x,
					y: opts.addImage.options.y,
					w: opts.addImage.options.w,
					h: opts.addImage.options.h,
				})
			}
		}
		if (opts.addShape) newSlide.addShape(opts.addShape.shapeName, opts.addShape.options || {})
		if (opts.addTable) newSlide.addTable(opts.addTable.rows, opts.addTable.options || {})
		if (opts.addText) newSlide.addText(opts.addText.text, opts.addText.options || {})
	})
}
