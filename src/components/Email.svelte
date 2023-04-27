<script lang="ts">
	import type { email } from '@prisma/client';
	import { createEventDispatcher, onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import Selector from './Selector.svelte';
	import Tag from './Tag.svelte';
	import Reader from './Reader.svelte';
	import Recipient from './icon/Recipient.svelte';
	import Sent from './icon/Sent.svelte';

	export let item: email;
	export let selected: Selectable;
	export let style = '';

	let store: Writable<UserState>;

	const dispatch = createEventDispatcher();

	// TODO email card layout
	$: scrollPosition = { header: { x: 0, remainingWidth: 0 }, card: { x: 0, remainingWidth: 0 } };
	let header: HTMLHeadingElement;
	let actionButton: HTMLInputElement;
	let card: HTMLButtonElement;
	let reader: HTMLElement;
	let scrollableElements: { [key: string]: HTMLElement };

	onMount(async () => {
		store = (await import('$lib/sessionStorage')).store;
		scrollableElements = { card, header };
		if (card && header) {
			for (const [name, element] of Object.entries(scrollableElements)) {
				scrollPosition[name as keyof typeof scrollPosition].remainingWidth =
					element.scrollWidth - element.clientWidth;
			}
		}
	});

	$: expand = false;
	$: console.log(scrollPosition);
	$: actionButton && document.activeElement != actionButton ? (expand = false) : null;
	function handleSelect() {
		if (selected.id != item.rowid) {
			selected.id = item.rowid;
		}
		expand = true;
		actionButton.focus();
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
	class="{style} flex p-2 m-1 rounded bg-paper-500 w-[95%] min-h-[15.5rem] max-w-4xl "
	style="min-width: {expand ? '99%' : '95%'}"
>
	<section
		class="flex flex-col relative {!expand
			? 'cardWrapper'
			: ''} min-h-[14.5rem] min-w-[inherit] overflow-hidden"
	>
		{#if store}
			<h1
				title={scrollPosition.header.x > 0 ? item.subject : null}
				bind:this={header}
				on:wheel={(e) => {
					header.scrollLeft += Math.abs(e.deltaX) > 0 ? e.deltaX : e.deltaY * 0.33;
					scrollPosition.header.x = header.scrollLeft + 1;
					if (scrollPosition.header.remainingWidth > 0) {
						e.preventDefault();
					}
				}}
				class:scrollable={scrollPosition.header.remainingWidth > 0}
				class:scrolled={scrollPosition.header.x > 1}
				class:scrolled__max={scrollPosition.header.remainingWidth > 0 &&
					scrollPosition.header.remainingWidth < scrollPosition.header.x}
				class="max-w-fit inline-block"
			>
				{item.subject}
			</h1>
			<article class="flex justify-between" style="flex-direction:{!expand ? 'row' : 'column'}">
				<div>
					<div class="stats p-1 flex flex-row gap-x-5">
						<span title="Read count" class="flex flex-row items-center ">
							<icon class="max-w-[36px]" style="filter: drop-shadow(1px 1px 1px rgb(0 0 0 / 0.4));">
								<Recipient color="#005F73" />
							</icon>
							{item.open_count}
						</span>
						<span title="Send count" class="flex flex-row items-center gap-x-1.5">
							<icon class="max-w-[36px]" style="filter: drop-shadow(1px 1px 1px rgb(0 0 0 / 0.4));">
								<Sent color="#005F73" />
							</icon>
							{item.send_count}
						</span>
					</div>
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
				<div
					style="text-align: initial"
					class="whitespace-normal "
					class:scrollableY={!expand}
					bind:this={reader}
				>
					<Reader bind:actionButton {expand} email={item} on:blur={handleBlur} />
				</div>
			</article>
		{/if}
	</section>
</button>

<style lang="scss">
	.cardWrapper {
		&::after {
			background: linear-gradient(to top, var(--color-bg-2) 0%, transparent 10%);
			content: '';
			position: absolute;
			bottom: -1px;
			margin-bottom: -1px;
			height: 100%;
			width: 100%;
		}
	}
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
		flex-direction: row;
		padding-left: 1em;
	}
	.scrollable {
		scrollbar-width: none;
		&::-webkit-scrollbar {
			display: none;
		}

		&:hover {
			overflow: scroll;
			/* prevent scrollbar from changing container dimensions in webkit */
			overflow: overlay;
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
