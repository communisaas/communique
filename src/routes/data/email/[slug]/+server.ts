// TODO endpoint to handle short IDs for email: https://www.npmjs.com/package/hashids
import { error } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export function GET({ url, params }) {
	console.log(params.slug);

	return new Response('done');
}
