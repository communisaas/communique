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

/** @type {import('./$types').Actions} */
export const actions = {
	publish: async ({ cookies, request }: RequestEvent) => {
		console.log(await request.formData());
		const formSubmission = await request.formData();
		const objectMapper = new PrismaClient();
		const profileRequestID: string | undefined = formSubmission.get('profile')?.toString();

		// TODO implement profile interface
		let profile: any;
		if (profileRequestID) {
			profile = await fetch(`${FINGERPRINTJS_URL}/events/${profileRequestID}`, {
				headers: { 'Auth-API-Key': FINGERPRINTJS_SERVER_KEY }
			});
		} else return fail(400, { profileRequestID, missing: true });

		// TODO more email form validation
		const validatedData = {
			subject: formSubmission.get('Subject')?.toString() ?? '',
			body: formSubmission.get('Letter')?.toString() ?? '',
			topic_list: formSubmission.get('Topic')?.toString().split('␞') ?? [],
			recipient_list: formSubmission.get('Recipient')?.toString().split('␞') ?? [],
			author_id: profile.products.identification.data.visitorId,
			open_count: 0,
			clipboard_count: 0,
			send_count: 0,
			read_count: 0
		};
		Object.entries(validatedData).every(([name, field]) => {
			// all fields should be defined
			if (field.length === 0) return fail(400, { name, missing: true });
		});

		await objectMapper.email.create({
			data: validatedData
		});

		// TODO recipient, author, topic

		return { success: true };
	}
};
