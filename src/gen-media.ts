/**
 * PptxGenJS: Media Methods
 */

import { imageSize } from 'image-size'
import { IMG_BROKEN, SLIDE_OBJECT_TYPES } from './core-enums'
import { PresSlide, SlideLayout, ISlideRelMedia } from './core-interfaces'

/** Images are measured in pixels; PowerPoint slide dimensions are inches at 96 DPI */
const IMAGE_DPI = 96

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
			try {
				const dims = imageSize(base64ToBytes(strData))
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
							const bitmap = fs.readFileSync(relPath)
							rel.data = Buffer.from(bitmap).toString('base64')
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
