<script lang="ts">
	import Home from '$components/icon/Home.svelte';
	import Compose from '$components/icon/Compose.svelte';
	import { page } from '$app/stores';

	const navLinks = { '/': Home, '/compose': Compose };
</script>

<aside class="object-cover inline-flex h-full">
	<div class="flex flex-col items-center  h-full bg-peacockFeather-500 shadow-nav z-50">
		<nav class="flex flex-col">
			{#each Object.entries(navLinks) as [route, icon]}
				<span class:activeNav={$page.route.id == route}>
					<a
						class:activeLink={$page.route.id == route}
						class:pointer-events-none={$page.route.id == `${route}`}
						class="min-h-full min-w-full"
						href={route}><svelte:component this={icon} /></a
					>
				</span>
			{/each}
		</nav>
	</div>
</aside>

<style>
	span {
		width: 100%;
		padding: 1rem 0.5rem;
		transition: all 0.2s ease-in;
	}
	a {
		opacity: 100%;
	}
	.activeLink {
		transition: all 0.1s ease-out;
		filter: contrast(0.4);
		border-radius: 1%;
	}

	.activeNav {
		transition: all 0.1s ease-out;
		border-right: 0.25rem solid theme('colors.larimarGreen.600');
	}
</style>
