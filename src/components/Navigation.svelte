<script lang="ts">
	import Compose from '$components/icon/Compose.svelte';
	import { page } from '$app/stores';
	import Topic from './icon/Topic.svelte';
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { fade, slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { afterNavigate, goto } from '$app/navigation';
	import { signOut } from '@auth/sveltekit/client';
	import LoginIcon from '$components/icon/Login.svelte';

	const navLinks = {
		'/': { component: Topic, label: 'Home' },
		'/compose': { component: Compose, label: 'Compose email' }
	};

	export let collapsed = false;

	let scrollTimeout: NodeJS.Timeout | null;
	const smallScreenBreakpoint = 640; // 640px is the default breakpoint for Tailwind's 'sm'

	let justCollapsed = false;
	// Update collapsed based on screen width and scroll position
	function updateCollapsedState() {
		if (!collapsed && !justCollapsed) collapsed = window.innerWidth < smallScreenBreakpoint;
	}

	// Listen for resize and scroll events to update the collapsed state
	function handleResize() {
		updateCollapsedState();
	}

	function handleScroll() {
		if (!scrollTimeout) {
			scrollTimeout = setTimeout(() => {
				scrollTimeout = null;
				updateCollapsedState();
			}, 200); // 200ms for throttling
		}
	}

	onMount(() => {
		window.addEventListener('resize', handleResize);
		window.addEventListener('scroll', handleScroll);
		// Initially set collapsed based on screen width and scroll position
		updateCollapsedState();
	});

	afterNavigate(() => {
		updateCollapsedState();
	});

	// Cleanup the event listeners when the component is destroyed
	onDestroy(() => {
		if (browser) {
			window.removeEventListener('resize', handleResize);
			window.removeEventListener('scroll', handleScroll);
		}
	});
</script>

<aside class="object-cover inline-flex h-full">
	<div class="flex flex-col items-center h-full bg-peacockFeather-700 z-40">
		<nav
			aria-label="Page navigation"
			class="flex flex-col justify-center sticky h-screen top-0 z-40"
		>
			{#if !collapsed}
				{#if $page.data.session}
					<div
						transition:slide={{ duration: 500, easing: quintOut, axis: 'x' }}
						class="group h-12 w-full flex items-center justify-center absolute top-0 hover:bg-peacockFeather-600 transition-colors duration-200 cursor-context-menu"
					>
						{#if $page.data.session.user?.image}
							<img src={$page.data.session.user.image} alt="avatar" class="h-10 w-10" />
						{/if}
						<!-- TODO move login/profile to bottom of navbar -->
						<div
							role="menu"
							class="absolute h-fit z-40 left-0 w-0 bottom-[200%] group-hover:w-auto group-hover:top-[100%] bg-artistBlue-700 text-paper-500 shadow-md"
						>
							<ul class="flex flex-col items-start space-y-1 xs:text-base my-2">
								<button
									on:focus={(e) => {
										let menuDiv = e.target.parentNode.parentNode;
										if (menuDiv) {
											menuDiv.style.top = '100%';
											menuDiv.style.width = 'auto';
										}
									}}
									on:blur={(e) => {
										let menuDiv = e.target.parentNode.parentNode;
										if (menuDiv) {
											menuDiv.style.top = '';
											menuDiv.style.width = '';
										}
									}}
									class="px-1.5 py-1 min-w-full text-left whitespace-nowrap hover:bg-peacockFeather-500 transition-colors duration-200"
									on:click={() => goto('/profile')}>Profile</button
								>
								<button
									class="px-1.5 py-1 min-w-full text-left whitespace-nowrap hover:bg-peacockFeather-500 transition-colors duration-200"
									on:focus={(e) => {
										let menuDiv = e.target.parentNode.parentNode;
										if (menuDiv) {
											menuDiv.style.top = '100%';
											menuDiv.style.width = 'auto';
										}
									}}
									on:blur={(e) => {
										let menuDiv = e.target.parentNode.parentNode;
										if (menuDiv) {
											menuDiv.style.top = '';
											menuDiv.style.width = '';
										}
									}}
									on:click={() => signOut({ callbackUrl: '/', redirect: false })}>Sign out</button
								>
							</ul>
						</div>
					</div>
				{:else}
					<button
						class="flex p-1 w-full max-h-full absolute self-center top-0 hover:bg-peacockFeather-600"
						on:click={() => (window.location.hash = '#signin')}
					>
						<icon class="w-10 h-10 m-auto inline-block">
							<LoginIcon />
						</icon>
					</button>
				{/if}
			{/if}
			{#if collapsed}
				<div
					class="absolute inset-0 min-w-fit h-screen flex justify-center items-center left-0 top-0"
				>
					<button
						on:click={() => {
							justCollapsed = true;
							collapsed = !collapsed;
							setTimeout(() => {
								justCollapsed = false;
							}, 200);
						}}
						on:touchstart|preventDefault={() => (collapsed = !collapsed)}
						class="flex flex-col backdrop-blur-sm gap-3 items-center justify-center relative border-x-2 border-y-2 rounded-md h-20 p-2 w-1.5 mr-4 ml-[4px] my-4 top-0 border-paper-800 cursor-pointer"
						in:fade={{ delay: 350, duration: 2000, easing: quintOut }}
					>
						<div class="w-2 h-2 rounded-full bg-paper-600" />
						<div class="w-2 h-2 rounded-full bg-paper-600" />
						<div class="w-2 h-2 rounded-full bg-paper-600" />
					</button>
				</div>
			{:else}
				<div
					class="w-full h-full flex flex-col justify-center items-center"
					transition:slide={{ duration: 500, easing: quintOut, axis: 'x' }}
				>
					{#each Object.entries(navLinks) as [route, link]}
						<span
							class="inline-block max-h-fit"
							class:active={$page.route.id == route}
							class:pointer-events-none={$page.route.id == `${route}`}
						>
							<a
								data-sveltekit-preload-data="hover"
								data-sveltekit-preload-code="eager"
								class="min-h-full min-w-full"
								aria-label={link.label}
								href={route}
							>
								<icon class="w-fit">
									<svelte:component this={link.component} />
								</icon>
							</a>
							<ins
								style="transform-origin: center right;"
								class:active={$page.route.id == route}
								class="absolute top-0 left-0 w-full h-full bg-paper-500 opacity-20"
							/>
						</span>
					{/each}
				</div>
			{/if}
		</nav>
	</div>
</aside>

<style>
	span {
		width: 100%;
		position: relative;
	}

	ins {
		height: 100%;
		transform: scale(0);
		transition: transform 0.1s ease-out;
	}

	.active {
		transform: scale(1);
		filter: contrast(0.4);
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
