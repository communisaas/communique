<script lang="ts">
	import type { ComponentType } from 'svelte';

	export let items: string[];
	export let selectable: ComponentType;
	export let selected: Selectable;

	export let style: string = '';
</script>

<ul class="px-10 py-1 flex flex-row justify-end gap-5">
	{#each items as item, index}
		<svelte:component this={selectable} bind:selected {style} {item} {index} />
	{/each}
</ul>
