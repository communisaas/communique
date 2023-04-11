/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck bitwise ops on strings are not supported by TypeScript

import { page } from '$app/stores';
import { get } from 'svelte/store';

export async function handleSelect(e: CustomEvent) {
	// selector | to select
	switch ((e.detail.type | e.detail.target) as number) {
		case 'recipient' | 'email': {
			const dataURL = new URL('/data/email', get(page).url);
			dataURL.searchParams.append(e.detail.type, e.detail.id);

			return await (await fetch(dataURL.toString())).json();
		}
		case 'email' | 'email': {
			const dataURL = new URL('/data/email', get(page).url);
			dataURL.searchParams.append(e.detail.type, e.detail.id);

			return await (await fetch(dataURL.toString())).json();
		}
		case 'topic' | 'email': {
			const dataURL = new URL('/data/topic', get(page).url);
			dataURL.searchParams.append(e.detail.type, e.detail.id);

			return await (await fetch(dataURL.toString())).json();
		}
	}
}
