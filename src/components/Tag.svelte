<script lang="ts">
	export let item: string;
	export let selected: Selectable;
	export let style = '';
	export let index: number;

	const contentLengthScalar = Math.sqrt(item.length).toFixed(0);
</script>

<input
	readonly
	class="cursor-pointer text-center inline-block px-2 py-1 rounded bg-larimarGreen-600 {style} "
	style:width="calc(2.25em*{contentLengthScalar})"
	value={item}
	name={item}
	tabindex={index}
	on:mousedown={(e) => {
		e.stopImmediatePropagation();
		selected.name = item;
		e.currentTarget.click();
	}}
/>

<style>
	input {
		transition: 0.2s ease-out;
	}
	input:hover {
		transform: translateY(-1px);
		box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
		transition: 0.2s ease-in;
	}
	input:focus {
		transform: translateY(0);
		outline: auto -webkit-focus-ring-color;
		transition: 0.2s ease-in;
	}
	input:focus {
		box-shadow: unset;
		transition: 0.2s ease-out;
	}
</style>
