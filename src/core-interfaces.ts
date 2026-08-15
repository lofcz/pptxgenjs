/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * PptxGenJS Interfaces
 */

import { CHART_NAME, PLACEHOLDER_TYPE, SHAPE_NAME, SLIDE_OBJECT_TYPES, TEXT_HALIGN, TEXT_VALIGN, TRANSITION_TYPE, WRITE_OUTPUT_TYPE } from './core-enums'

// Core Types
// ==========

/**
 * Coordinate number - either:
 * - Inches (0-n)
 * - Percentage (0-100)
 *
 * @example 10.25 // coordinate in inches
 * @example '75%' // coordinate as percentage of slide size
 */
export type Coord = number | `${number}%`
export interface PositionProps {
	/**
	 * Horizontal position
	 * - inches or percentage
	 * @example 10.25 // position in inches
	 * @example '75%' // position as percentage of slide size
	 */
	x?: Coord
	/**
	 * Vertical position
	 * - inches or percentage
	 * @example 10.25 // position in inches
	 * @example '75%' // position as percentage of slide size
	 */
	y?: Coord
	/**
	 * Height
	 * - inches or percentage
	 * @example 10.25 // height in inches
	 * @example '75%' // height as percentage of slide size
	 */
	h?: Coord
	/**
	 * Width
	 * - inches or percentage
	 * @example 10.25 // width in inches
	 * @example '75%' // width as percentage of slide size
	 */
	w?: Coord
}

/**
 * Convenience entrance animation: appear on click
 * - Alias for `animation: { type: 'appear', trigger: 'onClick' }`
 * - Ignored when `animation` is also set
 * @see MelleB/feat/appear-on-click (PR #1202)
 */
export interface AppearOnClickProps {
	/**
	 * Appear on click
	 * @default false
	 * @example true // entrance "Appear" triggered by click
	 */
	appearOnClick?: boolean
}

/**
 * Either `data` or `path` is required
 */
export interface DataOrPathProps {
	/**
	 * URL or relative path
	 *
	 * @example 'https://onedrives.com/myimg.png` // retrieve image via URL
	 * @example '/home/gitbrent/images/myimg.png` // retrieve image via local path
	 */
	path?: string
	/**
	 * base64-encoded string
	 * - Useful for avoiding potential path/server issues
	 *
	 * @example 'image/png;base64,iVtDafDrBF[...]=' // pre-encoded image in base-64
	 */
	data?: string
}
export interface BackgroundProps extends DataOrPathProps, ShapeFillProps {
	/**
	 * Color (hex format)
	 * @deprecated v3.6.0 - use `ShapeFillProps` instead
	 */
	fill?: HexColor

	/**
	 * source URL
	 * @deprecated v3.6.0 - use `DataOrPathProps` instead - remove in v4.0.0
	 */
	src?: string
}
/**
 * Color in Hex format
 * @example 'FF3399'
 */
export type HexColor = string
export type ThemeColor = 'tx1' | 'tx2' | 'bg1' | 'bg2' | 'accent1' | 'accent2' | 'accent3' | 'accent4' | 'accent5' | 'accent6'
/**
 * Color value: hex RGB, scheme token, or a scheme/hex color with OOXML transforms
 * (selective port of rafalBujok/define_color_theme + allow_modified_color_theme)
 */
export type Color = HexColor | ThemeColor | ModifiedThemeColor
export type Margin = number | [number, number, number, number]
export type HAlign = 'left' | 'center' | 'right' | 'justify'
export type VAlign = 'top' | 'middle' | 'bottom'

/**
 * Theme/hex color with DrawingML color transforms (`a:tint`, `a:shade`, `a:lumMod`, …)
 * - Percent fields are 0-100 (written as OOXML 0-100000)
 * - `hue` / `hueOff` are degrees (written as OOXML fixed-angle = deg × 60000)
 * @example { baseColor: 'accent1', tint: 40 }
 * @example { baseColor: 'FF0000', shade: 50, alpha: 80 }
 */
export interface ModifiedThemeColor {
	baseColor: HexColor | ThemeColor
	/** Opacity percent 0-100 (OOXML `a:alpha`) */
	alpha?: number
	alphaMod?: number
	alphaOff?: number
	blue?: number
	blueMod?: number
	blueOff?: number
	green?: number
	greenMod?: number
	greenOff?: number
	red?: number
	redMod?: number
	redOff?: number
	/** Hue in degrees 0-359 (OOXML `a:hue`) */
	hue?: number
	/** Hue modulation percent 0-100 */
	hueMod?: number
	/** Hue offset in degrees */
	hueOff?: number
	lum?: number
	lumMod?: number
	lumOff?: number
	sat?: number
	satMod?: number
	satOff?: number
	shade?: number
	tint?: number
	comp?: boolean
	gray?: boolean
	inv?: boolean
	gamma?: boolean
}

/**
 * Animation Properties
 * @see https://github.com/BapunHansdah/PptxGenJS/tree/release/pptxgenjs-animations
 */
export type AnimationTrigger = 'onClick' | 'withPrevious' | 'afterPrevious'

export type EntranceAnimation =
	| 'appear' | 'fadein' | 'flyin' | 'floatin' | 'split' | 'wipe'
	| 'shape' | 'wheel' | 'randombars' | 'zoom'
	| 'growandturn' | 'swivel' | 'bounce'

export type EmphasisAnimation =
	| 'pulse' | 'colorpulse' | 'teeter' | 'spin' | 'growshrink'
	| 'desaturate' | 'darken' | 'lighten' | 'transparency'
	| 'objectcolor' | 'complementarycolor' | 'linecolor' | 'fillcolor'

export type ExitAnimation =
	| 'disappear' | 'fadeout' | 'flyout' | 'floatout' | 'splitexit'
	| 'wipeexit' | 'shapeexit' | 'wheelexit' | 'randombarsexit'
	| 'shrinkandturn' | 'zoomexit' | 'swivelexit' | 'bounceexit'

export type PathAnimation =
	| 'pathdown' | 'patharcdown' | 'pathturnright' | 'pathcircle' | 'pathzigzag'

export type AnimationType = EntranceAnimation | EmphasisAnimation | ExitAnimation | PathAnimation

export type FlyDirection =
	| 'top' | 'bottom' | 'left' | 'right'
	| 'topLeft' | 'topRight'
	| 'bottomLeft' | 'bottomRight'

export type SplitDirection = 'horizontalIn' | 'horizontalOut' | 'verticalIn' | 'verticalOut'
/** Matches PowerPoint wipe presetSubtype directions used by gen-animations */
export type WipeDirection = 'bottom' | 'top' | 'left' | 'right'
export type ShapeMaskType = 'circle' | 'box' | 'diamond' | 'plus'
export type ShapeDirection = 'in' | 'out'
export type FloatDirection = 'floatUp' | 'floatDown'
export type ZoomDirection = 'slideCenter' | 'objectCenter'
export type SpinDirection = 'clockwise' | 'counterClockwise'
export type SpinAmount = 'quarterSpin' | 'halfSpin' | 'fullSpin' | 'twoSpins'
export type GrowShrinkDirection = 'horizontal' | 'vertical' | 'both'
export type GrowShrinkAmount = 'tiny' | 'smaller' | 'larger' | 'huge'
export type TransparencyLevel = '25%' | '50%' | '75%' | '100%' | number

export interface BaseAnimationConfig {
	type: AnimationType
	trigger?: AnimationTrigger
	/** Duration in milliseconds */
	duration?: number
	/** Delay in milliseconds */
	delay?: number
	/** Advanced: override animation class */
	class?: 'entr' | 'emph' | 'exit' | 'path'
	/** Advanced: override PowerPoint preset ID */
	presetID?: number
	/** Advanced: override PowerPoint preset subtype */
	presetSubtype?: number
}

export interface FlyAnimationConfig extends BaseAnimationConfig {
	type: 'flyin' | 'flyout'
	direction?: FlyDirection
}

export interface FloatAnimationConfig extends BaseAnimationConfig {
	type: 'floatin' | 'floatout'
	direction?: FloatDirection
}

export interface SplitAnimationConfig extends BaseAnimationConfig {
	type: 'split' | 'splitexit'
	direction?: SplitDirection
}

export interface WipeAnimationConfig extends BaseAnimationConfig {
	type: 'wipe' | 'wipeexit'
	direction?: WipeDirection
}

export interface ShapeAnimationConfig extends BaseAnimationConfig {
	type: 'shape' | 'shapeexit'
	shape?: ShapeMaskType
	direction?: ShapeDirection
}

export interface WheelAnimationConfig extends BaseAnimationConfig {
	type: 'wheel' | 'wheelexit'
	spokes?: 1 | 2 | 3 | 4 | 8
}

export interface RandomBarsAnimationConfig extends BaseAnimationConfig {
	type: 'randombars' | 'randombarsexit'
	direction?: 'horizontal' | 'vertical'
}

export interface ZoomAnimationConfig extends BaseAnimationConfig {
	type: 'zoom' | 'zoomexit'
	direction?: ZoomDirection
}

export interface SpinAnimationConfig extends BaseAnimationConfig {
	type: 'spin'
	direction?: SpinDirection
	amount?: SpinAmount
}

export interface GrowShrinkAnimationConfig extends BaseAnimationConfig {
	type: 'growshrink'
	direction?: GrowShrinkDirection
	amount?: GrowShrinkAmount
}

export interface ColorAnimationConfig extends BaseAnimationConfig {
	type: 'colorpulse' | 'objectcolor' | 'linecolor' | 'fillcolor'
	/** Hex color without '#', e.g. 'FFFF00' */
	color?: string
}

export interface TransparencyAnimationConfig extends BaseAnimationConfig {
	type: 'transparency'
	level?: TransparencyLevel
}

export type AnimationConfig =
	| BaseAnimationConfig
	| FlyAnimationConfig
	| FloatAnimationConfig
	| SplitAnimationConfig
	| WipeAnimationConfig
	| ShapeAnimationConfig
	| WheelAnimationConfig
	| RandomBarsAnimationConfig
	| ZoomAnimationConfig
	| SpinAnimationConfig
	| GrowShrinkAnimationConfig
	| ColorAnimationConfig
	| TransparencyAnimationConfig

/** Internal: object index + resolved animation for slide timing XML */
export interface SlideObjectAnimation {
	objectIndex: number
	/** DrawingML `cNvPr` id (honors explicit `sId` when set) */
	shapeId: number
	animation: AnimationConfig
}

// used by charts, shape, text
export interface BorderProps {
	/**
	 * Border type
	 * @default solid
	 */
	type?: 'none' | 'dash' | 'solid'
	/**
	 * Border color (hex)
	 * @example 'FF3399'
	 * @default '666666'
	 */
	color?: HexColor

	// TODO: add `transparency` prop to Borders (0-100%)

	/**
	 * Border width (points)
	 * - same name and unit as `ShapeLineProps.width`
	 * @default 1
	 */
	width?: number
	/**
	 * Border size (points)
	 * @deprecated v4.1.0 - use `width`
	 * @default 1
	 */
	pt?: number
}
// used by: image, object, text,
export interface HyperlinkProps {
	/**
	 * Relationship id - set by the library during export
	 * @internal
	 */
	_rId?: number
	/**
	 * Slide number to link to
	 */
	slide?: number
	/**
	 * Url to link to
	 */
	url?: string
	/**
	 * Hyperlink Tooltip
	 */
	tooltip?: string
}
/**
 * Soft-edge effect (`a:softEdge`) — blur the shape outline.
 * - radius in points
 */
export interface SoftEdgeProps {
	/**
	 * Soft-edge radius (points)
	 * @example 8
	 */
	radius: number
}

/**
 * Reflection effect (`a:reflection`) — Mona/PPTist-compatible subset.
 * Units: blur/distance in points; direction in degrees; opacity 0–1; scaleY as ratio (e.g. -1).
 */
export interface ReflectionProps {
	/**
	 * Blur radius (points)
	 * @default 0
	 */
	blur?: number
	/**
	 * Offset distance (points)
	 * @default 0
	 */
	distance?: number
	/**
	 * Direction (degrees)
	 * @default 0
	 */
	direction?: number
	/**
	 * Start opacity (0.0–1.0)
	 * @default 0.5
	 */
	opacity?: number
	/**
	 * Vertical scale ratio (`sy` / 100000). Negative flips the reflection.
	 * @default -1
	 */
	scaleY?: number
}

