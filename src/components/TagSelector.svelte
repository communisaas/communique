<script lang="ts">
	export let tagList: string[];
	export let selected: string = '';
	export let style = '';
</script>

<ul class="px-10 py-1 flex flex-row justify-end gap-5">
	{#each tagList as tag}
		<input
			readonly
			class={'cursor-pointer text-center inline-block max-w-[6rem] px-2 py-1 rounded bg-larimarGreen-600 ' +
				style}
			value={tag}
			name={tag}
			on:mousedown={(e) => {
				selected = tag;
				e.currentTarget.click();
			}}
		/>
	{/each}
</ul>

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
