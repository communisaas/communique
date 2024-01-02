import { redirect, type Handle } from '@sveltejs/kit';
import prepAuth from '$lib/data/auth';

import { sequence } from '@sveltejs/kit/hooks';
import { decode } from '@auth/core/jwt';
import { AUTH_SECRET } from '$env/static/private';

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
	// TODO use server-persisted access token
	if (
		(event.request.method === 'POST' && event.url.pathname.startsWith('/data')) ||
		event.url.pathname.startsWith('/data/user')
	) {
		// CSRF Token Verification
		const csrfToken = (await (await event.fetch('/auth/csrf')).json()).csrfToken.split('|')[0];
		if (!csrfToken || csrfToken !== event.request.headers.get('csrf-token')) {
			throw new Error('CSRF token mismatch');
		}
	}

	// Session handling and redirection for specific paths
	const session = await event.locals.getSession();
	if (!session && event.url.pathname.startsWith('/profile')) {
		throw redirect(302, `/sign/in?callbackUrl=${event.url.pathname}`);
	}

	return resolve(event);
}

export const handle = sequence(prepAuth, authorize) satisfies Handle;
