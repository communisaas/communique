<script lang="ts">
	import type { ComponentType } from 'svelte';

	export let items: Selectable[] | string[];
	export let selectable: ComponentType;
	export let selected: Selectable;
	export let alignment: string;

	export let style: string = '';

	// TODO overflowing items
</script>

<ul class="px-1 py-1 flex flex-row gap-5" style="justify-content: {alignment}">
	{#each items as item, index}
		<svelte:component this={selectable} bind:selected {style} {item} {index} />
	{/each}
</ul>
