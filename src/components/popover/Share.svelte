<script lang="ts">
	import { backInOut } from 'svelte/easing';
	import { fade, scale } from 'svelte/transition';
	import Clipboard from '../icon/Clipboard.svelte';
	import DOMPurify from 'isomorphic-dompurify';
	import Checkmark from '../icon/Checkmark.svelte';
	import Social from '../Social.svelte';
	import type { email } from '@prisma/client';
	import { page } from '$app/stores';
	import { createEventDispatcher, onMount } from 'svelte';

	import { handleMailto } from '$lib/data/email';
	import { handleCopy } from '$lib/data/select';
	import { goto, invalidateAll } from '$app/navigation';
	import type { Writable } from 'svelte/store';

	export let item: email;

	let emailCopied = false;
	let linkCopied = false;

	let sent = false;

	$: closeButtonText = sent ? 'Confirm' : 'Close';

	let sessionStore: Writable<UserState>;

	const dispatch = createEventDispatcher();

	onMount(async () => {
		sessionStore = (await import('$lib/data/sessionStorage')).store;
	});

	function setPopover(value: boolean) {
		dispatch('popover', value);
	}
</script>

<article class="flex flex-col gap-y-1 px-2 max-w-[100vw]">
	<div
		class="flex flex-col sm:flex-row justify-around items-stretch py-2 gap-3"
		in:scale={{ delay: 25, duration: 50, easing: backInOut }}
		out:scale={{ delay: 25, duration: 250, easing: backInOut }}
	>
		<div class="info info__clipboard p-2 flex flex-col items-center self-center w-fit max-w-full">
			<span class="pb-2 flex flex-col items-center">
				{#if /<\/?[a-z][\s\S]*>/i.test(item.body)}
					<p class="font-bold text-center">Click clipboard for a formatted copy.</p>
				{/if}
				<button
					on:click={() => handleMailto(dispatch, false)}
					on:keypress={(e) => {
						if (e.key === 'Enter') handleMailto(dispatch, false);
					}}
					class="text-sm opacity-75 underline hover:cursor-pointer hover:bg-transparent"
					style="background: unset; box-shadow: unset"
				>
					(and here to reopen a blank template)
				</button>
			</span>

			<button
				class="relative w-fit flex-col"
				style="background: unset; box-shadow: unset"
				on:click={async () => {
					emailCopied = true;
					const success = await handleCopy('email', item.body);
					if (success) if (success) setTimeout(() => (emailCopied = false), 2000);
				}}
				on:keypress={async (e) => {
					if (e.key === 'Enter') {
						emailCopied = true;
						const success = await handleCopy('email', item.body);
						if (success) if (success) setTimeout(() => (emailCopied = false), 2000);
					}
				}}
			>
				{#if emailCopied}
					<div in:fade={{ delay: 25, duration: 200 }} out:fade={{ delay: 50, duration: 300 }}>
						<p
							in:scale={{ delay: 35, duration: 250 }}
							out:scale={{ delay: 50, duration: 300 }}
							class="font-bold absolute z-20 left-0 right-0 mx-auto top-[50%] text-center"
						>
							{emailCopied ? 'Copied!' : 'Reopened!'}
						</p>

						<icon class="absolute z-10 w-1/2 left-0 right-0 top-[45%] mx-auto">
							<Checkmark />
						</icon>
					</div>
				{/if}
				<icon />
				<icon
					class="inline-block sm:w-[40vh] md:w-[40vh] w-[35vh]"
					class:clipboard-clicked={emailCopied}
					class:blur-sm={emailCopied}
					class:clipboard={!emailCopied}
				>
					<Clipboard>
						{@html DOMPurify.sanitize(item.body)}
					</Clipboard>
				</icon>
			</button>
		</div>
		<div class="info info__share flex flex-col items-center justify-center p-2">
			<span class="flex flex-col items-center justify-center relative gap-2 h-full">
				<div class="mt-auto">
					<Social
						bind:linkCopied
						shortLink={new URL('/' + item.shortid, $page.url.origin)}
						linkMessage="Share this email:"
					/>
				</div>
				<div
					class="mt-auto cursor-pointer"
					role="checkbox"
					aria-checked={sent}
					tabindex="0"
					on:click|preventDefault|stopPropagation={() => (sent = !sent)}
					on:keypress={(e) => {
						if (e.key === 'Enter') {
							sent = !sent;
						}
					}}
					class:blur-sm={linkCopied}
				>
					<input
						bind:checked={sent}
						on:click|stopPropagation
						name="Sent!"
						id="sendStatus"
						type="checkbox"
						class="max-w-full"
					/>
					<label for="sendStatus">Sent!</label>
				</div>
			</span>
		</div>
	</div>
	<button
		class="w-full h-10"
		on:click={async () => {
			setPopover(false);
			if (!$page.data.session && sent) {
				goto('/sign/in?callbackUrl=/', { noScroll: true, keepFocus: true });
				setPopover(true);
				return;
			} else if (sent && $page.data.session?.user?.email) {
				closeButtonText = 'Confirming...';
				const response = await fetch('/data/email/' + item.shortid, {
					method: 'POST',
					headers: {
						'Increment-Send': 'true',
						'Sender-Email': $page.data.session?.user?.email,
						'CSRF-Token': $sessionStore.csrfToken
					}
				});
				if ((await response.text()) === 'incremented') {
					$sessionStore.template.primary.cardList = $sessionStore.template.primary.cardList.map(
						(email) => {
							if (email.shortid === item.shortid) {
								email.send_count = String(Number(email.send_count) + 1);
							}
							return email;
						}
					);
					$sessionStore.user.sent_email_list.push(item.shortid);
				} else {
					closeButtonText = 'Confirm';
				}
			}
		}}
	>
		{closeButtonText}
	</button>
</article>

<style lang="scss">
	:global(body:has(.popover)) {
		overflow: hidden;
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

	// TODO consolidate button styles
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
