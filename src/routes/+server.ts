import objectMapper from '$lib/database';
import type { RequestHandler } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export const GET: RequestHandler = async (event) => {
	console.log(await event.request.json());
	// const selectedTopicEmails = objectMapper.email.findMany({
	// 	where: {
	// 		topic_list: {
	// 			has: loudestTopics[0].name
	// 		}
	// 	},
	// 	take: 10
	// });
	const options: ResponseInit = {
		status: 418,
		headers: {
			X: 'Gon give it to ya'
		}
	};
	return new Response('Hello', options);
};
