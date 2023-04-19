<script lang="ts">
	import type { email } from '@prisma/client';
	import { createEventDispatcher, onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import Selector from './Selector.svelte';
	import Tag from './Tag.svelte';
	import Reader from './Reader.svelte';

	export let item: email;
	export let selected: Selectable;
	export let style = '';

	let store: Writable<UserState>;

	const dispatch = createEventDispatcher();

	// TODO email card layout
	$: scrollPosition = { x: 0, remainingWidth: 0 };
	let header: HTMLHeadingElement;
	let actionButton: HTMLInputElement;
	let card: HTMLButtonElement;
	let scrollable: boolean, scrolled: boolean;

	onMount(async () => {
		store = (await import('$lib/sessionStorage')).store;
		if (header) scrollPosition.remainingWidth = header.scrollWidth - header.clientWidth;
	});

	$: {
		if (item && header) {
			scrollPosition.remainingWidth = header.scrollWidth - header.clientWidth;
			scrollable = scrollPosition.remainingWidth > 0;
			scrolled = scrollPosition.x > 1;
		}
	}

	$: expand = true;

	function handleSelect() {
		if (selected.id != item.rowid) {
			selected.id = item.rowid;
		}
		expand = true;
		dispatch('select', selected);
	}

	function handleBlur(event: FocusEvent) {
		if (event.relatedTarget instanceof HTMLElement) {
			if (!card.contains(event.relatedTarget)) expand = false;
		} else expand = false;
	}
</script>

<button
	bind:this={card}
	on:mousedown={handleSelect}
	on:keypress={(e) => {
		if (e.key === 'Enter') {
			handleSelect();
		}
	}}
	on:blur={handleBlur}
	class="{style} p-2 m-1 rounded bg-paper-500 w-[95%] min-h-[11.5rem] max-w-4xl"
>
	<section class="flex flex-col relative">
		{#if store}
			<h1
				title={scrollPosition.x > 0 ? item.subject : null}
				bind:this={header}
				on:wheel={(e) => {
					header.scrollLeft += Math.abs(e.deltaX) > 0 ? e.deltaX : e.deltaY * 0.33;
					scrollPosition.x = header.scrollLeft + 1;
					if (scrollable) {
						e.preventDefault();
					}
				}}
				class:scrollable
				class:scrolled
				class:scrolled__max={scrollable && scrollPosition.remainingWidth < scrollPosition.x}
			>
				{item.subject}
			</h1>
			<article class="flex flex-row">
				<div>
					<Selector
						selectable={Tag}
						items={item.topic_list}
						itemStyle="text-[11px]"
						alignment="start"
						overflow="scroll"
						target="email"
						bind:selected={$store.topic}
						on:select
						on:blur={handleBlur}
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
						on:blur={handleBlur}
					/>
				</div>
				<div class="basis-4/6 text-right">
					<Reader bind:actionButton {expand} email={item} on:blur={handleBlur} />
				</div>
			</article>
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
		white-space: nowrap;
		overflow: scroll;
		overflow-x: overlay;
		min-width: 100%;
		padding-bottom: 0;
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
