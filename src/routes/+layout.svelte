<script lang="ts">
	import '../app.postcss';
	import './styles.css';
	import colors from '$lib/ui/colors';
	import weMakeChangeLogo from '$lib/assets/We Make Change Logo.png';
	import ContentLoader from 'svelte-content-loader';
	import Navigation from '$components/Navigation.svelte';

	import { createEventDispatcher, onMount, onDestroy } from 'svelte';
	import type { topic } from '@prisma/client';
	import Locator from '$components/Locator.svelte';
	import Selector from '$components/Selector.svelte';
	import Tag from '$components/Tag.svelte';
	import type { Writable } from 'svelte/store';
	import { handleSelect } from '$lib/data/select';
	import { navigating, page } from '$app/stores';
	import { goto, invalidateAll } from '$app/navigation';
	import { routeModal } from '$lib/ui/hash';
	import { browser } from '$app/environment';

	export let data: LayoutSchema;
	const dispatch = createEventDispatcher();

	let sessionStore: Writable<UserState>,
		navCollapsed = false,
		windowWidth = 0;

	function handleHashChange(e: HashChangeEvent) {
		if (!window.location.hash) {
			$sessionStore.show = {
				login: false,
				share: false,
				privacyPolicy: false,
				moderatioPolicy: false,
				termsOfUse: false,
				confirm: false
			};
		}
		console.log(window.location.hash);
		// decouple internal routes from hash when sveltekit supports modals
		if (window.location.hash === '#terms-of-use') {
			$sessionStore.show.termsOfUse = true;
		} else if (window.location.hash === '#signin') {
			$sessionStore.show.login = true;
		} else if (window.location.hash === '#privacy-policy') {
			$sessionStore.show.privacyPolicy = true;
		} else if (window.location.hash === '#moderation-policy') {
			$sessionStore.show.moderationPolicy = true;
		} else if (window.location.hash === '#confirm') {
			$sessionStore.show.confirm = true;
		} else if (window.location.hash === '#geolocator') {
			$sessionStore.show.geolocator = true;
		} else {
			dispatch('popover', false);
		}
	}

	onMount(async () => {
		sessionStore = (await import('$lib/data/sessionStorage')).store;

		if ($sessionStore.template) {
			// reload data if session already exists
			await invalidateAll();
		}

		if ($page.data.session && $page.data.session?.user?.email) {
			$sessionStore.user =
				(await fetch('data/user/' + $page.data.session?.user?.email, {
					method: 'GET'
				}).then((res) => res.json())) || $sessionStore.user;
			$sessionStore.hiddenEmails = $sessionStore.user.ignored_content_list ?? [];
		}

		$sessionStore.composer = $sessionStore.composer || {};
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
			moderatioPolicy: false,
			termsOfUse: false,
			confirm: false,
			geolocator: false,
			afterPost: false
		};
		$sessionStore.hiddenEmails = $sessionStore.hiddenEmails || [];
		const hashes = window.location.hash.substring(1).split('#');

		windowWidth = window.outerWidth;

		$sessionStore = await routeModal(hashes, $sessionStore, dispatch);
		window.addEventListener('hashchange', handleHashChange);
	});

	onDestroy(() => {
		if (browser) window.removeEventListener('hashchange', handleHashChange);
	});

	$: topicNames = data.loudestTopics.map((topic: topic) => topic.name);
</script>

<main class="flex">
	<div
		class="grow-0 shrink-0 sm:m-0 w-[3.5rem] md:w-[4rem]"
		style={navCollapsed ? 'max-width: 0' : 'min-width: auto;'}
	>
		<Navigation bind:collapsed={navCollapsed} />
	</div>
	<div
		class="relative flex flex-col min-h-full w-full overflow-hidden"
		class:min-w-full={navCollapsed}
	>
		<header
			aria-label="Popular topics list"
			class="flex h-12 pr-1 z-50 bg-peacockFeather-700 relative align-middle w-full 2xl:pr-[calc(100vw-1500px)]"
		>
			{#if $sessionStore && $sessionStore.template}
				<span
					class="mr-auto flex relative overflow-visible items-center w-full justify-start h-full text-paper-500"
				>
					<Locator />
					<Selector
						selectable={Tag}
						itemStyle="whitespace-nowrap text-base bg-peacockFeather-500 text-paper-500"
						selectorStyle="self-center gap-x-2 m-auto w-full h-full px-1 pr-2 py-2"
						items={topicNames}
						alignment="center"
						backgroundColor={colors.peacockFeather[700]}
						scrollOverride={true}
						bind:selectedContent={$sessionStore.topic}
						on:select={async (e) => {
							// TODO loading placeholders on topic change
							if ($sessionStore.template.primary) {
								$sessionStore.template.primary.cardList = null;
								$sessionStore.template.primary.focus = {
									type: 'topic',
									item: e.detail.id,
									field: 'topic_list',
									source: 'topic',
									iterable: true
								};
								if ($page.route.id !== '/') await goto('/', { noScroll: true });
								$sessionStore.template.primary.cardList = await handleSelect(e);
							}
						}}
					/>
				</span>
			{/if}
		</header>
		<section class="min-h-screen">
			{#if !$navigating}
				<slot />
			{:else}
				<div class="w-full h-full flex items-center justify-center">
					<span class="m-auto">
						<ContentLoader
							uniqueKey="layoutLoader"
							speed={0.5}
							primaryColor={colors.peacockFeather[700]}
							secondaryColor={colors.artistBlue[500]}
							width={windowWidth}
						/>
					</span>
				</div>
			{/if}
		</section>
		<!-- TODO aria labels for footer -->
		<footer class="bg-gray-900 text-white py-6 static bottom-0 w-full">
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

				<div
					class="text-gray-400 md:text-sm text-xs mt-6 flex xs:flex-row flex-col-reverse justify-center items-center"
				>
					<span class="mt-2 xs:mt-0 xs:ml-3">&copy; 2023 Communique.</span>

					<span class="xs:border-l border-gray-600 pl-2 xs:ml-2 sm:mt-0 mt-2">
						<a
							href="#terms-of-use"
							on:click={() => (window.location.hash = '#terms-of-use')}
							class="text-teal-400 hover:text-teal-500">Terms of Use</a
						>
					</span>
					<span class="xs:border-l border-gray-600 pl-2 xs:ml-2 sm:mt-0 mt-2">
						<a
							href="#moderation-policy"
							on:click={() => (window.location.hash = '#moderation-policy')}
							class="text-teal-400 hover:text-teal-500">Moderation Policy</a
						>
					</span>
					<span class="xs:border-l border-gray-600 pl-2 xs:ml-2 sm:mt-0 mt-2">
						<a
							href="#privacy-policy"
							on:click={() => (window.location.hash = '#privacy-policy')}
							class="text-teal-400 hover:text-teal-500">Privacy Policy</a
						>
					</span>
					<!-- <span class="border-l border-gray-600 pl-2 ml-2">
						<a href="https://www.wemakechange.org/" target="_blank" class="self-start">
							<img src={weMakeChangeLogo} alt="We Make Change Logo" class="w-[10.125rem]" />
						</a>
					</span> -->
				</div>
			</div>
		</footer>
	</div>
</main>
