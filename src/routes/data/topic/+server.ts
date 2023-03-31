import { error } from '@sveltejs/kit';
import { findMany } from '$lib/database';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	const options = {
		where: Array.from(url.searchParams.entries()).reduce(
			(filter: Criteria, [field, value]: string[]) => {
				let criteria;
				switch (field) {
					case 'name': {
						criteria = { has: value };
						break;
					}
				}
				if (!criteria) throw Error('Invalid field name');
				filter[field] = criteria;
				console.log(filter);
				return filter;
			},
			{} as Criteria
		),
		take: 10
	};
	const topicList = await findMany('topic', options);

	console.log(topicList);
	return new Response(JSON.stringify(topicList));
}
