import { error } from '@sveltejs/kit';
import { findMany } from '$lib/database';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	console.log(url);
	const topicList = await findMany('email', url.searchParams, 10);

	console.log(topicList);
	return new Response(JSON.stringify(topicList));
}
