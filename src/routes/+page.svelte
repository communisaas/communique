<script type="ts">
	import Email from '$components/Email.svelte';
	import Selector from '$components/Selector.svelte';

	export let data: HomeSchema;
</script>

<svelte:head>
	<title>Communique</title>
	<meta name="description" content="Write & share email templates!" />
</svelte:head>

<Selector selectable={Email} items={data.emailList} />

<style>
</style>
