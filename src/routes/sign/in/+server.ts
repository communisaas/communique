import { redirect, type RequestHandler } from '@sveltejs/kit';

export const GET = (async ({ url }) => {
	const searchParams = url.searchParams.toString();
	const callbackURL =
		url.searchParams.get('callbackUrl') === url.origin + '/'
			? ''
			: url.searchParams.get('callbackUrl');
	throw redirect(302, `${callbackURL}/#signin#${searchParams}`);
}) satisfies RequestHandler;
