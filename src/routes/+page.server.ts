import { PrismaClient } from '@prisma/client';

const objectMapper = new PrismaClient();

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ parent }) {
	// TODO: compound queries
	// TODO: re-render on selectable change
	const { loudestTopics } = await parent();
	const loudestTopicEmails = objectMapper.email.findMany({
		where: {
			topic_list: {
				has: loudestTopics[0].name
			}
		},
		take: 10
	});
	const biggestRecipients = await objectMapper.recipient.findMany({
		orderBy: [
			{
				email_read_count: 'desc'
			}
		],
		take: 3
	});
	const biggestRecipientEmails = objectMapper.email.findMany({
		where: {
			recipient_list: {
				has: biggestRecipients[0].address
			}
		},
		take: 10
	});
	const spotlightEmails = objectMapper.email.findMany({
		take: 10
	});
	return {
		templateList: [
			{
				type: 'panel',
				selectableName: 'topic',
				header: 'Loudest voices in',
				alignment: 'right',
				cardList: await loudestTopicEmails
			},
			{
				type: 'panel',
				selectableName: 'spotlight',
				header: 'Spotlight on',
				alignment: 'left',
				cardList: await spotlightEmails
			},
			{
				type: 'panel',
				selectableName: 'recipient',
				header: 'Mail sent to',
				alignment: 'right',
				cardList: await biggestRecipientEmails
			}
		]
	};
}
