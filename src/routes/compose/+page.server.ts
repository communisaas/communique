import { TINYMCE_KEY, FINGERPRINTJS_KEY } from '$env/static/private';

/** @type {import('./$types').PageLoad} */
export function load() {
	return {
		editorKey: TINYMCE_KEY,
		profilerKey: FINGERPRINTJS_KEY
	};
}
