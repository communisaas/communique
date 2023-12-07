<script lang="ts">
	import { getFlagEmoji } from '$lib/ui/ux';
	import { getCountryForTimezone } from 'countries-and-timezones';
	import { onMount } from 'svelte';

	export let style = '';
	export let country = '';
	export let countryCode = '';

	let timezone: string;

	onMount(() => {
		timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
		const countryInfo = getCountryForTimezone(timezone);
		country = countryInfo?.name || 'United States';
		countryCode = countryInfo?.id || 'US';
	});
</script>

{#if country}
	<span class="text-paper-700 flex flex-col items-center justify-around {style}">
		<span class="mt-auto text-2xl md:text-3xl leading-[0.8] md:leading-[0.8] pt-1"
			>{getFlagEmoji(countryCode)}</span
		>
		<span class="mb-auto text-xs md:text-sm leading-none md:leading-none pb-1">{country}</span>
	</span>
{/if}
