/**
 * PptxGenJS: Media Methods
 */

import { IMG_BROKEN, SLIDE_OBJECT_TYPES } from './core-enums'
import { PresSlide, SlideLayout, ISlideRelMedia } from './core-interfaces'
import { applySvgFillColor, applySvgFillToDataUrl } from './gen-utils'

/** Images are measured in pixels; PowerPoint slide dimensions are inches at 96 DPI */
const IMAGE_DPI = 96

/**
 * Read the natural pixel dimensions of a raster image from its header bytes.
 * Self-contained replacement for the `image-size` package (PNG/JPEG/GIF/BMP).
 * Format refs: PNG spec §11.2.2 (IHDR is always the first chunk, width/height big-endian at bytes 16-24);
 * JPEG (JFIF) SOF0-SOF15 markers carry height then width big-endian; GIF87a/89a logical-screen descriptor
 * little-endian at bytes 6-10; BMP DIB header little-endian at bytes 18-26. SVG is sized separately (gen-objects).
 *
 * Declared dims are header-only (we never decode pixels), so clamp to a sane ceiling: a maliciously crafted
 * header can claim 0xFFFFFFFF px and emit a ~44-million-inch slide (a corrupt pptx). PowerPoint's max slide is
 * 56 in (5376 px @ 96 DPI); 100 000 px is generous headroom for legit high-res sources while rejecting bombs.
 */
const MAX_IMAGE_PX = 100000

function imageDimensions(bytes: Uint8Array): { width?: number; height?: number } {
	if (bytes.length < 10) return {} // every supported header's dims start at/after byte 6
	const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
	const sane = (w: number, h: number) => (w > 0 && h > 0 && w <= MAX_IMAGE_PX && h <= MAX_IMAGE_PX ? { width: w, height: h } : {})

	// PNG: 8-byte signature 89 50 4E 47 0D 0A 1A 0A, then IHDR length(4)+type(4)+width(4)+height(4)
	if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
		if (bytes.length < 24) return {}
		return sane(dv.getUint32(16, false), dv.getUint32(20, false))
	}

	// GIF: 'GIF87a'/'GIF89a', logical screen width/height little-endian at bytes 6-10
	if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) {
		return sane(dv.getUint16(6, true), dv.getUint16(8, true))
	}

	// BMP: 'BM', DIB width/height little-endian at bytes 18-26 (signed; height may be negative = top-down)
	if (bytes[0] === 0x42 && bytes[1] === 0x4d) {
		if (bytes.length < 26) return {}
		return sane(Math.abs(dv.getInt32(18, true)), Math.abs(dv.getInt32(22, true)))
	}

	// JPEG: FF D8, then walk marker segments until a Start-Of-Frame (C0-CF except C4/C8/CC) carries the dims
	if (bytes[0] === 0xff && bytes[1] === 0xd8) {
		let off = 2
		while (off + 9 <= bytes.length) {
			if (bytes[off] !== 0xff) { off++; continue }
			const marker = bytes[off + 1]
			const isSOF = marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc
			if (isSOF) return sane(dv.getUint16(off + 7, false), dv.getUint16(off + 5, false))
			if (marker === 0xd8 || marker === 0xd9 || (marker >= 0xd0 && marker <= 0xd7)) { off += 2; continue } // no length
			const segLen = dv.getUint16(off + 2, false)
			off += 2 + segLen
		}
	}

	return {}
}

/**
 * Decode a base64 (or data-url) string into bytes, in Node or the browser
 */
function base64ToBytes(strData: string): Uint8Array {
	const idxHdr = strData.indexOf('base64,')
	const strB64 = idxHdr > -1 ? strData.substring(idxHdr + 'base64,'.length) : strData

	if (typeof Buffer !== 'undefined') return new Uint8Array(Buffer.from(strB64, 'base64'))

	const strBin = atob(strB64)
	const bytes = new Uint8Array(strBin.length)
	for (let idx = 0; idx < strBin.length; idx++) bytes[idx] = strBin.charCodeAt(idx)
	return bytes
}

/**
 * Size images added without `w`/`h` to their natural dimensions (issue #34)
 * @note must run after `encodeSlideMediaRels` has resolved - it reads the encoded image bytes
 * @param {PresSlide | SlideLayout} layout - slide layout
 */
