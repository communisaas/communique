<script type="ts">
	import Email from '$components/Email.svelte';
	import Selector from '$components/Selector.svelte';
	import { onMount } from 'svelte';
	import type { Writable } from 'svelte/store';

	let store: Writable<CommuniqueLocalStorage>;

	onMount(async () => {
		store = (await import('$lib/localStorage')).store;
	});

	export let data: HomeSchema;

	// TODO loading placeholders
</script>

<svelte:head>
	<title>Communique</title>
	<meta name="description" content="Write & share email templates!" />
</svelte:head>

<h1>Loudest voices in {$store ? $store.selectedTopic : '{PLACEHOLDER}'}</h1>

<Selector selectable={Email} items={data.emailList} />

<style>
	h1 {
		text-align: left;
		margin: 0em 1em;
	}
</style>
