<script lang="ts">
	import Home from '$components/icon/Home.svelte';
	import Compose from '$components/icon/Compose.svelte';
	import { page } from '$app/stores';

	const navLinks = { '/': Home, '/compose': Compose };
</script>

<aside class="object-cover inline-flex h-full">
	<div class="flex flex-col items-center  h-full bg-peacockFeather-600 shadow-nav z-50">
		<nav class="flex flex-col">
			{#each Object.entries(navLinks) as [route, icon]}
				<span class:pointer-events-none={$page.route.id == `${route}`}>
					<a class:activeLink={$page.route.id == route} class="min-h-full min-w-full" href={route}
						><svelte:component this={icon} /></a
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
		transition: all 0.1s ease-in;
		position: relative;
	}

	a::before {
		position: absolute;
		transition: all 0.1s ease-in;
		content: '';
		display: block;
		transform: scale(0);
		transform-origin: right;
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
	}
	a:hover::before {
		transition: all 0.1s ease-out;
		top: 25px;
		right: 0;
		left: 0;
		bottom: 25px;
		border-right: 4px solid theme('colors.larimarGreen.600');
		transform: scale(1);
	}
	a {
		opacity: 100%;
		height: 100%;
		width: 100%;
	}

	.activeLink {
		filter: contrast(0.4);
	}

	.activeLink::before {
		content: '';
		display: block;
		transition: all 0.1s ease-out;
		position: absolute;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		border-right: 4px solid theme('colors.larimarGreen.600');
		transform: scale(1);
	}
	.activeLink:hover::before {
		top: 0;
		bottom: 0;
	}
</style>
