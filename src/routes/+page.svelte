<script lang="ts">
	import Email from '$components/Email.svelte';
	import Panel from '$components/Panel.svelte';
	import Modal from '$components/Modal.svelte';
	import modal from '$lib/ui/modal';
	import { handleSelect } from '$lib/data/select';
	import { createEventDispatcher, onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { goto } from '$app/navigation';
	import { handleMailto } from '$lib/data/email';
	import Share from '$components/Share.svelte';
	import Tag from '$components/Tag.svelte';
	import Login from '$components/Login.svelte';
	import { page } from '$app/stores';
	import { routeModal } from '$lib/ui/hash';
	import { marked } from 'marked';

	import termsOfUse from '$lib/policies/serviceTerms.md';
	import privacyPolicy from '$lib/policies/privacyPolicy.md';
	import Reader from '$components/Reader.svelte';

	export let data;

	let sessionStore: Writable<UserState>;
	let privacyPolicyHTML: string;

	const dispatch = createEventDispatcher();

	onMount(async () => {
		sessionStore = (await import('$lib/data/sessionStorage')).store;
		privacyPolicyHTML = marked(await (await fetch(privacyPolicy)).text());

		const hashes = window.location.hash.substring(1).split('#');
		// TODO use enum
		await routeModal(hashes, $page, $sessionStore, dispatch);
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
							$sessionStore.show.share = true;
							handleMailto(dispatch);
						}
					}}
				/>
			{/key}
		{/each}
	{/if}
</div>

{#if $sessionStore && $sessionStore.hasOwnProperty('show')}
	<div use:modal>
		{#if $sessionStore.show.share}
			<Modal
				popoverComponent={Share}
				props={{ item: $sessionStore.email.content }}
				on:popover={(e) => {
					$sessionStore.show.share = e.detail;
					if (!$sessionStore.show.share) {
						goto('/', { noScroll: true });
					}
				}}
			/>
		{:else if $sessionStore.show.login}
			<Modal
				popoverComponent={Login}
				props={{ providers: data.authProviders }}
				on:popover={(e) => {
					$sessionStore.show.login = e.detail;
					if (!$sessionStore.show.login) {
						goto('/', { noScroll: true });
					}
				}}
			/>
		{:else if $sessionStore.show.privacyPolicy}
			<Modal
				popoverComponent={Reader}
				props={{
					item: privacyPolicyHTML,
					inModal: true
				}}
				on:popover={(e) => {
					$sessionStore.show.privacyPolicy = e.detail;
					if (!$sessionStore.show.privacyPolicy) {
						goto('/', { noScroll: true });
					}
				}}
			/>
		{/if}
	</div>
{/if}
