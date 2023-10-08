import { redirect, type Handle } from '@sveltejs/kit';
import prepAuth from '$lib/data/auth';

import { sequence } from '@sveltejs/kit/hooks';

async function authorize({ event, resolve }) {
	// TODO structure auth requirements, verify session
	const session = await event.locals.getSession();
	console.log(session);

	if (event.url && event.url.pathname.startsWith('/compose')) {
		console.log('reached');
		if (!session) {
			throw redirect(302, '/sign/in?callbackUrl=/compose');
		}
	} else if (event.request && event.request.headers.get('increment-send')) {
		if (!session) {
			throw redirect(302, '/sign/in?callbackUrl=/');
		}
	}

	return resolve(event);
}

export const handle = sequence(prepAuth, authorize) satisfies Handle;
