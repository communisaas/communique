<script lang="ts">
	import { onMount, type ComponentType } from 'svelte';

	export let items: Selectable[] | string[];
	export let selectable: ComponentType;
	export let selected: Selectable;
	export let alignment: 'right' | 'left';
	export let overflow: 'scroll' | 'hidden' | 'visible' = 'hidden';

	export let style: string = '';

	// TODO overflowing items
	let scrollPosition = { list: { x: 0, remainingWidth: 0 } };

	let list: HTMLUListElement;

	onMount(async () => {
		scrollPosition.list.remainingWidth = list.scrollWidth - list.clientWidth;
		// only set valid position if element is scrollable
		scrollPosition.list.x = scrollPosition.list.remainingWidth == 0 ? 0 : 1;
	});
</script>

<ul
	bind:this={list}
	class="px-1 py-1 flex flex-row-reverse gap-5 overflow-x-hidden hover:overflow-x-{overflow} whitespace-nowrap"
	style="justify-content:{alignment}"
	on:wheel={(e) => {
		e.currentTarget.scrollLeft += e.deltaY * 0.15;
	}}
	on:scroll={(e) => {
		scrollPosition.list.x = e.currentTarget.scrollLeft + 1;
	}}
>
	{#each items as item}
		<svelte:component this={selectable} bind:selected {style} {item} />
	{/each}
</ul>
