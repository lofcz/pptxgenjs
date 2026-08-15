/**
 * Slide, layout, and master shape-tree rendering.
 */

import {
	ANCHOR,
	DEF_CELL_MARGIN_IN,
	DEF_PRES_LAYOUT_NAME,
	DEF_TEXT_SHADOW,
	EMU,
	SLDNUMFLDID,
	SLIDE_OBJECT_TYPES,
} from '../core-enums'
import {
	Coord,
	ISlideObject,
	ObjectOptions,
	PresLayout,
	PresSlide,
	ReflectionProps,
	SectionProps,
	ShadowProps,
	ShapeLineProps,
	SlideLayout,
	SoftEdgeProps,
	TableCell,
	TableCellProps,
	TableProps,
	TextGlowProps,
} from '../core-interfaces'
import {
	convertRotationDegrees,
	createColorElement,
	createGlowElement,
	encodeXmlEntities,
	genXmlColorSelection,
	getSmartParseNumber,
	getUuid,
	inch2Emu,
	resolveGlowOptions,
	valToPts,
} from '../gen-utils'
import { genXmlCreationIdExt, genXmlModIdExt } from '../gen-revision'
import { genXmlPlaceholder, genXmlTextBody, textRunsHaveOmml } from './text'

const ImageSizingXml = {
	cover: function (imgSize: { w: number, h: number }, boxDim: { w: number, h: number, x: number, y: number }) {
		const imgRatio = imgSize.h / imgSize.w
		const boxRatio = boxDim.h / boxDim.w
		const isBoxBased = boxRatio > imgRatio
		const width = isBoxBased ? boxDim.h / imgRatio : boxDim.w
		const height = isBoxBased ? boxDim.h : boxDim.w * imgRatio
		const hzPerc = Math.round(1e5 * 0.5 * (1 - boxDim.w / width))
		const vzPerc = Math.round(1e5 * 0.5 * (1 - boxDim.h / height))
		return `<a:srcRect l="${hzPerc}" r="${hzPerc}" t="${vzPerc}" b="${vzPerc}"/><a:stretch/>`
	},
	contain: function (imgSize: { w: number, h: number }, boxDim: { w: number, h: number, x: number, y: number }) {
		const imgRatio = imgSize.h / imgSize.w
		const boxRatio = boxDim.h / boxDim.w
		const widthBased = boxRatio > imgRatio
		const width = widthBased ? boxDim.w : boxDim.h / imgRatio
		const height = widthBased ? boxDim.w * imgRatio : boxDim.h
		const hzPerc = Math.round(1e5 * 0.5 * (1 - boxDim.w / width))
		const vzPerc = Math.round(1e5 * 0.5 * (1 - boxDim.h / height))
		return `<a:srcRect l="${hzPerc}" r="${hzPerc}" t="${vzPerc}" b="${vzPerc}"/><a:stretch/>`
	},
	crop: function (imgSize: { w: number, h: number }, boxDim: { w: number, h: number, x: number, y: number }) {
		const l = boxDim.x
		const r = imgSize.w - (boxDim.x + boxDim.w)
		const t = boxDim.y
		const b = imgSize.h - (boxDim.y + boxDim.h)
		const lPerc = Math.round(1e5 * (l / imgSize.w))
		const rPerc = Math.round(1e5 * (r / imgSize.w))
		const tPerc = Math.round(1e5 * (t / imgSize.h))
		const bPerc = Math.round(1e5 * (b / imgSize.h))
		return `<a:srcRect l="${lPerc}" r="${rPerc}" t="${tPerc}" b="${bPerc}"/><a:stretch/>`
	},
}

/**
 * Create the `a:tblPr` table-style block (banded rows/cols, first/last row/col emphasis, style id)
 * @param {TableProps} opts - table options
 * @return {string} XML
 */
function genXmlTblPr (opts: TableProps): string {
	// ISSUE#1299: PowerPoint accessibility treats `firstRow="1"` as the semantic table header.
	// When headers are repeated via autoPage, mark the first row unless the caller overrides.
	const firstRow = opts.firstRow ?? (opts.autoPageRepeatHeader ? true : undefined)
	const flags: Array<[string, boolean | undefined]> = [
		['firstRow', firstRow],
		['lastRow', opts.lastRow],
		['firstCol', opts.firstCol],
		['lastCol', opts.lastCol],
		['bandRow', opts.bandRow],
		['bandCol', opts.bandCol],
		// ECMA-376 §5.1.6.13: `rtl` on <a:tblPr> lays the table out right-to-left (issue #1291)
		['rtl', opts.rtlMode],
	]
	const attrs = flags
		.filter(([, val]) => typeof val === 'boolean')
		.map(([name, val]) => ` ${name}="${val ? 1 : 0}"`)
		.join('')

	if (!attrs && !opts.tableStyleId) return '<a:tblPr/>'
	// NOTE: `a:tableStyleId` must be the last child of `a:tblPr` per the schema
	return opts.tableStyleId ? `<a:tblPr${attrs}><a:tableStyleId>${encodeXmlEntities(opts.tableStyleId)}</a:tableStyleId></a:tblPr>` : `<a:tblPr${attrs}/>`
}

/**
 * Create the `a:ln` outline block for a shape/image
 * @param {ShapeLineProps} line - line options
 * @return {string} XML
 */
/**
 * Builds `<p14:trim>` / `<p14:fade>` / `<p14:bmkLst>` children of `<p14:media>` (MS-PPTX §2.3.3.14).
 * Times are ST_UniversalTimeOffset (ms).
 */
function genXmlMediaExtras (opts: ObjectOptions): string {
	let xml = ''
	if (opts.trim && (typeof opts.trim.st === 'number' || typeof opts.trim.end === 'number'))
		xml += `<p14:trim${typeof opts.trim.st === 'number' ? ` st="${Math.round(opts.trim.st)}"` : ''}${typeof opts.trim.end === 'number' ? ` end="${Math.round(opts.trim.end)}"` : ''}/>`
	if (opts.fade && (typeof opts.fade.in === 'number' || typeof opts.fade.out === 'number'))
		xml += `<p14:fade${typeof opts.fade.in === 'number' ? ` in="${Math.round(opts.fade.in)}"` : ''}${typeof opts.fade.out === 'number' ? ` out="${Math.round(opts.fade.out)}"` : ''}/>`
	if (opts.bookmarks && opts.bookmarks.length > 0)
		xml += `<p14:bmkLst>${opts.bookmarks.map(b => `<p14:bmk name="${encodeXmlEntities(b.name)}" time="${Math.round(b.time)}"/>`).join('')}</p14:bmkLst>`
	return xml
}

function genXmlLine (line: ShapeLineProps): string {
	// ECMA-376 §5.1.2.1.34: `<a:ln>` carries `w` and `cap` attributes (cap = line ending style, issue #782)
	const attrs = (line.width ? ` w="${valToPts(line.width)}"` : '') + (line.cap && ['flat', 'sq', 'rnd'].includes(line.cap) ? ` cap="${line.cap}"` : '')
	let xml = `<a:ln${attrs}>`
	if (line.color) xml += genXmlColorSelection(line)
	if (line.dashType) xml += `<a:prstDash val="${line.dashType}"/>`
	if (line.beginArrowType) xml += `<a:headEnd type="${line.beginArrowType}"/>`
	if (line.endArrowType) xml += `<a:tailEnd type="${line.endArrowType}"/>`
	// FUTURE: `endArrowSize` < a: headEnd type = "arrow" w = "lg" len = "lg" /> 'sm' | 'med' | 'lg'(values are 1 - 9, making a 3x3 grid of w / len possibilities)
	xml += '</a:ln>'
	return xml
}

/**
 * Create a single `a:outerShdw` / `a:innerShdw` element (no `effectLst` wrapper).
 * @note pure - unit conversion must NOT mutate the caller's options (issue #20)
 */
