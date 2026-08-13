/**
 * Chart title rendering.
 */

import { DEF_FONT_COLOR } from '../core-enums'
import { IChartPropsTitle } from '../core-interfaces'
import { convertRotationDegrees, createColorElement, encodeXmlEntities } from '../gen-utils'

/**
 * Create char title elements
 * @param {IChartPropsTitle} opts - options
 * @return {string} XML `<c:title>`
 */
export function genXmlTitle (opts: IChartPropsTitle, chartX?: number, chartY?: number): string {
	const align = opts.titleAlign === 'left' || opts.titleAlign === 'right' ? `<a:pPr algn="${opts.titleAlign.substring(0, 1)}">` : '<a:pPr>'
	const rotate = opts.titleRotate ? `<a:bodyPr rot="${convertRotationDegrees(opts.titleRotate)}"/>` : '<a:bodyPr/>' // don't specify rotation to get default (ex. vertical for cat axis)
	const sizeAttr = opts.fontSize ? `sz="${Math.round(opts.fontSize * 100)}"` : '' // only set the font size if specified.  Powerpoint will handle the default size
	const titleBold = opts.titleBold ? 1 : 0
	const titleItalic = opts.titleItalic ? 1 : 0

	let layout = '<c:layout/>'
	if (opts.titlePos && typeof opts.titlePos.x === 'number' && typeof opts.titlePos.y === 'number') {
		// NOTE: manualLayout x/y vals are *relative to entire slide*
		const totalX = opts.titlePos.x + (chartX ?? 0)
		const totalY = opts.titlePos.y + (chartY ?? 0)
		let valX = totalX === 0 ? 0 : (totalX * (totalX / 5)) / 10
		if (valX >= 1) valX = valX / 10
		if (valX >= 0.1) valX = valX / 10
		let valY = totalY === 0 ? 0 : (totalY * (totalY / 5)) / 10
		if (valY >= 1) valY = valY / 10
		if (valY >= 0.1) valY = valY / 10
		layout = `<c:layout><c:manualLayout><c:xMode val="edge"/><c:yMode val="edge"/><c:x val="${valX}"/><c:y val="${valY}"/></c:manualLayout></c:layout>`
	}

	return `<c:title>
      <c:tx>
        <c:rich>
          ${rotate}
          <a:lstStyle/>
          <a:p>
            ${align}
            <a:defRPr ${sizeAttr} b="${titleBold}" i="${titleItalic}" u="none" strike="noStrike">
              <a:solidFill>${createColorElement(opts.color || DEF_FONT_COLOR)}</a:solidFill>
              <a:latin typeface="${opts.fontFace || 'Arial'}"/>
            </a:defRPr>
          </a:pPr>
          <a:r>
            <a:rPr ${sizeAttr} b="${titleBold}" i="${titleItalic}" u="none" strike="noStrike">
              <a:solidFill>${createColorElement(opts.color || DEF_FONT_COLOR)}</a:solidFill>
              <a:latin typeface="${opts.fontFace || 'Arial'}"/>
            </a:rPr>
            <a:t>${encodeXmlEntities(opts.title) || ''}</a:t>
          </a:r>
        </a:p>
        </c:rich>
      </c:tx>
      ${layout}
      <c:overlay val="0"/>
    </c:title>`
}
