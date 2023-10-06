import { find, objectMapper, update } from '$lib/data/database';
import { error } from '@sveltejs/kit';

function isUUID(s: string) {
	return new RegExp(
		'^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$'
	).test(s);
}

/** @type {import('./$types').RequestHandler} */
export async function GET({ params, url }) {
	const whereCriteria: Criteria = {};

	if (isUUID(params.slug)) {
		whereCriteria.rowid = { equals: params.slug };
	} else {
		whereCriteria.shortid = { equals: params.slug };
	}

	const options = { where: whereCriteria };
	const email = await find('email', options);
	return new Response(JSON.stringify(email[0]));
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ params, request }) {
	const whereCriteria: Criteria = {};
	whereCriteria.shortid = params.slug;

	if (request.headers.get('increment-send') === 'true' && request.headers.get('sender-email')) {
		const senderEmail = request.headers.get('sender-email') as string;

		const emailOptions: Clause = { where: whereCriteria };
		const userOptions: Clause = {
			where: { email: senderEmail }
		};

		emailOptions.data = {
			send_count: { increment: 1 }
		};
		userOptions.data = { sent_email_list: { push: params.slug } }; // push shortid
		// TODO merge into single query once cockroachdb supports record types https://github.com/cockroachdb/cockroach/issues/70099?version=v23.1
		const result = await objectMapper.$transaction([
			objectMapper.email.update({ ...emailOptions }),
			objectMapper.user.update({ ...userOptions })
		]);

		// options.data = {
		// 	send_count: { increment: 1 },
		// 	user: {
		// 		where: { email: senderEmail },
		// 		data: { sent_email_list: { push: whereCriteria.rowid } }
		// 	}
		// };

		// console.log(await update('email', emailOptions, 'unique'));
	}
	return new Response('ok');
}
