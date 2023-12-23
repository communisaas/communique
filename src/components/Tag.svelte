<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	export let item: string;
	export let selected: Selectable;
	export let focusable = true;
	export let style = '';

	let store: Writable<UserState>,
		overflowing = false;

	const dispatch = createEventDispatcher();

	let tag: HTMLElement;
	onMount(async () => {
		store = (await import('$lib/data/sessionStorage')).store;
	});

	$: if (tag) {
		overflowing = tag.scrollHeight > tag.clientHeight || tag.scrollWidth > tag.clientWidth;
	}

	function handleSelect() {
		if (selected.id != item) {
			selected.id = item;
		}
		dispatch('select', selected);
	}
</script>

<span title={overflowing ? item : ''} class="max-w-full">
	<div
		bind:this={tag}
		tabindex={focusable ? 0 : -1}
		role="button"
		aria-label={item}
		class="button cursor-pointer text-center px-2 py-1 max-w-full whitespace-nowrap overflow-hidden overflow-ellipsis rounded w-fit {style} "
		on:click|stopPropagation={() => {
			handleSelect();
		}}
		on:keydown|stopPropagation={(e) => {
			if (e.key === 'Enter') {
				handleSelect();
			}
		}}
		on:blur
	>
		{item}
	</div>
</span>

<style lang="scss">
	.button {
		margin: 0;
		transition: 0.1s ease-in;
		&:hover {
			transform: translateY(-1px);
			box-shadow: rgba(0, 0, 0, 0.16) 0 1px 4px;

			transition: 0.1s ease-in;
		}
		&:active {
			transform: translateY(0);
			transition: 0.1s ease-in;
		}
	}
</style>
