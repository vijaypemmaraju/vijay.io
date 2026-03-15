/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			fontFamily: {
				display: ['Bricolage Grotesque', 'system-ui', 'sans-serif'],
				mono: ['IBM Plex Mono', 'Menlo', 'Monaco', 'monospace'],
			},
		},
		fontFamily: {
			sans: ['DM Sans', 'system-ui', 'sans-serif'],
		},
	},
	daisyui: {
		themes: ["business"],
	},
	plugins: [require('daisyui')],
}
