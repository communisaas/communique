<script type="ts">
	import Email from '$components/Email.svelte';
	import Panel from '$components/Panel.svelte';
	import { handleSelect } from '$lib/selectable';
	import { onMount } from 'svelte';
	import type { Writable } from 'svelte/store';

	let store: Writable<UserState>;

	onMount(async () => {
		store = (await import('$lib/sessionStorage')).store;
	});

	export let data: HomeSchema;

	// TODO loading placeholders
	// TODO switch panel header between selected topic & address context
	// TODO unbind email card list from layout data
</script>

<svelte:head>
	<title>Communique</title>
	<meta name="description" content="Write & share email templates!" />
</svelte:head>

<div class="flex flex-col gap-y-10">
	{#if store}
		{#each Object.values(data.template) as panel}
			<Panel
				header={`${panel.header} ${
					panel.focus in $store ? $store[panel.focus].name : 'Loading...'
				}`}
				alignment={panel.alignment}
				selectable={Email}
				items={panel.cardList}
				bind:selected={$store.email}
				on:select={async (e) => (data.template.primary.cardList = await handleSelect(e))}
			/>
		{/each}
	{/if}
</div>