// used by: chart, text, image
export interface ShadowProps {
	/**
	 * shadow type
	 * @default 'none'
	 */
	type: 'outer' | 'inner' | 'none'
	/**
	 * opacity (percent)
	 * - range: 0.0-1.0
	 * @example 0.5 // 50% opaque
	 */
	opacity?: number // TODO: "Transparency (0-100%)" in PPT // TODO: deprecate and add `transparency`
	/**
	 * blur (points)
	 * - range: 0-100
	 * @default 0
	 */
	blur?: number
	/**
	 * angle (degrees)
	 * - range: 0-359
	 * @default 0
	 */
	angle?: number
	/**
	 * shadow offset (points)
	 * - range: 0-200
	 * @default 0
	 */
	offset?: number // TODO: "Distance" in PPT
	/**
	 * shadow color (hex format)
	 * @example 'FF3399'
	 */
	color?: HexColor
	/**
	 * whether to rotate shadow with shape
	 * @default false
	 */
	rotateWithShape?: boolean
}
/**
 * OOXML preset pattern values for `a:pattFill`
 * @see ECMA-376 ST_PresetPatternVal
 * @see https://github.com/hakrueger/PptxGenJS/tree/pattern
 */
export type PresetPatternValues =
	| 'cross' | 'dkDnDiag' | 'dkHorz' | 'dkUpDiag' | 'dkVert'
	| 'dashDnDiag' | 'dashHorz' | 'dashUpDiag' | 'dashVert'
	| 'diagBrick' | 'diagCross' | 'divot' | 'dotGrid' | 'dotDmnd'
	| 'dnDiag' | 'horz' | 'horzBrick' | 'lgCheck' | 'lgConfetti' | 'lgGrid'
	| 'ltDnDiag' | 'ltHorz' | 'ltUpDiag' | 'ltVert' | 'narHorz' | 'narVert'
	| 'openDmnd' | 'pct5' | 'pct10' | 'pct20' | 'pct25' | 'pct30' | 'pct40'
	| 'pct50' | 'pct60' | 'pct70' | 'pct75' | 'pct80' | 'pct90'
	| 'plaid' | 'shingle' | 'smCheck' | 'smConfetti' | 'smGrid' | 'solidDmnd'
	| 'sphere' | 'trellis' | 'upDiag' | 'vert' | 'wave' | 'weave'
	| 'wdDnDiag' | 'wdUpDiag' | 'zigZag'

export interface ShapePatternProps {
	/**
	 * Preset pattern
	 * @default 'cross'
	 */
	prst?: PresetPatternValues
	/**
	 * Foreground (pattern) color
	 * - falls back to top-level `ShapeFillProps.color` when omitted
	 * @example '000000'
	 */
	color?: Color
	/**
	 * Background color
	 * @default 'FFFFFF'
	 * @example 'FFFFFF'
	 */
	bgColor?: Color
}

// used by: shape, table, text
export interface ShapeFillProps {
	/**
	 * Fill color
	 * - `HexColor` or `ThemeColor`
	 * - for `type:'pattern'`, used as the foreground color when `pattern.color` is omitted
	 * @example 'FF0000' // hex color (red)
	 * @example pptx.SchemeColor.text1 // Theme color (Text1)
	 */
	color?: Color
	/**
	 * Transparency (percent)
	 * - MS-PPT > Format Shape > Fill & Line > Fill > Transparency
	 * - range: 0-100
	 * @default 0
	 */
	transparency?: number
	/**
	 * Fill type
	 * @default 'solid'
	 * - `'gradient'` — nested definition via `gradient` (linear + radial)
	 * - `'linearGradient'` — flat sambauers/gradients API (`stops`/`angle`/… on this object)
	 * - `'pattern'` — pattern fill via `pattern`
	 */
	type?: 'none' | 'solid' | 'gradient' | 'linearGradient' | 'pattern'
	/**
	 * Gradient fill definition
	 * - required when `type` is `'gradient'` (ignored otherwise)
	 * @example { type:'gradient', gradient:{ angle:90, stops:[{pos:0,color:'FF0000'},{pos:100,color:'0000FF'}] } }
	 */
	gradient?: ShapeGradientProps
	/**
	 * Pattern fill definition (from hakrueger/pattern)
	 * - used when `type` is `'pattern'`
	 * @example { type:'pattern', pattern:{ prst:'ltHorz', color:'000000', bgColor:'FFFFFF' } }
	 */
	pattern?: ShapePatternProps

	/**
	 * Flat linear-gradient stops (`type: 'linearGradient'`, sambauers/gradients)
	 * @example { type:'linearGradient', angle:45, stops:[{position:0,color:'000000'},{position:100,color:'333333'}] }
	 */
	stops?: ShapeGradientStopProps[]
	/** Linear gradient angle in degrees (`type: 'linearGradient'`) */
	angle?: number
	/** Whether the gradient angle scales with the fill region (`type: 'linearGradient'`) */
	scaled?: boolean
	/**
	 * Whether the gradient rotates with its shape (`type: 'linearGradient'`)
	 * @default true
	 */
	rotWithShape?: boolean
	/** Gradient flip (`type: 'linearGradient'` / nested `gradient.flip`) */
	flip?: ShapeGradientFlip
	/** Tile rectangle percents 0-100 (`type: 'linearGradient'` / nested `gradient.tileRect`) */
	tileRect?: ShapeGradientTileRect

	/**
	 * Transparency (percent)
	 * @deprecated v3.3.0 - use `transparency`
	 */
	alpha?: number
}
export type ShapeGradientFlip = 'none' | 'x' | 'xy' | 'y'
export interface ShapeGradientTileRect {
	/** Top inset percent 0-100 */
	t?: number
	/** Right inset percent 0-100 */
	r?: number
	/** Bottom inset percent 0-100 */
	b?: number
	/** Left inset percent 0-100 */
	l?: number
}
export interface ShapeGradientStopProps {
	/**
	 * Stop color
	 * - `HexColor`, `ThemeColor`, or `ModifiedThemeColor` (DrawingML color transforms on `EG_ColorChoice`)
	 */
	color: Color
	/**
	 * Stop position along the gradient (percent)
	 * - range: 0-100 (values outside the range are clamped)
	 */
	pos?: number
	/**
	 * Alias of `pos` (sambauers/gradients API)
	 * - range: 0-100
	 */
	position?: number
	/**
	 * Stop transparency (percent)
	 * - range: 0-100
	 * @default 0
	 */
	transparency?: number
}
export interface ShapeGradientProps {
	/**
	 * Gradient geometry
	 * @default 'linear'
	 */
	type?: 'linear' | 'radial'
	/**
	 * Gradient angle (degrees, clockwise)
	 * - 0 = left-to-right, 90 = top-to-bottom
	 * - normalized into the range 0-359
	 * @default 0
	 */
	angle?: number
	/**
	 * Whether the gradient angle scales with the fill region
	 * @default false
	 */
	scaled?: boolean
	/**
	 * Whether the gradient rotates with its shape
	 * @default true
	 */
	rotateWithShape?: boolean
	/**
	 * Alias of `rotateWithShape` (sambauers/gradients API)
	 * @default true
	 */
	rotWithShape?: boolean
	/**
	 * Gradient flip direction (DrawingML `a:gradFill@flip`)
	 * @default 'none'
	 */
	flip?: ShapeGradientFlip
	/**
	 * Tile rectangle insets (percent 0-100) — DrawingML `a:tileRect`
	 */
	tileRect?: ShapeGradientTileRect
	/**
	 * Gradient color stops
	 * - MS-PPT requires **at least 2 stops**; fewer degrades to a solid fill
	 * - stops are sorted by `pos`/`position` before being written
	 */
	stops: ShapeGradientStopProps[]
}
export interface ShapeLineProps extends ShapeFillProps {
	/**
	 * Line width (pt)
	 * @default 1
	 */
	width?: number
	/**
	 * Dash type
	 * @default 'solid'
	 */
	dashType?: 'solid' | 'dash' | 'dashDot' | 'lgDash' | 'lgDashDot' | 'lgDashDotDot' | 'sysDash' | 'sysDot'
	/**
	 * Line ending cap style. ECMA-376 §5.1.2.1.34 `<a:ln>@cap` / ST_LineCap: `flat` (default), `sq` (square, extends half width), `rnd` (round).
	 * @since v4.1.0 (issue #782)
	 * @default 'flat'
	 */
	cap?: 'flat' | 'sq' | 'rnd'
	/**
	 * Begin arrow type
	 * @since v3.3.0
	 */
	beginArrowType?: 'none' | 'arrow' | 'diamond' | 'oval' | 'stealth' | 'triangle'
	/**
	 * End arrow type
	 * @since v3.3.0
	 */
	endArrowType?: 'none' | 'arrow' | 'diamond' | 'oval' | 'stealth' | 'triangle'
	/**
	 * Emit as a PowerPoint connector (`p:cxnSp`) attached to other shapes
	 * - Auto-set when `sourceId` / `targetId` are provided
	 * @see ZentoSoft/PptxGenJS connectors
	 */
	isConnector?: boolean
	/**
	 * Connected source shape id (`cNvPr` / `sId` of the start shape)
	 */
	sourceId?: number
	/**
	 * Connected target shape id (`cNvPr` / `sId` of the end shape)
	 */
	targetId?: number
	/**
	 * Source connection site index (see `pptx.anchor` for rect helpers)
	 */
	sourceAnchorPos?: number
	/**
	 * Target connection site index (see `pptx.anchor` for rect helpers)
	 */
	targetAnchorPos?: number
	/**
	 * Preset geometry adjustment values for bent/curved connectors
	 * @example [50000] // mid bend for bentConnector3
	 */
	curveadjust?: number[]
	// FUTURE: beginArrowSize (1-9)
	// FUTURE: endArrowSize (1-9)

