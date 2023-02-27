<script lang="ts">
	export let tagList: string[];
	export let selected: string;
	let highlighted: boolean = false;
</script>

<ul class="px-10 py-3 flex flex-row justify-end space-x-5">
	{#each tagList as tag}
		<input
			class="px-2 py-1 rounded bg-larimarGreen-600"
			type="button"
			value={tag}
			on:mousedown={() => {
				selected = tag;
				highlighted = true;
			}}
			on:focus={() => (highlighted = true)}
			on:blur={() => (highlighted = false)}
			class:highlighted={selected === tag && highlighted}
		/>
	{/each}
</ul>

<style>
	.highlighted {
		border: 2px solid;
	}
</style>
