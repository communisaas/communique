<script type="ts">
	import Email from '$components/Email.svelte';
	import Panel from '$components/Panel.svelte';
	import { onMount } from 'svelte';
	import type { Writable } from 'svelte/store';

	let store: Writable<UserState>;

	onMount(async () => {
		store = (await import('$lib/sessionStorage')).store;
		// $store.recipient = {
		// 	name: data.templateList.filter((panel) => panel.selectable === 'recipient')[0].cardList[0]
		// 		.recipient_list[0], // recipient panel defaults to address with recently most reads
		// 	type: 'recipient'
		// };
		$store.spotlight = { name: 'custom', type: 'recipient' };
		$store.email = { name: '', type: 'email' };
	});

	export let data: HomeSchema;

	// TODO loading placeholders
	// TODO switch panel header between selected topic & address context
	console.log(data);
	$: console.log($store);
</script>

<svelte:head>
	<title>Communique</title>
	<meta name="description" content="Write & share email templates!" />
</svelte:head>

<div class="flex flex-col gap-y-10">
	{#if store}
		{#each data.templateList as panel}
			<Panel
				header={`${panel.header} ${
					panel.selectable in $store ? $store[panel.selectable].name : 'Loading...'
				}`}
				alignment={panel.alignment}
				selectable={Email}
				items={panel.cardList}
				bind:selected={$store.email}
			/>
		{/each}
	{/if}
</div>