	/**
	 * Dash type
	 * @deprecated v3.3.0 - use `dashType`
	 */
	lineDash?: 'solid' | 'dash' | 'dashDot' | 'lgDash' | 'lgDashDot' | 'lgDashDotDot' | 'sysDash' | 'sysDot'
	/**
	 * @deprecated v3.3.0 - use `beginArrowType`
	 */
	lineHead?: 'none' | 'arrow' | 'diamond' | 'oval' | 'stealth' | 'triangle'
	/**
	 * @deprecated v3.3.0 - use `endArrowType`
	 */
	lineTail?: 'none' | 'arrow' | 'diamond' | 'oval' | 'stealth' | 'triangle'
	/**
	 * Line width (pt)
	 * @deprecated v3.3.0 - use `width`
	 */
	pt?: number
	/**
	 * Line size (pt)
	 * @deprecated v3.3.0 - use `width`
	 */
	size?: number
}
// used by: chart, slide, table, text
export interface TextBaseProps {
	/**
	 * Horizontal alignment
	 * @default 'left'
	 */
	align?: HAlign
	/**
	 * Bold style
	 * @default false
	 */
	bold?: boolean
	/**
	 * Add a line-break
	 * @default false
	 */
	breakLine?: boolean
	/**
	 * Add standard or custom bullet
	 * - use `true` for standard bullet
	 * - pass object options for custom bullet
	 * @default false
	 */
	bullet?:
	| boolean
	| {
		/**
		 * Bullet type
		 * @default bullet
		 */
		type?: 'bullet' | 'number'
		/**
		 * Bullet character code (unicode)
		 * @since v3.3.0
		 * @example '25BA' // 'BLACK RIGHT-POINTING POINTER' (U+25BA)
		 */
		characterCode?: string
		/**
		 * Bullet color (`HexColor`, `ThemeColor`, or `ModifiedThemeColor`)
		 * @example 'FF0000' // red
		 * @example pptx.SchemeColor.accent1
		 */
		color?: Color
		/**
		 * Indentation (space between bullet and text) (points)
		 * @since v3.3.0
		 * @default 27 // DEF_BULLET_MARGIN
		 * @example 10 // Indents text 10 points from bullet
		 */
		indent?: number
		/**
		 * Number type
		 * @since v3.3.0
		 * @example 'romanLcParenR' // roman numerals lower-case with paranthesis right
		 */
		numberType?:
		| 'alphaLcParenBoth'
		| 'alphaLcParenR'
		| 'alphaLcPeriod'
		| 'alphaUcParenBoth'
		| 'alphaUcParenR'
		| 'alphaUcPeriod'
		| 'arabicParenBoth'
		| 'arabicParenR'
		| 'arabicPeriod'
		| 'arabicPlain'
		| 'romanLcParenBoth'
		| 'romanLcParenR'
		| 'romanLcPeriod'
		| 'romanUcParenBoth'
		| 'romanUcParenR'
		| 'romanUcPeriod'
		/**
		 * Number bullets start at
		 * @since v3.3.0
		 * @default 1
		 * @example 10 // numbered bullets start with 10
		 */
		numberStartAt?: number

		// DEPRECATED

		/**
		 * Bullet code (unicode)
		 * @deprecated v3.3.0 - use `characterCode`
		 */
		code?: string
		/**
		 * Margin between bullet and text
		 * @since v3.2.1
		 * @deplrecated v3.3.0 - use `indent`
		 */
		marginPt?: number
		/**
		 * Number to start with (only applies to type:number)
		 * @deprecated v3.3.0 - use `numberStartAt`
		 */
		startAt?: number
		/**
		 * Number type
		 * @deprecated v3.3.0 - use `numberType`
		 */
		style?: string
	}
	/**
	 * Text color
	 * - `HexColor` or `ThemeColor`
	 * - MS-PPT > Format Shape > Text Options > Text Fill & Outline > Text Fill > Color
	 * @example 'FF0000' // hex color (red)
	 * @example pptx.SchemeColor.text1 // Theme color (Text1)
	 */
	color?: Color
	/**
	 * Font face name
	 * @example 'Arial' // Arial font
	 */
	fontFace?: string
	/**
	 * Font size
	 * @example 12 // Font size 12
	 */
	fontSize?: number
	/**
	 * Text highlight color (hex format)
	 * @example 'FFFF00' // yellow
	 */
	highlight?: HexColor
	/**
	 * italic style
	 * @default false
	 */
	italic?: boolean
	/**
	 * language
	 * - ISO 639-1 standard language code
	 * @default 'en-US' // english US
	 * @example 'fr-CA' // french Canadian
	 */
	lang?: string
	/**
	 * Add a soft line-break (shift+enter) before line text content
	 * @default false
	 * @since v3.5.0
	 */
	softBreakBefore?: boolean
	/**
	 * tab stops
	 * - PowerPoint: Paragraph > Tabs > Tab stop position
	 * @example [{ position:1 }, { position:3 }] // Set first tab stop to 1 inch, set second tab stop to 3 inches
	 */
	tabStops?: Array<{ position: number, alignment?: 'l' | 'r' | 'ctr' | 'dec' }>
	/**
	 * text direction
	 * `horz` = horizontal
	 * `vert` = rotate 90^
	 * `vert270` = rotate 270^
	 * `wordArtVert` = stacked
	 * @default 'horz'
	 */
	textDirection?: 'eaVert' | 'horz' | 'mongolianVert' | 'vert' | 'vert270' | 'wordArtVert' | 'wordArtVertRtl'
	/**
	 * Transparency (percent)
	 * - MS-PPT > Format Shape > Text Options > Text Fill & Outline > Text Fill > Transparency
	 * - range: 0-100
	 * @default 0
	 */
	transparency?: number
	/**
	 * underline properties
	 * - PowerPoint: Font > Color & Underline > Underline Style/Underline Color
	 * @default (none)
	 */
	underline?: {
		style?:
		| 'dash'
		| 'dashHeavy'
		| 'dashLong'
		| 'dashLongHeavy'
		| 'dbl'
		| 'dotDash'
		| 'dotDashHeave'
		| 'dotDotDash'
		| 'dotDotDashHeavy'
		| 'dotted'
		| 'dottedHeavy'
		| 'heavy'
		| 'none'
		| 'sng'
		| 'wavy'
		| 'wavyDbl'
		| 'wavyHeavy'
		color?: Color
	}
	/**
	 * vertical alignment
	 * @default 'top'
	 */
	valign?: VAlign
}
export interface PlaceholderProps extends PositionProps, TextBaseProps {
	name: string
	type: PLACEHOLDER_TYPE
	/**
	 * margin (points)
	 */
	margin?: Margin
}
export interface ObjectNameProps {
	/**
	 * Object name
	 * - used instead of default "Object N" name
	 * - PowerPoint: Home > Arrange > Selection Pane...
	 * @since v3.10.0
	 * @default 'Object 1'
	 * @example 'Antenna Design 9'
	 */
	objectName?: string
	/**
	 * Explicit DrawingML shape id (`p:cNvPr@id`)
	 * - Required when other shapes attach connectors via `line.sourceId` / `line.targetId`
	 * - Must be unique on the slide; defaults to `slideObjectIndex + 2` when omitted
	 * @see ZentoSoft/PptxGenJS connectors
	 * @example 20
	 */
	sId?: number
}
export interface ThemeProps {
	/**
	 * Headings font face name
	 * @example 'Arial Narrow'
	 * @default 'Calibri Light'
	 */
	headFontFace?: string
	/**
	 * Body font face name
	 * @example 'Arial'
	 * @default 'Calibri'
	 */
	bodyFontFace?: string
	/**
	 * Custom theme color scheme — exactly 12 hex colors, in order:
	 * dk1, lt1, dk2, lt2, accent1–6, hlink, folHlink
	 * @example ['1B1B1B','FFFFFF','44546A','E7E6E6','0B5FFF','ED7D31','A5A5A5','FFC000','5B9BD5','70AD47','0563C1','954F72']
	 */
	themeColors?: HexColor[]
}

// image / media ==================================================================================
export type MediaType = 'audio' | 'online' | 'video'

export interface ImageProps extends PositionProps, DataOrPathProps, ObjectNameProps, AppearOnClickProps {
	/**
	 * Alt Text value ("How would you describe this object and its contents to someone who is blind?")
	 * - PowerPoint: [right-click on an image] > "Edit Alt Text..."
	 */
	altText?: string
	/**
	 * Flip horizontally?
	 * @default false
	 */
	flipH?: boolean
	/**
	 * Flip vertical?
	 * @default false
	 */
	flipV?: boolean
	hyperlink?: HyperlinkProps
	/**
	 * Image outline/border (a picture frame)
	 * @example { color: '696969', width: 2 } // 2pt dim-gray border
	 */
	line?: ShapeLineProps
	/**
	 * Placeholder type
	 * - values: 'body' | 'header' | 'footer' | 'title' | et. al.
	 * @example 'body'
	 * @see https://docs.microsoft.com/en-us/office/vba/api/powerpoint.ppplaceholdertype
	 */
	placeholder?: string
	/**
	 * Image rotation (degrees)
	 * - range: -360 to 360
	 * @default 0
	 * @example 180 // rotate image 180 degrees
	 */
	rotate?: number
	/**
	 * Enable elliptical (circle/oval) image cropping
	 * - When `rectRadius` is set, that takes precedence (rounded rectangle)
	 * @default false
	 */
	rounding?: boolean
	/**
	 * Crop image to a rounded rectangle (from niranjan-uma-shankar/feature/html-to-pptx)
	 * - values: 0.0 to 1.0 (0 = sharp corners, 1 = maximum rounding)
	 * - when set, emits `prst="roundRect"` with an adjustment guide
	 * @example 0.2 // 20% corner radius
	 */
	rectRadius?: number
	/**
	 * Shadow Props
	 * - MS-PPT > Format Picture > Shadow
	 * @example
	 * { type: 'outer', color: '000000', opacity: 0.5, blur: 20,  offset: 20, angle: 270 }
	 */
	shadow?: ShadowProps
	/**
	 * Glow effect (`a:glow` in shape `effectLst`)
	 */
	glow?: TextGlowProps
	/**
	 * Soft-edge effect (`a:softEdge`)
	 */
	softEdge?: SoftEdgeProps
	/**
	 * Reflection effect (`a:reflection`)
	 */
	reflection?: ReflectionProps
	/**
	 * Image sizing options
	 */
	sizing?: {
		/**
		 * Sizing type
		 */
		type: 'contain' | 'cover' | 'crop'
		/**
		 * Image width
		 * - inches or percentage
		 * @example 10.25 // position in inches
		 * @example '75%' // position as percentage of slide size
		 */
		w: Coord
		/**
		 * Image height
		 * - inches or percentage
		 * @example 10.25 // position in inches
		 * @example '75%' // position as percentage of slide size
		 */
		h: Coord
		/**
		 * Offset from left to crop image
		 * - `crop` only
		 * - inches or percentage
		 * @example 10.25 // position in inches
		 * @example '75%' // position as percentage of slide size
		 */
		x?: Coord
		/**
		 * Offset from top to crop image
		 * - `crop` only
		 * - inches or percentage
		 * @example 10.25 // position in inches
		 * @example '75%' // position as percentage of slide size
		 */
		y?: Coord
	}
	/**
	 * Transparency (percent)
	 * - MS-PPT > Format Picture > Picture > Picture Transparency > Transparency
	 * - range: 0-100
	 * @default 0
	 * @example 25 // 25% transparent
	 */
	transparency?: number
	/**
	 * Recolor SVG paths (Martin-N)
	 * - Hex `color` only; replaces existing `#RRGGBB` fills, or adds `fill` on bare `<path>` elements
	 * @example { color: 'FF0000' }
	 */
	fill?: ShapeFillProps
	/**
	 * Animation configuration
	 * - Can be a simple animation name or full configuration object
	 * @example 'fadein'
	 * @example { type: 'flyin', direction: 'left', duration: 1000 }
	 */
	animation?: string | AnimationConfig
}
/**
 * Add media (audio/video) to slide
 * @requires either `link` or `path`
 */
export interface MediaProps extends PositionProps, DataOrPathProps, ObjectNameProps, AppearOnClickProps {
	/**
	 * Media type
	 * - Use 'online' to embed a YouTube video (only supported in recent versions of PowerPoint)
	 */
	type: MediaType
	/**
	 * Cover image
	 * @since 3.9.0
	 * @default "play button" image, gray background
	 */
	cover?: string
	/**
	 * media file extension
	 * - use when the media file path does not already have an extension, ex: "/folder/SomeSong"
	 * @since 3.9.0
	 * @default extension from file provided
	 */
	extn?: string
	/**
	 * Animation configuration
	 * - Can be a simple animation name or full configuration object
	 * @example 'fadein'
	 * @example { type: 'flyin', direction: 'left', duration: 1000 }
	 */
	animation?: string | AnimationConfig
	/**
	 * video embed link
	 * - works with YouTube
	 * - other sites may not show correctly in PowerPoint
	 * @example 'https://www.youtube.com/embed/Dph6ynRVyUc' // embed a youtube video
	 */
	link?: string
	/**
	 * full or local path
	 * @example 'https://freesounds/simpsons/bart.mp3' // embed mp3 audio clip from server
	 * @example '/sounds/simpsons_haha.mp3' // embed mp3 audio clip from local directory
	 */
	path?: string
	/**
	 * Trim playback start/end (milliseconds). MS-PPTX §2.3.3.18 `p14:media/p14:trim`.
	 * @example { st: 1000, end: 500 } // skip first 1s and last 0.5s
	 */
	trim?: { st?: number; end?: number }
	/**
	 * Audio fade in/out durations (milliseconds). MS-PPTX §2.3.3.15 `p14:media/p14:fade`.
	 * @example { in: 500, out: 1000 }
	 */
	fade?: { in?: number; out?: number }
	/**
	 * Media bookmarks (name + ms timestamp). MS-PPTX §2.3.3.11/12 `p14:media/p14:bmkLst`.
	 * @example [{ name: 'chorus', time: 30000 }]
	 */
	bookmarks?: { name: string; time: number }[]
	/**
	 * Mark the shape as a narration recording. MS-PPTX §2.2.14 `isNarration`.
	 * @default false
	 */
	isNarration?: boolean
	/**
	 * Start playing the media automatically when the slide is shown (no click needed).
	 * Implemented via the slide timing tree (`p:timing`) as a `p:video`/`p:audio` media node
	 * whose start condition has `delay="0"` (ECMA-376 §19.5 `CT_TLMediaNode` / MS-PPTX §2.3.3).
	 * @default false (plays on click)
	 */
	autoplay?: boolean
	/**
	 * Loop the media until stopped ("Loop until Stopped" in the PowerPoint Playback tab).
	 * Sets `repeatCount="indefinite"` on the media node's `cTn` (ECMA-376 §19.5.33).
	 * @default false
	 */
	loop?: boolean
	/**
	 * Play the video full-screen (`p:video@fullScrn`, ECMA-376 §19.5.92 `CT_TLMediaNodeVideo`).
	 * @default false
	 */
	fullScreen?: boolean
	/**
	 * Mute the media's audio (`p:cMediaNode@mute`, ECMA-376 §19.5.30 `CT_TLCommonMediaNodeData`).
	 * @default false
	 */
	mute?: boolean
}

// shapes =========================================================================================

