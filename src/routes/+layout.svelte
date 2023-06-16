<script lang="ts">
	import '../app.postcss';
	import './styles.css';

	import Navigation from '$components/Navigation.svelte';

	import { onMount } from 'svelte';
	import type { topic } from '@prisma/client';
	import Selector from '$components/Selector.svelte';
	import Tag from '$components/Tag.svelte';
	import { navigating } from '$app/stores';
	import type { Writable } from 'svelte/store';
	import { handleSelect } from '$lib/endpoint';

	export let data: LayoutSchema;

	let sessionStore: Writable<UserState>;
	onMount(async () => {
		sessionStore = (await import('$lib/sessionStorage')).store;
		$sessionStore.topic = $sessionStore.topic || { id: topicNames[0], type: 'topic' };
		$sessionStore.recipient = $sessionStore.recipient || {
			id: '',
			type: 'recipient'
		};
		$sessionStore.spotlight = $sessionStore.spotlight || { id: 'custom', type: 'recipient' };
		$sessionStore.email = $sessionStore.email || { id: '', type: 'email' };
		$sessionStore.template = $sessionStore.template || data.template;
	});

	$: topicNames = data.loudestTopics.map((topic: topic) => topic.name);
</script>

<div class="app flex flex-col">
	<main class="flex min-h-screen">
		<div class="grow-0 shrink-0 w-20"><Navigation /></div>

		<div class="whitespace-nowrap w-full">
			<header
				aria-label="Popular topics list"
				class="flex w-fit py-2 px-3 pb-2 bg-peacockFeather-700"
			>
				{#if $sessionStore && $sessionStore.template}
					<Selector
						selectable={Tag}
						target="email"
						itemStyle="bg-peacockFeather-500 text-paper-500"
						items={topicNames}
						alignment="center"
						bind:selected={$sessionStore.topic}
						on:select={async (e) => {
							if ($sessionStore.template.primary) {
								$sessionStore.template.primary.cardList = await handleSelect(e);
								$sessionStore.template.primary.header = 'Loudest voices in';
								$sessionStore.template.primary.focus = e.detail.id;
							}
						}}
					/>
				{/if}
			</header>
			<slot />
		</div>
	</main>
	<!-- TODO aria labels for footer -->
	<footer class="bg-gray-900 text-white py-6">
		<div class="container mx-auto flex flex-wrap justify-between px-4">
			<div class="w-full md:w-1/3 mb-4 md:mb-0">
				<div class="flex justify-center md:justify-start">
					<h4 class="font-bold text-lg mb-2 mr-2">Communique</h4>
					<span class="border-l border-gray-600 pl-2">
						<p class="text-sm text-gray-400">
							Because changing the world is too important to be left on read.
						</p>
					</span>
				</div>
			</div>
			<div class="w-full md:w-1/3 text-center mb-4 md:mb-0">
				<h4 class="font-bold text-lg mb-2">Get Involved</h4>
				<ul class="list-reset">
					<li><a href="#" class="text-teal-400 hover:text-teal-500">Find legislators</a></li>
					<li><a href="#" class="text-teal-400 hover:text-teal-500">Codebase</a></li>
					<li><a href="#" class="text-teal-400 hover:text-teal-500">Donate</a></li>
				</ul>
			</div>
			<div class="w-full md:w-1/3 text-center md:text-right">
				<h4 class="font-bold text-lg mb-2">Connect</h4>
				<ul class="list-reset">
					<li><a href="#" class="text-teal-400 hover:text-teal-500">Discord</a></li>
					<li><a href="#" class="text-teal-400 hover:text-teal-500">Twitter</a></li>
					<li><a href="#" class="text-teal-400 hover:text-teal-500">Instagram</a></li>
				</ul>
			</div>
		</div>
		<div class="text-gray-400 text-sm mt-6 flex justify-center items-center">
			<span class="mr-2">&copy; 2023 Communique DAO. All rights reserved.</span>
			<span class="border-l border-gray-600 pl-2 ml-2">
				<a href="#" class="text-teal-400 hover:text-teal-500">Terms of Use</a>
			</span>
			<span class="border-l border-gray-600 pl-2 ml-2">
				<a href="#" class="text-teal-400 hover:text-teal-500">Privacy Policy</a>
			</span>
		</div>
	</footer>
</div>
