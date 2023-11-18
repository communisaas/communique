<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import ContentLoader from 'svelte-content-loader';
	import colors from '$lib/ui/colors';
	import Tooltip from '../Tooltip.svelte';

	export let type: 'text' | 'search' | 'email',
		name: string,
		placeholder: string,
		style: string,
		tagStyle: string,
		autocompleteStyle: string = '',
		autocomplete: boolean = false,
		allowCustomValues: boolean = false,
		searchField = '',
		maxItems = 100;
	export let tagList: Descriptor<string>[] = [];
	export let searchResults: Descriptor<string>[] = [];
	export let inputStyle = '';
	export let addIconStyle =
		'add absolute bg-peacockFeather-600 h-6 w-6 text-2xl leading-6 font-bold';
	export let inputVisible: boolean = false;
	export let inputField: HTMLInputElement;

	let searching = false;

	let firstInput = true;

	let completionFocusIndex: number = 0;
	let completionList: HTMLUListElement;
	let completionButtons: HTMLDivElement[] = [];

	let deleteVisible: FlagMap = {}; // A map to hold visibility states
	let deleteButtons: ButtonElementMap = {}; // A map to hold the delete buttons

	let validityMessage: string | null;

	const dispatch = createEventDispatcher();

	$: tagValues = tagList.map((tag) => tag.item);

	function addTag(tag: Descriptor<string>) {
		inputField.value = '';
		validityMessage = null;
		if (tagValues.includes(tag.item)) {
			inputField.setCustomValidity(
				`${name.replace(name[0], name[0].toLocaleUpperCase())} ${tag.item} already entered.`
			);
			inputField.reportValidity();
		} else {
			tagList = [...tagList, tag];
			searchResults = searchResults.filter((result) => result.item !== tag.item);
			dispatch('add', tag);
		}
	}

	async function handleInput() {
		if (firstInput && type == 'email') {
			validityMessage = 'Try pasting a list of email addresses!';
			firstInput = false;
		}

		if (inputField.value.length > 2 && autocomplete) {
			searching = true;
		} else {
			searching = false;
		}

		const currentValueWidth = context.measureText(inputField.value).width + 8;
		if (currentValueWidth > placeholderWidth) {
			inputValueWidth = currentValueWidth;
		} else {
			inputValueWidth = placeholderWidth;
		}
		if (autocomplete && inputField.value.length > 2) {
			dispatch('autocomplete', { value: inputField.value, source: searchField });
			completionFocusIndex = -1;
		}
	}

	async function handleEmailPaste(event: ClipboardEvent) {
		// Define a regex pattern to match email addresses
		const emailRegex = /[\w.-]+@[\w.-]+\.\w+/g;

		// Get the pasted text from the clipboard event
		const pastedText = event.clipboardData?.getData('text') || '';

		// Extract all email addresses from the pasted text using the regex
		const extractedEmails = pastedText.match(emailRegex) || [];

		const deduplicatedEmails = extractedEmails.filter((email) => {
			if (!tagValues.includes(email)) return email;
		});

		if (deduplicatedEmails.length < 1) {
			inputField.setCustomValidity('No valid email addresses found!');
			inputField.reportValidity();
			return;
		}

		// Iterate over the extracted emails and call handleSubmit for each email
		for (const email of deduplicatedEmails) {
			inputField.value = email; // Set the inputField value to the current email
			handleSubmit(); // Call handleSubmit
		}

		if (deduplicatedEmails.length != extractedEmails.length) {
			inputField.setCustomValidity('Some email addresses were duplicates!');
			inputField.reportValidity();
		}
	}

	async function handleBlur(e: FocusEvent) {
		if (
			(!Object.keys(deleteVisible).some((k) => deleteVisible[k]) &&
				!completionList.contains(e.relatedTarget as Node)) ||
			!autocomplete
		) {
			searching = false;
			if (tagList.length > 0) inputVisible = false;
			groupedResults = {};
		}
		validityMessage = null;
		dispatch('blur', e.detail);
	}

	function handleSubmit() {
		if (searching && !groupedResults) return;
		else if (searching && type === 'search') {
			inputField.setCustomValidity('Still searching! Wait for results...');
			inputField.reportValidity();
			return;
		}
		if (tagList.length == maxItems) {
			inputField.setCustomValidity(`Maximum of ${maxItems} ${name}s!`);
			inputField.reportValidity();
			return;
		}

		if (autocomplete) {
			if (inputField.checkValidity()) {
				if (autocomplete) {
					if (completionFocusIndex >= 0) {
						addTag(filteredSearchResults[completionFocusIndex]);
					} else {
						addTag({ item: inputField.value, type: type });
					}
				} else {
					addTag({ item: inputField.value, type: type });
				}
				inputValueWidth = placeholderWidth;
			} else {
				inputField.reportValidity();
			}
		} else if (inputField.value.length < 3) {
			inputField.setCustomValidity('Too short!');
			inputField.reportValidity();
		} else if (
			inputField.value.length > 0 &&
			!allowCustomValues &&
			!filteredSearchResults.some((result) => result.item === inputField.value)
		) {
			inputField.setCustomValidity('Nothing here! Try adding it?');
			inputField.reportValidity();
			searchResults = [];
		} else {
			addTag({ item: inputField.value, type: type });
		}
	}

	$: if (searchResults) {
		searching = false;
	}
	$: filteredSearchResults = searchResults
		? searchResults.filter(
				(result) =>
					!tagList.some((tag) => tag.item === result.item && tag.type === result.type) &&
					(result.source === searchField || !searchField)
		  )
		: [];

	$: groupedResults = filteredSearchResults.reduce(
		(accumulator: { [key: string]: Descriptor<string>[] }, result) => {
			// TODO filter by searchfield at endpoint
			if (result.source && (result.source === searchField || !searchField)) {
				if (!accumulator[result.source]) {
					accumulator[result.source] = [];
				}
				accumulator[result.source].push(result);
			}
			return accumulator;
		},
		{}
	);

	let canvas: HTMLCanvasElement, context: CanvasRenderingContext2D;
	let inputValueWidth: number, placeholderWidth: number;
	onMount(() => {
		canvas = document.createElement('canvas');
		context = canvas.getContext('2d') as CanvasRenderingContext2D;
		if (context) {
			// TODO measure input width smoothly using in-dom placeholder
			context.font = getComputedStyle(inputField).font;
			inputValueWidth = context.measureText(placeholder).width * 1.2;
			placeholderWidth = inputValueWidth;
		}
	});
