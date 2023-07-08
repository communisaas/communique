/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck bitwise ops on strings are not supported by TypeScript

import { page } from '$app/stores';
import { get } from 'svelte/store';
import { redirect } from '@sveltejs/kit';

export async function handleSelect(e: CustomEvent) {
	const dataFetcher = async (endpoint: string) => {
		const dataURL = new URL(endpoint, get(page).url);
		dataURL.searchParams.append(e.detail.type, e.detail.id);

		return (await fetch(dataURL.toString())).json();
	};

	// selector | to fetch (as number to avoid type errors with boolean logic)
	switch ((e.detail.type | e.detail.target) as number) {
		case 'recipient' | 'email' | ('email' | 'email'): {
			return await dataFetcher('/data/email');
		}
		case 'topic' | 'email': {
			return await dataFetcher('/data/topic');
		}
	}
}
