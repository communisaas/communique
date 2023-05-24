<script lang="ts">
	import Home from '$components/icon/Home.svelte';
	import Compose from '$components/icon/Compose.svelte';
	import { page } from '$app/stores';

	const navLinks = {
		'/': { component: Home, label: 'Home' },
		'/compose': { component: Compose, label: 'Compose email' }
	};
</script>

<aside class="object-cover inline-flex h-full">
	<div class="flex flex-col items-center h-full bg-peacockFeather-700 shadow-nav z-50">
		<nav aria-label="Page navigation" class="flex flex-col">
			{#each Object.entries(navLinks) as [route, link]}
				<span
					class:active={$page.route.id == route}
					class:pointer-events-none={$page.route.id == `${route}`}
				>
					<a class="min-h-full min-w-full" aria-label={link.label} href={route}>
						<svelte:component this={link.component} />
					</a>
				</span>
			{/each}
		</nav>
	</div>
</aside>

<style>
	span {
		width: 100%;
		position: relative;
	}
	a::before {
		content: '';
		display: block;
		position: absolute;
		transition: all 0.05s ease-in;
		transform-origin: right;
		transform: scale(0);
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
	}
	a:hover::before {
		transition: border-right 0.1s ease-out;
		top: 25px;
		bottom: 25px;
		border-right: 4px solid theme('colors.larimarGreen.600');
		transform: scale(1);
	}
	a > :global(icon) {
		padding: 1em 0.5em;
		display: block;
	}
	.active {
		filter: contrast(0.4);
	}
	.active a::before {
		border-right: 4px solid theme('colors.larimarGreen.600');
		display: block;
		position: absolute;
		transition: all 0.1s ease-out;
		right: 0;
		left: 0;
		transform: scale(1);
	}
</style>
