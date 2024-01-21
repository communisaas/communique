import { redirect, type RequestHandler } from '@sveltejs/kit';

export const GET = (async ({ url }) => {
	const searchParams = url.searchParams.toString();

	let redirectURL;
	const callbackUrl = url.searchParams.get('callbackUrl') || url.origin;
	if (new URL(callbackUrl).pathname !== '/')
		redirectURL = `${new URL(callbackUrl).pathname}/#signin#${searchParams}`;
	else redirectURL = `/#signin#${searchParams}`;

	throw redirect(302, redirectURL);
}) satisfies RequestHandler;
