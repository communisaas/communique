<script lang="ts">
	import { expoOut, expoIn } from 'svelte/easing';
	import { fade } from 'svelte/transition';
	import type { SvelteComponent } from 'svelte';
	export let popoverComponent: typeof SvelteComponent;
	export let props: Props;

	let show: boolean;
	let menu: HTMLElement;
</script>

<main
	transition:fade={{ delay: 50, duration: 300, easing: expoIn }}
	aria-label="Send status screen"
	class="popover fixed items-center z-50 top-0 bottom-0 left-0 right-0"
	style="--bodyOverflow: {show ? 'hidden' : 'auto'}"
>
	<section
		class="absolute text-paper-800 flex flex-col gap-y-2 justify-center items-center min-w-full min-h-full"
		in:fade={{ delay: 15, duration: 150, easing: expoIn }}
		out:fade={{ delay: 25, duration: 200, easing: expoOut }}
		bind:this={menu}
	>
		<svelte:component this={popoverComponent} {...props} on:popover />
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
