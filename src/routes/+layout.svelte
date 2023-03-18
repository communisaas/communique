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

	export let data: LayoutSchema;

	let store: Writable<UserState>;
	onMount(async () => {
		store = (await import('$lib/sessionStorage')).store;
		$store.topic = { name: topicNames[0], type: 'topic' };
	});

	$: topicNames = data.loudestTopics.map((topic: topic) => topic.name);
</script>

<div class="app">
	<main class="flex min-h-screen">
		<div class="grow-0 shrink-0 w-20"><Navigation /></div>

		<div class="grow overflow-scroll whitespace-nowrap">
			<header class="flex h-fit py-2 px-3 pb-2 overflow-x-scroll bg-peacockFeather-600">
				{#if $store}
					<Selector
						selectable={Tag}
						items={topicNames}
						bind:selected={$store.topic}
						alignment="center"
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
