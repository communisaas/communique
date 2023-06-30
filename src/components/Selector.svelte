<script lang="ts">
	import { onMount, type ComponentType } from 'svelte';

	export let items: Selectable[] | string[];
	export let selectable: ComponentType; // type of item
	export let selected: Selectable; // selected item
	export let target: SelectableKey; // TODO remove
	export let alignment: 'start' | 'end' | 'center' | 'justify' | 'match-parent';
	export let overflow: 'scroll' | 'hidden' | 'visible' | 'wrap' = 'hidden';
	export let scrollable = true;
	export let itemStyle: string = '';
	export let selectorStyle: string = '';
	export let backgroundColor: string = '';

	const listStyle = `p-1 flex grow ${
		alignment == 'end' ? 'flex-row-reverse items-end' : 'flex-row'
	} gap-3  overflow-x-hidden ${
		overflow == 'wrap'
			? 'whitespace-normal flex-wrap gap-y-1'
			: 'whitespace-nowrap hover:overflow-x-' + overflow
	} ${selectorStyle}`;

	let scrollPosition = { x: 0, remainingWidth: 0, startX: 0, startScrollLeft: 0 };

	let resizeObserver: ResizeObserver;
	let list: HTMLElement;
	let scrolled: boolean;
	onMount(async () => {
		selected.target = target;
		resizeObserver = new ResizeObserver(() => {
			updateScrollableElements();
		});

		resizeObserver.observe(list);
	});

	function updateScrollableElements() {
		if (list) {
			scrollPosition.remainingWidth = list.scrollWidth - list.clientWidth;
			scrollable = scrollPosition.remainingWidth == 0 ? false : true;
			scrolled = scrollPosition.x > 1;
		}
	}

	$: {
		if (items && list && scrollable) {
			// update if new list litems
			updateScrollableElements();
		}
	}
</script>

<section class="relative overflow-hidden">
	<div
		bind:this={list}
		style="--backgroundColor: {backgroundColor}"
		class={listStyle}
		class:scrollable
		class:scrolled
		class:scrolled__max={scrolled && scrollPosition.remainingWidth - scrollPosition.x <= 1}
		on:wheel={(e) => {
			if (scrollable) {
				e.preventDefault();
				list.scrollLeft += Math.abs(e.deltaX) > 0 ? e.deltaX : e.deltaY * 0.33;
				scrollPosition.x = list.scrollLeft + 1;
			}
		}}
		on:touchstart={(e) => {
			if (scrollable) {
				scrollPosition.startX = e.touches[0].pageX;
				scrollPosition.startScrollLeft = list.scrollLeft;
			}
		}}
		on:touchmove={(e) => {
			if (scrollable) {
				e.preventDefault();
				const x = e.touches[0].pageX;
				const walk = x - scrollPosition.startX; // 3: scroll-fastness
				list.scrollLeft = scrollPosition.startScrollLeft - walk;
				scrollPosition.x = list.scrollLeft + 1;
			}
		}}
		on:touchend={() => {
			if (scrollable) {
				scrollPosition.startX = 0;
				scrollPosition.startScrollLeft = 0;
			}
		}}
	>
		{#each items as item}
			<svelte:component
				this={selectable}
				bind:selected
				style={itemStyle}
				{item}
				on:select
				on:blur
				on:externalAction
			/>
		{/each}
	</div>
</section>

<style lang="scss">
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
			content: '';
			pointer-events: none;
			display: block;
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			background: linear-gradient(to right, transparent 85%, var(--backgroundColor) 97%);
		}
	}

	.scrolled::before {
		background: linear-gradient(
			to right,
			var(--backgroundColor) 3%,
			transparent 15%,
			transparent 85%,
			var(--backgroundColor) 97%
		);
	}

	.scrolled__max::before {
		content: '';
		display: block;
		top: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(to right, var(--backgroundColor) 3%, transparent 15%);
	}
</style>
