/**
 * Chart axis rendering.
 */

import { AXIS_ID_CATEGORY_PRIMARY, AXIS_ID_CATEGORY_SECONDARY, AXIS_ID_VALUE_PRIMARY, AXIS_ID_VALUE_SECONDARY, CHART_TYPE, DEF_CHART_GRIDLINE, DEF_FONT_COLOR, DEF_FONT_SIZE, ONEPT } from '../core-enums'
import { IChartOptsLib } from '../core-interfaces'
import { convertRotationDegrees, createColorElement, encodeXmlEntities, valToPts } from '../gen-utils'
import { genXmlTitle } from './title'
import { createGridLineElement } from './utils'

/**
 * Create Category axis
 * @param {IChartOptsLib} opts - chart options
 * @param {string} axisId - value
 * @param {string} valAxisId - value
 * @return {string} XML
 */
export function makeCatAxis (opts: IChartOptsLib, axisId: string, valAxisId: string): string {
	let strXml = ''

	// Build cat axis tag
	// NOTE: Scatter and Bubble chart need two Val axises as they display numbers on x axis
	if (opts._type === CHART_TYPE.SCATTER || opts._type === CHART_TYPE.BUBBLE || opts._type === CHART_TYPE.BUBBLE3D) {
		strXml += '<c:valAx>'
	} else {
		strXml += '<c:' + (opts.catLabelFormatCode ? 'dateAx' : 'catAx') + '>'
	}
	strXml += '  <c:axId val="' + axisId + '"/>'
	strXml += '  <c:scaling>'
	strXml += '<c:orientation val="' + (opts.catAxisOrientation || (opts.barDir === 'col' ? 'minMax' : 'minMax')) + '"/>'
	if (opts.catAxisMaxVal || opts.catAxisMaxVal === 0) strXml += `<c:max val="${opts.catAxisMaxVal}"/>`
	if (opts.catAxisMinVal || opts.catAxisMinVal === 0) strXml += `<c:min val="${opts.catAxisMinVal}"/>`
	strXml += '</c:scaling>'
	strXml += '  <c:delete val="' + (opts.catAxisHidden ? '1' : '0') + '"/>'
	strXml += '  <c:axPos val="' + (opts.barDir === 'col' ? 'b' : 'l') + '"/>'
	strXml += opts.catGridLine && opts.catGridLine.style !== 'none' ? createGridLineElement(opts.catGridLine) : ''
	// '<c:title>' comes between '</c:majorGridlines>' and '<c:numFmt>'
	if (opts.showCatAxisTitle) {
		strXml += genXmlTitle({
			color: opts.catAxisTitleColor,
			fontFace: opts.catAxisTitleFontFace,
			fontSize: opts.catAxisTitleFontSize,
			titleRotate: opts.catAxisTitleRotate,
			title: opts.catAxisTitle || 'Axis Title',
		})
	}
	// NOTE: Adding Val Axis Formatting if scatter or bubble charts
	// ECMA-376 §5.7.2.122 CT_NumFmt: `sourceLinked` defaults to true and IGNORES formatCode (uses the linked
	// workbook format). A custom mask only takes effect with sourceLinked="0" (issue #1309).
	if (opts._type === CHART_TYPE.SCATTER || opts._type === CHART_TYPE.BUBBLE || opts._type === CHART_TYPE.BUBBLE3D) {
		// X (cat) axis: honor catLabelFormatCode so x and y can be formatted independently; fall back to valAxisLabelFormatCode for back-compat (issue #1436)
		const xAxisFmt = opts.catLabelFormatCode || opts.valAxisLabelFormatCode
		strXml += '  <c:numFmt formatCode="' + (xAxisFmt ? encodeXmlEntities(xAxisFmt) : 'General') + '" sourceLinked="0"/>'
	} else {
		strXml += '  <c:numFmt formatCode="' + (encodeXmlEntities(opts.catLabelFormatCode) || 'General') + '" sourceLinked="0"/>'
	}
	if (opts._type === CHART_TYPE.SCATTER) {
		strXml += '  <c:majorTickMark val="none"/>'
		strXml += '  <c:minorTickMark val="none"/>'
		strXml += '  <c:tickLblPos val="' + (opts.catAxisLabelPos || 'nextTo') + '"/>'
	} else {
		strXml += '  <c:majorTickMark val="' + (opts.catAxisMajorTickMark || 'out') + '"/>'
		strXml += '  <c:minorTickMark val="' + (opts.catAxisMinorTickMark || 'none') + '"/>'
		strXml += '  <c:tickLblPos val="' + (opts.catAxisLabelPos || (opts.barDir === 'col' ? 'low' : 'nextTo')) + '"/>'
	}
	strXml += '  <c:spPr>'
	strXml += `    <a:ln w="${opts.catAxisLineSize ? valToPts(opts.catAxisLineSize) : ONEPT}" cap="flat">`
	strXml += !opts.catAxisLineShow ? '<a:noFill/>' : '<a:solidFill>' + createColorElement(opts.catAxisLineColor || DEF_CHART_GRIDLINE.color) + '</a:solidFill>'
	strXml += '      <a:prstDash val="' + (opts.catAxisLineStyle || 'solid') + '"/>'
	strXml += '      <a:round/>'
	strXml += '    </a:ln>'
	strXml += '  </c:spPr>'
	strXml += '  <c:txPr>'
	if (opts.catAxisLabelRotate) {
		strXml += `<a:bodyPr rot="${convertRotationDegrees(opts.catAxisLabelRotate)}"/>`
	} else {
		// NOTE: don't specify "`rot=0" - that way the object will be auto behavior
		strXml += '<a:bodyPr/>'
	}
	strXml += '    <a:lstStyle/>'
	strXml += '    <a:p>'
	strXml += '    <a:pPr>'
	strXml += `      <a:defRPr sz="${Math.round((opts.catAxisLabelFontSize || DEF_FONT_SIZE) * 100)}" b="${opts.catAxisLabelFontBold ? 1 : 0}" i="${opts.catAxisLabelFontItalic ? 1 : 0}" u="none" strike="noStrike">`
	strXml += '      <a:solidFill>' + createColorElement(opts.catAxisLabelColor || DEF_FONT_COLOR) + '</a:solidFill>'
	strXml += '      <a:latin typeface="' + (opts.catAxisLabelFontFace || 'Arial') + '"/>'
	strXml += '   </a:defRPr>'
	strXml += '  </a:pPr>'
	strXml += '  <a:endParaRPr lang="' + (opts.lang || 'en-US') + '"/>'
	strXml += '  </a:p>'
	strXml += ' </c:txPr>'
	strXml += ' <c:crossAx val="' + valAxisId + '"/>'
	// ECMA-376 §5.7.2.33/34: `crosses@val` is ST_Crosses (autoZero|min|max); `crossesAt@val` is a double.
	// A numeric 0 is a legitimate crossing value, so distinguish with `??` not `||` (falsy 0 must not fall back to autoZero).
	strXml += typeof opts.valAxisCrossesAt === 'number'
		? ` <c:crossesAt val="${opts.valAxisCrossesAt}"/>`
		: ` <c:crosses val="${opts.valAxisCrossesAt ?? 'autoZero'}"/>`
	strXml += ' <c:auto val="1"/>'
	strXml += ' <c:lblAlgn val="ctr"/>'
	strXml += ` <c:noMultiLvlLbl val="${opts.catAxisMultiLevelLabels ? 0 : 1}"/>`
	if (opts.catAxisLabelFrequency) strXml += ' <c:tickLblSkip val="' + opts.catAxisLabelFrequency + '"/>'

	// Issue#149: PPT will auto-adjust these as needed after calcing the date bounds, so we only include them when specified by user
	// Allow major and minor units to be set for double value axis charts
	if (opts.catLabelFormatCode || opts._type === CHART_TYPE.SCATTER || opts._type === CHART_TYPE.BUBBLE || opts._type === CHART_TYPE.BUBBLE3D) {
		if (opts.catLabelFormatCode) {
			['catAxisBaseTimeUnit', 'catAxisMajorTimeUnit', 'catAxisMinorTimeUnit'].forEach(opt => {
				// Validate input as poorly chosen/garbage options will cause chart corruption and it wont render at all!
				if (opts[opt] && (typeof opts[opt] !== 'string' || !['days', 'months', 'years'].includes(opts[opt].toLowerCase()))) {
					console.warn(`"${opt}" must be one of: 'days','months','years' !`)
					opts[opt] = null
				}
			})
			if (opts.catAxisBaseTimeUnit) strXml += '<c:baseTimeUnit val="' + opts.catAxisBaseTimeUnit.toLowerCase() + '"/>'
			if (opts.catAxisMajorTimeUnit) strXml += '<c:majorTimeUnit val="' + opts.catAxisMajorTimeUnit.toLowerCase() + '"/>'
			if (opts.catAxisMinorTimeUnit) strXml += '<c:minorTimeUnit val="' + opts.catAxisMinorTimeUnit.toLowerCase() + '"/>'
		}
		if (opts.catAxisMajorUnit) strXml += `<c:majorUnit val="${opts.catAxisMajorUnit}"/>`
		if (opts.catAxisMinorUnit) strXml += `<c:minorUnit val="${opts.catAxisMinorUnit}"/>`
	}

	// Close cat axis tag
	// NOTE: Added closing tag of val or cat axis based on chart type
	if (opts._type === CHART_TYPE.SCATTER || opts._type === CHART_TYPE.BUBBLE || opts._type === CHART_TYPE.BUBBLE3D) {
		strXml += '</c:valAx>'
	} else {
		strXml += '</c:' + (opts.catLabelFormatCode ? 'dateAx' : 'catAx') + '>'
	}

	return strXml
}

