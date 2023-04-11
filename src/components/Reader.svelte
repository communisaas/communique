<script lang="ts">
	import type { email } from '@prisma/client';
	import { onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import DOMPurify from 'dompurify';

	export let expand = false;
	export let email: email;
	export let actionButton: HTMLInputElement;

	let expandable: HTMLElement;

	let store: Writable<UserState>;

	onMount(async () => {
		store = (await import('$lib/sessionStorage')).store;
	});
</script>

{#if store && email}
	<aside class:invisible={!expand} bind:this={expandable} on:mousedown|preventDefault>
		<input value="Copy to clipboard" bind:this={actionButton} type="button" on:blur />
		<div>
			{@html DOMPurify.sanitize(email.body)}
		</div>
	</aside>
{/if}
