import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { setActiveEmail } from '$lib/email';

import type { PageLoad } from './$types';

export const load = (async ({ params }) => {
	if (browser) {
		await setActiveEmail(params.slug);
		goto(`/#${params.slug}`, { replaceState: true, noScroll: true });
	}
}) satisfies PageLoad;
