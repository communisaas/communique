<script lang="ts">
	import '../app.postcss';
	import './styles.css';

	import Navigation from '$components/Navigation.svelte';

	import { onMount } from 'svelte';
	import type { topic } from '@prisma/client';
	import Selector from '$components/Selector.svelte';
	import Tag from '$components/Tag.svelte';
	import { navigating } from '$app/stores';
	import type { Writable } from 'svelte/store';
	import { handleSelect } from '$lib/selectable';

	export let data: LayoutSchema;

	let store: Writable<UserState>, lastStore: Writable<UserState>;
	onMount(async () => {
		store = (await import('$lib/sessionStorage')).store;
		$store.topic = { name: topicNames[0], type: 'topic' };
		$store.recipient = {
			name: '',
			type: 'recipient'
		};
		$store.spotlight = { name: 'custom', type: 'recipient' };
		$store.email = { name: '', type: 'email' };
	});

	$: topicNames = data.loudestTopics.map((topic: topic) => topic.name);

	$: fetchSelectedItems($store);

	function fetchSelectedItems(storage: UserState) {
		// console.log(data.template);
		// console.log(storage);
	}
</script>

<div class="app">
	<main class="flex min-h-screen">
		<div class="grow-0 shrink-0 w-20"><Navigation /></div>

		<div class="grow whitespace-nowrap">
			<header class="flex h-fit py-2 px-3 pb-2 bg-peacockFeather-600">
				{#if $store}
					<Selector
						selectable={Tag}
						items={topicNames}
						bind:selected={$store.topic}
						alignment="center"
						on:select={async (e) => (data.template.primary.cardList = await handleSelect(e))}
					/>
				{/if}
			</header>
			{#if $navigating}
				<div class="m-8">
					<h1 class="ext-3xl text-center text-cText">Fetching...</h1>
				</div>
			{:else}
				<slot />
			{/if}
		</div>
	</main>

	<footer />
</div>
