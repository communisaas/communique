import {
	TINYMCE_KEY,
	FINGERPRINTJS_KEY,
	FINGERPRINTJS_SERVER_KEY,
	FINGERPRINTJS_URL
} from '$env/static/private';
import type { PageLoad } from '../$types';
import type { RequestEvent } from './$types';

import { PrismaClient } from '@prisma/client';
import { fail } from '@sveltejs/kit';

export const load: PageLoad = () => {
	return {
		editorKey: TINYMCE_KEY,
		profilerKey: FINGERPRINTJS_KEY
	};
};

class EmailForm {
	inputFields: Record<string, string | string[] | number> = {
		subject: '',
		body: '',
		topic_list: [],
		recipient_list: [],
		set topic(tagList: string) {
			this.topic_list = tagList.split('␞');
		},
		set recipient(tagList: string) {
			this.recipient_list = tagList.split('␞');
		}
	};
	defaultMetrics = { open_count: 0, clipboard_count: 0, send_count: 0, read_count: 0 };
	emailForm: FormData;

	constructor(emailForm: FormData) {
		this.emailForm = emailForm;
	}

	validate() {
		for (const field of Object.keys(this.inputFields)) {
			// use setters to handle delimited strings
			if (field.includes('list')) continue;
			const value = this.emailForm.get(field);
			if (value != null || value != undefined) this.inputFields[field] = value.toString();
			else throw new Error(`${field} is empty`);
		}
	}
}

/** @type {import('./$types').Actions} */
export const actions = {
	publish: async ({ cookies, request }: RequestEvent) => {
		const formSubmission = await request.formData();
		const objectMapper = new PrismaClient();
		const profileRequestID: string | undefined = formSubmission.get('profileRequestID')?.toString();

		const response = await fetch(`${FINGERPRINTJS_URL}/events/${profileRequestID}`, {
			headers: { 'Auth-API-Key': FINGERPRINTJS_SERVER_KEY }
		});

		const profile = (await response.json()).products.identification.data;
		if (profile) {
			formSubmission.delete('profileRequestId');
		} else return fail(400, { name: 'profile', missing: true });

		const email = new EmailForm(formSubmission);
		try {
			email.validate();
		} catch (error) {
			fail(400, { name: error, missing: true });
		}

		await objectMapper.$transaction([
			// TODO recipient, topic

			objectMapper.author.upsert({
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
			}),
			// emailForm.inputFields.recipient_list.map(address => objectMapper.recipient.upsert({
			// 	where: {}
			// }))
			objectMapper.email.create({
				data: {
					...email.inputFields,
					...email.defaultMetrics,
					author: {
						connect: {
							rowid: profile.visitorId
						}
					}
				}
			})
		]);

		return { success: true };
	}
};