/**
 * Create Value Axis (Used by `bar3D`)
 * @param {IChartOptsLib} opts - chart options
 * @param {string} valAxisId - value
 * @return {string} XML
 */
export function makeValAxis (opts: IChartOptsLib, valAxisId: string): string {
	let axisPos = valAxisId === AXIS_ID_VALUE_PRIMARY ? (opts.barDir === 'col' ? 'l' : 'b') : opts.barDir !== 'col' ? 'r' : 't'
	if (valAxisId === AXIS_ID_VALUE_SECONDARY) axisPos = 'r' // default behavior for PPT is showing 2nd val axis on right (primary axis on left)
	const crossAxId = valAxisId === AXIS_ID_VALUE_PRIMARY ? AXIS_ID_CATEGORY_PRIMARY : AXIS_ID_CATEGORY_SECONDARY
	let strXml = ''

	strXml += '<c:valAx>'
	strXml += '  <c:axId val="' + valAxisId + '"/>'
	strXml += '  <c:scaling>'
	if (opts.valAxisLogScaleBase) strXml += `<c:logBase val="${opts.valAxisLogScaleBase}"/>`
	strXml += '<c:orientation val="' + (opts.valAxisOrientation || (opts.barDir === 'col' ? 'minMax' : 'minMax')) + '"/>'
	if (opts.valAxisMaxVal || opts.valAxisMaxVal === 0) strXml += `<c:max val="${opts.valAxisMaxVal}"/>`
	if (opts.valAxisMinVal || opts.valAxisMinVal === 0) strXml += `<c:min val="${opts.valAxisMinVal}"/>`
	strXml += '  </c:scaling>'
	strXml += `  <c:delete val="${opts.valAxisHidden ? 1 : 0}"/>`
	strXml += '  <c:axPos val="' + axisPos + '"/>'
	if (opts.valGridLine && opts.valGridLine.style !== 'none') strXml += createGridLineElement(opts.valGridLine)
	// '<c:title>' comes between '</c:majorGridlines>' and '<c:numFmt>'
	if (opts.showValAxisTitle) {
		strXml += genXmlTitle({
			color: opts.valAxisTitleColor,
			fontFace: opts.valAxisTitleFontFace,
			fontSize: opts.valAxisTitleFontSize,
			titleRotate: opts.valAxisTitleRotate,
			title: opts.valAxisTitle || 'Axis Title',
		})
	}
	strXml += `<c:numFmt formatCode="${opts.valAxisLabelFormatCode ? encodeXmlEntities(opts.valAxisLabelFormatCode) : 'General'}" sourceLinked="0"/>`
	if (opts._type === CHART_TYPE.SCATTER) {
		strXml += '  <c:majorTickMark val="none"/>'
		strXml += '  <c:minorTickMark val="none"/>'
		strXml += '  <c:tickLblPos val="nextTo"/>'
	} else {
		strXml += ' <c:majorTickMark val="' + (opts.valAxisMajorTickMark || 'out') + '"/>'
		strXml += ' <c:minorTickMark val="' + (opts.valAxisMinorTickMark || 'none') + '"/>'
		strXml += ' <c:tickLblPos val="' + (opts.valAxisLabelPos || (opts.barDir === 'col' ? 'nextTo' : 'low')) + '"/>'
	}
	strXml += ' <c:spPr>'
	strXml += `   <a:ln w="${opts.valAxisLineSize ? valToPts(opts.valAxisLineSize) : ONEPT}" cap="flat">`
	strXml += !opts.valAxisLineShow ? '<a:noFill/>' : '<a:solidFill>' + createColorElement(opts.valAxisLineColor || DEF_CHART_GRIDLINE.color) + '</a:solidFill>'
	strXml += '     <a:prstDash val="' + (opts.valAxisLineStyle || 'solid') + '"/>'
	strXml += '     <a:round/>'
	strXml += '   </a:ln>'
	strXml += ' </c:spPr>'
	strXml += ' <c:txPr>'
	strXml += `  <a:bodyPr${opts.valAxisLabelRotate ? (' rot="' + convertRotationDegrees(opts.valAxisLabelRotate).toString() + '"') : ''}/>` // don't specify rot 0 so we get the auto behavior
	strXml += '  <a:lstStyle/>'
	strXml += '  <a:p>'
	strXml += '    <a:pPr>'
	strXml += `      <a:defRPr sz="${Math.round((opts.valAxisLabelFontSize || DEF_FONT_SIZE) * 100)}" b="${opts.valAxisLabelFontBold ? 1 : 0}" i="${opts.valAxisLabelFontItalic ? 1 : 0}" u="none" strike="noStrike">`
	strXml += '        <a:solidFill>' + createColorElement(opts.valAxisLabelColor || DEF_FONT_COLOR) + '</a:solidFill>'
	strXml += '        <a:latin typeface="' + (opts.valAxisLabelFontFace || 'Arial') + '"/>'
	strXml += '      </a:defRPr>'
	strXml += '    </a:pPr>'
	strXml += '  <a:endParaRPr lang="' + (opts.lang || 'en-US') + '"/>'
	strXml += '  </a:p>'
	strXml += ' </c:txPr>'
	strXml += ' <c:crossAx val="' + crossAxId + '"/>'
	// ECMA-376 §5.7.2.33/34: when the user pins the category axis at an explicit value (valAxisCrossesAt is a
	// number, e.g. 0 for issue #1245), the perpendicular value axis must also cross explicitly (crossesAt), not autoZero.
	if (typeof opts.catAxisCrossesAt === 'number') {
		strXml += ` <c:crossesAt val="${opts.catAxisCrossesAt}"/>`
	} else if (typeof opts.catAxisCrossesAt === 'string') {
		strXml += ' <c:crosses val="' + opts.catAxisCrossesAt + '"/>'
	} else if (typeof opts.valAxisCrossesAt === 'number') {
		strXml += ` <c:crossesAt val="${opts.valAxisCrossesAt}"/>`
	} else {
		const isRight = axisPos === 'r' || axisPos === 't'
		const crosses = isRight ? 'max' : 'autoZero'
		strXml += ' <c:crosses val="' + crosses + '"/>'
	}
	strXml +=
		' <c:crossBetween val="' +
        (opts._type === CHART_TYPE.SCATTER || (!!(Array.isArray(opts._type) && opts._type.filter(type => type.type === CHART_TYPE.AREA).length > 0)) ? 'midCat' : 'between') +
        '"/>'
	if (opts.valAxisMajorUnit) strXml += ` <c:majorUnit val="${opts.valAxisMajorUnit}"/>`
	if (opts.valAxisDisplayUnit) { strXml += `<c:dispUnits><c:builtInUnit val="${opts.valAxisDisplayUnit}"/>${opts.valAxisDisplayUnitLabel ? '<c:dispUnitsLbl/>' : ''}</c:dispUnits>` }

	strXml += '</c:valAx>'

	return strXml
}

