<script lang="ts">
	import { createEventDispatcher, onMount, type DispatchOptions } from 'svelte/internal';
	import type { Writable } from 'svelte/store';
	export let item: string;
	export let selected: Selectable;
	export let style = '';

	let store: Writable<UserState>;

	const dispatch = createEventDispatcher();

	let tag: HTMLInputElement;
	let canvas: HTMLCanvasElement, context: CanvasRenderingContext2D;
	let tagWidth: number;
	$: context ? (tagWidth = context.measureText(item).width + 20) : null,
		onMount(async () => {
			store = (await import('$lib/sessionStorage')).store;

			canvas = document.createElement('canvas');
			context = canvas.getContext('2d') as CanvasRenderingContext2D;
			if (context) {
				context.font = getComputedStyle(tag).font;
				tagWidth = context.measureText(item).width + 20;
			}
		});

	function handleSelect() {
		if (selected.id != item) {
			selected.id = item;
		}
		dispatch('select', selected);
	}
</script>

<span>
	<input
		readonly
		class="cursor-pointer text-center px-2 py-1 rounded bg-larimarGreen-600 overflow-visible {style} "
		style:width="{tagWidth}px"
		value={item}
		bind:this={tag}
		on:mousedown|stopPropagation={() => {
			handleSelect();
		}}
		on:keypress|stopPropagation={(e) => {
			if (e.key === 'Enter') {
				handleSelect();
			}
		}}
		on:blur
	/>
</span>

<style lang="scss">
	input {
		&:hover {
			transform: translateY(-1px);
			box-shadow: rgba(0, 0, 0, 0.16) 0 1px 4px;

			transition: 0.1s ease-in;
		}
		&:active {
			transform: translateY(1px);
			transition: 0.1s ease-in-out;
		}
	}
</style>
