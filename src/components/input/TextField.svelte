<script lang="ts">
	import colors from '$lib/ui/colors';
	import { createEventDispatcher, onMount } from 'svelte';
	import ContentLoader from 'svelte-content-loader';

	export let value = '';
	export let style = '';
	export let type = 'text';
	export let required = false;
	export let placeholder = 'Enter text';
	export let autocomplete = false;
	export let searchSource = '';
	export let searchResults: Descriptor<string>[] | null = [];
	export let autocompleteStyle = '';
	export let browserAutocomplete = 'off';
	export let name = placeholder;
	export let inputField: HTMLInputElement | HTMLTextAreaElement | null = null;

	let searching = false;
	let completionListElement: HTMLUListElement | null = null;
	let completionItems: HTMLDivElement[] = [];

	let currentValue = value; // Ensure the placeholder is considered in initial width calculation
	const originalValue = value;
	let mirror: HTMLSpanElement;
	let completionFocusIndex: number = 0;
	let width = 'auto';

	const dispatch = createEventDispatcher();

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
				if (inputField.clientHeight < inputField.scrollHeight)
					inputField.style.height = `${inputField.scrollHeight}px`;
			}

			inputField.style.width = width; // Apply new width to input field
		}
	}

	function resolveCompletion(completion: Descriptor<string>) {
		currentValue = completion.item;
		searchResults = searchResults.filter((result) => result.item !== completion.item);
	}

	function handleInput() {
		if (inputField) {
			updateSize();
			if (inputField.value.length > 2 && autocomplete) {
				searching = true;
			} else {
				searching = false;
			}

			if (autocomplete && inputField.value.length > 2) {
				dispatch('autocomplete', { value: inputField.value, source: searchSource });
				completionFocusIndex = -1;
			}
		}
	}

	onMount(() => {
		updateSize();
	});

	$: currentValue, updateSize();

	$: if (searchResults) {
		searching = false;
	}

	$: groupedResults = searchResults
		? Object.entries(
				searchResults.reduce((accumulator: { [key: string]: Descriptor<string>[] }, result) => {
					if (result.source) {
						if (!accumulator[result.source]) {
							accumulator[result.source] = [];
						}

						// Check if the result already exists in the group
						if (!accumulator[result.source].some((item) => item.item === result.item)) {
							accumulator[result.source].push(result);
						}
					}
					return accumulator;
				}, {} as { [key: string]: Descriptor<string>[] })
		  )
				.map(([source, results]) => {
					// Calculate the mean rank for each group
					const meanRank =
						results.reduce((acc, curr) => acc + (curr.rank ?? 0), 0) / results.length;
					return { source, results, meanRank };
				})
				.sort((a, b) => a.meanRank - b.meanRank) // Sort groups by mean rank
				.reduce((acc, { source, results }) => {
					// Convert back to the original format
					acc[source] = results;
					return acc;
				}, {} as { [key: string]: Descriptor<string>[] })
		: {};

	let flatGroupedResults: Descriptor<string>[] = [];
	$: searchResults, (flatGroupedResults = flattenGroupedResults(groupedResults));

	// Flatten grouped results for easier index-based navigation
	function flattenGroupedResults(groupedResults: { [key: string]: Descriptor<string>[] }) {
		let flatResults: Descriptor<string>[] = [];
		Object.entries(groupedResults).forEach(([group, items]) => {
			items.forEach((item) => {
				flatResults.push({ ...item });
			});
		});
		return flatResults;
	}
</script>

<!-- Invisible mirror span to calculate width -->
<div class="mirror" bind:this={mirror}>
	{currentValue}
</div>

{#if type === 'text'}
	<input
		autocomplete={browserAutocomplete}
		id={name}
		{name}
		bind:this={inputField}
		bind:value={currentValue}
		type="text"
		{required}
		{placeholder}
		class="max-w-[80vw] {style}"
		on:input={handleInput}
		on:blur={(e) => {
			if (inputField && inputField.value.trim().length === 0) {
				currentValue = originalValue;
				updateSize();
			}
			dispatch('blur', e);
		}}
		on:focus
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
			if (inputField && inputField.value.trim().length === 0) {
				currentValue = originalValue;
				updateSize();
			}
		}}
	/>
{/if}
<ul
	bind:this={completionListElement}
	class="flex flex-col w-max max-w-[50vw] z-20 {autocompleteStyle}"
	class:py-2={searchResults && searchResults.length > 0}
	class:px-4={searchResults && searchResults.length > 0}
	on:mouseleave={() => (completionFocusIndex = -1)}
>
	{#if searching}
		<li class="relative p-1">
			<ContentLoader
				uniqueKey="tagAutocompleteLoader"
				width={width.slice(0, -2)}
				height={20}
				primaryColor={colors.artistBlue[500]}
				secondaryColor={colors.larimarGreen[500]}
				speed={0.5}
			/>
		</li>
	{:else if searchResults && searchResults.length > 0}
		{#each Object.keys(groupedResults) as type, groupIndex}
			<li class="-ml-1 font-bold">{type}</li>
			{#each groupedResults[type] as result, itemIndex}
				<li class="relative">
					<div
						tabindex="0"
						bind:this={completionItems[completionItems.length]}
						role="button"
						class="p-1 rounded mr-2 cursor-pointer w-full text-xs text-start overflow-hidden overflow-ellipsis"
						class:bg-peacockFeather-500={flatGroupedResults[completionFocusIndex] &&
							flatGroupedResults[completionFocusIndex].item === result.item}
						on:mouseenter={() =>
							(completionFocusIndex = flatGroupedResults.findIndex((r) => r.item === result.item))}
						on:click|preventDefault|stopPropagation={(e) => {
							resolveCompletion(flatGroupedResults[completionFocusIndex]);
							if (inputField) inputField.focus();
						}}
						on:keydown|preventDefault|stopPropagation={(e) => {
							if (e.key === 'Enter') {
								resolveCompletion(flatGroupedResults[completionFocusIndex]);
								if (inputField) inputField.focus();
							}
						}}
					>
						{result.item}
					</div>
				</li>
			{/each}
		{/each}
	{/if}
</ul>

<style>
	.mirror {
		display: block;
		position: absolute;
		visibility: hidden;
		white-space: pre-wrap;
		overflow: hidden;
		max-width: max-content;
		white-space: nowrap;
	}
</style>