export interface ShapeProps extends PositionProps, ObjectNameProps, AppearOnClickProps {
	/**
	 * Horizontal alignment
	 * @default 'left'
	 */
	align?: HAlign
	/**
	 * Radius (only for pptx.shapes.PIE, pptx.shapes.ARC, pptx.shapes.BLOCK_ARC)
	 * - In the case of pptx.shapes.BLOCK_ARC you have to setup the arcThicknessRatio
	 * - values: [0-359, 0-359]
	 * @since v3.4.0
	 * @default [270, 0]
	 */
	angleRange?: [number, number]
	/**
	 * Radius (only for pptx.shapes.BLOCK_ARC)
	 * - You have to setup the angleRange values too
	 * - values: 0.0-1.0
	 * @since v3.4.0
	 * @default 0.5
	 */
	arcThicknessRatio?: number
	/**
	 * Shape fill color properties
	 * @example { color:'FF0000' } // hex color (red)
	 * @example { color:'0088CC', transparency:50 } // hex color, 50% transparent
	 * @example { color:pptx.SchemeColor.accent1 } // Theme color Accent1
	 */
	fill?: ShapeFillProps
	/**
	 * Flip shape horizontally?
	 * @default false
	 */
	flipH?: boolean
	/**
	 * Flip shape vertical?
	 * @default false
	 */
	flipV?: boolean
	/**
	 * Add hyperlink to shape
	 * @example hyperlink: { url: "https://github.com/gitbrent/pptxgenjs", tooltip: "Visit Homepage" },
	 */
	hyperlink?: HyperlinkProps
	/**
	 * Line options
	 */
	line?: ShapeLineProps
	/**
	 * Points (only for pptx.shapes.CUSTOM_GEOMETRY)
	 * - type: 'arc'
	 * - `hR` Shape Arc Height Radius
	 * - `wR` Shape Arc Width Radius
	 * - `stAng` Shape Arc Start Angle
	 * - `swAng` Shape Arc Swing Angle
	 * @see http://www.datypic.com/sc/ooxml/e-a_arcTo-1.html
	 * @example [{ x: 0, y: 0 }, { x: 10, y: 10 }] // draw a line between those two points
	 */
	points?: Array<
	| { x: Coord, y: Coord, moveTo?: boolean }
	| { x: Coord, y: Coord, curve: { type: 'arc', hR: Coord, wR: Coord, stAng: number, swAng: number } }
	| { x: Coord, y: Coord, curve: { type: 'cubic', x1: Coord, y1: Coord, x2: Coord, y2: Coord } }
	| { x: Coord, y: Coord, curve: { type: 'quadratic', x1: Coord, y1: Coord } }
	| { close: true }
	>
	/**
	 * Rounded rectangle radius (only for pptx.shapes.ROUNDED_RECTANGLE)
	 * - values: 0.0 to 1.0
	 * @default 0
	 */
	rectRadius?: number
	/**
	 * Rotation (degrees)
	 * - range: -360 to 360
	 * @default 0
	 * @example 180 // rotate 180 degrees
	 */
	rotate?: number
	/**
	 * Shadow options
	 * TODO: need new demo.js entry for shape shadow
	 */
	shadow?: ShadowProps
	/**
	 * Glow effect (`a:glow` in shape `effectLst`)
	 */
	glow?: TextGlowProps
	/**
	 * Soft-edge effect (`a:softEdge`)
	 */
	softEdge?: SoftEdgeProps
	/**
	 * Reflection effect (`a:reflection`)
	 */
	reflection?: ReflectionProps

	/**
	 * @deprecated v3.3.0
	 */
	lineSize?: number
	/**
	 * @deprecated v3.3.0
	 */
	lineDash?: 'dash' | 'dashDot' | 'lgDash' | 'lgDashDot' | 'lgDashDotDot' | 'solid' | 'sysDash' | 'sysDot'
	/**
	 * @deprecated v3.3.0
	 */
	lineHead?: 'arrow' | 'diamond' | 'none' | 'oval' | 'stealth' | 'triangle'
	/**
	 * @deprecated v3.3.0
	 */
	lineTail?: 'arrow' | 'diamond' | 'none' | 'oval' | 'stealth' | 'triangle'
	/**
	 * Shape name (used instead of default "Shape N" name)
	 * @deprecated v3.10.0 - use `objectName`
	 */
	shapeName?: string
	/**
	 * Animation configuration
	 * - Can be a simple animation name or full configuration object
	 * @example 'fadein'
	 * @example { type: 'flyin', direction: 'left', duration: 1000 }
	 */
	animation?: string | AnimationConfig
}

// tables =========================================================================================

export interface TableToSlidesProps extends TableProps {
	_arrObjTabHeadRows?: TableRow[]
	// _masterSlide?: SlideLayout

	/**
	 * Add an image to slide(s) created during autopaging
	 * - `image` prop requires either `path` or `data`
	 * - see `DataOrPathProps` for details on `image` props
	 * - see `PositionProps` for details on `options` props
	 */
	addImage?: { image: DataOrPathProps, options: PositionProps }
	/**
	 * Add a shape to slide(s) created during autopaging
	 */
	addShape?: { shapeName: SHAPE_NAME, options: ShapeProps }
	/**
	 * Add a table to slide(s) created during autopaging
	 */
	addTable?: { rows: TableRow[], options: TableProps }
	/**
	 * Add a text object to slide(s) created during autopaging
	 */
	addText?: { text: TextProps[], options: TextPropsOptions }
	/**
	 * Whether to enable auto-paging
	 * - auto-paging creates new slides as content overflows a slide
	 * @default true
	 */
	autoPage?: boolean
	/**
	 * Auto-paging character weight
	 * - adjusts how many characters are used before lines wrap
	 * - range: -1.0 to 1.0
	 * @see https://gitbrent.github.io/PptxGenJS/docs/api-tables.html
	 * @default 0.0
	 * @example 0.5 // lines are longer (increases the number of characters that can fit on a given line)
	 */
	autoPageCharWeight?: number
	/**
	 * Auto-paging line weight
	 * - adjusts how many lines are used before slides wrap
	 * - range: -1.0 to 1.0
	 * @see https://gitbrent.github.io/PptxGenJS/docs/api-tables.html
	 * @default 0.0
	 * @example 0.5 // tables are taller (increases the number of lines that can fit on a given slide)
	 */
	autoPageLineWeight?: number
	/**
	 * Whether to repeat head row(s) on new tables created by autopaging
	 * @since v3.3.0
	 * @default false
	 */
	autoPageRepeatHeader?: boolean
	/**
	 * The `y` location to use on subsequent slides created by autopaging
	 * @default (top margin of Slide)
	 */
	autoPageSlideStartY?: number
	/**
	 * Column widths (inches)
	 */
	colW?: number | number[]
	/**
	 * Master slide name
	 * - define a master slide to have your auto-paged slides have corporate design, etc.
	 * @see https://gitbrent.github.io/PptxGenJS/docs/masters.html
	 */
	masterSlideName?: string
	/**
	 * Slide margin
	 * - this margin will be across all slides created by auto-paging
	 */
	slideMargin?: Margin

	/**
	 * @deprecated v3.3.0 - use `autoPageRepeatHeader`
	 */
	addHeaderToEach?: boolean
	/**
	 * @deprecated v3.3.0 - use `autoPageSlideStartY`
	 */
	newSlideStartY?: number
}
export interface TableCellProps extends TextBaseProps {
	/**
	 * Auto-paging character weight
	 * - adjusts how many characters are used before lines wrap
	 * - range: -1.0 to 1.0
	 * @see https://gitbrent.github.io/PptxGenJS/docs/api-tables.html
	 * @default 0.0
	 * @example 0.5 // lines are longer (increases the number of characters that can fit on a given line)
	 */
	autoPageCharWeight?: number
	/**
	 * Auto-paging line weight
	 * - adjusts how many lines are used before slides wrap
	 * - range: -1.0 to 1.0
	 * @see https://gitbrent.github.io/PptxGenJS/docs/api-tables.html
	 * @default 0.0
	 * @example 0.5 // tables are taller (increases the number of lines that can fit on a given slide)
	 */
	autoPageLineWeight?: number
	/**
	 * Cell border
	 */
	border?: BorderProps | [BorderProps, BorderProps, BorderProps, BorderProps]
	/**
	 * Cell colspan
	 */
	colspan?: number
	/**
	 * Fill color
	 * @example { color:'FF0000' } // hex color (red)
	 * @example { color:'0088CC', transparency:50 } // hex color, 50% transparent
	 * @example { color:pptx.SchemeColor.accent1 } // theme color Accent1
	 */
	fill?: ShapeFillProps
	hyperlink?: HyperlinkProps
	/**
	 * Cell margin (inches)
	 * @default 0
	 */
	margin?: Margin
	/**
	 * Cell rowspan
	 */
	rowspan?: number
	/**
	 * Text direction (Martin-N alias of `textDirection`)
	 * @deprecated use `textDirection`
	 */
	vert?: 'eaVert' | 'horz' | 'mongolianVert' | 'vert' | 'vert270' | 'wordArtVert' | 'wordArtVertRtl'
}
export interface TableProps extends PositionProps, TextBaseProps, ObjectNameProps, AppearOnClickProps {
	_arrObjTabHeadRows?: TableRow[]

	/**
	 * Whether to enable auto-paging
	 * - auto-paging creates new slides as content overflows a slide
	 * @default false
	 */
	autoPage?: boolean
	/**
	 * Auto-paging character weight
	 * - adjusts how many characters are used before lines wrap
	 * - range: -1.0 to 1.0
	 * @see https://gitbrent.github.io/PptxGenJS/docs/api-tables.html
	 * @default 0.0
	 * @example 0.5 // lines are longer (increases the number of characters that can fit on a given line)
	 */
	autoPageCharWeight?: number
	/**
	 * Auto-paging line weight
	 * - adjusts how many lines are used before slides wrap
	 * - range: -1.0 to 1.0
	 * @see https://gitbrent.github.io/PptxGenJS/docs/api-tables.html
	 * @default 0.0
	 * @example 0.5 // tables are taller (increases the number of lines that can fit on a given slide)
	 */
	autoPageLineWeight?: number
	/**
	 * Whether table header row(s) should be repeated on each new slide creating by autoPage.
	 * Use `autoPageHeaderRows` to designate how many rows comprise the table header (1+).
	 * @default false
	 * @since v3.3.0
	 */
	autoPageRepeatHeader?: boolean
	/**
	 * Number of rows that comprise table headers
	 * - required when `autoPageRepeatHeader` is set to true.
	 * @example 2 - repeats the first two table rows on each new slide created
	 * @default 1
	 * @since v3.3.0
	 */
	autoPageHeaderRows?: number
	/**
	 * The `y` location to use on subsequent slides created by autopaging
	 * @default (top margin of Slide)
	 */
	autoPageSlideStartY?: number
	/**
	 * Table border
	 * - single value is applied to all 4 sides
	 * - array of values in TRBL order for individual sides
	 */
	border?: BorderProps | [BorderProps, BorderProps, BorderProps, BorderProps]
	/**
	 * Width of table columns (inches)
	 * - single value is applied to every column equally based upon `w`
	 * - array of values in applied to each column in order
	 * @default columns of equal width based upon `w`
	 */
	colW?: number | number[]
	/**
	 * Cell background color
	 * @example { color:'FF0000' } // hex color (red)
	 * @example { color:'0088CC', transparency:50 } // hex color, 50% transparent
	 * @example { color:pptx.SchemeColor.accent1 } // theme color Accent1
	 */
	fill?: ShapeFillProps
	/**
	 * Cell margin (inches)
	 * - affects all table cells, is superceded by cell options
	 */
	margin?: Margin
	/**
	 * Height of table rows (inches)
	 * - single value is applied to every row equally based upon `h`
	 * - array of values in applied to each row in order
	 * @default rows of equal height based upon `h`
	 */
	rowH?: number | number[]
	/**
	 * Apply special formatting to the first row (header emphasis)
	 * - only renders when a table style is in effect (see `tableStyleId`)
	 * @default false
	 */
	firstRow?: boolean
	/**
	 * Apply special formatting to the last row (totals emphasis)
	 * @default false
	 */
	lastRow?: boolean
	/**
	 * Apply special formatting to the first column
	 * @default false
	 */
	firstCol?: boolean
	/**
	 * Apply special formatting to the last column
	 * @default false
	 */
	lastCol?: boolean
	/**
	 * Band (alternate the fill of) the rows
	 * @default false
	 */
	bandRow?: boolean
	/**
	 * Band (alternate the fill of) the columns
	 * @default false
	 */
	bandCol?: boolean
	/**
	 * Lay the table out right-to-left (column order reversed) - ECMA-376 §5.1.6.13 `a:tblPr@rtl`
	 * @default false
	 */
	rtlMode?: boolean
	/**
	 * Table style id (GUID of a built-in PowerPoint table style)
	 * - required for `bandRow`/`firstRow`/etc. to have a visible effect
	 * @example '{5C22544A-7EE6-4342-B048-85BDC9FD1C3A}' // "Medium Style 2 - Accent 1"
	 */
	tableStyleId?: string
	/**
	 * Placeholder name to bind this table to (from a slide master/layout `placeholder` object of `type:'tbl'`).
	 * Emits `<p:ph type="tbl"/>` on the graphicFrame and inherits the placeholder geometry (ECMA-376 §4.4.1.33/§4.8.14, issue #856).
	 */
	placeholder?: string
	/**
	 * Animation configuration
	 * - Can be a simple animation name or full configuration object
	 * @example 'fadein'
	 * @example { type: 'flyin', direction: 'left', duration: 1000 }
	 */
	animation?: string | AnimationConfig
	/**
	 * @deprecated v3.3.0 - use `autoPageSlideStartY`
	 */
	newSlideStartY?: number
}
export interface TableCell {
	/** @internal assigned by the table builder; consumers pass plain `{ text, options }` objects */
	_type?: SLIDE_OBJECT_TYPES.tablecell
	/** lines in this cell (autoPage) */
	_lines?: TableCell[][]
	/** `text` prop but guaranteed to hold "TableCell[]" */
	_tableCells?: TableCell[]
	/** height in EMU */
	_lineHeight?: number
	_hmerge?: boolean
	_vmerge?: boolean
	_rowContinue?: number
	_optImp?: any

