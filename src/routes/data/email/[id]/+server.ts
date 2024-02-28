import { AUTH_SECRET } from '$env/static/private';
import { find, objectMapper } from '$lib/data/database';
import { decode, getToken } from '@auth/core/jwt';
import type { Prisma } from '@prisma/client';
import type { DefaultArgs } from '@prisma/client/runtime/library';
import { error } from '@sveltejs/kit';

function isUUID(s: string) {
	return new RegExp(
		'^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$'
	).test(s);
}

/** @type {import('./$types').RequestHandler} */
export async function GET({ params, url }) {
	const whereCriteria: Criteria = {};

	if (isUUID(params.id)) {
		whereCriteria.rowid = { equals: params.id };
	} else {
		whereCriteria.shortid = { equals: params.id };
	}

	const options = { where: whereCriteria };
	const email = await find('email', options);
	return new Response(JSON.stringify(email[0]));
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ params, request, cookies, url }) {
	// HTTPS-only should be enforced on host, this is a developer convenience
	const authCookieName =
		url.protocol === 'https:' ? '__Secure-authjs.session-token' : 'authjs.session-token';
	const jwt = await decode({
		token: cookies.get(authCookieName),
		secret: process.env.AUTH_SECRET || AUTH_SECRET,
		salt: authCookieName
	});

	if (!jwt) {
		return new Response('Invalid token', { status: 401 });
	}
	if (
		jwt.email !== request.headers.get('sender-email') &&
		jwt.email !== request.headers.get('user-email')
	) {
		return new Response('Email address mismatch', { status: 403 });
	}

	const whereCriteria = { shortid: params.id };
	try {
		// case: increment send count
		if (request.headers.get('increment-send') === 'true' && request.headers.get('sender-email')) {
			const senderEmail = request.headers.get('sender-email') as string;

			const emailOptions: Prisma.emailUpdateArgs = { where: whereCriteria, data: {} };
			const userOptions: Prisma.userUpdateArgs = {
				where: { email: senderEmail },
				data: {}
			};

			const sentEmailList =
				(
					await objectMapper.user.findUnique({
						where: { email: senderEmail },
						select: { sent_content_list: true }
					})
				)?.sent_content_list ?? [];

			if (!sentEmailList.includes(params.id)) {
				const email = await objectMapper.email.findFirst({ where: whereCriteria });
				if (!email) {
					return new Response('Email not found', { status: 404 });
				}
				const topicOptions: Clause = {
					where: { name: { in: email.topic_list } }
				};
				topicOptions.data = {
					email_sent_count: { increment: 1 }
				};
				emailOptions.data = {
					send_count: { increment: 1 },
					last_updated: new Date().toISOString()
				};
				userOptions.data = { sent_content_list: { push: params.id } };
				// TODO merge into single query once cockroachdb supports record types https://github.com/cockroachdb/cockroach/issues/70099?version=v23.1
				await objectMapper.$transaction([
					objectMapper.user.update({ ...userOptions }),
					objectMapper.email.update({ ...emailOptions }),
					objectMapper.topic.updateMany({ ...topicOptions })
				]);
				return new Response('incremented');
			}

			// case: add email to ignore list
		} else if (
			request.headers.get('remove-email-content') === 'true' &&
			request.headers.get('user-email')
		) {
			const userEmail = request.headers.get('user-email') as string;
			const userOptions: Clause = {
				where: { email: userEmail }
			};
			userOptions.data = { ignored_content_list: { push: params.id } }; // push shortid
			await objectMapper.user.update({ ...userOptions });

			// case: update email id
		} else if (
			request.headers.get('update-id') === 'true' &&
			request.headers.get('user-email') &&
			request.body
		) {
			const emailOptions: Clause = {
				where: { shortid: params.id }
			};
			const newID = await request.text();
			emailOptions.data = { shortid: { set: newID } };

			await objectMapper.email.update({ ...emailOptions });

			// case: report email
		} else if (
			request.headers.get('report-email-content') === 'true' &&
			request.headers.get('user-email') &&
			request.body
		) {
			const userEmail = request.headers.get('user-email') as string;
			const issueOptions: Clause = {
				where: { added_by_email_id: { added_by: userEmail, email_id: params.id } }
			};
			const formData = await request.json();

			let upsertable;
			for (const [key, value] of Object.entries(formData)) {
				if (key === 'reportType' && value) {
					upsertable = {
						type: value
					};
				} else if (key === 'customReport' && value) {
					upsertable = {
						description: value
					};
				}
			}
			issueOptions.create = {
				user: {
					connect: { email: userEmail }
				},
				email: {
					connect: { shortid: params.id }
				},
				...upsertable
			};
			issueOptions.update = upsertable;
			await objectMapper.issue.upsert({ ...issueOptions });
		}
	} catch (e) {
		// TODO error monitoring
		console.error(e);
		return new Response(e.code, { status: 500 });
	}
	return new Response('ok');
}
