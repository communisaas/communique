import { error } from '@sveltejs/kit';
import { findMany } from '$lib/database';

const emailFieldMap: FieldMap = {
	topic: 'topic_list',
	recipient: 'recipient_list'
};

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	console.log(url);
	const emailList = await findMany('email', url.searchParams, 10, emailFieldMap);

	console.log(emailList);
	return new Response(JSON.stringify(emailList));
}
