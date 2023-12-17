<script lang="ts">
	import { onMount, createEventDispatcher, onDestroy } from 'svelte';
	import { writable, type Writable } from 'svelte/store';
	import { trapFocus, updateFocusableElements } from '$lib/ui/ux';
	import { page } from '$app/stores';
	import Tooltip from '$components/Tooltip.svelte';
	import Checkmark from '$components/icon/Checkmark.svelte';
	import ContentLoader from 'svelte-content-loader';
	import colors from '$lib/ui/colors';
	import Error from '$components/icon/Error.svelte';

	export let postID: string;

	let focusableElements = writable<HTMLElement[]>([]);
	let firstFocusableElement = writable<HTMLElement | null>(null);
	let lastFocusableElement = writable<HTMLElement>();
	let inputValueWidth = 0;

	let lastSetInput = '';
	let idConfirmed = true;
	let confirmingID = false;
	let confirmFailed = false;
	let closeReady = false;

	let store: Writable<UserState>;

	let dialog: HTMLElement;
	let idEditMessage: string | undefined = 'Click to edit';
	let firstFocus = true;
	let focusHandler: (e: KeyboardEvent) => void;

	let canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, inputField: HTMLInputElement;
	onMount(async () => {
		store = (await import('$lib/data/sessionStorage')).store;
		const [focusElems, firstElem, lastElem] = updateFocusableElements(dialog) as [
			HTMLElement[],
			HTMLElement,
			HTMLElement
		];
		focusableElements.set(focusElems);
		firstFocusableElement.set(firstElem);
		lastFocusableElement.set(lastElem);

		focusHandler = (e) => {
			firstFocus = false;
			trapFocus(e, $focusableElements);
		};

		firstFocusableElement.update((first) => {
			if (first) {
				lastElem.focus();
				firstFocus = false;
				return null;
			}
			return first;
		});
		canvas = document.createElement('canvas');
		context = canvas.getContext('2d') as CanvasRenderingContext2D;
		if (context) {
			// TODO measure input width smoothly using in-dom placeholder
			context.font = getComputedStyle(inputField).font;
		}
		if (inputField) {
			inputField.value = postID;
		}
		dialog.addEventListener('keydown', focusHandler);
	});

	$: if (inputField && context) inputValueWidth = context.measureText(postID).width + 9;

	onDestroy(() => {
		dialog.removeEventListener('keydown', focusHandler);
	});

	const dispatch = createEventDispatcher();
	function setPopover(value: boolean) {
		dispatch('popover', value);
	}

	async function handleSubmit() {
		if (inputField.value !== postID) {
			confirmingID = true;
			let response;
			try {
				response = await fetch('/data/email/' + postID, {
					method: 'POST',
					headers: {
						'Update-ID': 'true',
						'User-Email': $page.data.session?.user?.email,
						'CSRF-Token': $store.csrfToken
					},
					body: inputField.value
				});
			} catch (e) {
				console.error(e);
				confirmFailed = true;
				idConfirmed = false;
			}
			confirmingID = false;
			if (response?.status !== 200) {
				const errorCode = await response?.text();
				if (errorCode === 'P2002') {
					inputField.setCustomValidity('ID already exists!');
					inputField.reportValidity();
				}
				confirmFailed = true;
				idConfirmed = false;
			} else {
				idConfirmed = true;
				confirmFailed = false;
				postID = inputField.value;
				$store.postID = postID;
			}
		}
	}
</script>

<form
	class="flex flex-col m-2"
	bind:this={dialog}
	on:submit={async (e) => {
		if (postID !== inputField.value || inputField.value !== lastSetInput) {
			e.preventDefault();
			try {
				await handleSubmit();
			} catch (e) {
				console.error(e);
			}
			closeReady = true;
		} else {
			inputField.reportValidity();
		}
		if (closeReady) {
			setPopover(false);
		}
	}}
>
	<aside
		tabindex="-1"
		style="text-align: initial;"
		class="bg-artistBlue-800 p-2 w-full max-h-[75vh] items-center flex flex-col overflow-visible"
	>
		<h1 class="xs:text-md text-md">🎉 Posted!</h1>
		<p class="xs:text-sm md:text-base text-xs">
			Your post has been published and is now visible to the public.
		</p>
		<span class="flex items-center relative">
			<input
				tabindex="0"
				bind:this={inputField}
				required
				on:input={(e) => {
					idEditMessage = undefined;
					idConfirmed = false;
					confirmFailed = false;
					closeReady = false;
					inputField.setCustomValidity('');
					if (inputField.value.length > 30) {
						inputField.value = inputField.value.substring(0, 30); // Trims the value if it exceeds 30 characters
						inputField.setCustomValidity('Max 30 characters!');
						inputField.reportValidity();
					}
					inputValueWidth = context.measureText(inputField.value).width + 9;
				}}
				on:blur={async () => {
					if (inputField.value.length === 0) {
						inputField.value = postID;
					} else if (lastSetInput === inputField.value) {
						inputField.reportValidity();
						return;
					} else {
						await handleSubmit();
					}
					lastSetInput = inputField.value;
				}}
				class="bg-artistBlue-600 rounded m-3 p-1 font-bold underline mr-0.5 min-w-0 focus:min-w-[5px] xs:text-base text-xs"
				style="width: {inputValueWidth ? inputValueWidth : 0}px;"
			/>
			<Tooltip
				on:click={() => inputField.focus()}
				on:keypress={(e) => {
					if (e.key === 'Enter') {
						inputField.focus();
					}
				}}
				message={idEditMessage}
				style="top-[75%] left-[55%] xs:text-sm text-xs cursor-pointer"
			/>
			<span class="absolute max-w-[30px] m-1 -right-10">
				<span class="relative w-[30px] top-0">
					{#if idConfirmed}
						<Checkmark />
					{/if}
					{#if confirmFailed}
						<Error />
					{/if}
				</span>
				{#if confirmingID}
					<ContentLoader
						speed={0.5}
						primaryColor={colors.artistBlue[500]}
						secondaryColor={colors.larimarGreen[500]}
						width={30}
						height={30}
					/>
				{/if}
			</span>
		</span>

		<p class="mt-5 xs:text-sm md:text-bas text-xs">Gather senders & share the link below!</p>
		<span
			class="relative font-bold m-auto rounded mt-2 bg-peacockFeather-600 text-paper-800 underline p-1 flex text-[10px] xs:text-sm"
		>
			{new URL(postID, $page.url.origin)}
		</span>
	</aside>
	<button type="submit" on:click={() => setPopover(false)} class="w-full h-10 mt-2">Close</button>
</form>

<style lang="scss">
	button {
		background: rgba(255, 255, 255, 0.15);
		border-radius: 0 0 16px 16px;
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
