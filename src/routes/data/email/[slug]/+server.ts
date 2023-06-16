// TODO endpoint to handle short IDs for email: https://www.npmjs.com/package/hashids
import { find } from '$lib/database';
import { error } from '@sveltejs/kit';

function isUUID(s: string) {
	return new RegExp(
		'^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$'
	).test(s);
}

/** @type {import('./$types').RequestHandler} */
export async function GET({ params }) {
	// TODO email criteria filters
	const options = isUUID(params.slug)
		? { where: { rowid: { equals: params.slug } } }
		: { where: { shortid: { equals: params.slug } } };

	const email = await find('email', options);
	return new Response(JSON.stringify(email[0]));
}
