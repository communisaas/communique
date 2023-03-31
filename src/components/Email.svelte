<script lang="ts">
	import type { email } from '@prisma/client';
	import { createEventDispatcher, onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import Selector from './Selector.svelte';
	import Tag from './Tag.svelte';

	export let item: email;
	export let selected: Selectable;
	export let style = '';

	let store: Writable<UserState>;

	const dispatch = createEventDispatcher();

	// TODO email card layout
	$: scrollPosition = { x: 0, remainingWidth: 0 };
	let header: HTMLHeadingElement;
	let scrollable: boolean, scrolled: boolean;

	onMount(async () => {
		store = (await import('$lib/sessionStorage')).store;
		scrollPosition.remainingWidth = header.scrollWidth - header.clientWidth;
	});

	$: {
		if (item && header) {
			scrollPosition.remainingWidth = header.scrollWidth - header.clientWidth;
			scrollable = scrollPosition.remainingWidth > 0;
			scrolled = scrollPosition.x > 1;
		}
	}
</script>

<button
	on:mousedown={() => {
		if (selected.name != item.rowid) {
			selected.name = item.rowid;
		}
		dispatch('select', selected);
	}}
	class="{style} p-2 m-1 rounded bg-paper-500"
>
	<section class="flex flex-col w-60 relative">
		{#if store}
			<span class="relative ">
				<h1
					title={scrollPosition.x > 0 ? item.subject : null}
					bind:this={header}
					on:wheel|preventDefault={(e) => {
						header.scrollLeft += Math.abs(e.deltaX) > 0 ? e.deltaX : e.deltaY * 0.33;
						scrollPosition.x = header.scrollLeft + 1;
					}}
					class:scrollable
					class:scrolled
					class:scrolled__max={scrollable && scrollPosition.remainingWidth < scrollPosition.x}
				>
					{item.subject}
				</h1>
			</span>
			<Selector
				selectable={Tag}
				items={item.topic_list}
				itemStyle="text-[11px]"
				alignment="start"
				overflow="scroll"
				target="email"
				bind:selected={$store.topic}
				on:select
			/>
			<div class="stats p-1">
				<span>reads: {item.open_count}</span>
				<span>sends: {item.send_count}</span>
			</div>

			<Selector
				selectable={Tag}
				items={item.recipient_list}
				itemStyle="text-[11px] bg-teal-500"
				alignment="start"
				overflow="scroll"
				target="email"
				bind:selected={$store.recipient}
				on:select
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
		&::before {
			content: '';
			position: absolute;
			bottom: 0;
			height: 100%;
			width: 100%;
		}
	}
	.stats {
		text-align: start;
		display: flex;
		flex-direction: column;
		padding-left: 1em;
	}
	.scrollable {
		scrollbar-width: none;
		&::-webkit-scrollbar {
			display: none;
		}

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
