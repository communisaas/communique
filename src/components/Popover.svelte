<script lang="ts">
	import { expoOut, expoIn, backInOut } from 'svelte/easing';
	import { fade, scale } from 'svelte/transition';
	import Clipboard from './icon/Clipboard.svelte';
	import DOMPurify from 'dompurify';
	import Checkmark from './icon/Checkmark.svelte';

	export let show: boolean;
	export let emailContent: string;

	let emailCopied = false;

	async function handleCopy(e: MouseEvent) {
		emailCopied = true;
		try {
			await navigator.clipboard.write([
				new window.ClipboardItem({
					'text/html': new Blob([emailContent], { type: 'text/html' })
				})
			]);
		} catch (e) {
			// handle Firefox where ClipboardItem is not available
			try {
				const copyListener = (e: ClipboardEvent) => {
					e.clipboardData?.setData('text/html', emailContent);
					e.clipboardData?.setData('text/plain', emailContent);
					e.preventDefault();
				};
				document.addEventListener('copy', copyListener);
				document.execCommand('copy');
				document.removeEventListener('copy', copyListener);
			} catch (e) {
				(console.error || console.log).call(console, e.stack || e);
			}
		}
		setTimeout(() => (emailCopied = false), 2000);
	}
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
			<span class="flex flex-col items-center self-center gap-2 mb-12 w-fit max-w-10">
				<div>
					{#if /<\/?[a-z][\s\S]*>/i.test(emailContent)}
						<p class="font-bold text-center">Click clipboard for a formatted copy.</p>
					{/if}
					<p class="text-center text-sm opacity-75">Double-click to reopen.</p>
				</div>

				<span class="relative w-fit flex-col" on:mousedown={(e) => handleCopy(e)}>
					{#if emailCopied}
						<div>
							<p
								in:scale={{ delay: 35, duration: 250 }}
								out:scale={{ delay: 50, duration: 300 }}
								class="font-bold absolute z-20 left-0 right-0 mx-auto top-[50%] text-center"
							>
								Copied!
							</p>

							<icon class="absolute z-10 w-1/2 left-0 right-0 top-[45%] mx-auto">
								<Checkmark />
							</icon>
						</div>
					{/if}
					<icon />
					<icon
						class="inline-block min-w-[40vh]"
						class:clipboard-clicked={emailCopied}
						class:clipboard={!emailCopied}
					>
						<Clipboard>
							{@html DOMPurify.sanitize(emailContent)}
						</Clipboard>
					</icon>
					<p class="text-center">Link others in:</p>
				</span>
				<ul />
			</span>
			<span class="flex flex-col items-center justify-center gap-2">
				<div>
					<input name="Sent!" id="sendStatus" type="checkbox" class="min-w-max" />
					<label for="sendStatus">Sent!</label>
				</div>
				<button class="w-full h-10" on:click={() => (show = false)}>Close</button>
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

	.clipboard {
		transition: 0.1s ease-in-out;
		&:hover {
			transform: scale(1.03);
			cursor: pointer;
		}
		&:active {
			transform: scale(0.97);
		}
	}

	.clipboard-clicked {
		opacity: 0.5;
		transition: 0.1s ease-in-out;
		&:hover {
			cursor: pointer;
		}
		&:active {
			transform: scale(0.99);
		}
	}
	button {
		background: rgba(255, 255, 255, 0.15);
		border-radius: 16px;
		box-shadow: 0 1px 2px 1px rgba(0, 0, 0, 0.1);
		padding: 2px 5px;
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
