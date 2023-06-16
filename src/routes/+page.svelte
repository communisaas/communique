<script lang="ts">
	import Email from '$components/Email.svelte';
	import Panel from '$components/Panel.svelte';
	import Modal from '$components/Modal.svelte';
	import modal from '$lib/modal';
	import { handleSelect } from '$lib/endpoint';
	import { createEventDispatcher, onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { goto } from '$app/navigation';

	import he from 'he';
	import DOMPurify from 'dompurify';

	let sessionStore: Writable<UserState>;
	let showActionPopover = false;

	const dispatch = createEventDispatcher();

	function convertHtmlToText(node: Node): string {
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
			switch (child.nodeType) {
				case Node.ELEMENT_NODE:
					const childText = convertHtmlToText(child);
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

	async function handleMailto() {
		// TODO handle this in email class
		const mailBaseURL = new URL(`mailto:${$sessionStore.email.content.recipient_list.join(',')}`);
		const mailSubject = `?subject=${encodeURI($sessionStore.email.content.subject)}`;

		// Parse the HTML string into a DOM
		let parser = new DOMParser();
		let doc = parser.parseFromString(
			DOMPurify.sanitize($sessionStore.email.content.body),
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

	onMount(async () => {
		sessionStore = (await import('$lib/sessionStorage')).store;
		// Watch for changes to the URL hash
		const slug = window.location.hash.substring(1);
		if (slug) {
			// If the hash matches an email slug, show the modal
			handleMailto();
			showActionPopover = true;
		}
	});

	// TODO loading placeholders
</script>

<svelte:head>
	<title>Communique</title>
	<meta name="description" content="Write & share email templates!" />
</svelte:head>

<div role="feed" aria-label="Welcome to communique, you are at the home page" class="flex flex-col">
	{#if $sessionStore && $sessionStore.hasOwnProperty('template')}
		{#each Object.entries($sessionStore.template) as [order, panel]}
			{#key panel.header}
				<Panel
					header={`${panel.header} ${
						panel.selectable in $sessionStore ? $sessionStore.template[order].focus : 'Loading...'
					}`}
					alignment={panel.alignment}
					selectable={Email}
					items={panel.cardList}
					bind:selected={$sessionStore.email}
					on:select={async (e) => {
						$sessionStore.template.primary.cardList = await handleSelect(e);
						switch (e.detail.type) {
							case 'recipient':
								$sessionStore.template.primary.header = 'Most emails sent to';
								e.detail.id = e.detail.id.split('@')[0];
								break;
							case 'topic':
								$sessionStore.template.primary.header = 'Loudest voices in';
								break;
						}
						$sessionStore.template.primary.focus = e.detail.id;
					}}
					on:externalAction={async (e) => {
						if (e.detail.type === 'email') {
							goto(`/#${e.detail.context.shortid}`);
							showActionPopover = true;
							handleMailto();
						}
					}}
				/>
			{/key}
		{/each}
	{/if}
</div>

{#if showActionPopover}
	<div use:modal>
		<Modal
			on:popover={(e) => {
				showActionPopover = e.detail;
				if (!showActionPopover) {
					goto('/');
				}
			}}
			bind:item={$sessionStore.email.content}
		/>
	</div>
{/if}
