import { FINGERPRINTJS_SERVER_KEY, FINGERPRINTJS_URL } from '$env/static/private';
import type { RequestEvent } from './$types';

import objectMapper from '$lib/database';
import { fail } from '@sveltejs/kit';

class EmailForm {
	inputFields: EmailFormInput = {
		subject: '',
		body: '',
		topic_list: [],
		recipient_list: []
	};

	set subject(line: string) {
		this.inputFields.subject = line;
	}
	set body(text: string) {
		this.inputFields.body = text;
	}
	set topic_list(tagList: string) {
		this.inputFields.topic_list = tagList.split('␞');
	}
	set recipient_list(tagList: string) {
		this.inputFields.recipient_list = tagList.split('␞');
	}

	defaultMetrics = { open_count: 0, clipboard_count: 0, send_count: 0, read_count: 0 };
	emailForm: FormData;

	constructor(emailForm: FormData) {
		this.emailForm = emailForm;
	}

	validate() {
		for (const field of Object.keys(this.inputFields)) {
			const value = this.emailForm.get(field);
			if (value != null || value != undefined) {
				(this as RawEmailForm)[field] = value.toString();
			} else throw new Error(`${field} is empty`);
		}
	}
}

/** @type {import('./$types').Actions} */
export const actions = {
	publish: async ({ cookies, request }: RequestEvent) => {
		const formSubmission = await request.formData();
		const profileRequestID: string | undefined = formSubmission.get('profileRequestID')?.toString();

		const response = await fetch(`${FINGERPRINTJS_URL}/events/${profileRequestID}`, {
			headers: { 'Auth-API-Key': FINGERPRINTJS_SERVER_KEY }
		});

		const profile = (await response.json()).products.identification.data;
		if (profile) {
			formSubmission.delete('profileRequestId');
		} else return fail(400, { name: 'profile', missing: true });

		const emailForm = new EmailForm(formSubmission);
		try {
			emailForm.validate();
		} catch (error) {
			fail(400, { name: error, missing: true });
		}

		await objectMapper.$transaction(async (tx) => {
			const updateTime = new Date().toISOString();
			await tx.author.upsert({
				where: {
					rowid: profile.visitorId
				},
				update: { profile },
				create: {
					rowid: profile.visitorId,
					profile: profile,
					read_email_count: 0,
					sent_email_count: 0,
					open_email_count: 0,
					is_registered: false
				}
			});

			emailForm.inputFields.topic_list.map(
				async (topic) =>
					await tx.topic.upsert({
						where: { name: topic },
						create: {
							name: topic,
							last_updated: updateTime,
							email_count: 1,
							email_open_count: 0,
							email_read_count: 0,
							email_sent_count: 0,
							author: {
								connect: {
									rowid: profile.visitorId
								}
							}
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
							email_count: 1,
							email_open_count: 0,
							email_read_count: 0,
							email_sent_count: 0,
							author: {
								connect: {
									rowid: profile.visitorId
								}
							}
						},
						update: {
							email_count: { increment: 1 },
							last_updated: updateTime
						}
					})
			);
			await tx.email.create({
				data: {
					...emailForm.inputFields,
					...emailForm.defaultMetrics,
					author: {
						connect: {
							rowid: profile.visitorId
						}
					}
				}
			});
		});

		return { success: true };
	}
};
