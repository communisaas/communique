import { redirect, type Handle } from '@sveltejs/kit';
import prepAuth from '$lib/data/auth';

import { sequence } from '@sveltejs/kit/hooks';
import { decode } from '@auth/core/jwt';
import { AUTH_SECRET } from '$env/static/private';
import jose from 'jose';

async function protectDataEndpoints({ event, resolve }) {
	// Check for POST method and if it's a protected /data endpoint
	if (
		(event.request.method === 'POST' && event.url.pathname.startsWith('/data')) ||
		event.url.pathname.startsWith('/data/user')
	) {
		// Extract the JWT token and decode it
		const authCookieName =
			event.url.protocol === 'https:' ? '__Secure-authjs.session-token' : 'authjs.session-token';

		const jwt = await decode({
			token: event.cookies.get(authCookieName),
			secret: process.env.AUTH_SECRET || AUTH_SECRET,
			salt: authCookieName
		});

		if (!jwt) {
			throw new Error('Invalid token');
		}

		// Check JWT expiration
		const currentTime = Date.now() / 1000; // to get in seconds;
		if (jwt.exp && Number(jwt.exp) < currentTime) {
			throw new Error('Token expired');
		}

		// CSRF Token Verification
		const csrfToken = (await (await event.fetch('/auth/csrf')).json()).csrfToken.split('|')[0];
		if (!csrfToken || csrfToken !== event.request.headers.get('csrf-token')) {
			throw new Error('CSRF token mismatch');
		}
	}

	return resolve(event);
}

async function authorize({ event, resolve }) {
	// TODO structure auth requirements, verify session
	const authCookieName =
		event.url.protocol === 'https:' ? '__Secure-authjs.session-token' : 'authjs.session-token';

	const token = event.cookies.get(authCookieName);

	if (token)
		event.locals.tokenData = await decode({
			token,
			secret: process.env.AUTH_SECRET || AUTH_SECRET,
			salt: authCookieName
		});

	const session = await event.locals.getSession();

	if (event.url && event.url.pathname.startsWith('/compose')) {
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

export const handle = sequence(prepAuth, authorize, protectDataEndpoints) satisfies Handle;