	text?: string | TableCell[] // TODO: FUTURE: 20210815: ONly allow `TableCell[]` dealing with string|TableCell[] *SUCKS*
	options?: TableCellProps
}
export interface TableRowSlide {
	rows: TableRow[]
}
export type TableRow = TableCell[]

// text ===========================================================================================
export interface TextGlowProps {
	/**
	 * Border color (hex format)
	 * @example 'FF3399'
	 */
	color?: HexColor
	/**
	 * opacity (0.0 - 1.0)
	 * @example 0.5
	 * 50% opaque
	 */
	opacity?: number
	/**
	 * size (points)
	 */
	size: number
}

export interface TextPropsOptions extends PositionProps, DataOrPathProps, TextBaseProps, ObjectNameProps, AppearOnClickProps {
	_bodyProp?: {
		// Note: Many of these duplicated as user options are transformed to _bodyProp options for XML processing
		autoFit?: boolean
		align?: TEXT_HALIGN
		anchor?: TEXT_VALIGN
		lIns?: number
		rIns?: number
		tIns?: number
		bIns?: number
		numCol?: number
		spcCol?: number
		vert?: 'eaVert' | 'horz' | 'mongolianVert' | 'vert' | 'vert270' | 'wordArtVert' | 'wordArtVertRtl'
		wrap?: boolean
		vertOverflow?: 'overflow' | 'ellipsis' | 'clip'
		horzOverflow?: 'overflow' | 'clip'
	}
	_lineIdx?: number

	baseline?: number
	/**
	 * Number of text columns (>=2 flows text across columns). ECMA-376 §5.1.5.1.4 `@numCol` (issue #1320)
	 * @default undefined (single column)
	 */
	columns?: number
	/**
	 * Gap between text columns in inches. ECMA-376 §5.1.5.1.4 `@spcCol` (issue #1320)
	 * @default 0
	 */
	columnGap?: number
	/**
	 * Text capitalization applied at render time (does not change stored characters).
	 * ECMA-376 §5.1.5.2.1 `CT_TextCharacterProperties@cap` / §5.1.12.64 `ST_TextCapsType`:
	 * - `none` no capitalization, `small` small caps, `all` all caps
	 * @default undefined (no cap attribute)
	 */
	caps?: 'none' | 'small' | 'all'
	/**
	 * Character spacing
	 */
	charSpacing?: number
	/**
	 * Text fit options
	 *
	 * MS-PPT > Format Shape > Shape Options > Text Box > "[unlabeled group]": [3 options below]
	 * - 'none' = Do not Autofit
	 * - 'shrink' = Shrink text on overflow
	 * - 'resize' = Resize shape to fit text
	 *
	 * **Note** 'shrink' and 'resize' only take effect after editing text/resize shape.
	 * Both PowerPoint and Word dynamically calculate a scaling factor and apply it when edit/resize occurs.
	 *
	 * There is no way for this library to trigger that behavior, sorry.
	 *
	 * Pass an object `{ type:'shrink', fontScale?, lnSpcReduction? }` to write explicit
	 * `<a:normAutofit>` scaling attributes (ECMA-376 §5.1.5.1.3): `fontScale` and `lnSpcReduction`
	 * are percentages 0–100 (issue #1199).
	 * @since v3.3.0
	 * @default "none"
	 */
	fit?: 'none' | 'shrink' | 'resize' | { type: 'shrink'; fontScale?: number; lnSpcReduction?: number }
	/**
	 * Shape fill
	 * @example { color:'FF0000' } // hex color (red)
	 * @example { color:'0088CC', transparency:50 } // hex color, 50% transparent
	 * @example { color:pptx.SchemeColor.accent1 } // theme color Accent1
	 */
	fill?: ShapeFillProps
	/**
	 * Flip shape horizontally?
	 * @default false
	 */
	flipH?: boolean
	/**
	 * Flip shape vertical?
	 * @default false
	 */
	flipV?: boolean
	glow?: TextGlowProps
	hyperlink?: HyperlinkProps
	indentLevel?: number
	isTextBox?: boolean
	line?: ShapeLineProps
	/**
	 * Line spacing (pt)
	 * - PowerPoint: Paragraph > Indents and Spacing > Line Spacing: > "Exactly"
	 * @example 28 // 28pt
	 */
	lineSpacing?: number
	/**
	 * line spacing multiple (percent)
	 * - range: 0.0-9.99
	 * - PowerPoint: Paragraph > Indents and Spacing > Line Spacing: > "Multiple"
	 * @example 1.5 // 1.5X line spacing
	 * @since v3.5.0
	 */
	lineSpacingMultiple?: number
	/**
	 * Text box margin — array is **TRBL** (top, right, bottom, left), same as table margins.
	 * Maps to DrawingML `a:bodyPr` insets `tIns`/`rIns`/`bIns`/`lIns`
	 * (ECMA-376 Part 1 §5.1.5.1.1 `CT_TextBodyProperties`, `ST_Coordinate32` EMUs).
	 * Schema attribute order is lIns,tIns,rIns,bIns — that is XML order, not the API array.
	 * - values `>= 1` are points; values `< 1` are inches (same dual-unit rule as table cells)
	 * - PowerPoint: Format Shape > Shape Options > Size & Properties > Text Box > margins
	 * @example 0 // no margin
	 * @example 10 // 10pt on all sides
	 * @example 0.1 // 0.1" on all sides
	 * @example [10, 5, 10, 5] // T=10pt R=5pt B=10pt L=5pt
	 * @example [0.05, 0.1, 0.05, 0.1] // inches (PowerPoint "Normal")
	 */
	margin?: Margin
	outline?: { color: Color, size: number }
	paraSpaceAfter?: number
	paraSpaceBefore?: number
	placeholder?: string
	/**
	 * Rounded rectangle radius (only for pptx.shapes.ROUNDED_RECTANGLE)
	 * - values: 0.0 to 1.0
	 * @default 0
	 */
	rectRadius?: number
	/**
	 * Rotation (degrees)
	 * - range: -360 to 360
	 * @default 0
	 * @example 180 // rotate 180 degrees
	 */
	rotate?: number
	/**
	 * Whether to enable right-to-left mode
	 * @default false
	 */
	rtlMode?: boolean
	shadow?: ShadowProps
	/**
	 * Soft-edge effect (`a:softEdge` on the text shape)
	 */
	softEdge?: SoftEdgeProps
	/**
	 * Reflection effect (`a:reflection` on the text shape)
	 */
	reflection?: ReflectionProps
	shape?: SHAPE_NAME
	/**
	 * Strikethrough style
	 * - `boolean` form is deprecated (v4.1.0): `true` maps to `'sngStrike'` - pass the string value instead
	 */
	strike?: boolean | 'dblStrike' | 'sngStrike'
	subscript?: boolean
	superscript?: boolean
	/**
	 * Vertical alignment
	 * @default middle
	 */
	valign?: VAlign
	vert?: 'eaVert' | 'horz' | 'mongolianVert' | 'vert' | 'vert270' | 'wordArtVert' | 'wordArtVertRtl'
	/**
	 * Text wrap
	 * @since v3.3.0
	 * @default true
	 */
	wrap?: boolean
	/**
	 * Vertical overflow of text that does not fit the shape.
	 * ECMA-376 §5.1.5.1.1 `CT_TextBodyProperties@vertOverflow`.
	 * @default overflow
	 * @since v4.1.17
	 */
	vertOverflow?: 'overflow' | 'ellipsis' | 'clip'
	/**
	 * Horizontal overflow of text that does not fit the shape.
	 * ECMA-376 §5.1.5.1.1 `CT_TextBodyProperties@horzOverflow`.
	 * @default overflow
	 * @since v4.1.17
	 */
	horzOverflow?: 'overflow' | 'clip'
	/**
	 * Prebuilt Office Math (OMML) fragment for this text run.
	 * Emitted as PowerPoint math: `<a14:m><m:oMath>…</m:oMath></a14:m>` interleaved
	 * with surrounding `<a:r>` text runs. Bare `m:oMath` (without `a14:m`) is
	 * silently stripped by PowerPoint on open — the library wraps it for you.
	 * Callers convert LaTeX/MathML → OMML themselves (e.g. MathLive + mathml2omml).
	 * Use `text: ''` for math-only runs; surrounding runs can still hold plain text.
	 * @example { text: '', options: { omml: '<m:oMath xmlns:m="…">…</m:oMath>' } }
	 * @since v4.1.0
	 */
	omml?: string

	/**
	 * Whether "Fit to Shape?" is enabled
	 * @deprecated v3.3.0 - use `fit`
	 */
	autoFit?: boolean
	/**
	 * Whather "Shrink Text on Overflow?" is enabled
	 * @deprecated v3.3.0 - use `fit`
	 */
	shrinkText?: boolean
	/**
	 * Inset
	 * @deprecated v3.10.0 - use `margin`
	 */
	inset?: number
	/**
	 * Dash type
	 * @deprecated v3.3.0 - use `line.dashType`
	 */
	lineDash?: 'solid' | 'dash' | 'dashDot' | 'lgDash' | 'lgDashDot' | 'lgDashDotDot' | 'sysDash' | 'sysDot'
	/**
	 * @deprecated v3.3.0 - use `line.beginArrowType`
	 */
	lineHead?: 'none' | 'arrow' | 'diamond' | 'oval' | 'stealth' | 'triangle'
	/**
	 * @deprecated v3.3.0 - use `line.width`
	 */
	lineSize?: number
	/**
	 * @deprecated v3.3.0 - use `line.endArrowType`
	 */
	lineTail?: 'none' | 'arrow' | 'diamond' | 'oval' | 'stealth' | 'triangle'
	/**
	 * Animation configuration
	 * - Can be a simple animation name or full configuration object
	 * @example 'fadein'
	 * @example { type: 'flyin', direction: 'left', duration: 1000 }
	 */
	animation?: string | AnimationConfig
}
export interface TextProps {
	text?: string
	options?: TextPropsOptions
}

// charts =========================================================================================
// FUTURE: BREAKING-CHANGE: (soln: use `OptsDataLabelPosition|string` until 3.5/4.0)
/*
export interface OptsDataLabelPosition {
	pie: 'ctr' | 'inEnd' | 'outEnd' | 'bestFit'
	scatter: 'b' | 'ctr' | 'l' | 'r' | 't'
	// TODO: add all othere chart types
}
*/

export type ChartAxisTickMark = 'none' | 'inside' | 'outside' | 'cross'
export type ChartLineCap = 'flat' | 'round' | 'square'

export interface OptsChartData {
	_dataIndex?: number

