<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let item: string;
	export let selected: Selectable;
	export let style = '';

	const contentLengthScalar = Math.sqrt(item.length + 1) * Math.sqrt(1.5);

	const dispatch = createEventDispatcher();
	function dispatchSelected(selected: Selectable) {
		dispatch('select', selected);
	}
</script>

<input
	readonly
	class="cursor-pointer text-center px-2 py-1 rounded bg-larimarGreen-600 {style} "
	style:width="calc(2em*{contentLengthScalar})"
	value={item}
	title={item}
	on:mousedown|stopPropagation={() => {
		if (selected.name != item) selected.name = item;
		dispatchSelected(selected);
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
