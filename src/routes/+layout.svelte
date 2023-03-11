<script lang="ts">
	import '../app.postcss';
	import './styles.css';

	import Navigation from '$components/Navigation.svelte';

	import { onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type { topic } from '@prisma/client';
	import Selector from '$components/Selector.svelte';
	import Tag from '$components/Tag.svelte';

	export let data: LayoutSchema;

	let store: Writable<CommuniqueLocalStorage>;
	onMount(async () => {
		store = (await import('$lib/localStorage')).store;
		console.log($store);
		if ($store) $store.topic.name = topicNames[0];
	});

	$: topicNames = data.topicList.map((topic: topic) => topic.name);

	$: if ($store) console.log($store.topic);
</script>

<div class="app">
	<main class="flex min-h-screen">
		<div class="grow-0 shrink-0 w-20"><Navigation /></div>

		<div class="grow overflow-scroll whitespace-nowrap">
			<header class="flex h-fit py-2 pb-2 overflow-x-scroll">
				{#if $store}
					<Selector selectable={Tag} items={topicNames} bind:selected={$store.topic} />
				{/if}
			</header>
			<section class="gradient-background py-8">
				<slot />
			</section>
		</div>
	</main>

	<footer />
</div>

<style>
	.gradient-background {
		background: linear-gradient(
			90deg,
			theme('colors.peacockFeather.500'),
			theme('colors.larimarGreen.600')
		);
	}
</style>
