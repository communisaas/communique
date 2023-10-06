import { redirect, type Handle } from '@sveltejs/kit';
import prepAuth from '$lib/data/auth';

import { sequence } from '@sveltejs/kit/hooks';

async function authorize({ event, resolve }) {
	// TODO structure auth requirements, verify session
	if (event.url.pathname.startsWith('/compose') || event.request.headers.get('increment-send')) {
		const session = await event.locals.getSession();
		if (!session) {
			throw redirect(302, '/sign/in?callbackUrl=/compose');
		}
		// TODO update user account in db
		console.log(session);
	}

	return resolve(event);
}

export const handle = sequence(prepAuth, authorize) satisfies Handle;
