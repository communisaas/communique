<script lang="ts">
	import { page } from '$app/stores';
	import type { email } from '@prisma/client';
	import {
		createEventDispatcher,
		onMount,
		type ComponentType,
		beforeUpdate,
		afterUpdate
	} from 'svelte';
	import type { Writable } from 'svelte/store';

	export let alignment: 'start' | 'end' | 'center' | 'justify' | 'match-parent';
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
		<input value={email.rowid} bind:this={actionButton} type="button" on:blur />
		<div>
			{@html email.body}
		</div>
	</aside>
{/if}
