import { page } from '$app/stores';
import { get } from 'svelte/store';

export async function handleSelect(e: CustomEvent) {
	console.log(e.detail);
	console.log(get(page).data.template);
	switch (e.detail.type) {
		case 'recipient':
			break;
		case 'email':
			break;
		case 'topic': {
			const dataURL = new URL('/data/email', get(page).url);
			dataURL.searchParams.append(e.detail.type, e.detail.name);

			return await (await fetch(dataURL.toString())).json();
		}
	}
}
