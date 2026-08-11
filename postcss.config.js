// Tailwind 4 ships its PostCSS integration as a separate package rather than as
// the `tailwindcss` plugin itself, and folds vendor prefixing in, so
// autoprefixer is no longer part of this chain.
module.exports = {
	plugins: {
		"@tailwindcss/postcss": {},
	},
};
