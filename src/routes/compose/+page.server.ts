import { TINYMCEKEY, FINGERPRINTJSKEY } from '$env/static/private';
import type { PageLoad } from '../$types';
import type { RequestEvent } from './$types';

export const load: PageLoad = () => {
	return {
		editorKey: TINYMCEKEY,
		profilerKey: FINGERPRINTJSKEY
	};
};

/** @type {import('./$types').Actions} */
export const actions = {
	publish: async ({ cookies, request }: RequestEvent) => {
		console.log(await request.formData());

		return { success: true };
	}
};
