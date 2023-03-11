<script lang="ts">
	import Selector from './Selector.svelte';
	import type { ComponentType } from 'svelte';

	export let header: string;
	export let alignment: 'start' | 'end' | 'left' | 'right' | 'center' | 'justify' | 'match-parent';

	export let selectable: ComponentType;
	export let selected: Selectable;
	export let items: string[];

	// TODO expand mode, expose gradient background props
</script>

<section class={`flex flex-col pb-5 gradient-background`}>
	<h1 style={'text-align: ' + alignment}>{header}</h1>
	<Selector {selectable} {items} {alignment} bind:selected />
</section>

<style>
	h1 {
		text-align: right;
		margin: 2rem;
		margin-bottom: 1rem;
	}
	.gradient-background {
		background: linear-gradient(
			90deg,
			theme('colors.peacockFeather.500'),
			theme('colors.larimarGreen.600')
		);
	}
</style>