</script>

<div class="px-2 rounded max-w-full h-max relative items-center justify-center {style}">
	<form
		autocomplete="off"
		class="flex flex-nowrap max-w-full"
		on:submit|preventDefault={() => {
			handleSubmit();
		}}
	>
		<ul
			class="shrink min-w-0 inline-flex flex-row flex-wrap items-center max-w-full"
			aria-label="{name} list"
			aria-describedby="List of {name}s with an add button"
		>
			{#each tagList as tag}
				<li class="relative mx-2 min-w-0 {tagStyle}">
					<span
						role="listitem"
						class="relative h-full shrink flex whitespace-nowrap"
						on:mouseenter={() => (deleteVisible[tag.item] = true)}
						on:mouseleave={() => (deleteVisible[tag.item] = false)}
						on:touchend={() => (deleteVisible[tag.item] = false)}
						on:mousemove={(event) => {
							const containerRect = event.currentTarget.getBoundingClientRect();

							// Make sure the button stays within the boundaries
							let deleteX = Math.min(
								event.clientX - containerRect.left - 10,
								containerRect.width - 10
							);
							let deleteY = Math.min(
								event.clientY - containerRect.top - 10,
								containerRect.height - 10
							);

							deleteX = Math.max(deleteX, 0); // To keep it within left boundary
							deleteY = Math.max(deleteY, 0); // To keep it within top boundary

							if (deleteButtons[tag.item]) {
								deleteButtons[tag.item].style.left = `${deleteX}px`;
								deleteButtons[tag.item].style.top = `${deleteY}px`;
							}
						}}
					>
						<button
							bind:this={deleteButtons[tag.item]}
							type="button"
							on:click|stopPropagation={(e) => {
								tagList = tagList.filter((item) => item != tag);
								if (autocomplete) filteredSearchResults = [...filteredSearchResults, tag];
								if (tagList.length < 1 || inputVisible) inputField.focus();
								dispatch('delete', tag);
							}}
							on:focus={() => (deleteVisible[tag.item] = true)}
							on:blur={() => (deleteVisible[tag.item] = false)}
							class="delete absolute -top-1 -left-2 rounded-full bg-amber-600 w-4 h-4"
							class:show={deleteVisible[tag.item]}
							aria-label={`Remove ${name}`}
						>
							<!-- x sign -->
							&#215;
						</button>
						<span class="overflow-ellipsis overflow-hidden max-w-full inline-block underline">
							{tag.item}
						</span>
					</span>
				</li>
			{/each}
		</ul>
		<li class="flex gap-3 justify-center ml-auto flex-wrap items-center relative">
			<input
				required={tagList.length <= 0}
				{name}
				role="textbox"
				aria-label="{name} input"
				aria-describedby="Add a {name} here"
				{placeholder}
				inputmode={type}
				bind:this={inputField}
				on:blur={handleBlur}
				on:focus={(e) => (inputVisible = true)}
				on:keydown|self={(e) => {
					// clear earlier validation errors
					inputField.setCustomValidity('');

					const resultsLength = filteredSearchResults ? filteredSearchResults.length : 0;
					if (resultsLength > 0) {
						if (e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey)) {
							e.preventDefault();
							if (completionFocusIndex === resultsLength - 1) {
								completionFocusIndex = -1;
							} else {
								completionFocusIndex = (completionFocusIndex + 1) % resultsLength;
							}
						}
						if (e.key === 'ArrowUp' || (e.key === 'Tab' && e.shiftKey)) {
							e.preventDefault();
							if (completionFocusIndex === -1) {
								completionFocusIndex = resultsLength - 1;
							} else {
								completionFocusIndex = (completionFocusIndex - 1 + resultsLength) % resultsLength;
							}
						}
					}

					if (e.key === 'Enter') {
						e.preventDefault();
						handleSubmit();
					}

					if (e.key === 'Escape' || (e.key === 'Tab' && !filteredSearchResults)) {
						e.preventDefault();
						inputField.blur();
					}
				}}
				on:input={() => {
					handleInput();
				}}
				on:paste={(e) => {
					if (type === 'email') {
						handleEmailPaste(e);
						e.preventDefault();
					}
				}}
				style="width: {inputVisible && inputValueWidth ? inputValueWidth : 0}px;"
				class="rounded shadow-artistBlue shadow-card w-0 h-0 focus:ml-2 focus:mr-1 self-center justify-self-center {inputStyle}"
				class:show={inputVisible}
				class:p-1={inputVisible}
				{type}
			/>
			{#if validityMessage}
				<Tooltip message={validityMessage} style="top-[75%] left-[100%]" />
			{/if}
			<ul
				bind:this={completionList}
				class="autocomplete flex flex-col bg-paper-500 py-1 max-w-[80vw] w-fit {autocompleteStyle}"
				class:px-4={Object.keys(groupedResults).length > 0 && inputVisible}
				on:mouseleave={() => (completionFocusIndex = -1)}
			>
				{#if searching}
					<li class="relative px-1">
						<ContentLoader
							uniqueKey="autocomplete"
							width={inputValueWidth}
							height={20}
							secondaryColor={colors.larimarGreen[700]}
							speed={0.5}
						/>
					</li>
				{:else if filteredSearchResults && filteredSearchResults.length > 0 && inputVisible}
					{#each Object.keys(groupedResults) as type, groupIndex}
						<li class="-ml-1">{type}s</li>
						{#each groupedResults[type] as result, itemIndex}
							<li class="relative">
								<div
									tabindex="0"
									bind:this={completionButtons[completionButtons.length]}
									role="button"
									class="p-1 rounded mr-2 cursor-pointer w-full text-xs text-center overflow-hidden overflow-ellipsis"
									class:bg-paper-800={filteredSearchResults[completionFocusIndex] &&
										filteredSearchResults[completionFocusIndex].item === result.item}
									on:mouseenter={() =>
										(completionFocusIndex = filteredSearchResults.findIndex(
											(r) => r.item === result.item
										))}
									on:click|preventDefault|stopPropagation={(e) => {
										addTag(filteredSearchResults[completionFocusIndex]);
										inputValueWidth = placeholderWidth;
										inputField.focus();
									}}
									on:keydown|preventDefault|stopPropagation={(e) => {
										if (e.key === 'Enter') {
											addTag(filteredSearchResults[completionFocusIndex]);
											inputValueWidth = placeholderWidth;
											inputField.focus();
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
		</li>
		<button
			type="submit"
			name={`Add ${name}`}
			aria-label="Add button for {name}s"
			class="flex justify-center items-center relative min-w-fit shrink-0"
			on:mousedown|preventDefault
			on:click|preventDefault={(e) => {
				inputField.focus();
				if (inputField.value.length > 0) {
					handleSubmit();
				}
			}}
		>
			<span title={`Add ${name}`} class="flex">
				<slot />
				<icon class={addIconStyle} />
			</span>
		</button>
	</form>
</div>

<style lang="scss">
	input {
		transition: all 0.2s;
	}
	button span {
		filter: drop-shadow(1px 1px 0.5px rgb(0 0 0 / 0.4));
		transform: scale(0.97);
		transition: 0.1s all ease-out;
	}
	button .active {
		transform: scale(1);
	}
	button:hover span {
		filter: drop-shadow(2px 2px 1px rgb(0 0 0 / 0.4));
		transform: scale(1);
		transition: 0.1s all ease-in;
	}
	.add {
		bottom: 0;
		right: 0;
		border-radius: 9999px; // render circle
		color: #fff;
		opacity: 75%;
		transform: scale(0.75);
		transition: all 0.2s ease-in;
	}
	span:hover > .add {
		opacity: 85%;
		transform: scale(0.85);
		transition: all 0.2s ease-out;
	}
	.add:after {
		content: '+';
	}
	.delete {
		opacity: 0;
		transform: scale(0);
		transition: opacity 0.2s, transform 0.2s, visibility 0s 0.2s;
		color: #fff;
		font-size: 1rem;
		line-height: 1rem;
		opacity: 95%;
		text-shadow: rgba(0, 0, 0, 0.25) 0 2px 2px;
		&.show:hover {
			transform: scale(1.35);
			text-shadow: rgba(0, 0, 0, 0.25) 0 1px 1px;
		}
		&.show {
			transform: scale(1);
			transition: opacity 0.2s, transform 0.2s, visibility 0s 0.2s;
		}
	}

	.autocomplete {
		position: absolute;
		top: 75%;
		max-height: 200px;
		overflow-y: auto;
		overflow-x: visible;
		box-sizing: border-box;
		border-radius: 4px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		z-index: 100;
	}

	.show {
		visibility: visible;
		opacity: 1;
	}
	input.show {
		width: 4.55rem;
		height: 1.5rem;
		transition: all 0.2s;
	}
</style>
