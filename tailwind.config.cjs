import colors from './src/lib/ui/colors';

const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			colors: {
				...colors
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

export default config;
