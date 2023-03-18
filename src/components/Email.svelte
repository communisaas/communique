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
	export let selected: Selectable;
	export let style = '';
	export let index = 0;

	// TODO email card layout
</script>

<button
	on:mousedown={(e) => (selected.name = item.rowid)}
	tabindex={index}
	class="{style} p-2 rounded bg-paper"
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
				bind:selected={$store.recipient}
				style="text-[12px] bg-teal-500"
				alignment="right"
			/>
		{/if}
	</section>
</button>

<style>
	button {
		transition: 0.2s ease-out;
	}
	button:hover {
		transform: translateY(-1px);
		box-shadow: rgba(0, 0, 0, 0.16) 3px 3px 4px;
		transition: 0.2s ease-in;
	}
	button:active {
		transform: translateY(1px);
	}
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
