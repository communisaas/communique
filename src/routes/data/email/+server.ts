import { error } from '@sveltejs/kit';
import objectMapper from '$lib/database';

const emailFieldMap = {
	topic: 'topic_list',
	recipient: 'recipient_list'
};

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	console.log(url);
	const emailList = await objectMapper.email.findMany({
		where: {
			...Array.from(url.searchParams.entries()).reduce(
				(filter: { [field: string]: { has?: string } }, [field, value]: string[]) => {
					filter[emailFieldMap[field as keyof typeof emailFieldMap]] = {
						has: value
					};
					return filter;
				},
				{}
			)
		},
		take: 10
	});
	console.log(emailList);
	return new Response(JSON.stringify(emailList));
}
