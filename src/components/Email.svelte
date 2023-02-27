<script lang="ts">
	import type { email } from '@prisma/client';
	import { onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import TagSelector from './TagSelector.svelte';

	let store: Writable<CommuniqueLocalStorage>;
	onMount(async () => {
		store = (await import('./localStorage')).store;
	});

	export let email: email;

	// TODO email card layout
</script>

<article class="w-80 h-44 p-2 rounded bg-paper shadow-artistBlue shadow-card">
	<h1>{email.subject}</h1>
	<section class="flex flex-col">
		<span>reads: {email.open_count}</span>
		<span>sends: {email.send_count}</span>
	</section>
	{#if store}
		<TagSelector
			tagList={email.topic_list}
			bind:selected={$store.selectedTopic}
			style="text-[10px]"
		/>
	{/if}
	<TagSelector tagList={email.recipient_list} style="text-[10px] bg-emerald-500" />
</article>

<style>
	h1 {
		font-size: 1.4rem;
		text-align: start;
	}
</style>
