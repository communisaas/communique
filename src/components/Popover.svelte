<script lang="ts">
	import { quintOut } from 'svelte/easing';
	import { fade, scale } from 'svelte/transition';

	export let show: boolean;
</script>

<aside transition:fade aria-label="Send status screen" class="fixed z-50 top-0">
	<div
		class="absolute min-w-[100vw] min-h-[100vh]"
		transition:scale={{ delay: 25, duration: 150, easing: quintOut }}
	>
		content!
		<button class="min-w-max" on:click={() => (show = false)}>Close</button>
	</div>
</aside>

<style lang="scss">
	div {
		background: rgba(255, 255, 255, 0.35);
		box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
	}
</style>
