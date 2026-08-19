import { describe, expect, test } from "bun:test"
import { Deck, Slide, Text } from "../src/index.ts"
import { pptxElement } from "../src/jsx-runtime.ts"
import { validateDeck, writePptx } from "../src/render.ts"

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
})
