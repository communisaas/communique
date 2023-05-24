<script lang="ts">
	import Email from '$components/Email.svelte';
	import Panel from '$components/Panel.svelte';
	import { handleSelect } from '$lib/selectable';
	import { onMount } from 'svelte';
	import type { Writable } from 'svelte/store';

	let store: Writable<UserState>;
	onMount(async () => {
		store = (await import('$lib/sessionStorage')).store;
	});

	// TODO loading placeholders
</script>

<svelte:head>
	<title>Communique</title>
	<meta name="description" content="Write & share email templates!" />
</svelte:head>

<div class="flex flex-col">
	{#if $store && $store.hasOwnProperty('template')}
		{#each Object.entries($store.template) as [order, panel]}
			{#key panel.header}
				<Panel
					header={`${panel.header} ${
						panel.selectable in $store ? $store.template[order].focus : 'Loading...'
					}`}
					alignment={panel.alignment}
					selectable={Email}
					items={panel.cardList}
					bind:selected={$store.email}
					on:select={async (e) => {
						$store.template.primary.cardList = await handleSelect(e);
						switch (e.detail.type) {
							case 'recipient':
								$store.template.primary.header = 'Most emails sent to';
								e.detail.id = e.detail.id.split('@')[0];
								break;
							case 'topic':
								$store.template.primary.header = 'Loudest voices in';
								break;
						}
						$store.template.primary.focus = e.detail.id;
					}}
					on:externalAction={async (e) => {
						if (e.detail.type === 'email') {
							console.log(e);
						}
					}}
				/>{/key}
		{/each}
	{/if}
</div>
