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
</script>

<svelte:head>
	<title>Communique</title>
	<meta name="description" content="Write & share email templates!" />
</svelte:head>

<section class="flex flex-col">
	{#if store}
		<Panel
			header={`Loudest voices in ${$store ? $store.topic.name : '{PLACEHOLDER}'}`}
			headerAlign="right"
			selectable={Email}
			items={data.emailList}
			bind:selected={$store.email}
		/>
	{/if}
</section>
