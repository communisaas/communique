<script lang="ts">
	import { createEventDispatcher, onMount, type DispatchOptions } from 'svelte/internal';
	export let item: string;
	export let selected: Selectable;
	export let style = '';

	const dispatch = createEventDispatcher();

	const contentLengthScalar = Math.sqrt(item.length + 1) * Math.sqrt(1.5);
</script>

<input
	readonly
	class="cursor-pointer text-center px-2 py-1 rounded bg-larimarGreen-600 {style} "
	style:width="calc(2em*{contentLengthScalar})"
	value={item}
	title={item}
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
