/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: "class",
	content: ["./src/**/*.{ts,tsx}"],
	theme: {
		extend: {
			colors: {
				surface: {
					950: "#0a0a0f",
					900: "#111118",
					800: "#1c1c26",
					700: "#2a2a3a",
					600: "#3a3a4e",
				},
				accent: {
					DEFAULT: "#3b82f6",
					light: "#60a5fa",
					dim: "#1d4ed8",
				},
				positive: "#22c55e",
				negative: "#ef4444",
				neutral: "#a1a1aa",
			},
			fontFamily: {
				sans: ["var(--font-space-grotesk)", "sans-serif"],
			},
		},
	},
	plugins: [],
};
