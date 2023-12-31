<script lang="ts">
	import { page } from '$app/stores';
	import Panel from '$components/Panel.svelte';
	import { onMount } from 'svelte';
	import { get, type Writable } from 'svelte/store';
	import Email from '$components/Email.svelte';
	import Selector from '$components/Selector.svelte';
	import modal, { getModalMap, handlePopover } from '$lib/ui/modal';
	import Modal from '$components/Modal.svelte';
	import ContentLoader from 'svelte-content-loader';
	import TextField from '$components/input/TextField.svelte';
	import colors from '$lib/ui/colors.js';

	export let data;

	let store: Writable<UserState>,
		selectedSentEmail: Selectable = { item: '', type: 'option', id: '' },
		sentEmails = null as Selectable[] | null,
		windowWidth: number;

	onMount(async () => {
		store = (await import('$lib/data/sessionStorage')).store;
		const lastEmailId = $store.user.sent_email_list.slice(-1);
		windowWidth = window.outerWidth;
		sentEmails = await dataFetcher('data/email', 'email', [lastEmailId]);
	});

	$: modalMapping = getModalMap($store, $page.data as LayoutSchema);

	const dataFetcher = async (endpoint: string, type: string, values: string[]) => {
		const dataURL = new URL(endpoint, get(page).url);
		dataURL.searchParams.append(type, values.join('␞'));

		return (await fetch(dataURL.toString())).json();
	};
</script>

{#if $store && $store.user}
	<Panel
		initialSelection={{ item: $store.user?.email || 'Loading...', type: 'text' }}
		header="profile"
		alignment="end"
		items={$store.template['primary'].cardList ? [] : null}
	>
		<!-- if not loading new cards -->
		{#if $store.template['primary'].cardList}
			<p class="italic self-end ml-auto mr-3 pb-6 pl-1.5 xs:py-0 text-right text-paper-500">
				Email address managed by {$store.user?.auth_provider.charAt(0).toUpperCase() +
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
			<div class="flex flex-col justify-start gap-y-3 m-2 mt-0 min-w-full">
				<form class="relative max-w-xl flex flex-wrap">
					<fieldset>
						<legend class="text-paper-500 mx-2">Name</legend>
						<div class="flex flex-row justify-start gap-x-2 m-2 mt-0 max-w-[90%]">
							<div class="flex flex-col justify-start my-2 ml-1 min-w-fit">
								<TextField
									type="text"
									placeholder="given name"
									browserAutocomplete="given-name"
									required={true}
									value={$store.user.given_name
										? $store.user.given_name[0].toUpperCase() +
										  $store.user.given_name.slice(1).toLowerCase()
										: ''}
									style="bg-peacockFeather-700 text-paper-900 rounded-md shadow-card p-2 focus:outline-peacockFeather-500"
								/>
							</div>
							<div class="flex flex-col justify-start my-2 min-w-fit max-w-[90%]">
								<TextField
									type="text"
									placeholder="family name"
									browserAutocomplete="family-name"
									required={true}
									value={$store.user.family_name
										? $store.user.family_name[0].toUpperCase() +
										  $store.user.family_name.slice(1).toLowerCase()
										: ''}
									style="bg-peacockFeather-700 text-paper-900 rounded-md shadow-card p-2 focus:outline-peacockFeather-500"
								/>
							</div>
						</div>
					</fieldset>
					<div class="flex flex-col justify-start min-w-fit mx-2">
						<label for="address" class="text-paper-500">Address</label>
						<TextField
							type="textarea"
							placeholder="line 1&#13;line 2&#13;city, state, zip code"
							required={true}
							value={$store.user?.address || ''}
							style="bg-peacockFeather-700 text-paper-900 rounded-md shadow-card p-2 mr-4 m-2 focus:outline-peacockFeather-500"
						/>
					</div>
				</form>
				{#if $store.user.sent_email_list.length >= 1 && sentEmails}
					<div class="max-w-[98%]">
						<p class="p-2 text-paper-500">
							You have sent {$store.user.sent_email_list.length}
							{$store.user.sent_email_list.length === 1 ? 'email' : 'emails'} so far! Here's the last
							one:
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
				{:else if !sentEmails}
					<div class="flex justify-center items-center mt-20">
						<ContentLoader
							uniqueKey="sentEmailsLoader"
							height={40}
							width={windowWidth - 0.2 * windowWidth}
							primaryColor={colors.peacockFeather[700]}
							secondaryColor={colors.artistBlue[500]}
							speed={0.5}
						/>
					</div>
				{:else}
					<p class="p-2 m-auto text-paper-500">
						You have not sent any emails yet. When you do, the last one will appear here.
					</p>
				{/if}
				<button
					class="w-40 m-auto bg-artistBlue-700 hover:bg-artistBlue-800 hover:-translate-y-[1px] active:translate-y-0 text-paper-600 py-2 px-4 rounded-full transition duration-300 ease-in-out shadow-card focus:outline-none focus:ring-2 focus:ring-larimarGreen-700 focus:ring-opacity-50"
					on:click={() => (window.location.hash = '#confirm')}
				>
					Delete Account
				</button>
			</div>
		{/if}
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
{:else}{/if}

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
