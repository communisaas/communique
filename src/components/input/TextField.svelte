<script lang="ts">
	import { onMount } from 'svelte';

	export let value = '';
	export let style = '';
	export let type = 'text';
	export let required = false;
	export let placeholder = 'Enter text';
	export let autocomplete = 'off';
	export let name = placeholder;

	let inputField: HTMLInputElement | HTMLTextAreaElement | null = null;

	let currentValue = value; // Ensure the placeholder is considered in initial width calculation
	const originalValue = value;
	let mirror: HTMLSpanElement;
	let width = 'auto';

	function updateSize() {
		if (inputField && mirror) {
			// Update mirror content for width calculation
			mirror.textContent = currentValue || placeholder;
			mirror.style.width = 'auto'; // Allow it to expand as needed for content
			width = `${mirror.offsetWidth + 16}px`;

			if (type === 'textarea' && inputField instanceof HTMLTextAreaElement) {
				// Reset height to shrink if text gets deleted
				inputField.style.height = 'auto';
				// Set the height to scroll height to expand as needed
				width = `${mirror.offsetWidth + 28}px`;
				console.log(inputField.offsetHeight, inputField.scrollHeight);
				if (inputField.clientHeight < inputField.scrollHeight)
					inputField.style.height = `${inputField.scrollHeight}px`;
			}

			inputField.style.width = width; // Apply new width to input field
		}
	}

	onMount(() => {
		updateSize();
	});

	$: currentValue, updateSize();
</script>

<!-- Invisible mirror span to calculate width -->
<div class="mirror" bind:this={mirror}>
	{currentValue}
</div>

{#if type === 'text'}
	<input
		{autocomplete}
		id={name}
		{name}
		bind:this={inputField}
		bind:value={currentValue}
		type="text"
		{required}
		{placeholder}
		class="max-w-[80vw] {style}"
		on:input={updateSize}
		on:blur={(e) => {
			if (required && inputField && inputField.value.trim().length === 0) {
				currentValue = originalValue;
				updateSize();
			}
		}}
	/>
{:else if type === 'textarea'}
	<textarea
		id={name}
		{name}
		bind:this={inputField}
		bind:value={currentValue}
		{required}
		{placeholder}
		class="max-w-[80vw] {style}"
		style="resize: none;"
		on:input={updateSize}
		on:blur={(e) => {
			if (required && inputField && inputField.value.trim().length === 0) {
				currentValue = originalValue;
				updateSize();
			}
		}}
	/>
{/if}

<style>
	.mirror {
		display: block;
		position: absolute;
		visibility: hidden;
		white-space: pre-wrap;
		overflow: hidden;
		max-width: max-content;
	}
</style>
