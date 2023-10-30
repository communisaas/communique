import { AUTH_SECRET } from '$env/static/private';
import { objectMapper } from '$lib/data/database';

/** @type {import('./$types').RequestHandler} */
export async function GET({ request, params, url }) {
	const options: Clause = {
		where: { email: params.slug }
	};

	if (request.headers.get('ignored-emails') === 'true') {
		options.select = { ignored_email_list: true };
	}
	const results = await objectMapper.user.findUnique(options);
	return new Response(JSON.stringify(results));
}
