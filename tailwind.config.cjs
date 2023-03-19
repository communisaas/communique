const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			colors: {
				paper: {
					500: 'hsl(224, 44%, 95%)',
					600: 'hsl(209, 36%, 86%)',
					700: 'rgb(202, 216, 228)'
				},
				larimarGreen: {
					500: '#C9FFE2',
					600: '#94D2BD'
				},
				artistBlue: '#002B3D',
				peacockFeather: {
					500: '#0A9396',
					600: '#005F73'
				},
				violet: { 500: '#9D79BC', 600: '#8E6C88', 700: '#48233C' }
			},
			boxShadow: {
				page: 'rgba(0, 0, 0, 0.1) 0px 4px 12px;',
				card: 'rgba(0, 0, 0, 0.16) 0px 1px 4px;',
				nav: ' -7px 0 6px -7px  rgba(0,0,0,0.45) inset;'
			},
			transitionProperty: {
				width: 'width'
			}
		}
	},

	plugins: []
};

module.exports = config;
