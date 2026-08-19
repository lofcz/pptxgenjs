import { describe, expect, test } from "bun:test"
import { JSZip } from "@node-projects/jszip"
import { Deck, Group, Rect, Slide, Table, TableCell, TableRow, Text } from "../src/index.ts"
import { pptxElement } from "../src/jsx-runtime.ts"
import { createPptx, validateDeck, writePptx } from "../src/render.ts"

describe("pptxgenjs-plus-jsx", () => {
	test("validates and writes a one-slide deck", async () => {
		const deck = pptxElement(
			Deck,
			{ title: "Smoke" },
			pptxElement(
				Slide,
				{ background: { color: "FFFFFF" } },
				pptxElement(Text, { x: 0.5, y: 0.5, w: 8, h: 1, fontSize: 24 }, "Hello from JSX"),
			),
		)

		const issues = await validateDeck(deck)
		expect(issues.filter((issue) => issue.level === "error")).toEqual([])

		const buffer = await writePptx(deck, { outputType: "nodebuffer" })
		expect(Buffer.isBuffer(buffer)).toBe(true)
		expect((buffer as Buffer).subarray(0, 2).toString()).toBe("PK")
	})

	test("Group emits p:grpSp with group-relative children", async () => {
		const deck = pptxElement(
			Deck,
			{ title: "Group" },
			pptxElement(
				Slide,
				{},
				pptxElement(
					Group,
					{ x: 1, y: 1, w: 4, h: 3 },
					pptxElement(Rect, { x: 0, y: 0, w: 1, h: 1, fill: { color: "FF0000" } }),
					pptxElement(Text, { x: 0.2, y: 0.2, w: 2, h: 0.5 }, "inside"),
				),
			),
		)

		const pptx = await createPptx(deck)
		const zip = await JSZip.loadAsync((await pptx.write({ outputType: "nodebuffer" })) as Buffer)
		const xml = await zip.file("ppt/slides/slide1.xml")?.async("string")
		expect(xml).toBeTruthy()
		expect(xml!).toContain("<p:grpSp>")
		expect(xml!).toContain("<p:nvGrpSpPr>")
		expect(xml!).toMatch(/<a:chOff x="0" y="0"\/>/)
		expect(xml!).toContain("</p:grpSp>")
	})

	test("Table inside Group is rejected", async () => {
		const deck = pptxElement(
			Deck,
			{},
			pptxElement(
				Slide,
				{},
				pptxElement(
					Group,
					{ x: 1, y: 1, w: 4, h: 3 },
					pptxElement(
						Table,
						{ x: 0, y: 0, w: 3 },
						pptxElement(TableRow, {}, pptxElement(TableCell, {}, "nope")),
					),
				),
			),
		)

		await expect(createPptx(deck)).rejects.toThrow(/cannot be placed inside <Group>/)
	})
})
