<script lang="ts">
	import type { email } from '@prisma/client';
	import { onMount, afterUpdate, beforeUpdate } from 'svelte';
	import type { Writable } from 'svelte/store';
	import DOMPurify from 'dompurify';

	export let expand = false;
	export let email: email;
	export let contextElement: HTMLElement;

	let expandable: HTMLElement;
	let focusableElements: NodeListOf<Element>;
	let lastFocusableElement: HTMLElement;

	let store: Writable<UserState>;
	onMount(async () => {
		store = (await import('$lib/data/sessionStorage')).store;
	});

	beforeUpdate(() => {
		// Remove the blur event listener from the last focusable element
		if (lastFocusableElement) {
			lastFocusableElement.removeEventListener('blur', transferFocus);
		}
	});

	afterUpdate(() => {
		focusableElements = expandable.querySelectorAll(
			'a, button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
		);

		focusableElements.forEach((element: HTMLElement) => {
			if (expand) {
				element.removeAttribute('tabindex');
			} else {
				element.setAttribute('tabindex', '-1');
			}
		});

		// Add a blur event listener to each focusable element
		focusableElements.forEach((element: HTMLElement) => {
			element.addEventListener('blur', transferFocus);
		});
	});

	function transferFocus(event: FocusEvent) {
		// Check if the relatedTarget (the element receiving focus) is inside the expandable element
		console.log(expandable.contains(event.relatedTarget as Node));
		if (!expandable.contains(event.relatedTarget as Node)) {
			expand = false; // set expand to false if the focus is outside of the expandable element
		}
	}
</script>

<aside
	tabindex="-1"
	style="text-align: initial; max-height: {expand ? 'fit-content' : '0'}, overflow: visible"
	bind:this={expandable}
	on:click|preventDefault
	on:keypress|preventDefault
>
	<div
		tabindex="-1"
		aria-label="Email content"
		style="max-height: {expand ? 'fit-content' : '11rem'}; pointer-events: {expand
			? 'auto'
			: 'none'}"
	>
		{@html DOMPurify.sanitize(email.body)}
	</div>
</aside>
