<script lang="ts">
	import { getFlagEmoji } from '$lib/ui/ux';
	import { getCountryForTimezone } from 'countries-and-timezones';
	import { Country } from 'country-state-city';
	import { onMount } from 'svelte';
	import TextField from './input/TextField.svelte';
	import { handleAutocomplete } from '$lib/data/select';
	import type { Writable } from 'svelte/store';

	export let style = '';
	export let country = '';
	export let countryCode = '';

	let timezone: string;
	let locationString: string;
	let locationInputField: HTMLInputElement;
	let searchResults: Descriptor<string>[] | null = [];

	let sessionStore: Writable<UserState>;
	onMount(async () => {
		sessionStore = (await import('$lib/data/sessionStorage')).store;
		timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
		const countryInfo = getCountryForTimezone(timezone);
		countryCode = $sessionStore.country || countryInfo?.id || 'US';
		$sessionStore.country = $sessionStore.country || countryCode;
		locationString = $sessionStore.location || '';
	});

	$: if (country || countryCode) {
		country = Country.getCountryByCode(countryCode ?? $sessionStore.country)?.name || country;
	}
</script>

<!-- TODO resolve location across languages -->
{#if country}
	<div
		class="group h-full relative hover:bg-peacockFeather-600 transition-colors duration-200 cursor-context-menu px-1"
	>
		<span class="text-paper-700 flex flex-col items-center justify-around {style}">
			<span class="text-3xl leading-[0.8] pt-1.5">{getFlagEmoji(countryCode)}</span>
			<span class="mb-auto text-xs leading-none md:leading-none pb-1 whitespace-nowrap">
				{country}
			</span>
		</span>
		<div
			role="menu"
			class="absolute h-fit z-40 left-0 min-w-0 bottom-[200%] group-hover:w-auto group-hover:top-[100%] bg-artistBlue-700 shadow-md"
		>
			<ul class="flex items-center m-2">
				<TextField
					bind:inputField={locationInputField}
					bind:searchResults
					bind:value={locationString}
					placeholder="search location..."
					autocomplete={true}
					searchSource="location"
					autocompleteStyle="absolute max-h-80 overflow-y-auto top-[80%] left-[0.25rem] bg-peacockFeather-600 text-paper-500"
					style="rounded shadow-md px-1.5 py-1 min-w-full text-left whitespace-nowrap bg-peacockFeather-600 focus:outline-peacockFeather-500 transition-colors duration-200"
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
						$sessionStore.country = countryCode;
						$sessionStore.location = locationInputField.value;
					}}
					on:autocomplete={async (e) => {
						searchResults = null;
						searchResults = await handleAutocomplete(e);
					}}
					on:update={(e) => {
						countryCode = e.detail.item.includes(',')
							? e.detail.item.split(',').pop().trim()
							: Country.getAllCountries().find((c) => c.name === e.detail.item)?.isoCode;
					}}
				/>
			</ul>
		</div>
	</div>
{/if}
