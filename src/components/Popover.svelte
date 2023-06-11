<script lang="ts">
	import { expoOut, expoIn, backInOut } from 'svelte/easing';
	import { fade, scale } from 'svelte/transition';
	import Clipboard from './icon/Clipboard.svelte';

	export let show: boolean;
</script>

<aside
	transition:fade={{ delay: 50, duration: 500, easing: expoIn }}
	aria-label="Send status screen"
	class="popover fixed items-center z-50 top-0"
	style="--bodyOverflow: {show ? 'hidden' : 'auto'}"
	on:mousedown|stopPropagation|preventDefault
>
	<section
		class="absolute text-paper-800 flex justify-center items-center min-w-[100vw] min-h-[100vh]"
		in:fade={{ delay: 25, duration: 250, easing: expoOut }}
		out:fade={{ delay: 50, duration: 300, easing: expoIn }}
	>
		<div
			class="info flex flex-col p-2 pl-10 pr-10"
			in:scale={{ delay: 25, duration: 50, easing: backInOut }}
			out:scale={{ delay: 25, duration: 250, easing: backInOut }}
		>
			<span class="flex flex-col items-center justify-center gap-2 mb-12">
				<p>Paste into your email app.</p>
				<Clipboard />
				<p>Link others in:</p>
				<ul />
			</span>
			<span class="flex flex-col items-center justify-center gap-2">
				<div>
					<input name="Sent!" id="sendStatus" type="checkbox" class="min-w-max" />
					<label for="sendStatus">Sent!</label>
				</div>
				<button class="min-w-max" on:click={() => (show = false)}>Close</button>
			</span>
		</div>
	</section>
</aside>

<style lang="scss">
	:global(body:has(.popover)) {
		overflow: hidden;
	}
	section {
		overflow: auto;
		background: rgba(0, 0, 0, 0.6);
		backdrop-filter: blur(8px);
	}

	.info {
		background: rgba(255, 255, 255, 0.05);
		box-shadow: 0 1px 2px 2px rgba(0, 0, 0, 0.1);
		border-radius: 16px;
	}

	button {
		background: rgba(255, 255, 255, 0.15);
		border-radius: 16px;
		box-shadow: 0 1px 2px 1px rgba(0, 0, 0, 0.1);
		padding: 2px 5px;

		&:hover {
			background: rgba(255, 255, 255, 0.25);
			transform: translateY(-1px);
			transition: ease-in-out 0.1s;
		}
		&:active {
			transform: translateY(1px);
			background: rgba(255, 255, 255, 0.15);
		}
	}
</style>