/**
 * Create Series Axis (Used by `bar3D`)
 * @param {IChartOptsLib} opts - chart options
 * @param {string} axisId - axis ID
 * @param {string} valAxisId - value
 * @return {string} XML
 */
export function makeSerAxis (opts: IChartOptsLib, axisId: string, valAxisId: string): string {
	let strXml = ''

	// Build ser axis tag
	strXml += '<c:serAx>'
	strXml += '  <c:axId val="' + axisId + '"/>'
	strXml += '  <c:scaling><c:orientation val="' + (opts.serAxisOrientation || (opts.barDir === 'col' ? 'minMax' : 'minMax')) + '"/></c:scaling>'
	strXml += '  <c:delete val="' + (opts.serAxisHidden ? '1' : '0') + '"/>'
	strXml += '  <c:axPos val="' + (opts.barDir === 'col' ? 'b' : 'l') + '"/>'
	strXml += opts.serGridLine && opts.serGridLine.style !== 'none' ? createGridLineElement(opts.serGridLine) : ''
	// '<c:title>' comes between '</c:majorGridlines>' and '<c:numFmt>'
	if (opts.showSerAxisTitle) {
		strXml += genXmlTitle({
			color: opts.serAxisTitleColor,
			fontFace: opts.serAxisTitleFontFace,
			fontSize: opts.serAxisTitleFontSize,
			titleRotate: opts.serAxisTitleRotate,
			title: opts.serAxisTitle || 'Axis Title',
		})
	}
	strXml += `  <c:numFmt formatCode="${encodeXmlEntities(opts.serLabelFormatCode) || 'General'}" sourceLinked="0"/>`
	strXml += '  <c:majorTickMark val="out"/>'
	strXml += '  <c:minorTickMark val="none"/>'
	strXml += `  <c:tickLblPos val="${opts.serAxisLabelPos || (opts.barDir === 'col' ? 'low' : 'nextTo')}"/>`
	strXml += '  <c:spPr>'
	strXml += '    <a:ln w="12700" cap="flat">'
	strXml += !opts.serAxisLineShow ? '<a:noFill/>' : `<a:solidFill>${createColorElement(opts.serAxisLineColor || DEF_CHART_GRIDLINE.color)}</a:solidFill>`
	strXml += '      <a:prstDash val="solid"/>'
	strXml += '      <a:round/>'
	strXml += '    </a:ln>'
	strXml += '  </c:spPr>'
	strXml += '  <c:txPr>'
	strXml += '    <a:bodyPr/>' // don't specify rot 0 so we get the auto behavior
	strXml += '    <a:lstStyle/>'
	strXml += '    <a:p>'
	strXml += '    <a:pPr>'
	strXml += `    <a:defRPr sz="${Math.round((opts.serAxisLabelFontSize || DEF_FONT_SIZE) * 100)}" b="${opts.serAxisLabelFontBold ? '1' : '0'}" i="${opts.serAxisLabelFontItalic ? '1' : '0'}" u="none" strike="noStrike">`
	strXml += `      <a:solidFill>${createColorElement(opts.serAxisLabelColor || DEF_FONT_COLOR)}</a:solidFill>`
	strXml += `      <a:latin typeface="${opts.serAxisLabelFontFace || 'Arial'}"/>`
	strXml += '   </a:defRPr>'
	strXml += '  </a:pPr>'
	strXml += '  <a:endParaRPr lang="' + (opts.lang || 'en-US') + '"/>'
	strXml += '  </a:p>'
	strXml += ' </c:txPr>'
	strXml += ' <c:crossAx val="' + valAxisId + '"/>'
	strXml += ' <c:crosses val="autoZero"/>'
	if (opts.serAxisLabelFrequency) strXml += ' <c:tickLblSkip val="' + opts.serAxisLabelFrequency + '"/>'

	// Issue#149: PPT will auto-adjust these as needed after calcing the date bounds, so we only include them when specified by user
	if (opts.serLabelFormatCode) {
		['serAxisBaseTimeUnit', 'serAxisMajorTimeUnit', 'serAxisMinorTimeUnit'].forEach(opt => {
			// Validate input as poorly chosen/garbage options will cause chart corruption and it wont render at all!
			if (opts[opt] && (typeof opts[opt] !== 'string' || !['days', 'months', 'years'].includes(opt.toLowerCase()))) {
				console.warn(`"${opt}" must be one of: 'days','months','years' !`)
				opts[opt] = null
			}
		})
		if (opts.serAxisBaseTimeUnit) strXml += ` <c:baseTimeUnit  val="${opts.serAxisBaseTimeUnit.toLowerCase()}"/>`
		if (opts.serAxisMajorTimeUnit) strXml += ` <c:majorTimeUnit val="${opts.serAxisMajorTimeUnit.toLowerCase()}"/>`
		if (opts.serAxisMinorTimeUnit) strXml += ` <c:minorTimeUnit val="${opts.serAxisMinorTimeUnit.toLowerCase()}"/>`
		if (opts.serAxisMajorUnit) strXml += ` <c:majorUnit val="${opts.serAxisMajorUnit}"/>`
		if (opts.serAxisMinorUnit) strXml += ` <c:minorUnit val="${opts.serAxisMinorUnit}"/>`
	}

	// Close ser axis tag
	strXml += '</c:serAx>'

	return strXml
}
