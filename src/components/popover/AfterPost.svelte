<script lang="ts">
	import { onMount, createEventDispatcher, onDestroy } from 'svelte';
	import { writable, type Writable } from 'svelte/store';
	import { trapFocus, updateFocusableElements } from '$lib/ui/ux';

	export let postID: string;

	let focusableElements = writable<HTMLElement[]>([]);
	let lastFocusableElement = writable<HTMLElement>();
	let inputValueWidth = 0;

	let store: Writable<UserState>;

	let dialog: HTMLElement;
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
			inputValueWidth = context.measureText(postID).width * 1.1;
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
</script>

<section class="flex flex-col gap-2 m-10" bind:this={dialog}>
	<aside
		tabindex="-1"
		style="text-align: initial;"
		class="bg-artistBlue-800 p-5 overflow-auto w-full max-h-[75vh]"
	>
		<h1>🎉 Posted!</h1>
		<p>Your post has been published and is now visible to the public.</p>
		<input value={postID} />
	</aside>
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
