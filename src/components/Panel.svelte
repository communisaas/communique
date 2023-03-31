<script lang="ts">
	import Selector from './Selector.svelte';
	import { createEventDispatcher, type ComponentType } from 'svelte';
	import { handleSelect } from '$lib/selectable';

	export let header: string;
	export let alignment: 'start' | 'end' | 'center' | 'justify' | 'match-parent';

	export let selectable: ComponentType;
	export let selected: Selectable;
	export let items: Selectable[];

	let expand: boolean;
	let expandable: HTMLElement;
	const dispatch = createEventDispatcher();

	// TODO expose gradient background props
</script>

<section class="flex flex-col relative pb-5 px-5 gradient-background">
	<span class="tab tab__{alignment}" style="align-self: {alignment}"
		><h1 style="text-align: {alignment}; ">{header}</h1></span
	>
	<span class="control">
		<slot />
	</span>
	<Selector
		{selectable}
		{items}
		{alignment}
		target={selected.type}
		bind:selected
		on:select={(e) => {
			expand = true;
			console.log('focused');
			if (e.detail.type !== selected.type) {
				dispatch('select', e.detail);
			}
		}}
	/>
</section>
{#if expand}
	<aside bind:this={expandable} tabindex="-1">item</aside>
{/if}

<style lang="scss">
	section {
		box-shadow: 0 2.5px 1px theme('colors.peacockFeather.500');
		transition: all 0.175s ease-in-out;
		&:hover {
			box-shadow: 0 2.5px 1px theme('colors.peacockFeather.600');
		}
	}
	h1 {
		background-color: theme('colors.peacockFeather.600');
		color: white;
	}
	.tab {
		filter: drop-shadow(-1px 2px 1px theme('colors.larimarGreen.600'));

		&__start {
			margin-left: -1.25rem;
			margin-bottom: 1rem;
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
