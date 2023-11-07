import he from 'he';

import { get } from 'svelte/store';
import { error } from '@sveltejs/kit';
import DOMPurify from 'isomorphic-dompurify';

import type { email } from '@prisma/client';

export class EmailForm {
	inputFields: EmailFormInput = {
		subject: '',
		body: '',
		shortid: '',
		topic_list: [],
		recipient_list: []
	};
	author_email = '';

	set subject(line: string) {
		this.inputFields.subject = line;
	}
	set body(text: string) {
		this.inputFields.body = text;
	}
	set shortid(text: string) {
		this.inputFields.shortid = text;
	}
	set topic_list(tagList: string) {
		this.inputFields.topic_list = tagList.split('␞');
	}
	set recipient_list(tagList: string) {
		this.inputFields.recipient_list = tagList.split('␞');
	}

	defaultMetrics = { open_count: 0, clipboard_count: 0, send_count: 0, read_count: 0 };
	emailForm: FormData;

	constructor(emailForm: FormData, author_email: string) {
		this.emailForm = emailForm;
		this.author_email = author_email;
	}

	validate() {
		if (!this.author_email) throw new Error('Author email not set');

		for (const field of Object.keys(this.inputFields)) {
			const value = this.emailForm.get(field);
			if ((value != null || value != undefined) && field != 'body') {
				if (field == 'recipient_list' || field == 'topic_list') {
					if (value.toString().split('␞').length > 0) {
						throw new Error(`${field} is empty`);
					}
					if (value.toString().split('␞').length > 5 && field == 'topic_list') {
						throw new Error(`Too many topics! (Max 5)`);
					}
					if (value.toString().split('␞').length > 100 && field == 'recipient_list') {
						throw new Error(`Too many recipients! (Max 100)`);
					}
					(this as RawEmailForm)[field] = value.toString();
				}
			} else if ((value != null || value != undefined) && field == 'body') {
				const parsedBody = this.serializeBody(value.toString());
				if (parsedBody.length < 250) {
					throw new Error(`Email body is too short! (Min 250 characters)`);
				} else if (parsedBody.length > 0) {
					(this as RawEmailForm)[field] = parsedBody;
				} else throw new Error(`${field} is empty`);
			} else {
				throw new Error(`${field} is empty`);
			}
		}
	}

	serializeBody(editorDataString: string) {
		const dataObject = JSON.parse(editorDataString);
		let runningText = '';
		for (const block of dataObject.blocks) {
			if (block.type === 'paragraph') {
				// Check if the block is a paragraph
				runningText += DOMPurify.sanitize(`<p>${block.data.text}</p><br>`); // Wrap the text in <p> tags and add <br>
			}
			// You might want to handle other types of blocks differently here
		}
		return runningText;
	}
}

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

export async function handleMailto(
	dispatch: (name: string, detail?: unknown) => void,
	includeBody = true
) {
	const sessionStore = (await import('$lib/data/sessionStorage')).store;
	const mailBaseURL = new URL(`mailto:${get(sessionStore).email.content.recipient_list.join(',')}`);
	const mailSubject = `?subject=${encodeURI(get(sessionStore).email.content.subject)}`;

	// Parse the HTML string into a DOM
	const parser = new DOMParser();
	const doc = parser.parseFromString(
		DOMPurify.sanitize(get(sessionStore).email.content.body),
		'text/html'
	);

	let mailBody = '';
	if (includeBody) {
		let plainBody = convertHtmlToText(doc.body);

		// Decode any HTML entities
		plainBody = he.decode(plainBody);

		// URL encode the plain text body
		mailBody = `&body=${encodeURIComponent(plainBody)}`;
	}
	const mailURL = mailBaseURL.href + mailSubject + mailBody;

	dispatch('externalAction', { type: 'email', url: mailURL });
	window.open(mailURL, '_self');
}

export async function setActiveEmail(id: string) {
	const sessionStore = (await import('$lib/data/sessionStorage')).store;
	try {
		const email: email = await (await fetch(`data/email/${id}`)).json();
		sessionStore.update((sessionData) => {
			sessionData.email = { type: 'email', id: email.rowid, content: email };
			return sessionData;
		});
	} catch (e) {
		throw error(404, `Not found: ${e.message}`);
	}
}
