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

	// TODO drag-to-scroll
</script>

<button on:mousedown={(e) => (selected.name = item.rowid)} class="{style} p-2 rounded bg-paper-500">
	<section class="flex flex-col w-60 relative">
		<span class="relative pb-2">
			<h1
				title={scrollPosition.header.x > 0 ? item.subject : null}
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

	.stats {
		text-align: start;
		display: flex;
		flex-direction: column;
		padding-left: 1em;
	}
</style>
