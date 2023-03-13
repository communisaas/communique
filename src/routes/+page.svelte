<script type="ts">
	import Email from '$components/Email.svelte';
	import Panel from '$components/Panel.svelte';
	import type { recipient } from '@prisma/client';
	import { onMount } from 'svelte';
	import type { Writable } from 'svelte/store';

	let store: Writable<UserState>;

	onMount(async () => {
		store = (await import('$lib/sessionStorage')).store;

		if ($store) {
			$store.recipient = {
				name: data.templateList.filter((panel) => panel.selectableName === 'recipient')[0]
					.cardList[0].recipient_list[0], // recipient panel defaults to address with recently most reads
				type: 'recipient'
			};
			$store.spotlight = { name: 'custom', type: 'recipient' };
		}
	});

	export let data: HomeSchema;

	// TODO loading placeholders
	// TODO switch panel header between selected topic & address context
</script>

<svelte:head>
	<title>Communique</title>
	<meta name="description" content="Write & share email templates!" />
</svelte:head>

<div class="flex flex-col gap-y-10">
	{#if store}
		{#each data.templateList as panel}
			<Panel
				header={`${panel.header} ${$store ? $store.topic.name : '{PLACEHOLDER}'}`}
				alignment={panel.alignment}
				selectable={Email}
				items={panel.cardList}
				bind:selected={$store[panel.selectableName]}
			/>
		{/each}
	{/if}
</div>
