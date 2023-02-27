<script lang="ts">
	export let tagList: string[];
</script>

<ul>
	{#each tagList as tag}
		<li>{tag}</li>
	{/each}
</ul>
