<script lang="ts">
	import Email from '$components/Email.svelte';
	import Panel from '$components/Panel.svelte';
	import Modal from '$components/Modal.svelte';
	import modal, { handlePopover } from '$lib/ui/modal';
	import { handleSelect } from '$lib/data/select';
	import { createEventDispatcher, onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { goto } from '$app/navigation';
	import { handleMailto } from '$lib/data/email';
	import Share from '$components/popover/Share.svelte';
	import Login from '$components/Login.svelte';
	import { page } from '$app/stores';
	import Reader from '$components/popover/Reader.svelte';
	import type { email } from '@prisma/client';

	export let data;

	let sessionStore: Writable<UserState>;
	const dispatch = createEventDispatcher();

	onMount(async () => {
		sessionStore = (await import('$lib/data/sessionStorage')).store;
	});

	let modalMapping: ModalMap = {
		share: { component: Share, props: () => ({ item: $sessionStore.email.content }) },
		login: { component: Login, props: () => ({ providers: data.authProviders }) },
		privacyPolicy: {
			component: Reader,
			props: () => ({ item: $page.data.privacyPolicy, inModal: true })
		},
		moderationPolicy: {
			component: Reader,
			props: () => ({ item: $page.data.moderationPolicy, inModal: true })
		},
		termsOfUse: {
			component: Reader,
			props: () => ({ item: $page.data.termsOfUse, inModal: true })
		}
	};

	$: if ($sessionStore && $sessionStore.template && $sessionStore.hiddenEmails) {
		for (const templateName in $sessionStore.template)
			$sessionStore.template[templateName].cardList = $sessionStore.template[
				templateName
			].cardList.filter((card: email) => !$sessionStore.hiddenEmails.includes(card.shortid));
	}

	// TODO loading placeholders
</script>

<svelte:head>
	<title>Communique</title>
	<meta name="description" content="Write & share email templates!" />
</svelte:head>

<div
	role="feed"
	aria-label="Welcome to communique, you are at the home page"
	class="flex flex-col h-full mb-5"
>
	{#if $sessionStore && $sessionStore.hasOwnProperty('template')}
		{#each Object.entries($sessionStore.template) as [index, panel]}
			{#key panel.header}
				<Panel
					header={`${panel.selectable in $sessionStore ? panel.header : 'Loading...'}`}
					selectable={Email}
					alignment={panel.alignment}
					filterable={true}
					initialSelection={$sessionStore.template[index].focus}
					bind:items={panel.cardList}
					bind:selected={$sessionStore.email}
					on:select={async (e) => {
						$sessionStore.template.primary.cardList = [];
						$sessionStore.template.primary.cardList = await handleSelect(e);
						// switch (e.detail.type) {
						// 	case 'recipient':
						// 		$sessionStore.template.primary.header = 'Most emails sent to';
						// 		e.detail.id = e.detail.id.split('@')[0];
						// 		break;
						// 	case 'topic':
						// 		$sessionStore.template.primary.header = 'Loudest voices in';
						// 		break;
						// }
						$sessionStore.template[index].focus = {
							type: e.detail.type,
							item: e.detail.id,
							field: e.detail.type === 'recipient' ? 'recipient_list' : 'topic_list',
							source: e.detail.type,
							iterable: true
						};
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
	{#each Object.keys($sessionStore.show) as modalName (modalName)}
		{#if $sessionStore.show[modalName]}
			<div use:modal>
				<Modal
					popoverComponent={modalMapping[modalName].component}
					props={modalMapping[modalName].props()}
					on:popover={(e) => handlePopover(e, sessionStore, modalName, '/')}
				/>
			</div>
		{/if}
	{/each}
{/if}
