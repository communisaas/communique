<script lang="ts">
	export let tagList: string[];
	export let selected: string = '';
	export let style = '';
	let highlighted: boolean = false;
</script>

<ul class="px-10 py-1 flex flex-row justify-end gap-5">
	{#each tagList as tag}
		<input
			class={style + ' px-2 py-1 rounded bg-larimarGreen-600'}
			type="button"
			value={tag}
			name={tag}
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
		outline: 2px solid;
	}
</style>
