<script type="ts">
	import EmailSelector from '$components/EmailSelector.svelte';

	export let data: HomeSchema;

	$: console.log(data);
</script>

<svelte:head>
	<title>Communique</title>
	<meta name="description" content="Write & share email templates!" />
</svelte:head>

<EmailSelector emailList={data.emailList} />

<style>
</style>