export function applyNaturalImageSizes(layout: PresSlide | SlideLayout): void {
	layout._slideObjects
		.filter(obj => obj._type === SLIDE_OBJECT_TYPES.image && obj.options?._sizeFromImage)
		.forEach(obj => {
			const strData = layout._relsMedia.find(rel => rel.rId === obj.imageRid)?.data
			if (!obj.options || typeof strData !== 'string' || !strData || strData === IMG_BROKEN) return
			// An image bound to a placeholder inherits the placeholder's w/h (slide XML resolves it); sizing it
			// to its natural pixel dims instead would collapse it to ~px/96 inches (issue #996).
			if (obj.options.placeholder) return
			try {
				const dims = imageDimensions(base64ToBytes(strData))
				if (dims.width && dims.height) {
					obj.options.w = dims.width / IMAGE_DPI
					obj.options.h = dims.height / IMAGE_DPI
				}
			} catch (_ex) {
				// Unreadable/unsupported image: keep the 1x1 inch default
			}
		})
}

/**
 * Encode Image/Audio/Video into base64
 * @param {PresSlide | SlideLayout} layout - slide layout
 * @return {Promise} promise
 */
export function encodeSlideMediaRels(layout: PresSlide | SlideLayout): Array<Promise<string>> {
	// STEP 1: Detect real Node runtime once
	const isNode = typeof process !== 'undefined' && !!process.versions?.node && process.release?.name === 'node'
	// These will be filled only when we’re in Node
	let fs: typeof import('node:fs') | undefined
	let https: typeof import('node:https') | undefined
	let http: typeof import('node:http') | undefined

	// STEP 2: Lazy-load Node built-ins if needed
	const loadNodeDeps = isNode
		? async () => {
			; ({ default: fs } = await import('node:fs')); ({ default: https } = await import('node:https')); ({ default: http } = await import('node:http'))
		}
		: async () => { }
	// Immediately start it when we know we’re in Node
	if (isNode) loadNodeDeps()

	// STEP 3: Prepare promises list
	const imageProms: Array<Promise<string>> = []

	// A: Capture all audio/image/video candidates for encoding (filtering online/pre-encoded)
	const candidateRels = layout._relsMedia.filter(
		rel => rel.type !== 'online' && !rel.data && (!rel.path || (rel.path && !rel.path.includes('preencoded')))
	)

	// B: PERF: Mark dupes (same `path`) to avoid loading the same media over-and-over!
	const unqPaths: string[] = []
	candidateRels.forEach(rel => {
		const relPath = rel.path ?? ''
		if (!unqPaths.includes(relPath)) {
			rel.isDuplicate = false
			unqPaths.push(relPath)
		} else {
			rel.isDuplicate = true
		}
	})

	// STEP 4: Read/Encode each unique media item
	candidateRels
		.filter(rel => !rel.isDuplicate)
		.forEach(rel => {
			imageProms.push(
				(async () => {
					if (!https) await loadNodeDeps()

					const relPath = rel.path ?? ''

					// ────────────  NODE LOCAL FILE  ────────────
					if (isNode && fs && relPath.indexOf('http') !== 0) {
						try {
							const svgFill = typeof rel.fill?.color === 'string' ? rel.fill.color : undefined
							// Martin-N: SVG recolor needs UTF-8 text, not binary
							if (svgFill && (rel.type === 'image/svg+xml' || rel.extn === 'svg')) {
								const svgText = applySvgFillColor(fs.readFileSync(relPath, 'utf8'), svgFill)
								rel.data = Buffer.from(svgText, 'utf8').toString('base64')
							} else {
								const bitmap = fs.readFileSync(relPath)
								rel.data = Buffer.from(bitmap).toString('base64')
								if (svgFill && typeof rel.data === 'string') {
									rel.data = applySvgFillToDataUrl(rel.data, svgFill)
								}
							}
							candidateRels
								.filter(dupe => dupe.isDuplicate && dupe.path === rel.path)
								.forEach(dupe => (dupe.data = rel.data))
							return 'done'
						} catch (ex) {
							rel.data = IMG_BROKEN
							candidateRels
								.filter(dupe => dupe.isDuplicate && dupe.path === rel.path)
								.forEach(dupe => (dupe.data = rel.data))
							throw new Error(`ERROR: Unable to read media: "${rel.path}"\n${String(ex)}`)
						}
					}

					// ────────────  NODE HTTP(S)  ────────────
					if (isNode && https && http && relPath.startsWith('http')) {
						const httpMod = relPath.startsWith('http://') ? http : https
						return await new Promise<string>((resolve, reject) => {
							const fail = (msg: string): void => {
								rel.data = IMG_BROKEN
								candidateRels
									.filter(dupe => dupe.isDuplicate && dupe.path === rel.path)
									.forEach(dupe => (dupe.data = rel.data))
								reject(new Error(msg))
							}
							const req = httpMod.get(relPath, res => {
								const status = res.statusCode ?? 0
								if (status < 200 || status > 299) {
									res.resume() // drain so the socket is freed
									fail(`ERROR! Unable to load image (HTTP ${status}): ${rel.path}`)
									return
								}
								let raw = ''
								res.setEncoding('binary') // IMPORTANT: Only binary encoding works
								res.on('data', chunk => (raw += chunk))
								res.on('end', () => {
									rel.data = Buffer.from(raw, 'binary').toString('base64')
									candidateRels
										.filter(dupe => dupe.isDuplicate && dupe.path === rel.path)
										.forEach(dupe => (dupe.data = rel.data))
									resolve('done')
								})
								res.on('error', () => fail(`ERROR! Unable to load image (response): ${rel.path}`))
							})
							// NOTE: without this, a DNS/TLS/connection failure emits an unhandled 'error' and kills the process
							req.on('error', ex => fail(`ERROR! Unable to load image (request): ${rel.path}\n${String(ex)}`))
						})
					}

					// ────────────  BROWSER  ────────────
					return await new Promise<string>((resolve, reject) => {
						// A: build request
						const xhr = new XMLHttpRequest()
						xhr.onload = () => {
							// status 0 = non-HTTP schemes (file://); anything outside 2xx is an error page, not image bytes
							if (xhr.status !== 0 && (xhr.status < 200 || xhr.status > 299)) {
								rel.data = IMG_BROKEN
								candidateRels
									.filter(dupe => dupe.isDuplicate && dupe.path === rel.path)
									.forEach(dupe => (dupe.data = rel.data))
								reject(new Error(`ERROR! HTTP status ${xhr.status} loading image: ${rel.path}`))
								return
							}
							const reader = new FileReader()
							reader.onloadend = () => {
								if (typeof reader.result === 'string') rel.data = reader.result
								candidateRels
									.filter(dupe => dupe.isDuplicate && dupe.path === rel.path)
									.forEach(dupe => (dupe.data = rel.data))
								if (!rel.isSvgPng) {
									resolve('done')
								} else {
									createSvgPngPreview(rel)
										.then(() => resolve('done'))
										.catch(reject)
								}
							}
							reader.readAsDataURL(xhr.response)
						}
						xhr.onerror = () => {
							rel.data = IMG_BROKEN
							candidateRels
								.filter(dupe => dupe.isDuplicate && dupe.path === rel.path)
								.forEach(dupe => (dupe.data = rel.data))
							reject(new Error(`ERROR! Unable to load image (xhr.onerror): ${rel.path}`))
						}
						// B: execute request
						xhr.open('GET', relPath)
						xhr.responseType = 'blob'
						xhr.send()
					})
				})(),
			)
		})

	// STEP 5: SVG-PNG previews
	// ......: "SVG:" base64 data still requires a png to be generated
	// ......: (`isSvgPng` flag this as the preview image, not the SVG itself)
	layout._relsMedia
		.filter(rel => rel.isSvgPng && rel.data)
		.forEach(rel => {
			// NOTE: must push synchronously - the caller snapshots this array as soon as we return
			if (isNode) {
				// SVG is not supported in Node (more info: https://github.com/gitbrent/PptxGenJS/issues/401)
				rel.data = IMG_BROKEN
				imageProms.push(Promise.resolve('done'))
			} else {
				imageProms.push(createSvgPngPreview(rel))
			}
		})

	return imageProms
}

