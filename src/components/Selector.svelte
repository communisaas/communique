<script lang="ts">
	import type { ComponentType } from 'svelte';

	export let items: string[];
	export let selectable: ComponentType;
	export let selected: string = '';
	export let style = '';
</script>

<ul class="px-10 py-1 flex flex-row justify-end gap-5">
	{#each items as item}
		<svelte:component this={selectable} {selected} {style} {item} />
	{/each}
</ul>
