<script lang="ts">
	export let salutation: string;
	export let name: string;
	export let address: string;
	export let showAddress: boolean = true;
</script>

<section>
	<p>{salutation}</p>
	<p>{name}</p>
	{#if showAddress}
		<p>{address}</p>
	{/if}
</section>