	/**
	 * category labels
	 * @example ['Year 2000', 'Year 2010', 'Year 2020'] // single-level category axes labels
	 * @example [['Year 2000', 'Year 2010', 'Year 2020'], ['Decades', '', '']] // multi-level category axes labels
	 * @since `labels` string[][] type added v3.11.0
	 */
	labels?: string[] | string[][]
	/**
	 * series name
	 * @example 'Locations'
	 */
	name?: string
	/**
	 * bubble sizes
	 * @example [5, 1, 5, 1]
	 */
	sizes?: number[]
	/**
	 * category values
	 * @example [2000, 2010, 2020]
	 */
	values?: number[]
	/**
	 * Per-point custom Y error-bar magnitudes (symmetric plus/minus)
	 * - emits DrawingML `<c:errBars>` with `errValType="cust"`
	 * - values are packed into columns after all series in the embedded workbook
	 * @example [0.5, 0.3, 0.8]
	 * @see LanPodder/master
	 */
	errorrate?: number[]
	/**
	 * Series color - overrides the `chartColors` cycle for this series only
	 * - hex color or the string `'transparent'`
	 * - pie/doughnut charts colour each data point rather than each series: use `chartColors` for those
	 * @example 'FF0000' // this series is red, the rest follow `chartColors`
	 */
	color?: string
	/**
	 * Per-point custom data label text (replaces the numeric value label for that index)
	 * - sparse arrays are allowed: only defined string entries emit a custom `<c:dLbl>`
	 * - other points keep series-level `<c:dLbls>` defaults
	 * @example ['Q1', 'Q2', 'Q3', 'Q4']
	 * @example [undefined, 'Peak'] // only the second point is overridden
	 * @since v4.1.2
	 */
	dataLabels?: Array<string | undefined>
	/**
	 * "Value From Cells" data labels (DrawingML `c15:datalabelsRange`)
	 * - PowerPoint: Chart Design > Add Chart Element > Data Labels > More Options > Value From Cells
	 * - distinct from `dataLabels` (rich-text `<c:dLbl>`); use this for the Excel-linked range path
	 * @example ['10 units', '20 units', '30 units']
	 * @see Toukyh/fix-custom-label
	 */
	labelsRange?: string[]
}
// Used internally, probably shouldn't be used by end users
export interface IOptsChartData extends OptsChartData {
	labels?: string[][]
}
export interface OptsChartGridLine {
	/**
	 * MS-PPT > Chart format > Format Major Gridlines > Line > Cap type
	 * - line cap type
	 * @default flat
	 */
	cap?: ChartLineCap
	/**
	 * Gridline color (`HexColor`, `ThemeColor`, or `ModifiedThemeColor`)
	 * - widened to `Color` so `IChartOpts` can extend both this and `IChartPropsTitle`
	 *   (`TextBaseProps.color` is also `Color` after theme-color support)
	 * @example 'FF3399'
	 */
	color?: Color
	/**
	 * Gridline size (points)
	 */
	size?: number
	/**
	 * Gridline style
	 */
	style?: 'solid' | 'dash' | 'dot' | 'none'
}
// TODO: 202008: chart types remain with predicated with "I" in v3.3.0 (ran out of time!)
export interface IChartMulti {
	type: CHART_NAME
	data: IOptsChartData[]
	options: IChartOptsLib
}
export interface IChartPropsFillLine {
	/**
	 * PowerPoint: Format Chart Area/Plot > Border ["Line"]
	 * @example border: {color: 'FF0000', pt: 1} // hex RGB color, 1 pt line
	 */
	border?: BorderProps
	/**
	 * PowerPoint: Format Chart Area/Plot Area > Fill
	 * @example fill: {color: '696969'} // hex RGB color value
	 * @example fill: {color: pptx.SchemeColor.background2} // Theme color value
	 * @example fill: {transparency: 50} // 50% transparency
	 */
	fill?: ShapeFillProps
}
export interface IChartAreaProps extends IChartPropsFillLine {
	/**
	 * Whether the chart area has rounded corners
	 * - only applies when either `fill` or `border` is used
	 * @default true
	 * @since v3.11
	 */
	roundedCorners?: boolean
}
export interface IChartPropsBase {
	/**
	 * Axis position
	 */
	axisPos?: 'b' | 'l' | 'r' | 't'
	/**
	 * Series / marker colors
	 * - use `'transparent'` for no fill on series and line/radar/scatter markers
	 * @example ['4472C4', 'transparent', 'ED7D31']
	 */
	chartColors?: Color[]
	/**
	 * opacity (0 - 100)
	 * @example 50 // 50% opaque
	 */
	chartColorsOpacity?: number
	dataBorder?: BorderProps
	displayBlanksAs?: string
	invertedColors?: Color[]
	lang?: string
	layout?: PositionProps
	shadow?: ShadowProps
	/**
	 * @default false
	 */
	showLabel?: boolean
	showLeaderLines?: boolean
	/**
	 * Show "Value From Cells" data labels (`c15:showDataLabelsRange`)
	 * - auto-enabled when a series has `labelsRange`
	 * @default false
	 * @see Toukyh/fix-custom-label
	 */
	showDataLabelsRange?: boolean
	/**
	 * @default false
	 */
	showLegend?: boolean
	/**
	 * @default false
	 */
	showPercent?: boolean
	/**
	 * @default false
	 */
	showSerName?: boolean
	/**
	 * @default false
	 */
	showTitle?: boolean
	/**
	 * @default false
	 */
	showValue?: boolean
	/**
	 * 3D Perspecitve
	 * - range: 0-120
	 * @default 30
	 */
	v3DPerspective?: number
	/**
	 * Right Angle Axes
	 * - Shows chart from first-person perspective
	 * - Overrides `v3DPerspective` when true
	 * - PowerPoint: Chart Options > 3-D Rotation
	 * @default false
	 */
	v3DRAngAx?: boolean
	/**
	 * X Rotation
	 * - PowerPoint: Chart Options > 3-D Rotation
	 * - range: 0-359.9
	 * @default 30
	 */
	v3DRotX?: number
	/**
	 * Y Rotation
	 * - range: 0-359.9
	 * @default 30
	 */
	v3DRotY?: number

	/**
	 * PowerPoint: Format Chart Area (Fill & Border/Line)
	 * @since v3.11
	 */
	chartArea?: IChartAreaProps
	/**
	 * PowerPoint: Format Plot Area (Fill & Border/Line)
	 * @since v3.11
	 */
	plotArea?: IChartPropsFillLine

	/**
	 * @deprecated v3.11.0 - use `plotArea.border`
	 */
	border?: BorderProps
	/**
	 * @deprecated v3.11.0 - use `plotArea.fill`
	 */
	fill?: HexColor
}
export interface IChartPropsAxisCat {
	/**
	 * Multi-Chart prop: array of cat axes
	 */
	catAxes?: IChartPropsAxisCat[]
	catAxisBaseTimeUnit?: string
	catAxisCrossesAt?: number | 'autoZero'
	catAxisHidden?: boolean
	catAxisLabelColor?: string
	catAxisLabelFontBold?: boolean
	catAxisLabelFontFace?: string
	catAxisLabelFontItalic?: boolean
	catAxisLabelFontSize?: number
	catAxisLabelFrequency?: string
	catAxisLabelPos?: 'none' | 'low' | 'high' | 'nextTo'
	catAxisLabelRotate?: number
	catAxisLineColor?: string
	catAxisLineShow?: boolean
	catAxisLineSize?: number
	catAxisLineStyle?: 'solid' | 'dash' | 'dot'
	catAxisMajorTickMark?: ChartAxisTickMark
	catAxisMajorTimeUnit?: string
	catAxisMajorUnit?: number
	catAxisMaxVal?: number
	catAxisMinorTickMark?: ChartAxisTickMark
	catAxisMinorTimeUnit?: string
	catAxisMinorUnit?: number
	catAxisMinVal?: number
	/** @since v3.11.0 */
	catAxisMultiLevelLabels?: boolean
	catAxisOrientation?: 'minMax'
	catAxisTitle?: string
	catAxisTitleColor?: string
	catAxisTitleFontFace?: string
	catAxisTitleFontSize?: number
	catAxisTitleRotate?: number
	catGridLine?: OptsChartGridLine
	catLabelFormatCode?: string
	/**
	 * Whether data should use secondary category axis (instead of primary)
	 * @default false
	 */
	secondaryCatAxis?: boolean
	showCatAxisTitle?: boolean
}
export interface IChartPropsAxisSer {
	serAxisBaseTimeUnit?: string
	serAxisHidden?: boolean
	serAxisLabelColor?: string
	serAxisLabelFontBold?: boolean
	serAxisLabelFontFace?: string
	serAxisLabelFontItalic?: boolean
	serAxisLabelFontSize?: number
	serAxisLabelFrequency?: string
	serAxisLabelPos?: 'none' | 'low' | 'high' | 'nextTo'
	serAxisLineColor?: string
	serAxisLineShow?: boolean
	serAxisMajorTimeUnit?: string
	serAxisMajorUnit?: number
	serAxisMinorTimeUnit?: string
	serAxisMinorUnit?: number
	serAxisOrientation?: string
	serAxisTitle?: string
	serAxisTitleColor?: string
	serAxisTitleFontFace?: string
	serAxisTitleFontSize?: number
	serAxisTitleRotate?: number
	serGridLine?: OptsChartGridLine
	serLabelFormatCode?: string
	showSerAxisTitle?: boolean
}
export interface IChartPropsAxisVal {
	/**
	 * Whether data should use secondary value axis (instead of primary)
	 * @default false
	 */
	secondaryValAxis?: boolean
	showValAxisTitle?: boolean
	/**
	 * Multi-Chart prop: array of val axes
	 */
	valAxes?: IChartPropsAxisVal[]
	valAxisCrossesAt?: number | 'autoZero'
	valAxisDisplayUnit?: 'billions' | 'hundredMillions' | 'hundreds' | 'hundredThousands' | 'millions' | 'tenMillions' | 'tenThousands' | 'thousands' | 'trillions'
	valAxisDisplayUnitLabel?: boolean
	valAxisHidden?: boolean
	valAxisLabelColor?: string
	valAxisLabelFontBold?: boolean
	valAxisLabelFontFace?: string
	valAxisLabelFontItalic?: boolean
	valAxisLabelFontSize?: number
	valAxisLabelFormatCode?: string
	valAxisLabelPos?: 'none' | 'low' | 'high' | 'nextTo'
	valAxisLabelRotate?: number
	valAxisLineColor?: string
	valAxisLineShow?: boolean
	valAxisLineSize?: number
	valAxisLineStyle?: 'solid' | 'dash' | 'dot'
	/**
	 * PowerPoint: Format Axis > Axis Options > Logarithmic scale - Base
	 * - range: 2-99
	 * @since v3.5.0
	 */
	valAxisLogScaleBase?: number
	valAxisMajorTickMark?: ChartAxisTickMark
	valAxisMajorUnit?: number
	valAxisMaxVal?: number
	valAxisMinorTickMark?: ChartAxisTickMark
	valAxisMinVal?: number
	valAxisOrientation?: 'minMax'
	valAxisTitle?: string
	valAxisTitleColor?: string
	valAxisTitleFontFace?: string
	valAxisTitleFontSize?: number
	valAxisTitleRotate?: number
	valGridLine?: OptsChartGridLine
	/**
	 * Value label format code
	 * - this also directs Data Table formatting
	 * @since v3.3.0
	 * @example '#%' // round percent
	 * @example '0.00%' // shows values as '0.00%'
	 * @example '$0.00' // shows values as '$0.00'
	 */
	valLabelFormatCode?: string
}
export interface IChartPropsChartBar {
	/**
	 * 3D bar shape
	 * @default 'box'
	 */
	bar3DShape?: 'box' | 'cone' | 'coneToMax' | 'cylinder' | 'pyramid' | 'pyramidToMax'
	/**
	 * Bar direction - horizontal bars or vertical columns
	 * @default 'col'
	 */
	barDir?: 'bar' | 'col'
	barGapDepthPct?: number
	/**
	 * MS-PPT > Format chart > Format Data Point > Series Options >  "Gap Width"
	 * - width (percent)
	 * - range: `0`-`500`
	 * @default 150
	 */
	barGapWidthPct?: number
	/**
	 * Bar grouping
	 * @default 'clustered'
	 */
	barGrouping?: 'clustered' | 'percentStacked' | 'stacked' | 'standard'
	/**
	 * MS-PPT > Format chart > Format Data Point > Series Options >  "Series Overlap"
	 * - overlap (percent)
	 * - range: `-100`-`100`
	 * @since v3.9.0
	 * @default 0
	 */
	barOverlapPct?: number
}
export interface IChartPropsChartDoughnut {
	dataNoEffects?: boolean
	holeSize?: number
}
export interface IChartPropsChartLine {
	/**
	 * MS-PPT > Chart format > Format Data Series > Line > Cap type
	 * - line cap type
	 * @default flat
	 */
	lineCap?: ChartLineCap
	/**
	 * MS-PPT > Chart format > Format Data Series > Marker Options > Built-in > Type
	 * - line dash type
	 * @default solid
	 */
	lineDash?: 'dash' | 'dashDot' | 'lgDash' | 'lgDashDot' | 'lgDashDotDot' | 'solid' | 'sysDash' | 'sysDot'
	/**
	 * MS-PPT > Chart format > Format Data Series > Marker Options > Built-in > Type
	 * - marker type
	 * @default circle
	 */
	lineDataSymbol?: 'circle' | 'dash' | 'diamond' | 'dot' | 'none' | 'square' | 'triangle'
	/**
	 * MS-PPT > Chart format > Format Data Series > [Marker Options] > Border > Color
	 * - border color
	 * @default circle
	 */
	lineDataSymbolLineColor?: string
	/**
	 * MS-PPT > Chart format > Format Data Series > [Marker Options] > Border > Width
	 * - border width (points)
	 * @default 0.75
	 */
	lineDataSymbolLineSize?: number
	/**
	 * MS-PPT > Chart format > Format Data Series > Marker Options > Built-in > Size
	 * - marker size
	 * - range: 2-72
	 * @default 6
	 */
	lineDataSymbolSize?: number
	/**
	 * MS-PPT > Chart format > Format Data Series > Line > Width
	 * - line width (points)
	 * - range: 0-1584
	 * @default 2
	 */
	lineSize?: number
	/**
	 * MS-PPT > Chart format > Format Data Series > Line > Smoothed line
	 * - "Smoothed line"
	 * @default false
	 */
	lineSmooth?: boolean
}
export interface IChartPropsChartPie {
	dataNoEffects?: boolean
	/**
	 * MS-PPT > Format chart > Format Data Series > Series Options >  "Angle of first slice"
	 * - angle (degrees)
	 * - range: 0-359
	 * @since v3.4.0
	 * @default 0
	 */
	firstSliceAng?: number
}
export interface IChartPropsChartRadar {
	/**
	 * MS-PPT > Chart Type > Waterfall
	 * - radar chart type
	 * @default standard
	 */
	radarStyle?: 'standard' | 'marker' | 'filled' // TODO: convert to 'radar'|'markers'|'filled' in 4.0 (verbatim with PPT app UI)
}
export interface IChartPropsDataLabel {
	dataLabelBkgrdColors?: boolean
	dataLabelColor?: string
	dataLabelFontBold?: boolean
	dataLabelFontFace?: string
	dataLabelFontItalic?: boolean
	dataLabelFontSize?: number
	/**
	 * Data label format code
	 * @example '#%' // round percent
	 * @example '0.00%' // shows values as '0.00%'
	 * @example '$0.00' // shows values as '$0.00'
	 */
	dataLabelFormatCode?: string
	dataLabelFormatScatter?: 'custom' | 'customXY' | 'XY'
	/**
	 * Data label position
	 * - friendly names are translated to their OOXML codes; the codes themselves are still accepted
	 * - valid values differ per chart type: a value the chart type does not support is dropped with a
	 *   console warning rather than producing a file PowerPoint asks to repair
	 * @example 'outsideEnd' // bar/column, pie
	 * @example 'top' // line, scatter, radar
	 */
	dataLabelPosition?:
	| 'bottom' | 'center' | 'left' | 'right' | 'top' | 'insideEnd' | 'insideBase' | 'outsideEnd' | 'bestFit'
	| 'b' | 'ctr' | 'l' | 'r' | 't' | 'inEnd' | 'inBase' | 'outEnd'
}
export interface IChartPropsDataTable {
	dataTableFontSize?: number
	/**
	 * Data table format code
	 * @since v3.3.0
	 * @example '#%' // round percent
	 * @example '0.00%' // shows values as '0.00%'
	 * @example '$0.00' // shows values as '$0.00'
	 */
	dataTableFormatCode?: string
	/**
	 * Whether to show a data table adjacent to the chart
	 * @default false
	 */
	showDataTable?: boolean
	showDataTableHorzBorder?: boolean
	showDataTableKeys?: boolean
	showDataTableOutline?: boolean
	showDataTableVertBorder?: boolean
}
export interface IChartPropsLegend {
	legendColor?: string
	legendFontFace?: string
	legendFontSize?: number
	legendPos?: 'b' | 'l' | 'r' | 't' | 'tr'
}
export interface IChartPropsTitle extends TextBaseProps {
	title?: string
	titleAlign?: string
	titleBold?: boolean
	titleColor?: string
	titleFontFace?: string
	titleFontSize?: number
	titleItalic?: boolean
	titlePos?: { x: number, y: number }
	titleRotate?: number
}
export interface IChartOpts
	extends IChartPropsAxisCat,
	IChartPropsAxisSer,
	IChartPropsAxisVal,
	IChartPropsBase,
	IChartPropsChartBar,
	IChartPropsChartDoughnut,
	IChartPropsChartLine,
	IChartPropsChartPie,
	IChartPropsChartRadar,
	IChartPropsDataLabel,
	IChartPropsDataTable,
	IChartPropsLegend,
	IChartPropsTitle,
	ObjectNameProps,
	OptsChartGridLine,
	PositionProps {
	/**
	 * Alt Text value ("How would you describe this object and its contents to someone who is blind?")
	 * - PowerPoint: [right-click on a chart] > "Edit Alt Text..."
	 */
	altText?: string
	/**
	 * Animation configuration
	 * - Can be a simple animation name or full configuration object
	 * @example 'fadein'
	 * @example { type: 'flyin', direction: 'left', duration: 1000 }
	 */
	animation?: string | AnimationConfig
}
export interface IChartOptsLib extends IChartOpts {
	_type?: CHART_NAME | IChartMulti[] // TODO: v3.4.0 - move to `IChartOpts`, remove `IChartOptsLib`
}
export interface ISlideRelChart extends OptsChartData {
	type: CHART_NAME | IChartMulti[]
	opts: IChartOptsLib
	data: IOptsChartData[]
	// internal below
	rId: number
	Target: string
	globalId: number
	fileName: string
}

