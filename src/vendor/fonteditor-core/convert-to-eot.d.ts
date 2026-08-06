/** Minimal TTF / OTF / WOFF → EOT converter (vendored fonteditor-core graph). */
export function convertToEot (
	type: 'ttf' | 'otf' | 'woff',
	fontBuffer: ArrayBuffer,
	options?: {
		hinting?: boolean
		inflate?: (data: number[]) => number[]
	},
): ArrayBuffer
