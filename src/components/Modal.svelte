<script lang="ts">
	import { expoOut, expoIn } from 'svelte/easing';
	import { fade } from 'svelte/transition';
	import { createEventDispatcher, type ComponentType } from 'svelte';
	import type { email } from '@prisma/client';

	export let popoverComponent: ComponentType;
	export let item: email;
	let show: boolean;

	const dispatch = createEventDispatcher();

	function setPopover(value: boolean) {
		show = value;
		dispatch('popover', show);
	}
</script>

<main
	transition:fade={{ delay: 50, duration: 500, easing: expoIn }}
	aria-label="Send status screen"
	class="popover fixed items-center z-50 top-0"
	style="--bodyOverflow: {show ? 'hidden' : 'auto'}"
	on:click|stopPropagation|preventDefault
	on:keypress|stopPropagation|preventDefault
>
	<section
		class="absolute text-paper-800 flex flex-col gap-y-2 justify-center items-center min-w-[100vw] min-h-[100vh]"
		in:fade={{ delay: 25, duration: 250, easing: expoOut }}
		out:fade={{ delay: 50, duration: 300, easing: expoIn }}
	>
		<svelte:component
			this={popoverComponent}
			bind:item
			on:popover={(e) => {
				setPopover(e.detail);
			}}
		/>
	</section>
</main>

<style lang="scss">
	:global(body:has(.popover)) {
		overflow: hidden;
	}

	section {
		overflow: auto;
		background: rgba(0, 0, 0, 0.6);
		backdrop-filter: blur(8px);
	}
</style>
