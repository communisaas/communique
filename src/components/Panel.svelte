<script lang="ts">
	import Selector from './Selector.svelte';
	import type { ComponentType } from 'svelte';

	export let header: string;
	export let headerAlign:
		| 'start'
		| 'end'
		| 'left'
		| 'right'
		| 'center'
		| 'justify'
		| ' match-parent';

	export let selectable: ComponentType;
	export let selected: Selectable;
	export let items: string[];
</script>

<h1 style={'text-align: ' + headerAlign}>{header}</h1>
<Selector {selectable} {items} bind:selected />

<style>
	h1 {
		text-align: right;
		margin: -0.25em 1em 0.5em 1em;
	}
</style>
