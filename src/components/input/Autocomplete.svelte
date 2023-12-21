<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import ContentLoader from 'svelte-content-loader';
	import colors from '$lib/ui/colors';

	export let placeholder = 'Location (optional)';
	export let searchResults: Descriptor<string>[] = [];
	export let source: string;
	export let style = '';
	export let autocompleteStyle = '';

	let inputWidth: number;
	let searching = false;
	let loading = false;
	let completionFocusIndex = 0;
	let completionList;
	let input: HTMLInputElement;
	const dispatch = createEventDispatcher();

	onMount(() => {
		inputWidth = input.offsetWidth;
	});

	function handleInput(event) {
		if (input.value)
			if (input.value.length > 2) {
				searching = true;
				loading = true; // Start loading
				dispatch('autocomplete', { value: input.value, source });
				completionFocusIndex = -1;
			} else {
				searching = false;
			}
	}

	function selectLocation(item) {
		input.value = item;
		searching = false;
	}

	$: if (searchResults) {
		searching = false;
	}

	// Simulate result loading
	// $: if (searching) {
	// 	setTimeout(() => {
	// 		loading = false; // Stop loading after a delay
	// 	}, 1000); // Mock delay
	// }
</script>

<div class="location-autocomplete">
	<input bind:this={input} type="text" {placeholder} on:input={handleInput} class={style} />

	{#if searching}
		<ul
			bind:this={completionList}
			class="autocomplete flex flex-col bg-paper-500 py-1 max-w-[80vw] w-fit {autocompleteStyle}"
		>
			{#if loading}
				<li class="relative px-1">
					<ContentLoader
						uniqueKey="locationAutocompleteLoader"
						width={inputWidth}
						height={20}
						primaryColor={colors.artistBlue[500]}
						secondaryColor={colors.larimarGreen[500]}
						speed={0.5}
					/>
				</li>
			{:else if searchResults.length > 0}
				{#each searchResults as result, index}
					<li
						role="menuitem"
						class:selected={index === completionFocusIndex}
						on:click={() => selectLocation(result)}
						on:keypress={(e) => {
							if (e.key === 'Enter') {
								selectLocation(result);
							}
						}}
					>
						{result}
					</li>
				{/each}
			{/if}
		</ul>
	{/if}
</div>

<style>
	.location-autocomplete {
		position: relative;
		max-width: 100%;
	}

	.autocomplete {
		position: absolute;
		top: 100%;
		max-height: 200px;
		overflow-y: auto;
		overflow-x: visible;
		box-sizing: border-box;
		border-radius: 4px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		z-index: 100;
	}
	.autocomplete-results li {
		padding: 8px;
		cursor: pointer;
	}

	.autocomplete-results li:hover,
	.autocomplete-results li.selected {
		background-color: #efefef;
	}

	.loader {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		border-top: none;
		z-index: 100;
	}
</style>
