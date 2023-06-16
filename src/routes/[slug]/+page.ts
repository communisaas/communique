import { browser } from '$app/environment';
import { goto } from '$app/navigation';

import type { email } from '@prisma/client';
import { get, type Writable } from 'svelte/store';

import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (async ({ fetch, params }) => {
	if (browser) {
		const sessionStore: Writable<UserState> = (await import('$lib/sessionStorage')).store;
		const sessionData = get(sessionStore);
		if (
			!(
				'email' in sessionData &&
				'content' in sessionData.email &&
				params.slug === sessionData.email.content.shortid
			)
		) {
			try {
				const email: email = await (await fetch(`data/email/${params.slug}`)).json();
				sessionStore.update((sessionData) => {
					sessionData.email = { type: 'email', id: email.rowid, content: email };
					return sessionData;
				});
			} catch (e) {
				throw error(404, `Not found: ${e.message}`);
			}
		}
		goto(`/#${params.slug}`, { replaceState: true });
	}
}) satisfies PageLoad;
