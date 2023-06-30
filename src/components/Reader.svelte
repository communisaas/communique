<script lang="ts">
	import type { email } from '@prisma/client';
	import { onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import DOMPurify from 'dompurify';

	export let expand = false;
	export let email: email;

	let expandable: HTMLElement;

	let store: Writable<UserState>;
	onMount(async () => {
		store = (await import('$lib/sessionStorage')).store;
	});
</script>

{#if store && email}
	<aside
		tabindex="-1"
		style="text-align: initial; max-height: {expand ? 'fit-content' : '0'}, overflow: visible"
		bind:this={expandable}
		on:click|preventDefault
		on:keypress|preventDefault
	>
		<div aria-label="Email content" style="max-height: {expand ? 'fit-content' : '11rem'}">
			{@html DOMPurify.sanitize(email.body)}
		</div>
	</aside>
{/if}
