import { AUTH_SECRET, TINYMCE_KEY } from '$env/static/private';
import { v4 as uuidv4 } from 'uuid';
import type { RequestEvent, PageServerLoad } from './$types';

import { objectMapper } from '$lib/data/database';
import { fail } from '@sveltejs/kit';
import { EmailForm } from '$lib/data/email';
import { decode } from '@auth/core/jwt';

/** @type {import('./$types').Actions} */
export const actions = {
	publish: async ({ request, url, cookies }: RequestEvent) => {
		const authCookieName =
			url.protocol === 'https:' ? '__Secure-authjs.session-token' : 'authjs.session-token';

		const jwt = await decode({
			token: cookies.get(authCookieName),
			secret: process.env.AUTH_SECRET || AUTH_SECRET,
			salt: authCookieName
		});

		if (!jwt) {
			return fail(401, { name: 'Invalid auth token!' });
		}

		// TODO filter compose submissions through openAI API:
		// 	- classify content risk & label --> ask action suggestion, hold off publishing
		//  if moderation pass:
		//  - suggest shortid --> ensure unique in database
		//  - suggest topics --> cross-examine existing topics
		//  - if variable subjects toggled: suggest

		// TODO geolocation scope

		const formSubmission = await request.formData();

		// const profileRequestID: string | undefined = formSubmission.get('profileRequestID')?.toString();

		// const response = await fetch(`${FINGERPRINTJS_APIURL}/events/${profileRequestID}`, {
		// 	headers: { 'Auth-API-Key': FINGERPRINTJS_SERVER_KEY }
		// });

		// const profile = (await response.json()).products.identification.data;
		// if (profile) {
		// 	formSubmission.delete('profileRequestId');
		// } else return fail(400, { name: 'profile', missing: true });

		// TODO email shortid creation
		const stagingID = uuidv4();
		if (!('shortid' in formSubmission.keys())) {
			formSubmission.set('shortid', stagingID.slice(-8));
		}
		for (const [field, value] of formSubmission.entries()) {
			console.log(field, value);
		}

		const emailForm = new EmailForm(
			formSubmission,
			formSubmission.get('author_email')?.toString() || ''
		);
		try {
			emailForm.validate();
		} catch (error) {
			return fail(400, { name: error.toString(), missing: true });
		}

		console.log('shortid', emailForm.inputFields.shortid);

		await objectMapper.$transaction(
			async (tx) => {
				const updateTime = new Date().toISOString();
				await tx.author.upsert({
					where: { email_address: emailForm.author_email },
					update: {
						last_updated: updateTime,
						email_id_list: {
							push: stagingID.slice(-8)
						}
					},
					create: {
						read_email_count: 0,
						sent_email_count: 0,
						open_email_count: 0,
						email_id_list: [stagingID.slice(-8)],
						user: {
							connect: {
								email: emailForm.author_email
							}
						}
					}
				});

				emailForm.inputFields.topic_list.map(
					async (topic) =>
						await tx.topic.upsert({
							where: { name: topic },
							create: {
								name: topic,
								last_updated: updateTime,
								added_by: emailForm.author_email,
								email_count: 1,
								email_open_count: 0,
								email_read_count: 0,
								email_sent_count: 0
							},
							update: {
								email_count: { increment: 1 },
								last_updated: updateTime
							}
						})
				);

				emailForm.inputFields.recipient_list.map(
					async (address) =>
						await tx.recipient.upsert({
							where: { address },
							create: {
								address: address,
								last_updated: updateTime,
								added_by: emailForm.author_email,
								email_count: 1,
								email_open_count: 0,
								email_read_count: 0,
								email_sent_count: 0
							},
							update: {
								email_count: { increment: 1 },
								last_updated: updateTime
							}
						})
				);

				// TODO duplicate email detection
				await tx.email.create({
					data: {
						...emailForm.inputFields,
						...emailForm.defaultMetrics,
						added_by: emailForm.author_email
					}
				});
			},
			{
				maxWait: 5000, // default: 2000
				timeout: 10000 // default: 5000
			}
		);

		return { type: 'success', status: 200, postID: stagingID.slice(-8) };
	}
};

export const load = (async () => {
	return {
		editorKey: process.env.TINYMCE_KEY || TINYMCE_KEY
	};
}) satisfies PageServerLoad;
