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

	let headerElement: HTMLHeadingElement;
	let canvas: HTMLCanvasElement, context: CanvasRenderingContext2D;
	let headerWidth: number;
	$: context && headerElement ? (headerWidth = context.measureText(header).width) : null;
	onMount(async () => {
		store = (await import('$lib/sessionStorage')).store;
		canvas = document.createElement('canvas');
		context = canvas.getContext('2d') as CanvasRenderingContext2D;
		if (context && headerElement) {
			console.log(headerElement);
			context.font = getComputedStyle(headerElement).font;
			headerWidth = context.measureText(header).width + 20;
		}
	});

	$: expand = false;
</script>

{#if store}
	<section
		class:section__active={expand}
		class="flex flex-col relative pb-5 px-5 panel panel__{alignment}"
		style="--headerWidth: {(headerWidth ** (1 / headerWidth) * Math.log(headerWidth) * 500) /
			(headerWidth * 0.52)}em;"
	>
		<span class="tab tab__{alignment}" style="align-self: {alignment}">
			<h1 bind:this={headerElement} style="text-align: {alignment}; ">
				{header}
			</h1>
		</span>
		<span class="control">
			<slot />
		</span>
		<div>
			<Selector
				{selectable}
				{items}
				{alignment}
				selectorStyle="flex-col min-h-[13rem]"
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
		</div>
	</section>
{/if}

<style lang="scss">
	section {
		transition: all 0.5s ease-in-out;
	}
	h1 {
		color: white;
		width: fit-content;
	}
	.tab {
		&__start {
			margin-left: -1.25rem;
			margin-bottom: 1rem;
			& h1 {
				text-align: right;
				vertical-align: middle;
				padding: 0.5rem 0.75rem;
				display: flex;
				padding-right: calc(1.5em + 10pt);
			}
		}
		&__end {
			margin-right: -1.25rem;
			margin-bottom: 1rem;
			& h1 {
				text-align: right;
				vertical-align: middle;
				padding: 0.25rem 0.75rem;
				display: flex;
				padding-left: calc(1.5em + 10pt);
			}
		}
	}

	.panel {
		position: relative;
		&__start::before {
		}
		&__end::before {
			content: '';
			display: inline-block;
			position: absolute;
			top: 0;
			right: 0;
			width: 100%;
			height: 100%;
			clip-path: polygon(
				0 0,
				var(--headerWidth) 0,
				calc(var(--headerWidth) + 11px) 3.9rem,
				100% 3.9rem,
				100% 80%,
				100% 100%,
				10% 100%,
				0 100%
			);
			background: linear-gradient(
				90deg,
				theme('colors.peacockFeather.500'),
				theme('colors.larimarGreen.600')
			);
		}
	}
</style>
