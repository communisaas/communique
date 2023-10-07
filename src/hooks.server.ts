import { redirect, type Handle } from '@sveltejs/kit';
import prepAuth from '$lib/data/auth';

import { sequence } from '@sveltejs/kit/hooks';

async function authorize({ event, resolve }) {
	// TODO structure auth requirements, verify session
	const session = await event.locals.getSession();

	switch (event) {
		case event.url.pathname.startsWith('/compose'):
			if (!session) {
				throw redirect(302, '/sign/in?callbackUrl=/compose');
			}
			// TODO update user account in db
			console.log(session);
			break;
		case event.request.headers.get('increment-send'):
			if (!session) {
				throw redirect(302, '/sign/in?callbackUrl=/');
			}
			break;
	}

	return resolve(event);
}

export const handle = sequence(prepAuth, authorize) satisfies Handle;
