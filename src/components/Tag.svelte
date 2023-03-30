<script lang="ts">
	import { createEventDispatcher, onMount, type DispatchOptions } from 'svelte/internal';
	import type { Writable } from 'svelte/store';
	export let item: string;
	export let selected: Selectable;
	export let style = '';

	let store: Writable<UserState>;

	const dispatch = createEventDispatcher();

	$: contentLengthScalar = Math.sqrt(item.length / 1.5) * Math.SQRT2;

	let scrollPosition = { x: 0, remainingWidth: 0 };
	let tag: HTMLInputElement;
	let scrollable: boolean, scrolled: boolean;
	onMount(async () => {
		store = (await import('$lib/sessionStorage')).store;
		scrollPosition.remainingWidth = tag.scrollWidth - tag.clientWidth;
	});

	$: {
		if (item && tag) {
			// update if new list litems
			scrollPosition.remainingWidth = tag.scrollWidth - tag.clientWidth;
			scrollable = scrollPosition.remainingWidth == 0 ? false : true;
			scrolled = scrollPosition.x > 1;
		}
	}
</script>

<input
	readonly
	class="cursor-pointer text-center px-2 py-1 rounded bg-larimarGreen-600 {style} "
	style:width="calc(2em*{contentLengthScalar})"
	value={item}
	title={scrollPosition.x > 0 ? item : null}
	bind:this={tag}
	on:mousedown|stopPropagation={() => {
		if (selected.name != item) {
			selected.name = item;
			dispatch('select', selected);
		}
	}}
/>

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
