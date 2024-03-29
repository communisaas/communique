<script lang="ts">
	import { browser } from '$app/environment';
	import { afterUpdate, createEventDispatcher } from 'svelte';
	import { writable, type Writable } from 'svelte/store';
	import { fade, scale } from 'svelte/transition';
	import { onMount, onDestroy } from 'svelte';
	import { trapFocus, updateFocusableElements } from '$lib/ui/ux';
	import { SignIn } from '@auth/sveltekit/components';

	export let providers: AuthSchema;

	let sessionStore: Writable<UserState>;
	let chosenProvider: string | undefined;
	let dialog: HTMLElement;
	let focusableElements = writable<HTMLElement[]>([]);
	let firstFocusableElement = writable<HTMLElement | null>(null);
	let lastFocusableElement = writable<HTMLElement | null>(null);
	let firstFocus = true;
	let focusHandler: (e: KeyboardEvent) => void;

	function handlePageshow(event: PageTransitionEvent) {
		if (event.persisted) {
			chosenProvider = undefined;
		}
	}
	onMount(async () => {
		sessionStore = (await import('$lib/data/sessionStorage')).store;
		const [focusElems, firstElem, lastElem] = updateFocusableElements(dialog) as [
			HTMLElement[],
			HTMLElement,
			HTMLElement
		];
		focusableElements.set(focusElems);
		firstFocusableElement.set(firstElem);
		lastFocusableElement.set(lastElem);

		focusHandler = (e) => {
			lastElem.classList.remove('focus:outline-none');
			firstFocus = false;
			trapFocus(e, $focusableElements);
		};

		firstFocusableElement.update((first) => {
			if (first) {
				lastElem.focus();
				lastElem.classList.add('focus:outline-none');
				firstFocus = false;
				return null;
			}
			return first;
		});

		window.addEventListener('pageshow', handlePageshow);
		dialog.addEventListener('keydown', focusHandler);
	});

	onDestroy(() => {
		window.removeEventListener('pageshow', handlePageshow);
		dialog.removeEventListener('keydown', focusHandler);
	});

	const dispatch = createEventDispatcher();
	function setPopover(value: boolean) {
		dispatch('popover', value);
	}
	console.log(providers.providers);
</script>

<section role="dialog" bind:this={dialog} class="flex flex-col items-center relative">
	{#if !chosenProvider}
		<p class="absolute mb-4 w-max mx-auto -top-8" out:fade={{ duration: 30 }}>Sign in with</p>
	{:else}
		<p class="absolute mb-4 w-max mx-auto -top-8" in:fade={{ delay: 30, duration: 150 }}>
			{`Going to ${chosenProvider}...`}
		</p>
	{/if}
	<article class="flex flex-col gap-3 md:w-40 w-36">
		<div class="flex flex-wrap items-center justify-center gap-5">
			{#each Object.entries(providers.providers) as [id, attributes]}
				{#if !chosenProvider || chosenProvider === attributes.name}
					<SignIn provider={attributes.id} signInPage="sign/in">
						<button
							on:click={() => {
								chosenProvider = attributes.name;
							}}
							class="flex flex-col items-center justify-center md:w-14 md:h-14 h-fit w-fit"
							slot="submitButton"
						>
							<img
								src={providers.baseLogoURL + attributes.style.logo}
								alt="{attributes.name} logo"
								class="p-2"
							/>
						</button>
					</SignIn>
				{/if}
			{/each}
		</div>
		<div class="w-36 md:w-40 h-10 m-auto">
			{#if !chosenProvider}
				<button
					out:scale={{ delay: 20, duration: 150 }}
					class="w-full h-full"
					on:click={() => setPopover(false)}
				>
					Close
				</button>
			{/if}
		</div>
	</article>
</section>

<style lang="scss">
	button {
		background: rgba(255, 255, 255, 0.15);
		border-radius: 16px;
		box-shadow: 0 1px 2px 1px rgba(0, 0, 0, 0.1);
		transition: ease-in-out 0.1s;

		&:hover {
			background: rgba(255, 255, 255, 0.25);
			transform: translateY(-1px);
		}
		&:active {
			transform: translateY(1px);
			background: rgba(255, 255, 255, 0.15);
		}
	}
</style>
