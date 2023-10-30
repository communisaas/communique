import { goto } from '$app/navigation';
import { handleMailto, setActiveEmail } from '$lib/data/email';
import type { DispatchOptions } from 'svelte/internal';
import { page } from '$app/stores';
import { get } from 'svelte/store';

export async function routeModal(
	urlHashes: string[],
	sessionStore: UserState,
	eventDispatcher: <EventKey extends string>(
		type: EventKey,
		detail?: unknown,
		options?: DispatchOptions | undefined
	) => boolean
) {
	sessionStore.show.login = false; // reset login modal
	if (urlHashes.length === 1 && urlHashes[0]) {
		const slug = urlHashes[0];
		if (slug === 'signin') {
			if (!get(page).data.session) {
				sessionStore.show.login = true;
			} else {
				get(page).route.id || '/', { noScroll: true };
			}
		} else if (slug === 'terms-of-use') {
			sessionStore.show.termsOfUse = true;
		} else if (slug == 'privacy-policy') {
			sessionStore.show.privacyPolicy = true;
		} else if (slug == 'confirm') {
			sessionStore.show.confirm = true;
		} else if (
			sessionStore &&
			'email' in sessionStore &&
			'content' in sessionStore.email &&
			sessionStore.email.content.shortid === slug
		) {
			sessionStore.show.share = true;
			handleMailto(eventDispatcher);
		} else {
			// Otherwise, resolve the slug
			await setActiveEmail(slug);
			sessionStore.show.share = true;
			handleMailto(eventDispatcher);
		}
	} else {
		// hash has parameters, so iterate through them
		urlHashes.forEach(async (hash) => {
			const hashParams = new URLSearchParams(hash);

			if (hashParams.has('signin')) {
				if (!get(page).data.session) {
					sessionStore.show.login = true;
				} else {
					goto(get(page).route.id || '/', { noScroll: true });
				}
			}

			if (hashParams.has('callbackUrl')) {
				sessionStore.loginCallbackURL = decodeURIComponent(
					hashParams.get('callbackUrl') ?? ''
				) as `/${string}`;
			}
		});
	}
	return sessionStore;
}
