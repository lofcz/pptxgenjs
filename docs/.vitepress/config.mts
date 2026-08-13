import { defineConfig } from 'vitepress'

// Docs for the NEOMA fork of PptxGenJS - deployed to GitHub Pages.
// Content lives as plain markdown in ./docs so feature PRs update docs in the same commit.
export default defineConfig({
	title: 'PptxGenJS · NEOMA',
	description: 'Create PowerPoint presentations with JavaScript. NEOMA-maintained fork of PptxGenJS.',
	base: '/',
	head: [
		['link', { rel: 'icon', type: 'image/svg+xml', href: '/neoma-icon.svg' }],
	],
	themeConfig: {
		logo: { light: '/neoma-icon.svg', dark: '/neoma-icon-dark.svg' },
		nav: [
			{ text: 'Docs', link: '/introduction' },
			{ text: 'Quick Start', link: '/quick-start' },
			{ text: 'API', link: '/api-text' },
			{ text: 'Migrate', link: '/migration' },
		],
		sidebar: [
			{ text: 'Introduction', link: '/introduction' },
			{
				text: 'Get Started',
				collapsed: false,
				items: [
					{ text: 'Quick Start', link: '/quick-start' },
					{ text: 'Installation', link: '/installation' },
					{ text: 'Migrating from pptxgenjs', link: '/migration' },
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
		socialLinks: [{ icon: 'github', link: 'https://github.com/NeomaVerwaltung/PptxGenJS' }],
		search: { provider: 'local' },
		outline: { level: [2, 3] },
		footer: {
			message:
				'Released under the MIT License. · <a href="https://www.neo-ma.de/impressum">Impressum</a> · <a href="https://www.neo-ma.de/datenschutz">Datenschutz</a>',
			copyright: 'Copyright © 2015-present Brent Ely · © 2026-present NEOMA GmbH',
		},
		editLink: {
			pattern: 'https://github.com/NeomaVerwaltung/PptxGenJS/edit/master/docs/:path',
			text: 'Edit this page on GitHub',
		},
	},
})
