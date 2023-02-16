import { TINYMCEKEY } from '$env/static/private';
import type { PageLoad } from '../$types';

export const load: PageLoad = () => {
	return {
		key: TINYMCEKEY
	};
};