function genXmlShadowElement (shadow: ShadowProps): string {
	const type = shadow.type === 'inner' ? 'inner' : 'outer'
	const blur = valToPts(shadow.blur ?? 8)
	const offset = valToPts(shadow.offset ?? 4)
	const angle = Math.round((shadow.angle ?? 270) * 60000)
	const opacity = Math.round((shadow.opacity ?? 0.75) * 100000)
	const color = shadow.color || DEF_TEXT_SHADOW.color
	const attrs = type === 'outer' ? 'sx="100000" sy="100000" kx="0" ky="0" algn="bl" rotWithShape="0"' : ''

	return `<a:${type}Shdw ${attrs} blurRad="${blur}" dist="${offset}" dir="${angle}"><a:srgbClr val="${color}"><a:alpha val="${opacity}"/></a:srgbClr></a:${type}Shdw>`
}

/**
 * Create `a:softEdge` element
 * @note pure - does not mutate caller options
 */
function genXmlSoftEdgeElement (softEdge: SoftEdgeProps): string {
	return `<a:softEdge rad="${valToPts(softEdge.radius)}"/>`
}

/**
 * Create `a:reflection` element (Mona/PPTist subset)
 * @note pure - does not mutate caller options
 */
function genXmlReflectionElement (reflection: ReflectionProps): string {
	const blur = valToPts(reflection.blur ?? 0)
	const dist = valToPts(reflection.distance ?? 0)
	const dir = Math.round((reflection.direction ?? 0) * 60000)
	const stA = Math.round((reflection.opacity ?? 0.5) * 100000)
	const sy = Math.round((reflection.scaleY ?? -1) * 100000)
	return `<a:reflection blurRad="${blur}" stA="${stA}" endA="0" dist="${dist}" dir="${dir}" sy="${sy}" algn="bl" rotWithShape="0"/>`
}

export type ShapeEffectLstOptions = {
	shadow?: ShadowProps
	glow?: TextGlowProps
	softEdge?: SoftEdgeProps
	reflection?: ReflectionProps
}

/**
 * Create the shape/image `a:effectLst` block (shadow + glow + reflection + softEdge).
 * Child order follows ECMA-376 `CT_EffectList`: glow, innerShdw, outerShdw, reflection, softEdge.
 * @note pure - unit conversion must NOT be written back to the caller's options object (issue #20)
 */
function genXmlEffectLst (opts: ShapeEffectLstOptions): string {
	const parts: string[] = []

	const resolvedGlow = resolveGlowOptions(opts.glow)
	if (resolvedGlow) parts.push(createGlowElement(resolvedGlow))

	const shadow = opts.shadow
	if (shadow && shadow.type !== 'none') {
		parts.push(genXmlShadowElement(shadow))
	}

	if (opts.reflection) parts.push(genXmlReflectionElement(opts.reflection))
	if (opts.softEdge) parts.push(genXmlSoftEdgeElement(opts.softEdge))

	if (!parts.length) return ''
	return `<a:effectLst>${parts.join('')}</a:effectLst>`
}

/** Shape id → layout box used to auto-size connectors (ZentoSoft) */
type ShapeIdCoord = { id: number, position: { x?: Coord, y?: Coord, w?: Coord, h?: Coord } }

function findShapeCoord (list: ShapeIdCoord[], id: number | undefined): ShapeIdCoord | undefined {
	if (id == null) return undefined
	return list.find(el => el.id === id)
}

/** Anchor point on a box in inches (numeric positions only) */
function anchorPointInches (
	box: { x?: Coord, y?: Coord, w?: Coord, h?: Coord },
	anchorPos: number | undefined
): { x: number, y: number } | undefined {
	const bx = Number(box.x)
	const by = Number(box.y)
	const bw = Number(box.w)
	const bh = Number(box.h)
	if ([bx, by, bw, bh].some(n => Number.isNaN(n))) return undefined

	switch (anchorPos) {
		case ANCHOR.TOP:
			return { x: bx + bw / 2, y: by }
		case ANCHOR.BOTTOM:
			return { x: bx + bw / 2, y: by + bh }
		case ANCHOR.LEFT:
			return { x: bx, y: by + bh / 2 }
		case ANCHOR.RIGHT:
			return { x: bx + bw, y: by + bh / 2 }
		default:
			return undefined
	}
}

/**
 * When a connector references shapes with numeric inch positions + rect anchors,
 * compute the line's x/y/w/h and flip flags (ZentoSoft auto-layout).
 */
function applyConnectorAutoLayout (
	line: ShapeLineProps,
	coordinates: ShapeIdCoord[],
	presLayout: PresLayout
): { x: number, y: number, cx: number, cy: number, flipH: boolean, flipV: boolean } | undefined {
	const source = findShapeCoord(coordinates, line.sourceId)
	const target = findShapeCoord(coordinates, line.targetId)
	if (!source || !target) return undefined

	const start = anchorPointInches(source.position, line.sourceAnchorPos)
	const end = anchorPointInches(target.position, line.targetAnchorPos)
	if (!start || !end) return undefined

	let x = start.x
	let y = start.y
	let cx: number
	let cy: number
	let flipH = false
	let flipV = false

	if (end.x >= x) {
		cx = end.x - x
	} else {
		flipH = true
		cx = x - end.x
		x = end.x
	}
	if (end.y >= y) {
		cy = end.y - y
	} else {
		flipV = true
		cy = y - end.y
		y = end.y
	}

	return {
		x: getSmartParseNumber(x, 'X', presLayout),
		y: getSmartParseNumber(y, 'Y', presLayout),
		cx: getSmartParseNumber(cx, 'X', presLayout),
		cy: getSmartParseNumber(cy, 'Y', presLayout),
		flipH,
		flipV,
	}
}

function resolveShapeId (options: ObjectOptions | undefined, idx: number, usedIds: Set<number>): number {
	const requested = options?.sId
	const shapeId = requested != null ? requested : idx + 2
	if (usedIds.has(shapeId)) {
		throw new Error(
			requested != null
				? `sId ${shapeId} is already in use on this slide — object/shape ids must be unique`
				: `auto-generated shape id ${shapeId} conflicts with an explicit sId — use a higher sId`
		)
	}
	usedIds.add(shapeId)
	return shapeId
}

/**
 * Transforms a slide or slideLayout to resulting XML string - Creates `ppt/slide*.xml`
 * @param {PresSlide|SlideLayout} slideObject - slide object created within createSlideObject
 * @return {string} XML string with <p:cSld> as the root
 */
/**
 * Resolve section/summary zoom `zoomSectionTitle` to the section's stable GUID (`zoomSectionId`).
 * Throws if the named section doesn't exist, since a dangling anchor produces a repair prompt.
 */
export function resolveZoomSections (slide: PresSlide, sections?: SectionProps[]): void {
	;(slide._slideObjects ?? []).forEach(obj => {
		if (obj._type !== SLIDE_OBJECT_TYPES.zoom || obj.zoomKind === 'slide' || !obj.zoomSectionTitle) return
		const sect = (sections ?? []).find(s => s.title === obj.zoomSectionTitle)
		if (!sect) throw new Error(`addZoom() error: no section named "${obj.zoomSectionTitle}" — call addSection({ title }) first`)
		if (!sect._id) sect._id = getUuid('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx')
		obj.zoomSectionId = `{${sect._id}}`
	})
}

