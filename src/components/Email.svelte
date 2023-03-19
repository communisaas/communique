<script lang="ts">
	import type { email } from '@prisma/client';
	import { onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import Selector from './Selector.svelte';
	import Tag from './Tag.svelte';

	let store: Writable<UserState>;

	export let item: email;
	export let selected: Selectable;
	export let style = '';

	// TODO email card layout
	let scrollPosition = { header: { x: 0, remainingWidth: 0 } };
	let header: HTMLHeadingElement;

	onMount(async () => {
		store = (await import('$lib/sessionStorage')).store;
		scrollPosition.header.remainingWidth = header.scrollWidth - header.clientWidth;
		// only set valid position if element is scrollable
		scrollPosition.header.x = scrollPosition.header.remainingWidth == 0 ? 0 : 1;
	});

	$: console.log(scrollPosition);
</script>

<button on:mousedown={(e) => (selected.name = item.rowid)} class="{style} p-2 rounded bg-paper-500">
	<section class="flex flex-col w-60 relative">
		<span class="relative pb-2">
			<h1
				bind:this={header}
				on:scroll={() => {
					scrollPosition.header.x = header.scrollLeft + 1;
				}}
				class:scrollable={scrollPosition.header.x > 0}
				class:scrolled={scrollPosition.header.x > 1}
				class:scrolled__max={scrollPosition.header.remainingWidth < scrollPosition.header.x}
			>
				{item.subject}
			</h1>
		</span>
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
		overflow: hidden;
		white-space: nowrap;
		width: auto;
		height: auto;
		padding-bottom: 4px;
	}
	h1::before {
		content: '';
		position: absolute;
		bottom: 0;
		height: 100%;
		width: 100%;
		pointer-events: none;
	}
	h1::-webkit-scrollbar {
		top: -10px;
	}
	h1::-webkit-scrollbar-track {
		background-color: transparent;
	}
	h1::-webkit-scrollbar-thumb {
		background-color: theme('colors.paper.700');
		border-radius: 20px;
		border: 6px solid transparent;
		background-clip: content-box;
	}
	h1::-webkit-scrollbar-thumb:hover {
		border: 5px solid transparent;
		background-clip: content-box;
		background-color: gray;
	}
	h1::-webkit-scrollbar-thumb:active {
		background-clip: content-box;
		background-color: theme('colors.peacockFeather.500');
	}
	.stats {
		text-align: start;
		display: flex;
		flex-direction: column;
		padding-left: 1em;
	}
	.scrollable:hover {
		overflow-x: scroll;
		/* prevent scrollbar from changing container dimensions in webkit */
		overflow-x: overlay;
	}
	.scrollable::before {
		background: linear-gradient(to right, transparent 90%, theme('colors.paper.500') 97%);
	}
	.scrolled::before {
		background: linear-gradient(
			to right,
			var(--color-bg-2) 3%,
			transparent 10%,
			transparent 90%,
			var(--color-bg-2) 97%
		);
	}
	.scrolled__max::before {
		background: linear-gradient(to right, var(--color-bg-2) 3%, transparent 10%);
	}
</style>
