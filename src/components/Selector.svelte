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

	const listStyle = `p-1 flex grow ${
		alignment == 'end' ? 'flex-row-reverse items-end' : 'flex-row'
	} gap-3  overflow-x-hidden ${
		overflow == 'wrap'
			? 'whitespace-normal flex-wrap gap-y-1'
			: 'whitespace-nowrap hover:overflow-x-' + overflow
	} ${selectorStyle}`;

	let scrollPosition = { x: 0, remainingWidth: 0 };

	let list: HTMLElement;
	let scrolled: boolean;
	onMount(async () => {
		selected.target = target;
	});

	$: {
		if (items && list && scrollable) {
			// update if new list litems
			scrollPosition.remainingWidth = list.scrollWidth - list.clientWidth;
			scrollable = scrollPosition.remainingWidth == 0 ? false : true;
			scrolled = scrollPosition.x > 1;
		}
	}
</script>

<div
	bind:this={list}
	class={listStyle}
	class:scrollable
	class:scrolled
	class:scrolled__max={scrolled && scrollPosition.remainingWidth - scrollPosition.x <= 1}
	on:wheel={(e) => {
		list.scrollLeft += Math.abs(e.deltaX) > 0 ? e.deltaX : e.deltaY * 0.33;
		scrollPosition.x = list.scrollLeft + 1;
		if (scrollable) {
			e.preventDefault();
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

<style lang="scss">
	.scrollable {
		width: auto;

		&::before {
			content: '';
			position: absolute;
			bottom: 0;
			height: 100%;
			width: 100%;
			pointer-events: none;
			background: linear-gradient(to right, transparent 90%, var(--color-bg-2) 97%);
			transform: scaleX(1.01);
			z-index: 10;
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
		transform: scaleX(1.01);

		z-index: 10;
	}
	.scrolled__max::before {
		background: linear-gradient(to right, var(--color-bg-2) 3%, transparent 10%);

		z-index: 10;
	}
</style>
