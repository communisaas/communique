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
		added_by: '',
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
		const profileRequestID: string | undefined = formSubmission.get('profile')?.toString();

		if (profileRequestID) {
			const response = await fetch(`${FINGERPRINTJS_URL}/events/${profileRequestID}`, {
				headers: { 'Auth-API-Key': FINGERPRINTJS_SERVER_KEY }
			});
			const profile = await response.json();
			formSubmission.set('added_by', profile.products.identification.data.visitorId);
			formSubmission.delete('profile');
		} else return fail(400, { name: 'profile', missing: true });

		// TODO more email form validation
		const email = new EmailForm(formSubmission);
		try {
			email.validate();
		} catch (error) {
			fail(400, { name: error, missing: true });
		}
		// TODO recipient, author, topic

		// await objectMapper.author.create({data:{}})
		console.log({ ...email.inputFields, ...email.defaultMetrics });
		await objectMapper.email.create({
			data: { ...email.inputFields, ...email.defaultMetrics }
		});

		return { success: true };
	}
};
