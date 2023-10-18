<script lang="ts">
	import '../app.postcss';
	import './styles.css';
	import colors from '$lib/ui/colors';
	import weMakeChangeLogo from '$lib/assets/We Make Change Logo.png';
	import Navigation from '$components/Navigation.svelte';

	import { createEventDispatcher, onMount, onDestroy } from 'svelte';
	import { signIn, signOut } from '@auth/sveltekit/client';
	import type { topic } from '@prisma/client';
	import Selector from '$components/Selector.svelte';
	import Tag from '$components/Tag.svelte';
	import LoginIcon from '$components/icon/Login.svelte';
	import type { Writable } from 'svelte/store';
	import { handleSelect } from '$lib/data/select';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { routeModal } from '$lib/ui/hash';
	import { browser } from '$app/environment';

	export let data: LayoutSchema;
	const dispatch = createEventDispatcher();

	let sessionStore: Writable<UserState>,
		navCollapsed = false;

	function handleHashChange(e: HashChangeEvent) {
		$sessionStore.show = {
			login: false,
			share: false,
			privacyPolicy: false,
			termsOfUse: false
		};
		if (window.location.hash === '#terms-of-use') {
			$sessionStore.show.termsOfUse = true;
		} else if (window.location.hash === '#privacy-policy') {
			$sessionStore.show.privacyPolicy = true;
		} else {
			dispatch('popover', false);
		}
	}

	onMount(async () => {
		sessionStore = (await import('$lib/data/sessionStorage')).store;

		$sessionStore.csrfToken =
			($sessionStore.csrfToken || (await (await fetch('/auth/csrf')).json()).csrfToken) ?? '';

		if ($page.data.session && $page.data.session?.user?.email) {
			const ignoredEmails = await fetch('/data/user/' + $page.data.session.user?.email, {
				method: 'GET',
				headers: {
					'CSRF-Token': $sessionStore.csrfToken,
					'Ignored-Emails': 'true'
				}
			}).then((res) => res.json());
			$sessionStore.hiddenEmails = ignoredEmails.ignored_email_list ?? [];
		}

		$sessionStore.topic = $sessionStore.topic || { id: topicNames[0], type: 'topic' };
		$sessionStore.recipient = $sessionStore.recipient || {
			id: '',
			type: 'recipient'
		};
		$sessionStore.spotlight = $sessionStore.spotlight || { id: 'custom', type: 'recipient' };
		$sessionStore.email = $sessionStore.email || { id: '', type: 'email' };
		$sessionStore.template = $sessionStore.template || data.template;
		$sessionStore.show = $sessionStore.show || {
			login: false,
			share: false,
			privacyPolicy: false,
			termsOfUse: false
		};
		$sessionStore.hiddenEmails = $sessionStore.hiddenEmails || [];
		const hashes = window.location.hash.substring(1).split('#');
		// TODO use enum
		$sessionStore = await routeModal(hashes, $page, $sessionStore, dispatch);
		window.addEventListener('hashchange', handleHashChange);
	});

	onDestroy(() => {
		if (browser) window.removeEventListener('hashchange', handleHashChange);
	});

	$: topicNames = data.loudestTopics.map((topic: topic) => topic.name);
</script>

<main class="flex">
	<div
		class="grow-0 shrink-0 sm:m-0 w-[7%] xl:w-[5rem]"
		style={navCollapsed ? 'max-width: 0' : 'min-width: 50px;'}
	>
		<Navigation bind:collapsed={navCollapsed} />
	</div>
	<div
		class="relative flex flex-col min-h-full w-[calc(100%-50px)] xl:w-full"
		class:min-w-full={navCollapsed}
	>
		<section class="min-h-screen mb-3">
			<header
				aria-label="Popular topics list"
				class="flex pr-3 md:h-12 h-14 bg-peacockFeather-700 items-center relative align-middle w-full"
			>
				{#if $sessionStore && $sessionStore.template}
					<Selector
						selectable={Tag}
						target="email"
						itemStyle="whitespace-nowrap text-base bg-peacockFeather-500 text-paper-500"
						selectorStyle="md:py-2"
						items={topicNames}
						alignment="center"
						backgroundColor={colors.peacockFeather[700]}
						bind:selectedContent={$sessionStore.topic}
						on:select={async (e) => {
							if ($sessionStore.template.primary) {
								$sessionStore.template.primary.cardList = await handleSelect(e);
								$sessionStore.template.primary.focus = {
									type: 'topic',
									item: e.detail.id,
									field: 'topic_list',
									source: 'topic',
									iterable: true
								};
								await goto('/', { noScroll: true });
							}
						}}
					/>
				{/if}
				<span class="ml-auto flex flex-col items-center justify-center h-full text-paper-500">
					{#if $page.data.session}
						{#if $page.data.session.user?.image}
							<img
								src={$page.data.session.user.image}
								alt="avatar"
								class="h-7 w-7 md:h-10 md:w-10"
							/>
						{/if}

						<button on:click={() => signOut({ callbackUrl: '/', redirect: false })}>
							Sign out
						</button>
					{:else}
						<span class="whitespace-nowrap text-[11px] self-end justify-self-end ml-1.5 -mb-0.5"
							>Sign in</span
						>
						<button
							class="w-8 justify-self-end -mr-4"
							on:click={() => signIn({ callbackUrl: '/', redirect: false })}
						>
							<LoginIcon />
						</button>
					{/if}
				</span>
			</header>
			<slot />
		</section>
		<!-- TODO aria labels for footer -->
		<footer class="bg-gray-900 text-white py-6 static bottom-0 w-full xl:w-full z-10">
			<div class="container mx-auto flex flex-wrap items-center justify-center px-4">
				<div class="mb-4 md:mb-0">
					<div class="flex justify-center md:justify-start">
						<h4 class="font-bold md:text-lg sm:text-base text-sm mb-2 mr-2">Communique</h4>

						<span class="border-l border-gray-600 pl-2 w-1/2">
							<p class="md:text-sm text-xs text-gray-400">
								Changing the world is too important to be left unread.
							</p>
						</span>
					</div>
				</div>
				<!-- <div class="w-full md:w-1/3 text-center mb-4 md:mb-0">
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
	</div> -->

				<div class="text-gray-400 md:text-sm text-xs mt-6 flex justify-center items-center">
					<span class="mr-2">&copy; 2023 Communique. All rights reserved.</span>

					<span class="border-l border-gray-600 pl-2 ml-2">
						<a
							href="#terms-of-use"
							on:click={() => (window.location.hash = '#terms-of-use')}
							class="text-teal-400 hover:text-teal-500">Terms of Use</a
						>
					</span>
					<span class="border-l border-gray-600 pl-2 ml-2">
						<a
							href="#privacy-policy"
							on:click={() => (window.location.hash = '#privacy-policy')}
							class="text-teal-400 hover:text-teal-500">Privacy Policy</a
						>
					</span>
					<span class="border-l border-gray-600 pl-2 ml-2">
						<a href="https://www.wemakechange.org/" target="_blank" class="self-start">
							<img src={weMakeChangeLogo} alt="We Make Change Logo" class="w-[10.125rem]" />
						</a>
					</span>
				</div>
			</div>
		</footer>
	</div>
</main>
