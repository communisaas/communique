import sveltePreprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-auto';
import { sass } from 'svelte-preprocess-sass';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [
		sveltePreprocess({
			postcss: true,
			typescript: {
				transpileOnly: true
			},
			style: sass()
		})
	],

	kit: {
		adapter: adapter(),
		alias: {
			$components: 'src/components'
		}
	}
};

export default config;
