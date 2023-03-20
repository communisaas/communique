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

	// TODO hover-to-scroll
</script>

<button on:mousedown={(e) => (selected.name = item.rowid)} class="{style} p-2 rounded bg-paper-500">
	<section class="flex flex-col w-60 relative">
		<span class="relative pb-2">
			<h1
				title={scrollPosition.header.x > 0 ? item.subject : null}
				bind:this={header}
				on:wheel={(e) => {
					header.scrollLeft += e.deltaY * 0.15;
				}}
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
				overflow="scroll"
			/>
			<Selector
				selectable={Tag}
				items={item.recipient_list}
				bind:selected={$store.recipient}
				style="text-[12px] bg-teal-500"
				alignment="right"
				overflow="scroll"
			/>
		{/if}
	</section>
</button>

<style lang="scss">
	button {
		transition: 0.2s ease-out;
		&:hover {
			transform: scale(1.01);
			box-shadow: theme('colors.peacockFeather.600') 0 0 2px 2px;
			transition: 0.1s ease-in;
		}
		&:active {
			transform: scale(1);
			box-shadow: unset;
			transition: 0.1s ease-in-out;
			box-shadow: theme('colors.paper.700') 0 0 2px 2px;
		}
	}
	h1 {
		font-size: 1.4rem;
		text-align: start;
		font-weight: 600;
		overflow: hidden;
		white-space: nowrap;
		width: auto;
		padding-bottom: 4px;
		&::before {
			content: '';
			position: absolute;
			bottom: 0;
			height: 100%;
			width: 100%;
			pointer-events: none;
		}
	}
	.stats {
		text-align: start;
		display: flex;
		flex-direction: column;
		padding-left: 1em;
	}
	.scrollable {
		&:hover {
			overflow-x: scroll;
			/* prevent scrollbar from changing container dimensions in webkit */
			overflow-x: overlay;
		}
		&::before {
			background: linear-gradient(to right, transparent 90%, var(--color-bg-2) 97%);
			transform: scaleX(1.01);
		}
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