export function slideObjectToXml (slide: PresSlide | SlideLayout): string {
	let strSlideXml: string = slide._name ? `<p:cSld name="${encodeXmlEntities(slide._name)}">` : '<p:cSld>'
	let intTableNum = 1

	// STEP 1: Add background color/image (ensure only a single `<p:bg>` tag is created, ex: when master-baskground has both `color` and `path`)
	if (slide._bkgdImgRid) {
		strSlideXml += `<p:bg><p:bgPr><a:blipFill dpi="0" rotWithShape="1"><a:blip r:embed="rId${slide._bkgdImgRid}"><a:lum/></a:blip><a:srcRect/><a:stretch><a:fillRect/></a:stretch></a:blipFill><a:effectLst/></p:bgPr></p:bg>`
	} else if (
		slide.background?.color ||
		(slide.background?.type === 'gradient' && slide.background.gradient) ||
		(slide.background?.type === 'linearGradient' && (slide.background.stops?.length ?? 0) >= 2)
	) {
		// NOTE: `<a:effectLst/>` is required by PowerPoint (matches image-bg path above); omitting it triggers the repair dialog
		strSlideXml += `<p:bg><p:bgPr>${genXmlColorSelection(slide.background)}<a:effectLst/></p:bgPr></p:bg>`
	} else if (!slide.bkgd && slide._name && slide._name === DEF_PRES_LAYOUT_NAME) {
		// NOTE: Default [white] background is needed on slideMaster1.xml to avoid gray background in Keynote (and Finder previews)
		strSlideXml += '<p:bg><p:bgRef idx="1001"><a:schemeClr val="bg1"/></p:bgRef></p:bg>'
	}

	// STEP 2: Continue slide by starting spTree node
	strSlideXml += '<p:spTree>'
	strSlideXml += '<p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>'
	strSlideXml += '<p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/>'
	strSlideXml += '<a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>'

	// STEP 3: Loop over all Slide.data objects and add them to this slide
	const usedShapeIds = new Set<number>()
	const shapeCoordinates: ShapeIdCoord[] = []
	slide._slideObjects.forEach((slideItemObj: ISlideObject, idx: number) => {
		let x = 0
		let y = 0
		let cx = getSmartParseNumber('75%', 'X', slide._presLayout)
		let cy = 0
		let placeholderObj: ISlideObject | undefined
		let locationAttr = ''
		let arrTabRows: TableCell[][] = []
		let objTabOpts: ObjectOptions = {}
		slideItemObj.options = slideItemObj.options || {}
		const shapeId = resolveShapeId(slideItemObj.options, idx, usedShapeIds)
		// Keep resolved id on options so animations / later passes can target the same cNvPr id
		slideItemObj.options.sId = shapeId
		shapeCoordinates.push({
			id: shapeId,
			position: {
				x: slideItemObj.options.x,
				y: slideItemObj.options.y,
				w: slideItemObj.options.w,
				h: slideItemObj.options.h,
			},
		})
		let intColCnt = 0
		let cellOpts: TableCellProps | undefined
		let strXml = ''
		const sizing: ObjectOptions['sizing'] = slideItemObj.options?.sizing
		const rounding = slideItemObj.options?.rounding

		if (
			'_slideLayout' in slide &&
			slide._slideLayout?._slideObjects !== undefined &&
			slideItemObj.options &&
			slideItemObj.options.placeholder
		) {
			placeholderObj = slide._slideLayout._slideObjects.filter(
				(object: ISlideObject) => object.options?.placeholder === slideItemObj.options?.placeholder
			)[0]
		}

		// A: Geometry — connectors may auto-size from source/target shape boxes (ZentoSoft)
		const connectorLayout =
			slideItemObj.options.line?.isConnector
				? applyConnectorAutoLayout(slideItemObj.options.line, shapeCoordinates, slide._presLayout)
				: undefined

		if (connectorLayout) {
			x = connectorLayout.x
			y = connectorLayout.y
			cx = connectorLayout.cx
			cy = connectorLayout.cy
			slideItemObj.options.flipH = connectorLayout.flipH
			slideItemObj.options.flipV = connectorLayout.flipV
		} else {
			if (typeof slideItemObj.options.x !== 'undefined') x = getSmartParseNumber(slideItemObj.options.x, 'X', slide._presLayout)
			if (typeof slideItemObj.options.y !== 'undefined') y = getSmartParseNumber(slideItemObj.options.y, 'Y', slide._presLayout)
			if (typeof slideItemObj.options.w !== 'undefined') cx = getSmartParseNumber(slideItemObj.options.w, 'X', slide._presLayout)
			if (typeof slideItemObj.options.h !== 'undefined') cy = getSmartParseNumber(slideItemObj.options.h, 'Y', slide._presLayout)
		}

		// Set w/h now that smart parse is done.
		// `getSmartParseNumber` guesses units per-value (<100=inches, >=100=EMU), so `w:2899, h:97` mixes EMU
		// and inches. The sizing fns only use imgSize for a *ratio*, so normalize to a common unit before they
		// corrupt `srcRect` with a garbage aspect (issue #1286). Frame `cx`/`cy` below keep their own values.
		let imgWidth = cx
		let imgHeight = cy
		if (slideItemObj.options?.sizing?.type) {
			// `getSmartParseNumber` guesses units per-value (<100=inches, >=100=EMU), so `w:2899, h:97` mixes
			// EMU and inches and corrupts the sizing aspect/`srcRect` (issue #1286). boxDim is always EMU, so
			// coerce both image dims to EMU: whichever raw value was taken as inches (<100) is re-read as EMU.
			const rawW = slideItemObj.options.w
			const rawH = slideItemObj.options.h
			if (typeof rawW === 'number' && rawW < 100 && typeof rawH === 'number' && rawH >= 100) imgWidth = rawW
			else if (typeof rawH === 'number' && rawH < 100 && typeof rawW === 'number' && rawW >= 100) imgHeight = rawH
		}

		// If using a placeholder then inherit it's position
		if (placeholderObj) {
			if (placeholderObj.options?.x || placeholderObj.options?.x === 0) x = getSmartParseNumber(placeholderObj.options?.x, 'X', slide._presLayout)
			if (placeholderObj.options?.y || placeholderObj.options?.y === 0) y = getSmartParseNumber(placeholderObj.options?.y, 'Y', slide._presLayout)
			if (placeholderObj.options?.w || placeholderObj.options?.w === 0) cx = getSmartParseNumber(placeholderObj.options?.w, 'X', slide._presLayout)
			if (placeholderObj.options?.h || placeholderObj.options?.h === 0) cy = getSmartParseNumber(placeholderObj.options?.h, 'Y', slide._presLayout)
			// Re-sync the image frame: imgWidth/imgHeight were snapshotted from cx/cy before this block, so a
			// placeholder's w/h would otherwise be lost and the frame stay at the 1x1 default (issue #996).
			imgWidth = cx
			imgHeight = cy
		}
		//
		if (slideItemObj.options.flipH) locationAttr += ' flipH="1"'
		if (slideItemObj.options.flipV) locationAttr += ' flipV="1"'
		if (slideItemObj.options.rotate) locationAttr += ` rot="${convertRotationDegrees(slideItemObj.options.rotate)}"`

		// B: Add OBJECT to the current Slide
		switch (slideItemObj._type) {
			case SLIDE_OBJECT_TYPES.table: {
				arrTabRows = slideItemObj.arrTabRows ?? []
				objTabOpts = slideItemObj.options
				intColCnt = 0

				// Calc number of columns
				// NOTE: Cells may have a colspan, so merely taking the length of the [0] (or any other) row is not
				// ....: sufficient to determine column count. Therefore, check each cell for a colspan and total cols as reqd
				arrTabRows[0].forEach(cell => {
					cellOpts = cell.options
					intColCnt += cellOpts?.colspan ? Number(cellOpts.colspan) : 1
				})

				// STEP 1: Start Table XML
				// NOTE: Non-numeric cNvPr id values will trigger "presentation needs repair" type warning in MS-PPT-2013
				strXml = `<p:graphicFrame><p:nvGraphicFramePr><p:cNvPr id="${intTableNum * (slide._slideNum ?? 0) + 1}" name="${slideItemObj.options.objectName}"/>`
				// When the table binds to a master/layout placeholder, emit `<p:ph type="tbl"/>` (ECMA-376 §4.4.1.33, issue #856)
				const tblPh = placeholderObj ? genXmlPlaceholder(placeholderObj) : ''
				strXml +=
					'<p:cNvGraphicFramePr><a:graphicFrameLocks noGrp="1"/></p:cNvGraphicFramePr>' +
					`  <p:nvPr>${tblPh}${genXmlModIdExt(typeof slideItemObj.options.modId === 'number' ? slideItemObj.options.modId : 1579011935)}</p:nvPr>` +
					'</p:nvGraphicFramePr>'
				strXml += `<p:xfrm><a:off x="${x || (x === 0 ? 0 : EMU)}" y="${y || (y === 0 ? 0 : EMU)}"/><a:ext cx="${cx || (cx === 0 ? 0 : EMU)}" cy="${cy || EMU
				}"/></p:xfrm>`
				strXml += '<a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/table">'
				// NOTE: banding/emphasis only renders when a table style is applied - either `tableStyleId` here or a theme default
				strXml += `<a:tbl>${genXmlTblPr(objTabOpts as TableProps)}`

				// STEP 2: Set column widths
				// Evenly distribute cols/rows across size provided when applicable (calc them if only overall dimensions were provided)
				// A: Col widths provided?
				// B: Table Width provided without colW? Then distribute cols
				if (Array.isArray(objTabOpts.colW)) {
					strXml += '<a:tblGrid>'
					for (let col = 0; col < intColCnt; col++) {
						let w = inch2Emu(objTabOpts.colW[col])
						if (w == null || isNaN(w)) {
							w = (typeof slideItemObj.options.w === 'number' ? slideItemObj.options.w : 1) / intColCnt
						}
						strXml += `<a:gridCol w="${Math.round(w)}"/>`
					}
					strXml += '</a:tblGrid>'
				} else {
					let intColW = objTabOpts.colW ? objTabOpts.colW : EMU
					if (slideItemObj.options.w && !objTabOpts.colW) intColW = Math.round((typeof slideItemObj.options.w === 'number' ? slideItemObj.options.w : 1) / intColCnt)
					strXml += '<a:tblGrid>'
					for (let colw = 0; colw < intColCnt; colw++) {
						strXml += `<a:gridCol w="${intColW}"/>`
					}
					strXml += '</a:tblGrid>'
				}

				// STEP 3: Build our row arrays into an actual grid to match the XML we will be building next (ISSUE #36)
				// Note row arrays can arrive "lopsided" as in row1:[1,2,3] row2:[3] when first two cols rowspan!,
				// so a simple loop below in XML building wont suffice to build table correctly.
				// We have to build an actual grid now
				/*
					EX: (A0:rowspan=3, B1:rowspan=2, C1:colspan=2)

					/------|------|------|------\
					|  A0  |  B0  |  C0  |  D0  |
					|      |  B1  |  C1  |      |
					|      |      |  C2  |  D2  |
					\------|------|------|------/
				*/
				// A: add _hmerge cell for colspan. should reserve rowspan
				arrTabRows.forEach(cells => {
					for (let cIdx = 0; cIdx < cells.length;) {
						const cell = cells[cIdx]
						const colspan = cell.options?.colspan
						const rowspan = cell.options?.rowspan
						if (colspan && colspan > 1) {
							const vMergeCells = new Array(colspan - 1).fill(undefined).map(() => {
								return { _type: SLIDE_OBJECT_TYPES.tablecell, options: { rowspan }, _hmerge: true } as const
							})
							cells.splice(cIdx + 1, 0, ...vMergeCells)
							cIdx += colspan
						} else {
							cIdx += 1
						}
					}
				})
				// B: add _vmerge cell for rowspan. should reserve colspan/_hmerge
				arrTabRows.forEach((cells, rIdx) => {
					const nextRow = arrTabRows[rIdx + 1]
					if (!nextRow) return
					cells.forEach((cell, cIdx) => {
						const rowspan = cell._rowContinue || cell.options?.rowspan
						const colspan = cell.options?.colspan
						const _hmerge = cell._hmerge
						if (rowspan && rowspan > 1) {
							const hMergeCell = { _type: SLIDE_OBJECT_TYPES.tablecell, options: { colspan }, _rowContinue: rowspan - 1, _vmerge: true, _hmerge } as const
							nextRow.splice(cIdx, 0, hMergeCell)
						}
					})
				})

				// STEP 4: Build table rows/cells
				arrTabRows.forEach((cells, rIdx) => {
					const itemOpts: ObjectOptions = slideItemObj.options ?? {}
					// A: Table Height provided without rowH? Then distribute rows
					let intRowH = 0 // IMPORTANT: Default must be zero for auto-sizing to work
					if (Array.isArray(objTabOpts.rowH) && objTabOpts.rowH[rIdx]) intRowH = inch2Emu(Number(objTabOpts.rowH[rIdx]))
					else if (objTabOpts.rowH && !isNaN(Number(objTabOpts.rowH))) intRowH = inch2Emu(Number(objTabOpts.rowH))
					else if (itemOpts.cy || itemOpts.h) {
						intRowH = Math.round(
							(itemOpts.h ? inch2Emu(itemOpts.h) : typeof itemOpts.cy === 'number' ? itemOpts.cy : 1) /
							arrTabRows.length
						)
					}

					// B: Start row
					strXml += `<a:tr h="${intRowH}">`

					// C: Loop over each CELL
					cells.forEach(cellObj => {
						const cell: TableCell = cellObj

						const cellSpanAttrs = {
							rowSpan: (cell.options?.rowspan ?? 0) > 1 ? cell.options?.rowspan : undefined,
							gridSpan: (cell.options?.colspan ?? 0) > 1 ? cell.options?.colspan : undefined,
							vMerge: cell._vmerge ? 1 : undefined,
							hMerge: cell._hmerge ? 1 : undefined,
						}
						let cellSpanAttrStr = Object.keys(cellSpanAttrs)
							.map(k => [k, cellSpanAttrs[k]])
							.filter(([, v]) => !!v)
							.map(([k, v]) => `${String(k)}="${String(v)}"`)
							.join(' ')
						if (cellSpanAttrStr) cellSpanAttrStr = ' ' + cellSpanAttrStr

						// 1: COLSPAN/ROWSPAN: Add dummy cells for any active colspan/rowspan
						if (cell._hmerge || cell._vmerge) {
							strXml += `<a:tc${cellSpanAttrStr}><a:tcPr/></a:tc>`
							return
						}

						// 2: OPTIONS: Build/set cell options
						const cellOpts = cell.options || {}
						cell.options = cellOpts

						// B: Inherit some options from table when cell options dont exist
						// @see: http://officeopenxml.com/drwTableCellProperties-alignment.php
						;['align', 'bold', 'border', 'color', 'fill', 'fontFace', 'fontSize', 'margin', 'textDirection', 'vert', 'underline', 'valign'].forEach(name => {
							if (objTabOpts[name] && !cellOpts[name] && cellOpts[name] !== 0) cellOpts[name] = objTabOpts[name]
						})

						const cellValign = cellOpts.valign
							? ` anchor="${cellOpts.valign.replace(/^c$/i, 'ctr').replace(/^m$/i, 'ctr').replace('center', 'ctr').replace('middle', 'ctr').replace('top', 't').replace('btm', 'b').replace('bottom', 'b')}"`
							: ''
						// `vert` = Martin-N alias of `textDirection`
						const cellDir = cellOpts.textDirection || cellOpts.vert
						const cellTextDir = (cellDir && cellDir !== 'horz') ? ` vert="${cellDir}"` : ''

						let fillColor =
							cell._optImp?.fill?.color
								? cell._optImp.fill.color
								: cell._optImp?.fill && typeof cell._optImp.fill === 'string'
									? cell._optImp.fill
									: ''
						fillColor = fillColor || cellOpts.fill ? cellOpts.fill : ''
						const cellFill = fillColor ? genXmlColorSelection(fillColor) : ''

						let cellMargin = cellOpts.margin === 0 || cellOpts.margin ? cellOpts.margin : DEF_CELL_MARGIN_IN
						if (!Array.isArray(cellMargin) && typeof cellMargin === 'number') cellMargin = [cellMargin, cellMargin, cellMargin, cellMargin]
						// Guard against non-number/non-array margins (e.g. object/string) which otherwise yield marL="NaN" and trigger PowerPoint repair
						if (!Array.isArray(cellMargin)) cellMargin = DEF_CELL_MARGIN_IN as [number, number, number, number]
						cellMargin = (cellMargin as number[]).map(v => (typeof v === 'number' && isFinite(v) ? v : 0)) as [number, number, number, number]
						/** FUTURE: DEPRECATED:
						 * - Backwards-Compat: Oops! Discovered we were still using points for cell margin before v3.8.0 (UGH!)
						 * - We cant introduce a breaking change before v4.0, so...
						 */
						const cellMarginXml = cellMargin[0] >= 1
							? ` marL="${valToPts(cellMargin[3])}" marR="${valToPts(cellMargin[1])}" marT="${valToPts(cellMargin[0])}" marB="${valToPts(
								cellMargin[2]
							)}"`
							: ` marL="${inch2Emu(cellMargin[3])}" marR="${inch2Emu(cellMargin[1])}" marT="${inch2Emu(cellMargin[0])}" marB="${inch2Emu(
								cellMargin[2]
							)}"`

						// FUTURE: Cell NOWRAP property (textwrap: add to a:tcPr (horzOverflow="overflow" or whatever options exist)

						// 4: Set CELL content and properties ==================================
						strXml += `<a:tc${cellSpanAttrStr}>${genXmlTextBody(cell)}<a:tcPr${cellMarginXml}${cellValign}${cellTextDir}>`
						// strXml += `<a:tc${cellColspan}${cellRowspan}>${genXmlTextBody(cell)}<a:tcPr${cellMarginXml}${cellValign}${cellTextDir}>`
						// FIXME: 20200525: ^^^
						// <a:tcPr marL="38100" marR="38100" marT="38100" marB="38100" vert="vert270">

						// 5: Borders: Add any borders
						if (cellOpts.border && Array.isArray(cellOpts.border)) {
							const border = cellOpts.border
							// NOTE: *** IMPORTANT! *** LRTB order matters! (Reorder a line below to watch the borders go wonky in MS-PPT-2013!!)
							;[
								{ idx: 3, name: 'lnL' },
								{ idx: 1, name: 'lnR' },
								{ idx: 0, name: 'lnT' },
								{ idx: 2, name: 'lnB' },
							].forEach(obj => {
								if (border[obj.idx].type !== 'none') {
									strXml += `<a:${obj.name} w="${valToPts(border[obj.idx].pt)}" cap="flat" cmpd="sng" algn="ctr">`
									strXml += `<a:solidFill>${createColorElement(border[obj.idx].color)}</a:solidFill>`
									strXml += `<a:prstDash val="${border[obj.idx].type === 'dash' ? 'sysDash' : 'solid'
									}"/><a:round/><a:headEnd type="none" w="med" len="med"/><a:tailEnd type="none" w="med" len="med"/>`
									strXml += `</a:${obj.name}>`
								} else {
									strXml += `<a:${obj.name} w="0" cap="flat" cmpd="sng" algn="ctr"><a:noFill/></a:${obj.name}>`
								}
							})
						}

						// 6: Close cell Properties & Cell
						strXml += cellFill
						strXml += '  </a:tcPr>'
						strXml += ' </a:tc>'
					})

					// D: Complete row
					strXml += '</a:tr>'
				})

				// STEP 5: Complete table
				strXml += '      </a:tbl>'
				strXml += '    </a:graphicData>'
				strXml += '  </a:graphic>'
				strXml += '</p:graphicFrame>'

				// STEP 6: Set table XML
				strSlideXml += strXml

				// LAST: Increment counter
				intTableNum++
				break
			}

			case SLIDE_OBJECT_TYPES.text:
			case SLIDE_OBJECT_TYPES.placeholder: {
				const isConnector = !!slideItemObj.options.line?.isConnector
				// Lines can have zero cy, but text should not
				if (!slideItemObj.options.line && cy === 0) cy = EMU * 0.3
				// Text margins are applied in addTextDefinition → `_bodyProp` (TRBL)

				// A: Start SHAPE / CONNECTOR ============================================
				if (isConnector) {
					strSlideXml += '<p:cxnSp>'
					strSlideXml += `<p:nvCxnSpPr><p:cNvPr id="${shapeId}" name="${slideItemObj.options.objectName}"></p:cNvPr>`
					strSlideXml += `<p:cNvCxnSpPr><a:stCxn id="${slideItemObj.options.line?.sourceId}" idx="${slideItemObj.options.line?.sourceAnchorPos ?? 0}"/><a:endCxn id="${slideItemObj.options.line?.targetId}" idx="${slideItemObj.options.line?.targetAnchorPos ?? 0}"/></p:cNvCxnSpPr>`
					strSlideXml += `<p:nvPr>${genXmlModIdExt(slideItemObj.options.modId)}</p:nvPr></p:nvCxnSpPr><p:spPr>`
				} else {
					strSlideXml += '<p:sp>'
					// B: The addition of the "txBox" attribute is the sole determiner of if an object is a shape or textbox
					strSlideXml += `<p:nvSpPr><p:cNvPr id="${shapeId}" name="${slideItemObj.options.objectName}">`
					// <Hyperlink>
					if (slideItemObj.options.hyperlink?.url) {
						strSlideXml += `<a:hlinkClick r:id="rId${slideItemObj.options.hyperlink._rId}" tooltip="${slideItemObj.options.hyperlink.tooltip ? encodeXmlEntities(slideItemObj.options.hyperlink.tooltip) : ''}"/>`
					}
					if (slideItemObj.options.hyperlink?.slide) {
						strSlideXml += `<a:hlinkClick r:id="rId${slideItemObj.options.hyperlink._rId}" tooltip="${slideItemObj.options.hyperlink.tooltip ? encodeXmlEntities(slideItemObj.options.hyperlink.tooltip) : ''}" action="ppaction://hlinksldjump"/>`
					}
					// </Hyperlink>
					strSlideXml += '</p:cNvPr>'
					// PowerPoint math zones are authored in text boxes; force txBox when OMML is present
					const useTxBox = Boolean(slideItemObj.options?.isTextBox) || textRunsHaveOmml(slideItemObj.text)
					strSlideXml += '<p:cNvSpPr' + (useTxBox ? ' txBox="1"/>' : '/>')
					strSlideXml += `<p:nvPr>${slideItemObj._type === 'placeholder' ? genXmlPlaceholder(slideItemObj) : genXmlPlaceholder(placeholderObj)}${genXmlModIdExt(slideItemObj.options.modId)}</p:nvPr>`
					strSlideXml += '</p:nvSpPr><p:spPr>'
				}
				strSlideXml += `<a:xfrm${locationAttr}>`
				strSlideXml += `<a:off x="${x}" y="${y}"/>`
				strSlideXml += `<a:ext cx="${cx}" cy="${cy}"/></a:xfrm>`

				if (!isConnector && slideItemObj.shape === 'custGeom') {
					strSlideXml += '<a:custGeom><a:avLst />'
					strSlideXml += '<a:gdLst>'
					strSlideXml += '</a:gdLst>'
					strSlideXml += '<a:ahLst />'
					strSlideXml += '<a:cxnLst>'
					strSlideXml += '</a:cxnLst>'
					strSlideXml += '<a:rect l="l" t="t" r="r" b="b" />'

					strSlideXml += '<a:pathLst>'
					strSlideXml += `<a:path w="${cx}" h="${cy}">`

					slideItemObj.options.points?.forEach((point, i) => {
						if ('curve' in point) {
							switch (point.curve.type) {
								case 'arc':
									strSlideXml += `<a:arcTo hR="${getSmartParseNumber(point.curve.hR, 'Y', slide._presLayout)}" wR="${getSmartParseNumber(
										point.curve.wR,
										'X',
										slide._presLayout
									)}" stAng="${convertRotationDegrees(point.curve.stAng)}" swAng="${convertRotationDegrees(point.curve.swAng)}" />`
									break
								case 'cubic':
									strSlideXml += `<a:cubicBezTo>
									<a:pt x="${getSmartParseNumber(point.curve.x1, 'X', slide._presLayout)}" y="${getSmartParseNumber(point.curve.y1, 'Y', slide._presLayout)}" />
									<a:pt x="${getSmartParseNumber(point.curve.x2, 'X', slide._presLayout)}" y="${getSmartParseNumber(point.curve.y2, 'Y', slide._presLayout)}" />
									<a:pt x="${getSmartParseNumber(point.x, 'X', slide._presLayout)}" y="${getSmartParseNumber(point.y, 'Y', slide._presLayout)}" />
									</a:cubicBezTo>`
									break
								case 'quadratic':
									strSlideXml += `<a:quadBezTo>
									<a:pt x="${getSmartParseNumber(point.curve.x1, 'X', slide._presLayout)}" y="${getSmartParseNumber(point.curve.y1, 'Y', slide._presLayout)}" />
									<a:pt x="${getSmartParseNumber(point.x, 'X', slide._presLayout)}" y="${getSmartParseNumber(point.y, 'Y', slide._presLayout)}" />
									</a:quadBezTo>`
									break
								default:
									break
							}
						} else if ('close' in point) {
							strSlideXml += '<a:close />'
						} else if (point.moveTo || i === 0) {
							strSlideXml += `<a:moveTo><a:pt x="${getSmartParseNumber(point.x, 'X', slide._presLayout)}" y="${getSmartParseNumber(
								point.y,
								'Y',
								slide._presLayout
							)}" /></a:moveTo>`
						} else {
							strSlideXml += `<a:lnTo><a:pt x="${getSmartParseNumber(point.x, 'X', slide._presLayout)}" y="${getSmartParseNumber(
								point.y,
								'Y',
								slide._presLayout
							)}" /></a:lnTo>`
						}
					})

					strSlideXml += '</a:path>'
					strSlideXml += '</a:pathLst>'
					strSlideXml += '</a:custGeom>'
				} else {
					strSlideXml += '<a:prstGeom prst="' + slideItemObj.shape + '"><a:avLst>'
					if (slideItemObj.options.rectRadius) {
						strSlideXml += `<a:gd name="adj" fmla="val ${Math.round((slideItemObj.options.rectRadius * EMU * 100000) / Math.min(cx, cy))}"/>`
					} else if (slideItemObj.options.angleRange) {
						for (let i = 0; i < 2; i++) {
							const angle = slideItemObj.options.angleRange[i]
							strSlideXml += `<a:gd name="adj${i + 1}" fmla="val ${convertRotationDegrees(angle)}" />`
						}

						if (slideItemObj.options.arcThicknessRatio) {
							strSlideXml += `<a:gd name="adj3" fmla="val ${Math.round(slideItemObj.options.arcThicknessRatio * 50000)}" />`
						}
					}
					if (isConnector && slideItemObj.options.line?.curveadjust?.length) {
						slideItemObj.options.line.curveadjust.forEach((adj, i) => {
							strSlideXml += `<a:gd name="adj${i + 1}" fmla="val ${Math.round(Number(adj))}"/>`
						})
					}
					strSlideXml += '</a:avLst></a:prstGeom>'
				}

				// Option: FILL
				strSlideXml += slideItemObj.options.fill ? genXmlColorSelection(slideItemObj.options.fill) : '<a:noFill/>'

				// shape Type: LINE: line color
				if (slideItemObj.options.line) strSlideXml += genXmlLine(slideItemObj.options.line)

				// EFFECTS: shadow / glow / softEdge / reflection
				// REF: @see http://officeopenxml.com/drwSp-effects.php
				strSlideXml += genXmlEffectLst({
					shadow: slideItemObj.options.shadow,
					glow: slideItemObj.options.glow,
					softEdge: slideItemObj.options.softEdge,
					reflection: slideItemObj.options.reflection,
				})

				// B: Close shape Properties
				strSlideXml += '</p:spPr>'

				if (isConnector) {
					// Connectors have no text body
					strSlideXml += '</p:cxnSp>'
				} else {
					// C: Add formatted text (text body "bodyPr")
					strSlideXml += genXmlTextBody(slideItemObj)
					// LAST: Close SHAPE =======================================================
					strSlideXml += '</p:sp>'
				}
				break
			}

			case SLIDE_OBJECT_TYPES.image:
				strSlideXml += '<p:pic>'
				strSlideXml += '  <p:nvPicPr>'
				strSlideXml += `<p:cNvPr id="${shapeId}" name="${slideItemObj.options.objectName}" descr="${encodeXmlEntities(
					slideItemObj.options.altText || slideItemObj.image
				)}">`
				if (slideItemObj.hyperlink?.url) {
					strSlideXml += `<a:hlinkClick r:id="rId${slideItemObj.hyperlink._rId}" tooltip="${slideItemObj.hyperlink.tooltip ? encodeXmlEntities(slideItemObj.hyperlink.tooltip) : ''
					}"/>`
				}
				if (slideItemObj.hyperlink?.slide) {
					strSlideXml += `<a:hlinkClick r:id="rId${slideItemObj.hyperlink._rId}" tooltip="${slideItemObj.hyperlink.tooltip ? encodeXmlEntities(slideItemObj.hyperlink.tooltip) : ''
					}" action="ppaction://hlinksldjump"/>`
				}
				strSlideXml += '    </p:cNvPr>'
				strSlideXml += '    <p:cNvPicPr><a:picLocks noChangeAspect="1"/></p:cNvPicPr>'
				strSlideXml += '    <p:nvPr>' + genXmlPlaceholder(placeholderObj) + genXmlModIdExt(slideItemObj.options.modId) + '</p:nvPr>'
				strSlideXml += '  </p:nvPicPr>'
				strSlideXml += '<p:blipFill>'
				// NOTE: This works for both cases: either `path` or `data` contains the SVG
				if (
					(slide._relsMedia || []).filter(rel => rel.rId === slideItemObj.imageRid)[0] &&
					(slide._relsMedia || []).filter(rel => rel.rId === slideItemObj.imageRid)[0].extn === 'svg'
				) {
					strSlideXml += `<a:blip r:embed="rId${(slideItemObj.imageRid ?? 0) - 1}">`
					strSlideXml += slideItemObj.options.transparency ? ` <a:alphaModFix amt="${Math.round((100 - slideItemObj.options.transparency) * 1000)}"/>` : ''
					strSlideXml += ' <a:extLst>'
					strSlideXml += '  <a:ext uri="{96DAC541-7B7A-43D3-8B79-37D633B846F1}">'
					strSlideXml += `   <asvg:svgBlip xmlns:asvg="http://schemas.microsoft.com/office/drawing/2016/SVG/main" r:embed="rId${slideItemObj.imageRid}"/>`
					strSlideXml += '  </a:ext>'
					strSlideXml += ' </a:extLst>'
					strSlideXml += '</a:blip>'
				} else {
					strSlideXml += `<a:blip r:embed="rId${slideItemObj.imageRid}">`
					strSlideXml += slideItemObj.options.transparency ? `<a:alphaModFix amt="${Math.round((100 - slideItemObj.options.transparency) * 1000)}"/>` : ''
					strSlideXml += '</a:blip>'
				}
				if (sizing?.type) {
					const boxW = sizing.w ? getSmartParseNumber(sizing.w, 'X', slide._presLayout) : cx
					const boxH = sizing.h ? getSmartParseNumber(sizing.h, 'Y', slide._presLayout) : cy
					const boxX = getSmartParseNumber(sizing.x || 0, 'X', slide._presLayout)
					const boxY = getSmartParseNumber(sizing.y || 0, 'Y', slide._presLayout)
					const sourceSize = sizing.type !== 'crop' && typeof slideItemObj.options.w === 'number' && typeof slideItemObj.options.h === 'number'
						? { w: slideItemObj.options.w, h: slideItemObj.options.h }
						: { w: imgWidth, h: imgHeight }

					strSlideXml += ImageSizingXml[sizing.type](sourceSize, { w: boxW, h: boxH, x: boxX, y: boxY })
					// ECMA-376 §5.1.10.55: `srcRect` crops the source blip; the `<a:ext>` frame is the independent
					// on-slide bounding box. Only `cover`/`contain` resize the frame to the fitted box. For `crop`
					// the frame must keep the user's w/h container - collapsing it to the crop box (or 0) breaks
					// rendering (issue #1399).
					if (sizing.type !== 'crop') {
						imgWidth = boxW
						imgHeight = boxH
					}
				} else {
					strSlideXml += '  <a:stretch><a:fillRect/></a:stretch>'
				}
				strSlideXml += '</p:blipFill>'
				strSlideXml += '<p:spPr>'
				strSlideXml += ' <a:xfrm' + locationAttr + '>'
				strSlideXml += `  <a:off x="${x}" y="${y}"/>`
				strSlideXml += `  <a:ext cx="${imgWidth}" cy="${imgHeight}"/>`
				strSlideXml += ' </a:xfrm>'
				// Geometry: rectRadius → roundRect; rounding (legacy) → ellipse; else rect
				// Selective port of niranjan-uma-shankar/feature/html-to-pptx (keeps ellipse back-compat)
				if (typeof slideItemObj.options.rectRadius === 'number') {
					const adjValue = Math.round((slideItemObj.options.rectRadius * EMU * 100000) / Math.min(imgWidth, imgHeight))
					strSlideXml += ` <a:prstGeom prst="roundRect"><a:avLst><a:gd name="adj" fmla="val ${adjValue}"/></a:avLst></a:prstGeom>`
				} else {
					strSlideXml += ` <a:prstGeom prst="${rounding ? 'ellipse' : 'rect'}"><a:avLst/></a:prstGeom>`
				}

				// OUTLINE: picture border/frame (issue #35)
				if (slideItemObj.options.line) strSlideXml += genXmlLine(slideItemObj.options.line)

				// EFFECTS: shadow / glow / softEdge / reflection
				strSlideXml += genXmlEffectLst({
					shadow: slideItemObj.options.shadow,
					glow: slideItemObj.options.glow,
					softEdge: slideItemObj.options.softEdge,
					reflection: slideItemObj.options.reflection,
				})
				strSlideXml += '</p:spPr>'
				strSlideXml += '</p:pic>'
				break

			case SLIDE_OBJECT_TYPES.media:
				if (slideItemObj.mtype === 'online') {
					strSlideXml += '<p:pic>'
					strSlideXml += ' <p:nvPicPr>'
					// IMPORTANT: <p:cNvPr id="" value is critical - if its not the same number as preview image `rId`, PowerPoint throws error!
					strSlideXml += `<p:cNvPr id="${(slideItemObj.mediaRid ?? 0) + 2}" name="${slideItemObj.options.objectName}"/>`
					strSlideXml += ' <p:cNvPicPr/>'
					strSlideXml += ' <p:nvPr>'
					strSlideXml += `  <a:videoFile r:link="rId${slideItemObj.mediaRid}"/>`
					strSlideXml += ' </p:nvPr>'
					strSlideXml += ' </p:nvPicPr>'
					// NOTE: `blip` is diferent than videos; also there's no preview "p:extLst" above but exists in videos
					strSlideXml += ` <p:blipFill><a:blip r:embed="rId${(slideItemObj.mediaRid ?? 0) + 1}"/><a:stretch><a:fillRect/></a:stretch></p:blipFill>` // NOTE: Preview image is required!
					strSlideXml += ' <p:spPr>'
					strSlideXml += `  <a:xfrm${locationAttr}><a:off x="${x}" y="${y}"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm>`
					strSlideXml += '  <a:prstGeom prst="rect"><a:avLst/></a:prstGeom>'
					strSlideXml += ' </p:spPr>'
					strSlideXml += '</p:pic>'
				} else {
					// ECMA-376: audio uses `<a:audioFile>`, video uses `<a:videoFile>` under nvPr.
					const mediaFileTag = slideItemObj.mtype === 'audio' ? 'a:audioFile' : 'a:videoFile'
					strSlideXml += '<p:pic>'
					strSlideXml += ' <p:nvPicPr>'
					// IMPORTANT: <p:cNvPr id="" value is critical - if not the same number as preiew image rId, PowerPoint throws error!
					strSlideXml += `<p:cNvPr id="${(slideItemObj.mediaRid ?? 0) + 2}" name="${slideItemObj.options.objectName
					}"><a:hlinkClick r:id="" action="ppaction://media"/></p:cNvPr>`
					strSlideXml += ' <p:cNvPicPr><a:picLocks noChangeAspect="1"/></p:cNvPicPr>'
					strSlideXml += ' <p:nvPr>'
					strSlideXml += `  <${mediaFileTag} r:link="rId${slideItemObj.mediaRid}"/>`
					strSlideXml += '  <p:extLst>'
					strSlideXml += '   <p:ext uri="{DAA4B4D4-6D71-4841-9C94-3DE7FCFB9230}">'
					// MS-PPTX §2.3.3.14 CT_Media: trim/fade/bmkLst children (issue-gap #6). Self-close when none (preserves prior output).
					const mediaExtras = genXmlMediaExtras(slideItemObj.options)
					strSlideXml += mediaExtras
						? `    <p14:media xmlns:p14="http://schemas.microsoft.com/office/powerpoint/2010/main" r:embed="rId${(slideItemObj.mediaRid ?? 0) + 1}">${mediaExtras}    </p14:media>`
						: `    <p14:media xmlns:p14="http://schemas.microsoft.com/office/powerpoint/2010/main" r:embed="rId${(slideItemObj.mediaRid ?? 0) + 1}"/>`
					strSlideXml += '   </p:ext>'
					// MS-PPTX §2.2.14 Narration: isNarration flag on the media shape's nvPr.
					if (slideItemObj.options.isNarration)
						strSlideXml += '   <p:ext uri="{42D2F446-02D8-4167-A562-619A0277C38B}"><p15:isNarration xmlns:p15="http://schemas.microsoft.com/office/powerpoint/2012/main" val="1"/></p:ext>'
					strSlideXml += '  </p:extLst>'
					strSlideXml += ' </p:nvPr>'
					strSlideXml += ' </p:nvPicPr>'
					strSlideXml += ` <p:blipFill><a:blip r:embed="rId${(slideItemObj.mediaRid ?? 0) + 2}"/><a:stretch><a:fillRect/></a:stretch></p:blipFill>` // NOTE: Preview image is required!
					strSlideXml += ' <p:spPr>'
					strSlideXml += `  <a:xfrm${locationAttr}><a:off x="${x}" y="${y}"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm>`
					strSlideXml += '  <a:prstGeom prst="rect"><a:avLst/></a:prstGeom>'
					strSlideXml += ' </p:spPr>'
					strSlideXml += '</p:pic>'
				}
				break

			case SLIDE_OBJECT_TYPES.zoom: {
			// MS-PPTX §2.2.15: mc:AlternateContent { Choice p16:{sldZm|sectionZm|summaryZm} | Fallback }.
				const zOpts = slideItemObj.options
				const zKind = slideItemObj.zoomKind ?? 'slide'
				const zRid = slideItemObj.zoomRid ?? 0
				const zId = getUuid('{xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx}')
				const zRet = zOpts.returnToParent === false ? '0' : '1'
				const zShowBg = zOpts.showBg === false ? '0' : '1'
				const zDur = typeof zOpts.transitionDur === 'number' ? ` p14:transitionDur="${Math.round(zOpts.transitionDur)}"` : ''
				const zGeom = `<a:xfrm${locationAttr}><a:off x="${x}" y="${y}"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom>`
				const zFill = `<p:blipFill><a:blip r:embed="rId${zRid}"/><a:stretch><a:fillRect/></a:stretch></p:blipFill>`
				const zmPr = `<p166:zmPr id="${zId}" returnToParent="${zRet}" showBg="${zShowBg}" imageType="preview"${zDur}>${zFill}<p:spPr>${zGeom}</p:spPr></p166:zmPr>`
				const nsMap = {
					slide: 'http://schemas.microsoft.com/office/powerpoint/2016/slidezoom',
					section: 'http://schemas.microsoft.com/office/powerpoint/2016/sectionzoom',
					summary: 'http://schemas.microsoft.com/office/powerpoint/2016/summaryzoom',
				}
				const zNs = nsMap[zKind]

				strSlideXml += '<mc:AlternateContent xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006">'
				strSlideXml += `<mc:Choice Requires="p16" xmlns:p16="${zNs}" xmlns:p166="http://schemas.microsoft.com/office/powerpoint/2016/6/main" xmlns:p14="http://schemas.microsoft.com/office/powerpoint/2010/main">`
				if (zKind === 'slide') {
					const zSldId = 255 + (slideItemObj.zoomSlideNum ?? 1)
					strSlideXml += `<p16:sldZm><p16:sldZmObj sldId="${zSldId}">${zmPr}</p16:sldZmObj></p16:sldZm>`
				} else if (zKind === 'section') {
					strSlideXml += `<p16:sectionZm><p16:sectionZmObj sectionId="${slideItemObj.zoomSectionId}">${zmPr}</p16:sectionZmObj></p16:sectionZm>`
				} else {
				// §2.11 CT_SummaryZoom: summaryZmObj(s) + required layout choice (gridLayout/fixedLayout).
					const szTitle = zOpts.zoomTitle ? ` title="${encodeXmlEntities(zOpts.zoomTitle)}"` : ''
					const szDescr = zOpts.zoomDescr ? ` descr="${encodeXmlEntities(zOpts.zoomDescr)}"` : ''
					const szOff = (typeof zOpts.offsetFactorX === 'number' ? ` offsetFactorX="${Math.round(zOpts.offsetFactorX)}"` : '') + (typeof zOpts.offsetFactorY === 'number' ? ` offsetFactorY="${Math.round(zOpts.offsetFactorY)}"` : '')
					const szScale = (typeof zOpts.scaleFactorX === 'number' ? ` scaleFactorX="${Math.round(zOpts.scaleFactorX)}"` : '') + (typeof zOpts.scaleFactorY === 'number' ? ` scaleFactorY="${Math.round(zOpts.scaleFactorY)}"` : '')
					strSlideXml += `<p16:summaryZm><p16:summaryZmObj sectionId="${slideItemObj.zoomSectionId}"${szTitle}${szDescr}${szOff}${szScale}>${zmPr}</p16:summaryZmObj><p16:gridLayout/></p16:summaryZm>`
				}
				strSlideXml += '</mc:Choice>'
				// Fallback for older readers: pic for slide/section zoom; grpSp for summary zoom (§2.2.15).
				if (zKind === 'summary') {
					strSlideXml += `<mc:Fallback><p:grpSp><p:nvGrpSpPr><p:cNvPr id="${shapeId}" name="${zOpts.objectName}"/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="${x}" y="${y}"/><a:ext cx="${cx}" cy="${cy}"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr></p:grpSp></mc:Fallback>`
				} else {
					strSlideXml += '<mc:Fallback><p:pic><p:nvPicPr>'
					strSlideXml += `<p:cNvPr id="${shapeId}" name="${zOpts.objectName}" descr="${encodeXmlEntities(zOpts.altText || '')}"/>`
					strSlideXml += '<p:cNvPicPr><a:picLocks noChangeAspect="1"/></p:cNvPicPr><p:nvPr/></p:nvPicPr>'
					strSlideXml += zFill
					strSlideXml += `<p:spPr>${zGeom}</p:spPr></p:pic></mc:Fallback>`
				}
				strSlideXml += '</mc:AlternateContent>'
				break
			}

			case SLIDE_OBJECT_TYPES.chart:
				strSlideXml += '<p:graphicFrame>'
				strSlideXml += ' <p:nvGraphicFramePr>'
				strSlideXml += `   <p:cNvPr id="${shapeId}" name="${slideItemObj.options.objectName}" descr="${encodeXmlEntities(slideItemObj.options.altText || '')}"/>`
				strSlideXml += '   <p:cNvGraphicFramePr/>'
				strSlideXml += `   <p:nvPr>${genXmlPlaceholder(placeholderObj)}${genXmlModIdExt(slideItemObj.options.modId)}</p:nvPr>`
				strSlideXml += ' </p:nvGraphicFramePr>'
				strSlideXml += ` <p:xfrm><a:off x="${x}" y="${y}"/><a:ext cx="${cx}" cy="${cy}"/></p:xfrm>`
				strSlideXml += ' <a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">'
				strSlideXml += '  <a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/chart">'
				strSlideXml += `   <c:chart r:id="rId${slideItemObj.chartRid}" xmlns:c="http://schemas.openxmlformats.org/drawingml/2006/chart"/>`
				strSlideXml += '  </a:graphicData>'
				strSlideXml += ' </a:graphic>'
				strSlideXml += '</p:graphicFrame>'
				break

			default:
				strSlideXml += ''
				break
		}
	})

	// STEP 4: Add slide numbers (if any) last
	if (slide._slideNumberProps) {
		// Set some defaults (done here b/c SlideNumber canbe added to masters or slides and has numerous entry points)
		if (!slide._slideNumberProps.align) slide._slideNumberProps.align = 'left'

		strSlideXml += '<p:sp>'
		strSlideXml += ' <p:nvSpPr>'
		strSlideXml += '  <p:cNvPr id="25" name="Slide Number Placeholder 0"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr>'
		strSlideXml += '  <p:nvPr><p:ph type="sldNum" sz="quarter" idx="4294967295"/></p:nvPr>'
		strSlideXml += ' </p:nvSpPr>'
		strSlideXml += ' <p:spPr>'
		strSlideXml += '<a:xfrm>' +
			`<a:off x="${getSmartParseNumber(slide._slideNumberProps.x, 'X', slide._presLayout)}" y="${getSmartParseNumber(slide._slideNumberProps.y, 'Y', slide._presLayout)}"/>` +
			`<a:ext cx="${slide._slideNumberProps.w ? getSmartParseNumber(slide._slideNumberProps.w, 'X', slide._presLayout) : '800000'}" cy="${slide._slideNumberProps.h ? getSmartParseNumber(slide._slideNumberProps.h, 'Y', slide._presLayout) : '300000'}"/>` +
			'</a:xfrm>' +
			' <a:prstGeom prst="rect"><a:avLst/></a:prstGeom>' +
			' <a:extLst><a:ext uri="{C572A759-6A51-4108-AA02-DFA0A04FC94B}"><ma14:wrappingTextBoxFlag val="0" xmlns:ma14="http://schemas.microsoft.com/office/mac/drawingml/2011/main"/></a:ext></a:extLst>' +
			'</p:spPr>'
		strSlideXml += '<p:txBody>'
		strSlideXml += '<a:bodyPr'
		if (slide._slideNumberProps.margin && Array.isArray(slide._slideNumberProps.margin)) {
			strSlideXml += ` lIns="${valToPts(slide._slideNumberProps.margin[3] || 0)}"`
			strSlideXml += ` tIns="${valToPts(slide._slideNumberProps.margin[0] || 0)}"`
			strSlideXml += ` rIns="${valToPts(slide._slideNumberProps.margin[1] || 0)}"`
			strSlideXml += ` bIns="${valToPts(slide._slideNumberProps.margin[2] || 0)}"`
		} else if (typeof slide._slideNumberProps.margin === 'number') {
			strSlideXml += ` lIns="${valToPts(slide._slideNumberProps.margin || 0)}"`
			strSlideXml += ` tIns="${valToPts(slide._slideNumberProps.margin || 0)}"`
			strSlideXml += ` rIns="${valToPts(slide._slideNumberProps.margin || 0)}"`
			strSlideXml += ` bIns="${valToPts(slide._slideNumberProps.margin || 0)}"`
		}
		if (slide._slideNumberProps.valign) {
			strSlideXml += ` anchor="${slide._slideNumberProps.valign.replace('top', 't').replace('middle', 'ctr').replace('bottom', 'b')}"`
		}
		strSlideXml += '/>'
		strSlideXml += '  <a:lstStyle><a:lvl1pPr>'
		if (slide._slideNumberProps.fontFace || slide._slideNumberProps.fontSize || slide._slideNumberProps.color) {
			strSlideXml += `<a:defRPr sz="${Math.round((slide._slideNumberProps.fontSize || 12) * 100)}">`
			if (slide._slideNumberProps.color) strSlideXml += genXmlColorSelection(slide._slideNumberProps.color)
			if (slide._slideNumberProps.fontFace) { strSlideXml += `<a:latin typeface="${slide._slideNumberProps.fontFace}"/><a:ea typeface="${slide._slideNumberProps.fontFace}"/><a:cs typeface="${slide._slideNumberProps.fontFace}"/>` }
			strSlideXml += '</a:defRPr>'
		}
		strSlideXml += '</a:lvl1pPr></a:lstStyle>'
		strSlideXml += '<a:p>'
		if (slide._slideNumberProps.align.startsWith('l')) strSlideXml += '<a:pPr algn="l"/>'
		else if (slide._slideNumberProps.align.startsWith('c')) strSlideXml += '<a:pPr algn="ctr"/>'
		else if (slide._slideNumberProps.align.startsWith('r')) strSlideXml += '<a:pPr algn="r"/>'
		else strSlideXml += '<a:pPr algn="l"/>'
		strSlideXml += `<a:fld id="${SLDNUMFLDID}" type="slidenum"><a:rPr b="${slide._slideNumberProps.bold ? 1 : 0}" lang="en-US"/>`
		strSlideXml += `<a:t>${slide._slideNum}</a:t></a:fld><a:endParaRPr lang="en-US"/></a:p>`
		strSlideXml += '</p:txBody></p:sp>'
	}

	// STEP 5: Close spTree and finalize slide XML
	strSlideXml += '</p:spTree>'
	strSlideXml += genXmlCreationIdExt('creationId' in slide ? slide.creationId : undefined)
	strSlideXml += '</p:cSld>'

	// LAST: Return
	return strSlideXml
}
