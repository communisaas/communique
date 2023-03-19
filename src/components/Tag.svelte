<script lang="ts">
	export let item: string;
	export let selected: Selectable;
	export let style = '';

	const contentLengthScalar = Math.sqrt(item.length + 1).toFixed(0);
</script>

<input
	readonly
	class="cursor-pointer text-center inline-block px-2 py-1 rounded bg-larimarGreen-600 {style} "
	style:width="calc(2em*{contentLengthScalar})"
	name={item}
	value={item}
	on:mousedown|stopPropagation={(e) => {
		selected.name = item;
	}}
/>

<style lang="scss">
	input {
		&:hover {
			transform: translateY(-0.5px);
			box-shadow: rgba(0, 0, 0, 0.16) 0 1px 4px;

			transition: 0.1s ease-in;
		}
		&:active {
			transform: translateY(0.5px);
			transition: 0.1s ease-in-out;
		}
	}
</style>
