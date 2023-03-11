<script type="ts">
	import Email from '$components/Email.svelte';
	import Panel from '$components/Panel.svelte';
	import { onMount } from 'svelte';
	import type { Writable } from 'svelte/store';

	let store: Writable<UserState>;

	onMount(async () => {
		store = (await import('$lib/sessionStorage')).store;
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
		<Panel
			header={`Loudest voices in ${$store ? $store.topic.name : '{PLACEHOLDER}'}`}
			alignment="right"
			selectable={Email}
			items={data.emailList}
			bind:selected={$store.email}
		/>

		<Panel
			header={`Loudest voices in ${$store ? $store.topic.name : '{PLACEHOLDER}'}`}
			alignment="left"
			selectable={Email}
			items={data.emailList}
			bind:selected={$store.email}
		/>
	{/if}
</div>
