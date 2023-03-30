<script lang="ts">
	import Selector from './Selector.svelte';
	import type { ComponentType } from 'svelte';

	export let header: string;
	export let alignment: 'start' | 'end' | 'center' | 'justify' | 'match-parent';

	export let selectable: ComponentType;
	export let selected: Selectable;
	export let items: Selectable[];

	// TODO expand mode, expose gradient background props
</script>

<section class="flex flex-col relative pb-5 px-5 gradient-background">
	<span class="tab__{alignment}" style="align-self: {alignment}"
		><h1 style="text-align: {alignment}; ">{header}</h1></span
	>
	<span class="control">
		<slot />
	</span>
	<Selector {selectable} {items} {alignment} target={selected.type} bind:selected on:select />
</section>

<style lang="scss">
	h1 {
		background-color: theme('colors.peacockFeather.600');
		color: white;
	}
	.tab {
		&__start {
			margin-left: -1.25rem;
			margin-bottom: 1rem;
			filter: drop-shadow(-1px 2px 1px theme('colors.larimarGreen.600'));
			& h1 {
				text-align: right;
				vertical-align: middle;
				padding: 0.5rem 1rem;
				display: flex;
				padding-right: 3rem;
				clip-path: polygon(0 0, 100% 0, 90% 100%, 0 100%);
			}
		}
		&__end {
			margin-right: -1.25rem;
			margin-bottom: 1rem;
			filter: drop-shadow(-1px 2px 1px theme('colors.larimarGreen.600'));
			& h1 {
				text-align: right;
				vertical-align: middle;
				padding: 0.5rem 1rem;
				display: flex;
				padding-left: 3rem;
				clip-path: polygon(0 0, 100% 0, 100% 100%, 10% 100%);
			}
		}
	}

	.gradient-background {
		background: linear-gradient(
			90deg,
			theme('colors.peacockFeather.500'),
			theme('colors.larimarGreen.600')
		);
	}
</style>
