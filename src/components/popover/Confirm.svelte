<script lang="ts">
	import { onMount, createEventDispatcher, onDestroy } from 'svelte';
	import { writable, type Writable } from 'svelte/store';
	import { trapFocus, updateFocusableElements } from '$lib/ui/ux';

	export let advisoryText: string;
	export let inputToConfirm: string;
	export let action: (e: SubmitEvent) => Response | Promise<Response>;

	let focusableElements = writable<HTMLElement[]>([]);
	let lastFocusableElement = writable<HTMLElement>();
	let currentInputValue: string = '';
	let inputValueWidth = 0;

	let store: Writable<UserState>;

	let dialog: HTMLElement;
	let confirmButton: HTMLButtonElement;
	let submitDisabled = false;
	let firstFocusableElement = writable<HTMLElement | null>(null);
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
			inputValueWidth = context.measureText(inputToConfirm).width * 1.1;
		}
		dialog.addEventListener('keydown', focusHandler);
	});

	onDestroy(() => {
		dialog.removeEventListener('keydown', focusHandler);
	});

	const dispatch = createEventDispatcher();
	function setPopover(value: boolean) {
		dispatch('popover', value);
	}

	$: confirmButtonText = currentInputValue.length > 0 ? 'Confirm' : 'Close';
</script>

<section class="flex flex-col gap-2 m-10" bind:this={dialog}>
	<form
		on:submit|preventDefault={async (e) => {
			if (!submitDisabled && currentInputValue.length > 0 && e.submitter) {
				e.submitter.innerHTML = 'Confirming...';
				try {
					await action(e);
				} catch (err) {
					console.error(err);
					e.submitter.innerHTML = "Error! Try again; we'll look into it";
					e.stopPropagation();
					return;
				}
			}
			if (!submitDisabled) setPopover(false);
		}}
	>
		<aside
			tabindex="-1"
			style="text-align: initial;"
			class="bg-artistBlue-800 p-5 overflow-auto w-full max-h-[75vh]"
		>
			<div tabindex="-1" aria-label="content" class="max-h-fit w-full">
				<p>{advisoryText}</p>

				<input
					bind:this={inputField}
					placeholder={inputToConfirm}
					bind:value={currentInputValue}
					on:input={(e) => {
						e.currentTarget.setCustomValidity('');
						confirmButton.innerHTML = confirmButtonText;
						if (currentInputValue.length > 0 && currentInputValue !== inputToConfirm) {
							submitDisabled = true;
							e.currentTarget.setCustomValidity('Does not match!');
						} else {
							submitDisabled = false;
						}
					}}
					class="m-auto block h-10 bg-artistBlue-700 text-white rounded-md p-2 mt-2"
					style={`width: ${inputValueWidth}px`}
					type="text"
				/>
			</div>
		</aside>
		<button bind:this={confirmButton} class="w-full h-10 mt-2">{confirmButtonText}</button>
	</form>
</section>

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
