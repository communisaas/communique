<script lang="ts">
	import Selector from './Selector.svelte';
	import { createEventDispatcher, onMount, type ComponentType } from 'svelte';
	import type { Writable } from 'svelte/store';

	export let header: string;
	export let alignment: 'start' | 'end' | 'center' | 'justify' | 'match-parent';

	export let selectable: ComponentType;
	export let selected: Selectable;
	export let items: Selectable[];

	const dispatch = createEventDispatcher();

	let store: Writable<UserState>;

	onMount(async () => {
		store = (await import('$lib/sessionStorage')).store;
	});

	$: expand = false;
	$: console.log(expand);
</script>

{#if store}
	<section
		class:section__active={expand}
		class="flex flex-col relative pb-5 px-5 gradient-background"
		on:blur={(e) => {
			expand = false;
			console.log(e);
		}}
	>
		<span class="tab tab__{alignment}" style="align-self: {alignment}">
			<h1 style="text-align: {alignment}; ">
				{header}
			</h1>
		</span>
		<span class="control">
			<slot />
		</span>
		<Selector
			{selectable}
			{items}
			{alignment}
			selectorStyle="flex-col"
			target={selected.type}
			bind:selected
			on:select={(e) => {
				// if selected item is targeting the panel selectable
				if (e.detail.type === selected.type) {
					expand = true;
				} else {
					dispatch('select', e.detail);
					// actionButton.focus();
				}
			}}
			on:blur
		/>
	</section>
{/if}

<style lang="scss">
	section {
		box-shadow: 0 2.5px 1px theme('colors.peacockFeather.500');
		transition: all 0.5s ease-in-out;
		&:hover {
			box-shadow: 0 2.5px 1px theme('colors.peacockFeather.600');
		}
	}
	h1 {
		background-color: theme('colors.peacockFeather.600');
		color: white;
		width: fit-content;
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
				padding-right: calc(1.5em + 10pt);
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
				padding-left: calc(1.5em + 10pt);
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
