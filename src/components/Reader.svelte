<script lang="ts">
	import { page } from '$app/stores';
	import { createEventDispatcher, onMount, type ComponentType } from 'svelte';
	import type { Writable } from 'svelte/store';

	export let alignment: 'start' | 'end' | 'center' | 'justify' | 'match-parent';
	export let expand = false;
	export let selected: Selectable;
	export let actionButton: HTMLInputElement;

	let expandable: HTMLElement;
	const dispatch = createEventDispatcher();

	let store: Writable<UserState>;

	let detail = fetch(`data/${selected.type}/`);

	onMount(async () => {
		store = (await import('$lib/sessionStorage')).store;
	});

	$: if (document) console.log(document.activeElement);
	$: console.log($page);
</script>

{#if store}
	<aside class:invisible={!expand} bind:this={expandable} on:mousedown|preventDefault>
		<input value={$store[selected.type].id} bind:this={actionButton} type="button" />
	</aside>
{/if}
