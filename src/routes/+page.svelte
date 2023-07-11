<script lang="ts">
	import Email from '$components/Email.svelte';
	import Panel from '$components/Panel.svelte';
	import Modal from '$components/Modal.svelte';
	import modal from '$lib/ui/modal';
	import { handleSelect } from '$lib/data/select';
	import { createEventDispatcher, onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { goto } from '$app/navigation';
	import { setActiveEmail, handleMailto } from '$lib/data/email';
	import Share from '$components/Share.svelte';
	import Tag from '$components/Tag.svelte';
	import Login from '$components/Login.svelte';
	import { page } from '$app/stores';

	export let data;

	let sessionStore: Writable<UserState>;
	let showSharePopover = false;
	let showLoginPopover = false;

	const dispatch = createEventDispatcher();

	onMount(async () => {
		sessionStore = (await import('$lib/data/sessionStorage')).store;
		// Extract the hash values
		const hashes = window.location.hash.substring(1).split('#');
		// If there's only one hash, handle the case for email short id
		if (hashes.length === 1 && hashes[0]) {
			const slug = hashes[0];

			if (slug === 'signin') {
				if (!$page.data.session) {
					showLoginPopover = true;
				} else {
					goto(`/`, { noScroll: true });
				}
			} else if (
				$sessionStore &&
				'email' in $sessionStore &&
				'content' in $sessionStore.email &&
				$sessionStore.email.content.shortid === slug
			) {
				showSharePopover = true;
				handleMailto(dispatch);
			} else {
				// Otherwise, resolve the slug
				await setActiveEmail(slug);
				showSharePopover = true;
				handleMailto(dispatch);
			}
		} else {
			// Iterate over each hash
			hashes.forEach(async (hash) => {
				const hashParams = new URLSearchParams(hash);

				if (hashParams.has('signin')) {
					if (!$page.data.session) {
						showLoginPopover = true;
					} else {
						goto(`/`, { noScroll: true });
					}
				}

				if (hashParams.has('callbackUrl')) {
					// handle callbackUrl
					$sessionStore.loginCallbackURL = decodeURIComponent(hashParams.get('callbackUrl') ?? '');
					// process callbackUrl...
				}

				// handle other hashes...
			});
		}
	});

	// TODO loading placeholders
</script>

<svelte:head>
	<title>Communique</title>
	<meta name="description" content="Write & share email templates!" />
</svelte:head>

<div
	role="feed"
	aria-label="Welcome to communique, you are at the home page"
	class="flex flex-col h-full"
>
	{#if $sessionStore && $sessionStore.hasOwnProperty('template')}
		{#each Object.entries($sessionStore.template) as [index, panel]}
			{#key panel.header}
				<Panel
					header={`${panel.selectable in $sessionStore ? panel.header : 'Loading...'}`}
					selectable={Email}
					selector={Tag}
					selectorTarget={panel.selectable}
					initialSelection={$sessionStore.template[index].focus}
					alignment={panel.alignment}
					items={panel.cardList}
					filterable={true}
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
							goto(`/#${e.detail.context.shortid}`, { noScroll: true });
							showSharePopover = true;
							handleMailto(dispatch);
						}
					}}
				/>
			{/key}
		{/each}
	{/if}
</div>

{#if showSharePopover}
	<div use:modal>
		<Modal
			popoverComponent={Share}
			bind:item={$sessionStore.email.content}
			on:popover={(e) => {
				showSharePopover = e.detail;
				if (!showSharePopover) {
					goto('/', { noScroll: true });
				}
			}}
		/>
	</div>
{/if}

{#if showLoginPopover}
	<div use:modal>
		<Modal
			popoverComponent={Login}
			bind:item={data.authProviders}
			on:popover={(e) => {
				showLoginPopover = e.detail;
				if (!showLoginPopover) {
					goto('/', { noScroll: true });
				}
			}}
		/>
	</div>
{/if}
