import objectMapper from '$lib/database';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ setHeaders }) {
	// TODO: compound queries, lazy load
	const loudestTopics = await objectMapper.topic.findMany({ take: 10 });

	setHeaders({
		'cache-control': 'public, max-age=3600'
	});
	const loudestTopicEmails = objectMapper.email.findMany({
		where: {
			topic_list: {
				has: loudestTopics[0].name
			}
		},
		take: 10
	});
	const spotlightEmails = objectMapper.email.findMany({
		take: 10
	});
	return {
		loudestTopics,
		template: {
			primary: {
				type: 'panel',
				selectable: 'topic',
				header: 'Loudest voices',
				focus: loudestTopics[0].name,
				alignment: 'end',
				cardList: await loudestTopicEmails
			},
			secondary: {
				type: 'panel',
				selectable: 'spotlight',
				header: 'Spotlight on',
				focus: 'custom',
				alignment: 'start',
				cardList: await spotlightEmails
			}
		}
	};
}
