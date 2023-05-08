<script lang="ts">
	import ActionButton from './ActionButton.svelte';
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

	$: console.log(expand);
</script>

{#if store && email}
	<ActionButton {actionButton} visible={expand} {email} />
	<aside
		tabindex="-1"
		style="text-align: initial; max-height: {expand ? 'fit-content' : '0'}, overflow: visible"
		bind:this={expandable}
		on:mousedown|preventDefault
	>
		<div style="max-height: {expand ? 'fit-content' : '11rem'}">
			{@html DOMPurify.sanitize(email.body)}
		</div>
	</aside>
{/if}

<style lang="scss">
	input {
		cursor: pointer;
		border: 2px solid theme('colors.larimarGreen.600');
		&:hover {
			transform: translateY(-1px);
			box-shadow: rgba(0, 0, 0, 0.16) 0 1px 4px;

			transition: 0.1s ease-in;
		}
	}
</style>
