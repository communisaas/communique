<script lang="ts">
	import Selector from './Selector.svelte';
	import { createEventDispatcher, onMount, type ComponentType, tick } from 'svelte';
	import type { Writable } from 'svelte/store';
	import Page from '../routes/+page.svelte';

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

	let expand = false;
</script>

{#if store}
	<section
		class:section__active={expand}
		class="flex flex-col relative pb-5 px-5 gradient-background"
	>
		<span class="tab tab__{alignment}" style="align-self: {alignment}">
			<h1 class="text-paper-500" style="text-align: {alignment}; ">
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
			selectorStyle="flex-col min-h-[13rem]"
			target={selected.type}
			bind:selected
			on:select={async (e) => {
				if (e.detail.type === selected.type) {
					expand = true; // selected item is targeting the panel selectable
				} else if (e.detail.type === 'topic' || e.detail.type === 'recipient') {
					window.scrollTo({ top: 0, behavior: 'smooth' }); // TODO handle this in parent page component
					dispatch('select', e.detail);
				} else {
					dispatch('select', e.detail);
				}
			}}
			on:blur
		/>
	</section>
{/if}

<style lang="scss">
	section {
		transition: all 0.5s ease-in-out;
	}
	h1 {
		background-color: theme('colors.peacockFeather.700');
		width: fit-content;
	}
	.tab {
		filter: drop-shadow(-1px 2px 1px theme('colors.larimarGreen.700'));

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
			theme('colors.peacockFeather.600'),
			theme('colors.teal.700')
		);
	}
</style>