// Core
// ====
// PRIVATE vvv
export interface ISlideRel {
	type: SLIDE_OBJECT_TYPES
	Target: string
	fileName?: string
	data: any[] | string
	opts?: IChartOpts
	path?: string
	extn?: string
	globalId?: number
	rId: number
}
export interface ISlideRelMedia {
	type: string
	opts?: MediaProps
	path?: string
	extn?: string
	data?: string | ArrayBuffer
	/** used to indicate that a media file has already been read/enocded (PERF) */
	isDuplicate?: boolean
	isSvgPng?: boolean
	/** SVG path recolor (Martin-N) — applied when encoding SVG media */
	fill?: ShapeFillProps
	svgSize?: { w: number, h: number }
	rId: number
	Target: string
}
export interface ISlideObject {
	_type: SLIDE_OBJECT_TYPES
	options?: ObjectOptions
	// text
	text?: TextProps[]
	// table
	arrTabRows?: TableCell[][]
	// chart
	chartRid?: number
	// image:
	image?: string
	imageRid?: number
	hyperlink?: HyperlinkProps
	// media
	media?: string
	mtype?: MediaType
	mediaRid?: number
	shape?: SHAPE_NAME
	// zoom (MS-PPTX §2.9-§2.11)
	/** zoom kind: slide | section | summary @internal */
	zoomKind?: 'slide' | 'section' | 'summary'
	/** 1-based target slide number (slide zoom) @internal */
	zoomSlideNum?: number
	/** target section title (section/summary zoom) @internal */
	zoomSectionTitle?: string
	/** resolved target section GUID (braced `{…}`), set at build @internal */
	zoomSectionId?: string
	/** cover/thumbnail image rId @internal */
	zoomRid?: number
}
// PRIVATE ^^^

/**
 * Zip compression applied to the exported file
 * - 'none': store uncompressed (fastest)
 * - 'fast': DEFLATE level 1 (quick, decent savings)
 * - 'best': DEFLATE level 9 (smallest file, slowest)
 */
export type CompressionLevel = 'none' | 'fast' | 'best'

/** Font file formats supported by embedded TrueType fonts (`addFont`) */
export type EmbedFontType = 'ttf' | 'otf' | 'woff' | 'eot'

/**
 * Options for `pptx.addFont()` — embeds a custom font into the exported PPTX
 */
export interface AddFontOptions {
	/** Font family name referenced by `fontFace` on text/shapes */
	fontFace: string
	/** Raw font file bytes */
	fontFile: ArrayBuffer
	/** Source font format */
	fontType: EmbedFontType
}

export interface WriteBaseProps {
	/**
	 * Whether to compress export (can save substantial space, but takes a bit longer to export)
	 * @default false
	 * @since v3.5.0
	 * @deprecated v4.1.0 - set `compression` on the presentation instead (`pptx.compression = 'best'`) - a
	 * boolean per-write flag cannot express a level and compression is document config, not a per-call concern
	 */
	compression?: boolean
}
export interface WriteProps extends WriteBaseProps {
	/**
	 * Output type
	 * - values: 'arraybuffer' | 'base64' | 'binarystring' | 'blob' | 'nodebuffer' | 'uint8array' | 'STREAM'
	 * @default 'blob'
	 */
	outputType?: WRITE_OUTPUT_TYPE
}
export interface WriteFileProps extends WriteBaseProps {
	/**
	 * Export file name
	 * @default 'Presentation.pptx'
	 */
	fileName?: string
}
export interface SectionProps {
	/** @internal managed by the library; consumers only pass `{ title, order? }` */
	_type?: 'user' | 'default'
	/** @internal slides in this section, populated at build time */
	_slides?: PresSlide[]
	/** Stable GUID for section-zoom anchors (MS-PPTX §2.9). Auto-assigned at build if unset. @internal */
	_id?: string

	/**
	 * Section title
	 */
	title: string
	/**
	 * Section order - uses to add section at any index
	 * - values: 1-n
	 */
	order?: number
}
export interface PresLayout {
	_sizeW?: number
	_sizeH?: number

	/**
	 * Layout Name
	 * @example 'LAYOUT_WIDE'
	 */
	name: string
	width: number
	height: number
}
/**
 * Argument to `defineLayout()` - dimensions may be given as `width`/`height` or as `w`/`h`
 */
export interface DefineLayoutProps {
	/**
	 * Layout name
	 * @example 'A3'
	 */
	name: string
	/** Layout width (inches) - or use `w` */
	width?: number
	/** Layout height (inches) - or use `h` */
	height?: number
	/** Layout width (inches) - alias of `width` */
	w?: number
	/** Layout height (inches) - alias of `height` */
	h?: number
}
export interface SlideNumberProps extends PositionProps, TextBaseProps {
	/**
	 * margin (points)
	 */
	margin?: Margin // TODO: convert to inches in 4.0 (valid values are 0-22)
}
export interface SlideMasterProps {
	/**
	 * Unique name for this master
	 */
	title: string
	background?: BackgroundProps
	margin?: Margin
	slideNumber?: SlideNumberProps
	objects?: Array< | { chart: IChartOpts }
	| { image: ImageProps }
	| { line: ShapeProps }
	| { rect: ShapeProps }
	| { roundRect: ShapeProps }
	| { text: TextProps }
	/** any of the 180+ shape types (`line`/`rect` above are shorthands) */
	| { shape: { type: SHAPE_NAME, options?: ShapeProps } }
	| { table: { rows: TableRow[], options?: TableProps } }
	| { media: MediaProps }
	| {
		placeholder: {
			options: PlaceholderProps
			/**
			 * Text to be shown in placeholder (shown until user focuses textbox or adds text)
			 * - Leave blank to have powerpoint show default phrase (ex: "Click to add title")
			 */
			text?: string
		}
	}>

	/**
	 * @deprecated v3.3.0 - use `background`
	 */
	bkgd?: string | BackgroundProps
}
export interface ObjectOptions extends ImageProps, PositionProps, ShapeProps, TableCellProps, TextPropsOptions {
	_placeholderIdx?: number
	_placeholderType?: PLACEHOLDER_TYPE
	/** image added without `w`/`h`: size it from the image itself during export @internal */
	_sizeFromImage?: boolean

	cx?: Coord
	cy?: Coord
	margin?: Margin
	colW?: number | number[] // table
	rowH?: number | number[] // table
	// MS-PPTX §2.3.3.14 media extras + §2.2.14 narration (media objects only)
	trim?: { st?: number; end?: number }
	fade?: { in?: number; out?: number }
	bookmarks?: { name: string; time: number }[]
	isNarration?: boolean
	// Playback behaviour (ECMA-376 §19.5 CT_TLMediaNode — drives the slide timing tree)
	autoplay?: boolean
	loop?: boolean
	fullScreen?: boolean
	mute?: boolean
	// MS-PPTX §2.8 CT_ZoomObjectProperties (zoom objects only)
	returnToParent?: boolean
	showBg?: boolean
	transitionDur?: number
	// MS-PPTX §2.11 CT_SummaryZoomObject attrs (summary zoom only)
	zoomTitle?: string
	zoomDescr?: string
	offsetFactorX?: number
	offsetFactorY?: number
	scaleFactorX?: number
	scaleFactorY?: number
}
export interface SlideBaseProps {
	_bkgdImgRid?: number
	_margin?: Margin
	_name?: string
	_presLayout: PresLayout
	_rels: ISlideRel[]
	_relsChart: ISlideRelChart[] // needed as we use args:"PresSlide|SlideLayout" often
	_relsMedia: ISlideRelMedia[] // needed as we use args:"PresSlide|SlideLayout" often
	_slideNum: number | null
	_slideNumberProps?: SlideNumberProps
	_slideObjects: ISlideObject[]

