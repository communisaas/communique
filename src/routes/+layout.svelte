<script lang="ts">
	import '../app.postcss';
	import './styles.css';

	import Navigation from '$components/Navigation.svelte';
	import TagSelector from '$components/Tag.svelte';

	import { onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type { topic } from '@prisma/client';
	import Selector from '$components/Selector.svelte';
	import Tag from '$components/Tag.svelte';

	export let data: LayoutSchema;

	let store: Writable<CommuniqueLocalStorage>;
	onMount(async () => {
		store = (await import('$components/localStorage')).store;
	});

	$: topicNames = data.topicList.map((topic: topic) => topic.name);
</script>

<div class="app">
	<main class="flex min-h-screen overflow-y-scroll">
		<div class="grow-0 shrink-0 w-20"><Navigation /></div>

		<div class="grow">
			<header class="block h-fit py-2">
				{#if store}
					<Selector selectable={Tag} items={topicNames} bind:selected={$store.selectedTopic} />
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
