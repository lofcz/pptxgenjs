import { defineConfig } from '@rspress/core'

const pagesBase = process.env.PAGES_BASE_PATH?.trim()
const base = !pagesBase || pagesBase === '/' ? '/' : pagesBase.endsWith('/') ? pagesBase : `${pagesBase}/`

export default defineConfig({
	root: 'docs',
	title: 'PptxGenJS',
	description: 'Create PowerPoint presentations with JavaScript. Maintained by Matěj Lofcz Štágl.',
	base,
	logoText: 'PptxGenJS',
	outDir: 'doc_dist',
	markdown: {
		shiki: {
			langAlias: {
				HTML: 'html',
			},
		},
	},
	themeConfig: {
		nav: [
			{ text: 'Docs', link: '/introduction' },
			{ text: 'Quick Start', link: '/quick-start' },
			{ text: 'API', link: '/api-text' },
			{ text: 'Migrate', link: '/migration' },
		],
		sidebar: {
			'/': [
				{ text: 'Introduction', link: '/introduction' },
				{
					text: 'Get Started',
					collapsed: false,
					items: [
						{ text: 'Quick Start', link: '/quick-start' },
						{ text: 'Installation', link: '/installation' },
						{ text: 'Migrating to pptxgenjs-plus', link: '/migration' },
						{ text: 'Compatibility', link: '/compatibility' },
						{ text: 'Integration', link: '/integration' },
					],
				},
				{
					text: 'Usage',
					collapsed: false,
					items: [
						{ text: 'Creating a Presentation', link: '/usage-pres-create' },
						{ text: 'Presentation Options', link: '/usage-pres-options' },
						{ text: 'Adding a Slide', link: '/usage-add-slide' },
						{ text: 'Slide Options', link: '/usage-slide-options' },
						{ text: 'Saving a Presentation', link: '/usage-saving' },
					],
				},
				{
					text: 'Features',
					collapsed: false,
					items: [
						{ text: 'HTML to PowerPoint', link: '/html-to-powerpoint' },
						{ text: 'Masters & Placeholders', link: '/masters' },
						{ text: 'Sections', link: '/sections' },
						{ text: 'Shapes & Schemes', link: '/shapes-and-schemes' },
						{ text: 'Speaker Notes', link: '/speaker-notes' },
					],
				},
				{
					text: 'API Reference',
					collapsed: false,
					items: [
						{ text: 'Charts', link: '/api-charts' },
						{ text: 'Images', link: '/api-images' },
						{ text: 'Media', link: '/api-media' },
						{ text: 'Shapes', link: '/api-shapes' },
						{ text: 'Tables', link: '/api-tables' },
						{ text: 'Text', link: '/api-text' },
					],
				},
				{
					text: 'Troubleshooting',
					collapsed: true,
					items: [
						{ text: '"Needs Repair" Errors', link: '/needs-repair-errors' },
						{ text: 'Deprecated Features', link: '/deprecated' },
					],
				},
				{
					text: 'Maintainers',
					collapsed: true,
					items: [{ text: 'Rendering Architecture', link: '/maintainer-rendering' }],
				},
			],
		},
		socialLinks: [
			{
				icon: 'github',
				mode: 'link',
				content: 'https://github.com/lofcz/PptxGenJS',
			},
		],
		footer: {
			message:
				'Released under the MIT License.<br/>Copyright © 2015-present Brent Ely · © 2026-present Matěj Lofcz Štágl',
		},
		editLink: {
			docRepoBaseUrl: 'https://github.com/lofcz/PptxGenJS/tree/master/docs',
			text: 'Edit this page on GitHub',
		},
	},
})
