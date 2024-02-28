import { redirect, type Handle } from '@sveltejs/kit';

import { sequence } from '@sveltejs/kit/hooks';
import { decode } from '@auth/core/jwt';
import { AUTH_SECRET } from '$env/static/private';
import { handle as authHandle } from '$lib/data/auth'

/** @type {import('@sveltejs/kit').Handle} */
async function authorize({ event, resolve }) {
	const authCookieName =
		event.url.protocol === 'https:' ? '__Secure-authjs.session-token' : 'authjs.session-token';

	const token = event.cookies.get(authCookieName);
	let jwt;

	if (token) {
		jwt = await decode({
			token,
			secret: process.env.AUTH_SECRET || AUTH_SECRET,
			salt: authCookieName
		});

		if (!jwt) {
			// Redirect or throw an error if no JWT or invalid JWT for protected paths
			if (event.url.pathname.startsWith('/data') || event.url.pathname.startsWith('/profile')) {
				redirect(302, `/sign/in?callbackUrl=${event.url.pathname}`);
			}
		} else {
			// Check JWT expiration
			const currentTime = Date.now() / 1000;
			if (jwt.exp && Number(jwt.exp) < currentTime) {
				redirect(302, `/sign/in?callbackUrl=${event.url.pathname}`);
			}
		}
	}

	// For server endpoints
	// Session handling and redirection for specific paths
	if (event.url.pathname.startsWith('/profile')) {
		const session = await event.locals.auth();
		if (!session) {
			throw redirect(302, `/sign/in?callbackUrl=${event.url.pathname}`);
		}
	}

	return resolve(event);
}

export const handle = sequence(authHandle, authorize) satisfies Handle;
