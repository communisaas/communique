<script lang="ts">
	import { page } from '$app/stores';
	import Panel from '$components/Panel.svelte';
	import { onMount } from 'svelte';
	import { get, type Writable } from 'svelte/store';
	import Email from '$components/Email.svelte';
	import Selector from '$components/Selector.svelte';
	import modal, { handlePopover } from '$lib/ui/modal';
	import Modal from '$components/Modal.svelte';
	import Login from '$components/Login.svelte';
	import Share from '$components/popover/Share.svelte';
	import Reader from '$components/popover/Reader.svelte';
	import Confirm from '$components/popover/Confirm.svelte';
	import { signOut } from '@auth/sveltekit/client';

	export let data;

	let store: Writable<UserState>,
		selectedSentEmail: Selectable = { item: '', type: 'option', id: '' },
		sentEmails = [] as Selectable[],
		modalMapping: ModalMap = {
			confirm: {
				component: Confirm,
				props: () => ({
					advisoryText:
						'If you really want to delete your account, type your email address below to confirm. Some data might be retained, like message counts, in addition to personal info according to local laws.',
					inputToConfirm: $store.user?.email,
					action: async (e: SubmitEvent) => {
						const response = await fetch('/data/user/' + $store.user?.email, {
							method: 'DELETE',
							headers: {
								'CSRF-Token': $store.csrfToken
							}
						});
						if (response.status !== 200) {
							throw new Error(`Could not delete user: (${response.status}) ${response.statusText}`);
						} else {
							signOut({ callbackUrl: '/', redirect: false });
						}
					}
				})
			},
			share: { component: Share, props: () => ({ item: $store.email.content }) },
			login: { component: Login, props: () => ({ providers: data.authProviders }) },
			privacyPolicy: {
				component: Reader,
				props: () => ({ item: $page.data.privacyPolicy, inModal: true })
			},
			moderationPolicy: {
				component: Reader,
				props: () => ({ item: $page.data.moderationPolicy, inModal: true })
			},
			termsOfUse: {
				component: Reader,
				props: () => ({ item: $page.data.termsOfUse, inModal: true })
			}
		};

	onMount(async () => {
		store = (await import('$lib/data/sessionStorage')).store;
		const lastEmailId = $store.user.sent_email_list.slice(-1);
		sentEmails = await dataFetcher('data/email', 'email', [lastEmailId]);
	});

	const dataFetcher = async (endpoint: string, type: string, values: string[]) => {
		const dataURL = new URL(endpoint, get(page).url);
		dataURL.searchParams.append(type, values.join('␞'));

		return (await fetch(dataURL.toString())).json();
	};
</script>

{#if $store && $store.user}
	<Panel
		initialSelection={{ item: $store.user?.email || 'Loading...', type: 'text' }}
		header="Profile"
		alignment="end"
		items={[]}
	>
		<div class="flex flex-col justify-start gap-y-3 m-2 min-w-full">
			<p class="italic self-end mr-6 text-paper-500">
				Your email address is managed by {$store.user?.auth_provider.charAt(0).toUpperCase() +
					$store.user?.auth_provider.slice(1)}.
				<span class="inline">
					<img
						src={data.authProviders.baseLogoURL +
							data.authProviders.providers[$store.user?.auth_provider || ''].style.logo}
						alt={$store.user?.auth_provider + ' logo'}
						class="inline"
					/>
				</span>
			</p>
			{#if $store.user.sent_email_list.length >= 1}
				<div class="max-w-[98%]">
					<p class="p-2 text-paper-500">
						You have sent {$store.user.sent_email_list.length}
						{$store.user.sent_email_list.length === 1 ? 'email' : 'emails'} so far! Here's the last one:
					</p>
					<Selector
						selectable={Email}
						items={sentEmails}
						alignment="match-parent"
						selectorStyle="flex-col px-2 min-h-[13rem] md:max-w-7xl max-w-3xl m-auto overflow-visible"
						overflow="visible"
						scrollable={false}
						bind:selectedContent={selectedSentEmail}
						on:select={async (e) => {
							// if (e.detail.type === selected.type) {
							// } else if (e.detail.type === 'topic' || e.detail.type === 'recipient') {
							// 	window.scrollTo({ top: 0, behavior: 'smooth' }); // TODO handle this in parent page component
							// 	dispatch('select', e.detail);
							// } else {
							// 	dispatch('select', e.detail);
							// }
						}}
						on:externalAction
						on:blur
					/>
				</div>
			{:else}
				<p class="p-2 m-auto text-paper-500">
					You have not sent any emails yet. When you do, the last one will appear here.
				</p>
			{/if}
			<button
				class="w-40 m-auto bg-artistBlue-700 hover:bg-artistBlue-800 hover:-translate-y-[1px] active:translate-y-0 text-white py-2 px-4 rounded-full transition duration-300 ease-in-out shadow-card focus:outline-none focus:ring-2 focus:ring-larimarGreen-700 focus:ring-opacity-50"
				on:click={() => (window.location.hash = '#confirm')}
			>
				Delete Account
			</button>
		</div>
	</Panel>

	<!-- {:else}
	<div class="flex justify-center items-center mt-20">
		<ContentLoader
			uniqueKey="autocomplete"
			height={40}
			width={200}
			secondaryColor={colors.larimarGreen[700]}
			speed={0.5}
		/>
	</div> -->
{/if}

{#if $store && $store.hasOwnProperty('show')}
	{#each Object.keys($store.show) as modalName (modalName)}
		{#if $store.show[modalName]}
			<div use:modal>
				<Modal
					popoverComponent={modalMapping[modalName].component}
					props={modalMapping[modalName].props()}
					on:popover={(e) => handlePopover(e, store, modalName, '/profile')}
				/>
			</div>
		{/if}
	{/each}
{/if}