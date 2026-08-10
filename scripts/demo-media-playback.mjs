/**
 * Demo: media autoplay/loop/fullScreen/mute (ECMA-376 §19.5 CT_TLMediaNode).
 * Builds a real PPTX with an embedded video + audio and prints the timing-tree XML.
 * Run: node scripts/demo-media-playback.mjs
 */
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import PptxGenJS from '../src/bld/pptxgen.es.js'
const { JSZip } = createRequire(import.meta.url)('@node-projects/jszip')

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const videoData = `data:video/mp4;base64,${readFileSync(join(root, 'scripts', 'sample.mp4')).toString('base64')}`
const cover = `data:image/png;base64,${readFileSync(join(root, 'scripts', 'sample-cover.png')).toString('base64')}`
// Real audio track extracted from the sample video (stub MP3 was unplayable in PowerPoint).
const audioData = `data:audio/mp3;base64,${readFileSync(join(root, 'scripts', 'sample.mp3')).toString('base64')}`

const pptx = new PptxGenJS()
pptx.defineLayout({ name: 'WIDE', width: 10, height: 5.625 })
pptx.layout = 'WIDE'

// Slide 1: autoplay + loop video (embedded)
const s1 = pptx.addSlide()
s1.background = { color: '1a1a2e' }
s1.addText('Autoplay + Loop Video', { x: 0.5, y: 0.3, w: 9, h: 0.6, fontSize: 28, color: 'FFFFFF', bold: true })
s1.addMedia({ type: 'video', data: videoData, cover, x: 2, y: 1.2, w: 6, h: 3.4, autoplay: true, loop: true })

// Slide 2: full-screen muted autoplay video
const s2 = pptx.addSlide()
s2.addText('Fullscreen Muted Autoplay', { x: 0.5, y: 0.3, w: 9, h: 0.6, fontSize: 28, color: '333333', bold: true })
s2.addMedia({ type: 'video', data: videoData, cover, x: 2, y: 1.2, w: 6, h: 3.4, autoplay: true, fullScreen: true, mute: true })

// Slide 3: on-click video + looping narration audio
const s3 = pptx.addSlide()
s3.addText('Click-to-play + Looping Audio', { x: 0.5, y: 0.3, w: 9, h: 0.6, fontSize: 24, bold: true })
s3.addMedia({ type: 'video', data: videoData, cover, x: 1, y: 1.3, w: 4, h: 2.3 }) // no playback opts → plays on click
s3.addMedia({ type: 'audio', data: audioData, x: 6, y: 1.5, w: 1.2, h: 1.2, autoplay: true, loop: true, isNarration: true })

await pptx.writeFile({ fileName: join(root, 'out', 'demo-media-playback.pptx') })

const zip = await JSZip.loadAsync(readFileSync(join(root, 'out', 'demo-media-playback.pptx')))
for (const name of ['ppt/slides/slide1.xml', 'ppt/slides/slide2.xml', 'ppt/slides/slide3.xml']) {
	const xml = await zip.file(name).async('string')
	const timing = /<p:timing>[\s\S]*?<\/p:timing>/.exec(xml)
	console.log(`\n=== ${name} ===`)
	console.log(timing ? timing[0] : '(no timing tree)')
	if (name.endsWith('slide3.xml')) {
		console.log('audioFile?', xml.includes('<a:audioFile'))
		console.log('videoFile count', (xml.match(/<a:videoFile/g) || []).length)
	}
}
console.log('\nWrote out/demo-media-playback.pptx')
