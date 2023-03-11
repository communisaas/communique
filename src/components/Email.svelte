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
	class="{style} w-80 h-44 p-2 rounded bg-paper shadow-artistBlue shadow-card"
>
	<h1>{item.subject}</h1>
	<section class="flex flex-col bg-">
		<span>reads: {item.open_count}</span>
		<span>sends: {item.send_count}</span>
	</section>
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
</button>

<style>
	h1 {
		font-size: 1.4rem;
		text-align: start;
	}
</style>
