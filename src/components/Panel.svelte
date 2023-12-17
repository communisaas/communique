<script lang="ts">
	import Selector from './Selector.svelte';
	import { createEventDispatcher, onMount, type ComponentType } from 'svelte';
	import type { Writable } from 'svelte/store';
	import TagInput from './input/Tag.svelte';
	import { handleAutocomplete } from '$lib/data/select';

	export let header: string;
	export let alignment: 'start' | 'end' | 'center' | 'justify' | 'match-parent';

	export let selectable: ComponentType | undefined = undefined;
	export let selectorTarget: 'topic' | 'recipient' | 'spotlight' | undefined = undefined;
	export let selected: Selectable = { item: '', type: 'option', id: '' };
	export let initialSelection: Descriptor<string> = { item: '', type: '' };
	export let items: Selectable[] = [];
	export let filterable = false;
	let searchResults: Descriptor<string>[] = [];
	let searchInput: HTMLInputElement;

	const dispatch = createEventDispatcher();

	let store: Writable<UserState>;
	let inputVisible = false;
	let selectionList: Descriptor<string>[] = [initialSelection];

	let lastItems: Selectable[] = [];
	let oldInitialSelection: Descriptor<string> = initialSelection;
	let lastSelection: Descriptor<string> = initialSelection;

	$: if (initialSelection !== oldInitialSelection) {
		selectionList = [initialSelection];
		oldInitialSelection = initialSelection;
	}

	async function handleFilter() {
		// Grouping by fields
		const grouped = selectionList.reduce((accumulator, { item, source }) => {
			if (typeof source === 'string') {
				if (!accumulator[source]) accumulator[source] = [];
				accumulator[source].push(item);
			}
			return accumulator;
		}, {} as Record<string, string[]>);
		// Construct the query string from the grouped object
		const tagString = Object.entries(grouped)
			.map(([field, items]) => `${field}=${encodeURIComponent(items.join('␞'))}`)
			.join('&');
		console.log(tagString);
		return await (await fetch(`data/email?${tagString}`)).json();
	}
</script>

<section class="flex flex-col relative gradient-background h-full">
	<aside class="flex flex-nowrap pb-3" style="justify-content: {alignment}">
		{#if selectorTarget != 'spotlight'}
			<h1
				class="text-paper-500 h-fit self-center md:mx-2 ml-2 my-1 text-base xs:text-2xl md:text-3xl leading-tight md:leading-normal"
				style="background-color: transparent; padding: unset"
			>
				{header}
			</h1>
		{/if}
		<div
			class="tab tab__{alignment} sm:max-w-[85%] max-w-[calc(90%-1rem)] 2xl:pr-[calc(100vw-1500px)]"
		>
			<span class="space space__{alignment}">
				{#if filterable && selectorTarget != 'spotlight'}
					<TagInput
						bind:inputField={searchInput}
						type="search"
						name="search item"
						placeholder={'search'}
						style="h-14 xs:mx-4 mr-5 ml-1 w-fit bg-transparent xs:pr-0.5 pr-0 pl-2"
						tagStyle="md:text-xl md:leading-normal leading-tight text-sm underline font-bold bg-transparent rounded px-2 px-1 pr-1 text-paper-500"
						addIconStyle="add bg-peacockFeather-500 h-10 w-10 md:h-12 md:w-12 text-4xl md:text-5xl inline-block leading-12"
						inputStyle="bg-peacockFeather-600 text-paper-500 focus:outline-peacockFeather-500"
						autocompleteStyle="right-0"
						autocomplete={true}
						bind:tagList={selectionList}
						bind:inputVisible
						bind:searchResults
						on:autocomplete={async (e) => {
							searchResults = await handleAutocomplete(e);
						}}
						on:delete={async (e) => {
							lastSelection = e.detail;
							lastItems = items;
							items = [];
							if (selectionList.length >= 1) items = await handleFilter();
						}}
						on:add={async (e) => {
							items = [];
							items = await handleFilter();
						}}
						on:blur={() => {
							if (selectionList.length <= 0) {
								selectionList = [lastSelection];
								items = lastItems;
								inputVisible = false;
							}
						}}
					/>
				{:else}
					<p class="text-paper-500 z-10 mx-10 sm:my-3 my-2">
						{initialSelection.item}
					</p>
				{/if}
			</span>
		</div>
	</aside>
	<span class="control">
		<slot />
	</span>
	{#if items && selectable}
		<Selector
			{selectable}
			{items}
			alignment="match-parent"
			selectorStyle="flex-col sm:px-2 pl-2 pr-0.5 min-h-[13rem] max-w-3xl md:max-w-7xl m-auto overflow-visible"
			overflow="visible"
			scrollable={false}
			bind:selectedContent={selected}
			on:select={async (e) => {
				if (e.detail.type === selected.type) {
				} else if (e.detail.type === 'topic' || e.detail.type === 'recipient') {
					window.scrollTo({ top: 0, behavior: 'smooth' }); // TODO handle this in parent page component
					dispatch('select', e.detail);
				} else {
					dispatch('select', e.detail);
				}
			}}
			on:externalAction
			on:blur
		/>
	{/if}
</section>

<style lang="scss">
	section {
		transition: all 0.5s ease-in-out;
	}
	h1 {
		text-align: right;
		vertical-align: middle;
		padding: 0 1rem;
	}

	.space {
		display: flex;
		height: 100%;

		&__end {
			margin-right: 5%;
		}
	}

	.tab {
		filter: drop-shadow(1px 2px 1px theme('colors.artistBlue.500'));
		position: relative;
		z-index: 20;
		min-width: 0;

		&__start {
			align-items: start;
			& .space {
				padding: 0.5em 0;
				padding-right: 2em;
				justify-content: center;
				&::before {
					content: '';
					position: absolute;
					top: -1px;
					left: 0;
					right: 0;
					bottom: 0;
					width: 100%;
					clip-path: polygon(0 0, 100% 0, 90% 100%, 0 100%);

					background-color: theme('colors.peacockFeather.700');
				}
			}
		}
		&__end {
			& .space {
				padding: 0.5em 0;
				padding-left: 0.5em;
				align-items: center;

				&::before {
					content: '';
					position: absolute;
					top: -1px;
					left: 0;
					right: 0;
					bottom: 0;
					width: 100%;
					clip-path: polygon(0 0, 100% 0, 100% 100%, 2em 100%);
					background-color: theme('colors.peacockFeather.700');
				}
			}
		}
	}

	.gradient-background {
		background: linear-gradient(
			90deg,
			theme('colors.peacockFeather.600'),
			theme('colors.teal.700')
		);
		background-repeat: no-repeat;
	}
</style>
