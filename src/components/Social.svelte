<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import Checkmark from './icon/Checkmark.svelte';

	export let shortLink: URL;
	export let linkMessage = '';

	let linkCopied = false;

	async function handleCopy() {
		linkCopied = true;
		try {
			await navigator.clipboard.writeText(shortLink.href);
		} catch (e) {
			// handle Firefox where ClipboardItem is not available
			try {
				const copyListener = (e: ClipboardEvent) => {
					e.clipboardData?.setData('text/plain', shortLink.href);
					e.preventDefault();
				};
				document.addEventListener('copy', copyListener);
				document.execCommand('copy');
				document.removeEventListener('copy', copyListener);
			} catch (e) {
				(console.error || console.log).call(console, e.stack || e);
			}
		}
		setTimeout(() => (linkCopied = false), 2000);
	}
</script>

<aside>
	<section class="relative grid grid-rows-2" aria-live="polite">
		<div class="relative h-fit">
			{#if linkCopied}
				<div in:fade={{ delay: 25, duration: 200 }} out:fade={{ delay: 50, duration: 300 }}>
					<icon class="absolute z-10 w-4/5 left-0 right-0 -top-[0.775rem] m-auto">
						<Checkmark />
					</icon>
				</div>
			{/if}
			{#if linkMessage && !linkCopied}
				<p
					out:scale={{ delay: 20, duration: 150 }}
					in:fade={{ delay: 0, duration: 150 }}
					class="text-center m-2 absolute left-0 right-0 ml-auto mr-auto row-span-1"
				>
					{linkMessage}
				</p>
			{/if}
			{#if linkCopied}
				<p
					in:fade={{ delay: 0, duration: 150 }}
					out:scale={{ delay: 20, duration: 150 }}
					class="text-center m-2 absolute left-0 right-0 ml-auto mr-auto row-span-1"
				>
					<b>Copied!</b>
				</p>
			{/if}
		</div>
		<button
			class="shortLink underline p-2 rounded inline-block"
			class:blur-sm={linkCopied}
			class:opacity-50={linkCopied}
			aria-label="copy shortened link"
			on:click={() => handleCopy()}
			on:keypress={() => handleCopy()}
		>
			{shortLink.host + shortLink.pathname}
		</button>
	</section>
</aside>

<style lang="scss">
	.shortLink {
		cursor: pointer;
		background-color: rgba(255, 255, 255, 0.15);
		transition: 0.1s ease-in-out;

		&:hover {
			transform: scale(1.03);
		}
		&:active {
			transform: scale(0.97);
		}
	}
</style>
