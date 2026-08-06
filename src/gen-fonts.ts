/**
 * PptxGenJS: Embedded font helpers
 * Integrates liyao1520/pptx-embed-fonts into the export pipeline.
 * @see https://github.com/liyao1520/pptx-embed-fonts
 */

import type JSZip from 'jszip'
import type { AddFontOptions, EmbedFontType } from './core-interfaces'

/** Pending font registration prior to zip export */
export interface PendingEmbedFont {
	fontFace: string
	fontFile: ArrayBuffer
	fontType: EmbedFontType
}

/**
 * Convert registered fonts into OOXML `ppt/fonts/*.fntdata` + presentation.xml entries.
 * Mutates `zip` in place (before generateAsync) so we avoid a second pack/unpack.
 * Dynamically imports pptx-embed-fonts so consumers that never call addFont avoid the heavy font stack.
 */
export async function embedFontsIntoZip (zip: JSZip, fonts: PendingEmbedFont[]): Promise<void> {
	if (fonts.length === 0) return

	const { default: PPTXEmbedFonts } = await import('pptx-embed-fonts')
	const embedder = new PPTXEmbedFonts()
	await embedder.loadZip(zip)

	for (const font of fonts) {
		switch (font.fontType) {
			case 'ttf':
				await embedder.addFontFromTTF(font.fontFace, font.fontFile)
				break
			case 'otf':
				await embedder.addFontFromOTF(font.fontFace, font.fontFile)
				break
			case 'woff':
				await embedder.addFontFromWOFF(font.fontFace, font.fontFile)
				break
			case 'eot':
				await embedder.addFontFromEOT(font.fontFace, font.fontFile)
				break
			default:
				throw new Error(`Invalid font type "${String((font as AddFontOptions).fontType)}" - use ttf | otf | woff | eot`)
		}
	}

	await embedder.updateFiles()
}