	background?: BackgroundProps
	/**
	 * @deprecated v3.3.0 - use `background`
	 */
	bkgd?: string | BackgroundProps
}
export interface SlideLayout extends SlideBaseProps {
	_slide?: {
		_bkgdImgRid?: number
		back: string
		color: string
		hidden?: boolean
	}
}
export interface PresSlide extends SlideBaseProps {
	_rId: number
	_slideLayout: SlideLayout
	_slideId: number

	addChart: (type: CHART_NAME | IChartMulti[], data: IOptsChartData[], options?: IChartOpts) => PresSlide
	addImage: (options: ImageProps) => PresSlide
	addMedia: (options: MediaProps) => PresSlide
	addNotes: (notes: string) => PresSlide
	addShape: (shapeName: SHAPE_NAME, options?: ShapeProps) => PresSlide
	addTable: (tableRows: TableRow[], options?: TableProps) => PresSlide
	addText: (text: string | TextProps[], options?: TextPropsOptions) => PresSlide

	/**
	 * Background color or image (`color` | `path` | `data`)
	 * @example { color: 'FF3399' } - hex color
	 * @example { color: 'FF3399', transparency:50 } - hex color with 50% transparency
	 * @example { path: 'https://onedrives.com/myimg.png` } - retrieve image via URL
	 * @example { path: '/home/gitbrent/images/myimg.png` } - retrieve image via local path
	 * @example { data: 'image/png;base64,iVtDaDrF[...]=' } - base64 string
	 * @since v3.3.0
	 */
	background?: BackgroundProps
	/**
	 * Default text color (hex format)
	 * @example 'FF3399'
	 * @default '000000' (DEF_FONT_COLOR)
	 */
	color?: HexColor
	/**
	 * Whether slide is hidden
	 * @default false
	 */
	hidden?: boolean
	/**
	 * Slide number options
	 */
	slideNumber?: SlideNumberProps
	/**
	 * Slide transition. Emitted as `<p:transition>` (ECMA-376 §19.3.1.50 `CT_SlideTransition`).
	 * @example { type: 'fade', duration: 700 }
	 * @example { type: 'push', direction: 'l', advClick: false, advTm: 3000 }
	 */
	transition?: SlideTransitionProps
	/**
	 * Add a slide transition (convenience method; sets `transition`).
	 * @example slide.addTransition({ type: 'morph', duration: 800 })
	 */
	addTransition: (options: SlideTransitionProps) => PresSlide
	/**
	 * Threaded comments on this slide (MS-PPTX §2.16). Emitted to `ppt/comments/commentSlide<N>.xml`.
	 */
	comments?: CommentProps[]
	/**
	 * Add a threaded comment to this slide.
	 * @example slide.addComment({ text: 'Review this', author: 'Ada', x: 1, y: 1 })
	 */
	addComment: (comment: CommentProps) => PresSlide
	/**
	 * Add a Slide Zoom object linking to another slide (MS-PPTX §2.10 `p16:sldZm`).
	 * Rendered inside `mc:AlternateContent` with a `pic` fallback for older readers.
	 * @example slide.addZoom({ slideNum: 3, x: 1, y: 4, w: 2, h: 1.13 })
	 */
	addZoom: (options: ZoomProps) => PresSlide
	/**
	 * Add a Section Zoom object linking to a section's first slide (MS-PPTX §2.9 `p16:sectionZm`).
	 * Rendered inside `mc:AlternateContent` with a `pic` fallback.
	 * @example slide.addSectionZoom({ sectionTitle: 'Intro', x: 1, y: 4, w: 2, h: 1.13 })
	 */
	addSectionZoom: (options: SectionZoomProps) => PresSlide
	/**
	 * Add a Summary Zoom object linking to a section (MS-PPTX §2.11 `p16:summaryZm`).
	 * Rendered inside `mc:AlternateContent` with a `grpSp` fallback.
	 * @example slide.addSummaryZoom({ sectionTitle: 'Intro', x: 1, y: 4, w: 2, h: 1.13 })
	 */
	addSummaryZoom: (options: SummaryZoomProps) => PresSlide
}
/** Base Zoom navigation options. MS-PPTX §2.8 `CT_ZoomObjectProperties`. */
interface ZoomBaseProps extends PositionProps, ObjectNameProps {
	/** Cover/thumbnail image (base64 data URI or path). Defaults to a plain preview tile. */
	cover?: string
	/** Return to the zoom-source slide after viewing the target. @default true */
	returnToParent?: boolean
	/** Use the destination slide's background. @default true */
	showBg?: boolean
	/** Zoom transition duration (ms). Omit to use the destination slide's own transition. */
	transitionDur?: number
	/** Optional alt text. */
	altText?: string
}
/** A Slide Zoom navigation object. MS-PPTX §2.10 `CT_SlideZoom`. */
export interface ZoomProps extends ZoomBaseProps {
	/** 1-based slide number to zoom to. */
	slideNum: number
}
/** A Section Zoom navigation object. MS-PPTX §2.9 `CT_SectionZoom`. */
export interface SectionZoomProps extends ZoomBaseProps {
	/** Title of the target section (must match an `addSection({ title })`). */
	sectionTitle: string
}
/** A Summary Zoom navigation object. MS-PPTX §2.11 `CT_SummaryZoom`. */
export interface SummaryZoomProps extends ZoomBaseProps {
	/** Title of the target section (must match an `addSection({ title })`). */
	sectionTitle: string
	/** Alt-text title on the zoom object. */
	title?: string
	/** Alt-text description on the zoom object. */
	descr?: string
	/** X offset from default layout (percent, 100000 = 100%). @default 0 */
	offsetFactorX?: number
	/** Y offset from default layout (percent). @default 0 */
	offsetFactorY?: number
	/** X scale from default layout (percent). @default 100000 */
	scaleFactorX?: number
	/** Y scale from default layout (percent). @default 100000 */
	scaleFactorY?: number
}
/**
 * Slide transition options. ECMA-376 §19.3.1.50 `CT_SlideTransition`.
 * Modern (MS-PPTX) transition types are emitted inside `<mc:AlternateContent>` with a base-type fallback.
 */
export interface SlideTransitionProps {
	/**
	 * Transition type.
	 * ECMA-376 base: 'blinds'|'checker'|'circle'|'comb'|'cover'|'cut'|'diamond'|'dissolve'|'fade'|
	 * 'newsflash'|'none'|'plus'|'pull'|'push'|'random'|'randomBar'|'split'|'strips'|'wedge'|'wheel'|'wipe'|'zoom'.
	 * MS-PPTX 2010+ (emitted via AlternateContent): 'conveyor'|'doors'|'ferris'|'flash'|'flip'|'flythrough'|
	 * 'gallery'|'glitter'|'honeycomb'|'morph'|'pan'|'prism'|'reveal'|'ripple'|'shred'|'switch'|'vortex'|'warp'|'wheelReverse'|'window'.
	 */
	type: TRANSITION_TYPE
	/**
	 * Transition direction. Meaning depends on type:
	 * side (push/wipe/vortex/pan): 'l'|'r'|'u'|'d'; orientation (blinds/checker/comb/randomBar/doors): 'horz'|'vert';
	 * eight-dir (cover/pull/ferris/gallery/conveyor/flip/switch): 'l'|'r'|'u'|'d'|'lu'|'ru'|'ld'|'rd';
	 * corner (strips): 'lu'|'ru'|'ll'|'rl'; in/out (split/zoom/warp): 'in'|'out'.
	 */
	direction?: string
	/**
	 * Transition speed.
	 * @default 'fast'
	 */
	speed?: 'slow' | 'med' | 'fast'
	/**
	 * Duration in milliseconds (MS-PPTX `p14:dur` extension; overrides `speed`).
	 */
	duration?: number
	/** Advance on mouse click. @default true */
	advClick?: boolean
	/** Auto-advance after N milliseconds. */
	advTm?: number
	/** `wheel` only: number of spokes. @default 4 */
	spokes?: number
	/** `fade`/`cut` only: transition through black. @default false */
	thruBlk?: boolean
}
export interface AddSlideProps {
	masterName?: string // TODO: 20200528: rename to "masterTitle" (createMaster uses `title` so lets be consistent)
	sectionTitle?: string
}
export interface PresentationProps {
	author: string
	company: string
	/**
	 * Zip compression for exported files
	 * @default 'none'
	 * @since v4.1.0
	 */
	compression: CompressionLevel
	layout: string
	masterSlide: PresSlide
	/**
	 * Presentation's layout
	 * read-only
	 */
	presLayout: PresLayout
	revision: string
	/**
	 * Whether to enable right-to-left mode
	 * @default false
	 */
	rtlMode: boolean
	/**
	 * Starting slide number written to `ppt/presentation.xml` (`firstSlideNum`)
	 * - PowerPoint: Design > Slide Size > Custom Slide Size > Number slides from
	 * @default 1
	 * @example 0 // first slide displays as "0"
	 */
	firstSlideNum: number
	/**
	 * Alignment guides shown in PowerPoint's editor (ruler guides). MS-PPTX §2.4.3.3 `CT_ExtendedGuide`.
	 * Emitted as `p15:sldGuideLst` under `<p:presentation>` extLst.
	 * @example [{ orient: 'vert', pos: 3.5 }, { orient: 'horz', pos: 2, color: 'FF0000' }] // pos in inches
	 */
	guides?: GuideProps[]
	/**
	 * Default DPI used when compressing/saving images. MS-PPTX §2.3.1.5 `defaultImageDpi`.
	 * Only applies when image compression is on. @example 220
	 */
	defaultImageDpi?: number
	/**
	 * Discard image editing data (crop info, imgProps) on save. MS-PPTX §2.3.1.6 `discardImageEditData`.
	 * @default false
	 */
	discardImageEditData?: boolean
	/**
	 * Recommend the document open read-only. MS-PPTX §2.14.1.1 `readonlyRecommended`.
	 * @default false
	 */
	readonlyRecommended?: boolean
	/**
	 * Modern comment authors (MS-PPTX §2.16 `authorLst`). Emitted to `ppt/authors.xml`.
	 * Comments reference authors by index. Auto-populated from slide comments if left empty.
	 * @example [{ name: 'Ada Lovelace', initials: 'AL' }]
	 */
	commentAuthors?: CommentAuthorProps[]
	subject: string
	theme?: ThemeProps
	title: string
}
/** A modern-comment author. MS-PPTX §2.16.3.1 `CT_Author`. */
export interface CommentAuthorProps {
	/** Author display name (required). */
	name: string
	/** Author initials. */
	initials?: string
	/** Stable GUID. Auto-generated if omitted. */
	id?: string
	/** Unique user id (presence). Defaults to `id`. */
	userId?: string
	/** Identity provider that produced userId. @default 'None' */
	providerId?: string
}
/** A threaded comment on a slide. MS-PPTX §2.16.3.3 `CT_Comment`. */
export interface CommentProps {
	/** Comment body text. */
	text: string
	/** Author index into `pptx.commentAuthors` (0-based) or author name. @default 0 */
	author?: number | string
	/** X position (inches) of the comment badge. */
	x?: number
	/** Y position (inches) of the comment badge. */
	y?: number
	/** Replies to this comment. */
	replies?: { text: string; author?: number | string }[]
	/** ISO date; defaults to now. */
	startDate?: string
}
/**
 * An editor alignment guide. MS-PPTX §2.4.3.3 `CT_ExtendedGuide` / §2.4.3.4 `CT_ExtendedGuideList`.
 */
export interface GuideProps {
	/** Guide orientation. @default 'vert' */
	orient?: 'horz' | 'vert'
	/** Position from the left (vert) or top (horz) edge of the slide, in inches. @default 0 */
	pos?: number
	/** Guide line color (hex). @default theme accent */
	color?: HexColor
	/** Optional guide name. */
	name?: string
	/** Mark as user-drawn. @default true */
	userDrawn?: boolean
}
// PRIVATE interface
export interface IPresentationProps extends PresentationProps {
	sections: SectionProps[]
	slideLayouts: SlideLayout[]
	slides: PresSlide[]
}
