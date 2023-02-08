<script>
	import '../app.postcss';
	import Navigation from '$components/Navigation.svelte';
	import './styles.css';
</script>

<div class="app">
	<main class="flex min-h-screen overflow-y-scroll">
		<div class="grow-0 shrink-0 w-20"><Navigation /></div>

		<div class="grow">
			<header class="block py-[1.25rem]">
				<h1 class="">Loudest emails in</h1>
			</header>
			<slot />
		</div>
	</main>

	<footer />
</div>
