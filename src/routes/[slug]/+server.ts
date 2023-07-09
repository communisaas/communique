import { redirect } from '@sveltejs/kit';

export const GET = (({ params }) => {
	throw redirect(302, `/#${params.slug}`);
}) satisfies RequestHandler;
