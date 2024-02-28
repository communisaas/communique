/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck bitwise ops on strings are not supported by TypeScript

import { page } from '$app/stores';
import { get } from 'svelte/store';
import DOMPurify from 'isomorphic-dompurify';
import { convertHtmlToText } from './email';
import he from 'he';

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

export async function handleCopy(dataType: 'email' | 'link', content: email | string) {
	let copyData, cleanedBody;

	if (dataType === 'email') {
		cleanedBody = DOMPurify.sanitize(content);
		const parser = new DOMParser();
		const doc = parser.parseFromString(cleanedBody, 'text/html');
		content = convertHtmlToText(doc.body);

		content = he.decode(content);
		content = content.replace(/\n{4,}/g, '\n');

		copyData = {
			'text/html': cleanedBody,
			'text/plain': content
		};
	} else {
		copyData = {
			'text/plain': content
		};
	}

	try {
		const clipboardData: { [key: string]: Blob } = {
			'text/plain': new Blob([copyData['text/plain']], { type: 'text/plain' })
		};

		if (dataType === 'email') {
			clipboardData['text/html'] = new Blob([copyData['text/html']], { type: 'text/html' });
		}

		await navigator.clipboard.write([new ClipboardItem(clipboardData)]);
	} catch (e) {
		try {
			const copyListener = (e: ClipboardEvent) => {
				for (const [type, value] of Object.entries(copyData)) {
					e.clipboardData?.setData(type, value);
				}
				e.preventDefault();
			};
			document.addEventListener('copy', copyListener);
			document.execCommand('copy');
			document.removeEventListener('copy', copyListener);
		} catch (e) {
			(console.error || console.log).call(console, e.stack || e);
		}
	}

	return true;
}

export async function fetchSearchResults(item: string, fetch: fetch, source = '') {
	let response;
	// TODO error handling
	if (item)
		response = await fetch(
			`/data/search/${encodeURIComponent(item)}` + (source ? `?source=${source}` : '')
		);
	if (response.ok) {
		return await response.json();
	} else {
		console.error('Failed to fetch search results:', await response.text());
		return null;
	}
}

export function debounce(callback, delay) {
	let timer;
	return function (...args) {
		return new Promise((resolve, reject) => {
			const later = () => {
				clearTimeout(timer);
				try {
					// This ensures callback runs with the correct 'this' context
					resolve(callback(...args));
				} catch (error) {
					reject(error);
				}
			};

			clearTimeout(timer);
			timer = setTimeout(later, delay);
		});
	};
}

const debouncedSearchResults = debounce(fetchSearchResults, 600);
export async function handleAutocomplete(e: CustomEvent<string>) {
	try {
		return (
			(await debouncedSearchResults(e.detail.value, fetch, e.detail.source)) as QueryResult[]
		).map((result) => {
			let fieldName: string,
				source: string,
				iterable = false;
			switch (result.source) {
				case 'recipient':
					source = 'email';
					fieldName = 'recipient_list';
					iterable = true;
					break;
				case 'topic':
					source = 'topic';
					fieldName = 'topic_list';
					iterable = true;
					break;
				case 'email':
					source = 'topic';
					fieldName = 'subject';
					iterable = false;
					break;
				case 'city':
					source = 'location';
					fieldName = 'city';
					iterable = false;
					break;
				case 'state':
					source = 'location';
					fieldName = 'state';
					iterable = false;
					break;
				case 'country':
					source = 'location';
					fieldName = 'country';
					iterable = false;
					break;
				default: {
					throw new Error('Invalid source type');
				}
			}
			return {
				type: source,
				item: result.id || result.item,
				field: fieldName,
				iterable: iterable,
				source: result.source,
				rank: result.rank
			} as Descriptor<string>;
		});
	} catch (error) {
		console.error('Error in fetching search results:', error);
		return [];
	}
}
