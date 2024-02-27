/** @type {import('tailwindcss').Config} */
module.exports = {
	
	content: [
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',

		// or if using 'src' directory:
		'./src/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
            colors: {
                'primary': '#2086f3',
                'background': '#012041',
            }
		},
	},
	plugins: [],
}
