<script lang="ts">
	import { onMount, type ComponentType } from 'svelte';

	export let items: Selectable[] | string[];
	export let selectable: ComponentType;
	export let selected: Selectable;
	export let target: SelectableKey;
	export let alignment: 'right' | 'left' | 'start' | 'end' | 'center' | 'justify' | 'match-parent';
	export let overflow: 'scroll' | 'hidden' | 'visible' = 'hidden';
	export let itemStyle: string = '';

	const listStyle = `py-1 flex flex-row-reverse gap-5 overflow-x-hidden hover:overflow-x-${overflow} whitespace-nowrap`;

	// TODO overflowing items
	let scrollPosition = { list: { x: 0, remainingWidth: 0 } };

	let list: HTMLUListElement;

	onMount(async () => {
		selected.target = target;
		scrollPosition.list.remainingWidth = list.scrollWidth - list.clientWidth;
		// only set valid position if element is scrollable
		scrollPosition.list.x = scrollPosition.list.remainingWidth == 0 ? 0 : 1;
	});

	$: console.log(scrollPosition);
</script>

<div class="relative z-0">
	<ul
		bind:this={list}
		class={listStyle}
		style="justify-content:{alignment};"
		class:scrollable={scrollPosition.list.x > 0}
		class:scrolled={scrollPosition.list.x > 1}
		class:scrolled__max={scrollPosition.list.remainingWidth - scrollPosition.list.x <= 1}
		on:wheel|preventDefault={(e) => {
			e.currentTarget.scrollLeft += e.deltaY * 0.15;
		}}
		on:scroll={(e) => {
			scrollPosition.list.x = Math.abs(e.currentTarget.scrollLeft + 1);
		}}
	>
		{#each items as item}
			<svelte:component this={selectable} bind:selected style={itemStyle} {item} on:select />
		{/each}
	</ul>
</div>

<style lang="scss">
	.scrollable {
		overflow: hidden;
		white-space: nowrap;
		width: auto;

		&::before {
			content: '';
			position: absolute;
			bottom: 0;
			height: 100%;
			width: 100%;
			pointer-events: none;
			background: linear-gradient(to right, var(--color-bg-2) 3%, transparent 10%);
			transform: scaleX(1.02);
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
		transform: scaleX(1.02);

		z-index: 10;
	}
	.scrolled__max::before {
		background: linear-gradient(to right, transparent 97%, var(--color-bg-2) 100%);
		z-index: 10;
	}
</style>
