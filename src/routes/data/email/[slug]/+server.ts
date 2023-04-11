// TODO endpoint to handle short IDs for email: https://www.npmjs.com/package/hashids
import { find } from '$lib/database';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params }) {
	console.log(params.slug);
	const options = {
		where: {
			OR: [
				{
					rowid: { equals: params.slug }
				},
				{
					shortid: { equals: params.slug }
				}
			]
		}
	};
	const email = await find('email', options);
	return new Response(JSON.stringify(email[0]));
}
