import he from 'he';
import DOMPurify from 'dompurify';

import { get } from 'svelte/store';

export function convertHtmlToText(node: Node): string {
	let text = '';

	const blockTags: string[] = [
		'div',
		'p',
		'h1',
		'h2',
		'h3',
		'h4',
		'h5',
		'h6',
		'header',
		'footer',
		'article',
		'section',
		'aside',
		'br',
		'hr'
	];

	for (const child of Array.from(node.childNodes)) {
		const childText = convertHtmlToText(child);
		switch (child.nodeType) {
			case Node.ELEMENT_NODE:
				if (blockTags.includes((child as HTMLElement).tagName.toLowerCase())) {
					text += '\n' + childText;
				} else {
					text += childText;
				}
				break;
			case Node.TEXT_NODE:
				text += (child as Text).textContent;
				break;
			default:
				break;
		}
	}

	return text.trim();
}

export async function handleMailto(dispatch: (name: string, detail?: unknown) => void) {
	const sessionStore = (await import('$lib/sessionStorage')).store;
	const mailBaseURL = new URL(`mailto:${get(sessionStore).email.content.recipient_list.join(',')}`);
	const mailSubject = `?subject=${encodeURI(get(sessionStore).email.content.subject)}`;

	// Parse the HTML string into a DOM
	const parser = new DOMParser();
	const doc = parser.parseFromString(
		DOMPurify.sanitize(get(sessionStore).email.content.body),
		'text/html'
	);
	let plainBody = convertHtmlToText(doc.body);

	// Decode any HTML entities
	plainBody = he.decode(plainBody);

	// Collapse consecutive newlines
	plainBody = plainBody.replace(/\n{4,}/g, '\n');

	// URL encode the plain text body
	const mailBody = `&body=${encodeURIComponent(plainBody)}`;
	const mailURL = mailBaseURL.href + mailSubject + mailBody;

	dispatch('externalAction', { type: 'email', url: mailURL });
	window.open(mailURL, '_self');
}
