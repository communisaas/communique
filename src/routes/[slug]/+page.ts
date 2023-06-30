import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { setActiveEmail } from '$lib/email';

export const load = async ({ params }) => {
	// TODO reserve website endpoints so they don't conflict with email slugs
	if (browser) {
		await setActiveEmail(params.slug);
		goto(`/#${params.slug}`, { replaceState: true, noScroll: true });
	}
};
