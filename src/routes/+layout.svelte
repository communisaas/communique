<script lang="ts">
	import '../app.postcss';
	import Navigation from '$components/Navigation.svelte';
	import './styles.css';
	import TagSelector from '$components/TagSelector.svelte';

	export let data: LayoutSchema;

	$: console.log(data);
</script>

<div class="app">
	<main class="flex min-h-screen overflow-y-scroll">
		<div class="grow-0 shrink-0 w-20"><Navigation /></div>

		<div class="grow">
			<header class="block py-[1.25rem]">
				<TagSelector tagList={data.topicList} />
			</header>
			<slot />
		</div>
	</main>

	<footer />
</div>
