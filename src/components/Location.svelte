<script lang="ts">
	import { goto } from '$app/navigation';
	import { getFlagEmoji } from '$lib/ui/ux';
	import { getCountryForTimezone } from 'countries-and-timezones';
	import { onMount } from 'svelte';
	import TextField from './input/TextField.svelte';
	import { handleAutocomplete } from '$lib/data/select';

	export let style = '';
	export let country = '';
	export let countryCode = '';

	let timezone: string;
	let locationInputField: HTMLInputElement;
	let searchResults: Descriptor<string>[] | null = [];

	onMount(() => {
		timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
		const countryInfo = getCountryForTimezone(timezone);
		country = countryInfo?.name || 'United States';
		countryCode = countryInfo?.id || 'US';
	});
</script>

<!-- TODO resolve location across languages -->
{#if country}
	<div
		class="group h-full relative rounded hover:bg-peacockFeather-600 transition-colors duration-200 cursor-context-menu px-1"
	>
		<span class="text-paper-700 flex flex-col items-center justify-around {style}">
			<span class="mt-auto text-2xl md:text-3xl leading-[0.8] md:leading-[0.8] pt-1"
				>{getFlagEmoji(countryCode)}</span
			>
			<span class="mb-auto text-xs md:text-sm leading-none md:leading-none pb-1">{country}</span>
		</span>
		<div
			role="menu"
			class="absolute h-fit z-40 left-0 min-w-0 bottom-[200%] group-hover:w-auto group-hover:top-[100%] bg-peacockFeather-700 shadow-lg"
		>
			<ul class="flex items-center m-2">
				<TextField
					bind:inputField={locationInputField}
					bind:searchResults
					placeholder="search location..."
					autocomplete={true}
					searchSource="location"
					autocompleteStyle="absolute max-h-80 overflow-y-auto top-[80%] left-[0.25rem] bg-peacockFeather-600 text-paper-500"
					style="rounded px-1.5 py-1 min-w-full text-left whitespace-nowrap bg-peacockFeather-600 transition-colors duration-200"
					on:focus={(e) => {
						let menuDiv = locationInputField ? locationInputField.parentNode?.parentNode : null;
						if (menuDiv) {
							menuDiv.style.top = '100%';
							menuDiv.style.width = 'auto';
						}
					}}
					on:blur={(e) => {
						searchResults = [];
						let menuDiv = locationInputField ? locationInputField.parentNode?.parentNode : null;
						if (menuDiv) {
							menuDiv.style.top = '';
							menuDiv.style.width = '';
						}
					}}
					on:autocomplete={async (e) => {
						searchResults = null;
						searchResults = await handleAutocomplete(e);
					}}
				/>
			</ul>
		</div>
	</div>
{/if}