/**
 * Create SVG preview image
 * @param {ISlideRelMedia} rel - slide rel
 * @return {Promise} promise
 */
async function createSvgPngPreview(rel: ISlideRelMedia): Promise<string> {
	return await new Promise((resolve, reject) => {
		// A: Create
		const image = new Image()

		// Shared error handler (also wired to `image.onerror`); the reason string is informational only
		const handleError = (): void => {
			rel.data = IMG_BROKEN
			reject(new Error(`ERROR! Unable to load image (image.onerror): ${rel.path}`))
		}

		// B: Set onload event
		image.onload = () => {
			// First: Check for any errors: This is the best method (try/catch wont work, etc.)
			if (image.width + image.height === 0) {
				handleError()
			}
			const canvas = document.createElement('canvas')
			const ctx = canvas.getContext('2d')
			if (!ctx) {
				handleError()
				return
			}
			canvas.width = image.width
			canvas.height = image.height
			ctx.drawImage(image, 0, 0)
			// Users running on local machine will get the following error:
			// "SecurityError: Failed to execute 'toDataURL' on 'HTMLCanvasElement': Tainted canvases may not be exported."
			// when the canvas.toDataURL call executes below.
			try {
				rel.data = canvas.toDataURL(rel.type)
				resolve('done')
			} catch (_ex) {
				handleError()
			}
		}
		image.onerror = handleError

		// C: Load image
		image.src = typeof rel.data === 'string' ? rel.data : IMG_BROKEN
	})
}
