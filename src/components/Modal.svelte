<script lang="ts">
	import { expoOut, expoIn, backInOut } from 'svelte/easing';
	import { fade, scale } from 'svelte/transition';
	import Clipboard from './icon/Clipboard.svelte';
	import DOMPurify from 'dompurify';
	import Checkmark from './icon/Checkmark.svelte';
	import Social from './Social.svelte';
	import type { email } from '@prisma/client';
	import { page } from '$app/stores';
	import { createEventDispatcher } from 'svelte';

	import he from 'he';
	import { convertHtmlToText, handleMailto } from '$lib/email';

	export let item: email;

	let show: boolean;
	let emailCopied = false;

	const dispatch = createEventDispatcher();

	function setPopover(value: boolean) {
		show = value;
		dispatch('popover', show);
	}

	async function handleCopy() {
		emailCopied = true;
		const cleanedBody = DOMPurify.sanitize(item.body);

		// Parse the HTML string into a DOM
		let parser = new DOMParser();
		let doc = parser.parseFromString(cleanedBody, 'text/html');
		let plainBody = convertHtmlToText(doc.body);

		// Decode any HTML entities
		plainBody = he.decode(plainBody);

		// Collapse consecutive newlines
		plainBody = plainBody.replace(/\n{4,}/g, '\n');
		try {
			await navigator.clipboard.write([
				new window.ClipboardItem({
					'text/html': new Blob([cleanedBody], { type: 'text/html' })
				})
			]);
		} catch (e) {
			// handle Firefox where ClipboardItem is not available
			try {
				const copyListener = (e: ClipboardEvent) => {
					e.clipboardData?.setData('text/html', cleanedBody);
					e.clipboardData?.setData('text/plain', plainBody);
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

{#if item}
	<main
		transition:fade={{ delay: 50, duration: 500, easing: expoIn }}
		aria-label="Send status screen"
		class="popover fixed items-center z-50 top-0"
		style="--bodyOverflow: {show ? 'hidden' : 'auto'}"
		on:mousedown|stopPropagation|preventDefault
	>
		<section
			class="absolute text-paper-800 flex flex-col gap-y-2 justify-center items-center min-w-[100vw] min-h-[100vh]"
			in:fade={{ delay: 25, duration: 250, easing: expoOut }}
			out:fade={{ delay: 50, duration: 300, easing: expoIn }}
		>
			<article class="flex flex-col gap-y-1">
				<div
					class="flex flex-row justify-around items-stretch py-2 gap-x-3"
					in:scale={{ delay: 25, duration: 50, easing: backInOut }}
					out:scale={{ delay: 25, duration: 250, easing: backInOut }}
				>
					<div
						class="info info__clipboard p-2 flex flex-col items-center self-center w-fit max-w-10"
					>
						<span>
							{#if /<\/?[a-z][\s\S]*>/i.test(item.body)}
								<p class="font-bold text-center">Click clipboard for a formatted copy.</p>
							{/if}
							<p class="text-center text-sm opacity-75">Double-click to reopen.</p>
						</span>

						<span
							class="relative w-fit flex-col"
							on:click={(e) => handleCopy()}
							on:keypress={(e) => handleCopy()}
							on:dblclick={() => handleMailto(dispatch)}
						>
							{#if emailCopied}
								<div in:fade={{ delay: 25, duration: 200 }} out:fade={{ delay: 50, duration: 300 }}>
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
								class:blur-sm={emailCopied}
								class:clipboard={!emailCopied}
							>
								<Clipboard>
									{@html DOMPurify.sanitize(item.body)}
								</Clipboard>
							</icon>
						</span>
					</div>
					<div class="info info__share flex flex-col items-center justify-center p-2">
						<span class="flex flex-col items-center justify-center gap-2 h-max">
							<Social
								shortLink={new URL('/' + item.shortid, $page.url.origin)}
								linkMessage="Share this email:"
							/>
							<div>
								<input name="Sent!" id="sendStatus" type="checkbox" class="min-w-max" />
								<label for="sendStatus">Sent!</label>
							</div>
						</span>
					</div>
				</div>
				<button class="w-full h-10" on:click={() => setPopover(false)}>Close</button>
			</article>
		</section>
	</main>
{/if}

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
		cursor: pointer;
		transition: 0.1s ease-in-out;
		&:hover {
			transform: scale(1.03);
		}
		&:active {
			transform: scale(0.97);
		}
	}

	.clipboard-clicked {
		cursor: pointer;
		opacity: 0.5;
		transition: 0.1s ease-in-out;
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
