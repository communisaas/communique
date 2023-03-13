<script lang="ts">
	import type { email } from '@prisma/client';
	import { onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import Selector from './Selector.svelte';
	import Tag from './Tag.svelte';

	let store: Writable<UserState>;
	onMount(async () => {
		store = (await import('$lib/sessionStorage')).store;
	});

	export let item: email;
	export let selected = '';
	export let style = '';
	export let index = 0;

	// TODO email card layout
</script>

<button
	on:mousedown={(e) => (selected = item.rowid)}
	tabindex={index}
	class="{style} p-2 rounded bg-paper shadow-artistBlue shadow-card"
>
	<section class="flex flex-col w-60">
		<h1>{item.subject}</h1>
		<div class="stats">
			<span>reads: {item.open_count}</span>
			<span>sends: {item.send_count}</span>
		</div>

		{#if store}
			<Selector
				selectable={Tag}
				items={item.topic_list}
				bind:selected={$store.topic}
				style="text-[12px]"
				alignment="right"
			/>
			<Selector
				selectable={Tag}
				items={item.recipient_list}
				bind:selected={$store.topic}
				style="text-[12px] bg-teal-500"
				alignment="right"
			/>
		{/if}
	</section>
</button>

<style>
	h1 {
		font-size: 1.4rem;
		text-align: start;
		font-weight: 600;
	}

	.stats {
		text-align: start;
		display: flex;
		flex-direction: column;
		padding-left: 1em;
	}
</style>
