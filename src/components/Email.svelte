<script lang="ts">
	import type { email } from '@prisma/client';
	import { createEventDispatcher, onMount, afterUpdate, tick } from 'svelte';
	import type { Writable } from 'svelte/store';
	import Selector from './Selector.svelte';
	import Tag from './Tag.svelte';
	import Reader from './Reader.svelte';
	import RecipientIcon from './icon/Recipient.svelte';
	import SentIcon from './icon/Sent.svelte';
	import MenuIcon from './icon/Menu.svelte';
	import { flip } from 'svelte/animate';
	import { scale, fade, slide, fly } from 'svelte/transition';
	import { expoIn, expoOut, quintOut } from 'svelte/easing';
	import Menu from './Menu.svelte';

	export let item: email;
	export let selected: Selectable;
	export let style = '';

	let sessionStore: Writable<UserState>;

	$: scrollPosition = {
		header: { x: 0, remainingWidth: 0, startX: 0, startScrollLeft: 0 },
		card: { x: 0, remainingWidth: 0, startX: 0, startScrollLeft: 0 }
	};
	let header: HTMLHeadingElement;
	let card: HTMLButtonElement;
	let expand = false;
	let scrollToCard = false;
	let scrollableElements: { [key: string]: HTMLElement };
	let nestedHover = false;

	let showMenu = false;
	let selectedMenuItem = '';
	let menuItems = [
		{ name: 'Get link', show: true, nestedActions: false },
		{ name: 'Not interested...', show: true, nestedActions: false },
		{ name: 'Report', show: true, nestedActions: true }
	];

	onMount(async () => {
		sessionStore = (await import('$lib/sessionStorage')).store;
	});

	afterUpdate(() => {
		if (scrollToCard) {
			// TODO better fix for resolving events still pending after the DOM update
			setTimeout(() => {
				card.scrollIntoView({ behavior: 'smooth', block: 'center' });
			});
			scrollToCard = false;
		}
		if (card && header) {
			scrollableElements = { card, header };
			updateScrollableElements(scrollableElements);
		}
	});

	function updateScrollableElements(scrollableElements: { [key: string]: HTMLElement }) {
		for (const [name, element] of Object.entries(scrollableElements)) {
			scrollPosition[name as keyof typeof scrollPosition].remainingWidth =
				element.scrollWidth - element.clientWidth;
		}
	}

	const dispatch = createEventDispatcher();

	function setExpand(value: boolean) {
		expand = value;
		dispatch('expand', expand);
	}

	async function handleSelect() {
		if (selected.id != item.rowid) {
			selected.id = item.rowid;
		}
		if (expand) {
			dispatch('externalAction', { type: 'email', context: item });
		} else {
			setExpand(true);
			scrollToCard = true;
			$sessionStore.email.id = item.rowid;
			$sessionStore.email.content = item;
		}
		dispatch('select', selected);
	}

	async function focusMenuItem(itemName: string) {
		selectedMenuItem = itemName;
		menuItems = menuItems.map((i) =>
			i.name === selectedMenuItem ? { ...i, show: true } : { ...i, show: false }
		);
	}

	function handleBlur(event: FocusEvent) {
		if (document.activeElement == event.target) return; // keep expanded if focus is on the card
		if (event.relatedTarget instanceof HTMLElement) {
			// keep expanded if focus is on a nested button
			if (!card.contains(event.relatedTarget)) setExpand(false);
		} else {
			setExpand(false);
		}
		if (!expand) {
			header.scrollLeft = 0;
			scrollPosition.header.x = 0;
		} else {
			scrollPosition.header.x = 1;
		}
		showMenu = false;
	}
</script>

<button
	bind:this={card}
	on:click={handleSelect}
	on:keypress={(e) => {
		if (e.key === 'Enter') {
			handleSelect();
		}
	}}
	on:blur={handleBlur}
	aria-label="Email with a subject: {item.subject}"
	class="{style} flex p-2 m-1 rounded bg-artistBlue-600 items-center relative
		justify-center min-w-[95%] min-h-[15.5rem] max-w-4xl"
	class:cursor-alias={expand}
	class:clickable={!nestedHover}
	style="min-width: {expand ? '99%' : '95%'};"
>
	{#if showMenu}
		<div
			on:click|stopPropagation={() => {
				if (expand) {
					showMenu = !showMenu;
				} else {
					expand = true;
					handleSelect();
				} // if menu recently closed but not yet destroyed, still expand the card
			}}
			on:keypress|stopPropagation={(e) => {
				if (e.key === 'Enter') {
					if (expand) {
						showMenu = !showMenu;
					} else {
						expand = true;
						handleSelect();
					}
				}
			}}
		>
			<Menu on:mouseenter={() => (nestedHover = true)}>
				{#each menuItems.filter((item) => item.show) as item (item.name)}
					<li
						class="menu__item"
						on:click={() => {
							if (item.nestedActions) focusMenuItem(item.name);
						}}
						on:keypress={(e) => {
							if (e.key === 'Enter' && item.nestedActions) focusMenuItem(item.name);
						}}
						class:z-10={selectedMenuItem === item.name}
						class:z-0={selectedMenuItem !== item.name}
						out:fly={{
							delay: 50,
							duration: 500,
							x: 500,
							easing: quintOut
						}}
						animate:flip={{ delay: 50, duration: 500, easing: quintOut }}
					>
						{item.name}
					</li>
				{/each}
				<li
					class="menu__item menu__item--close"
					on:click={() => {
						showMenu = false;
						nestedHover = false;
						selectedMenuItem = '';
						menuItems = menuItems.map((i) => ({ ...i, show: true }));
					}}
					on:keypress={(e) => {
						if (e.key === 'Enter') {
							showMenu = false;
							nestedHover = false;
							selectedMenuItem = '';
							menuItems = menuItems.map((i) => ({ ...i, show: true }));
						}
					}}
				>
					Close
				</li>
			</Menu>
		</div>
	{/if}
	<section
		class="flex flex-col relative {!expand
			? 'cardWrapper'
			: ''} min-h-[14.5rem] min-w-full overflow-hidden"
	>
		{#if sessionStore}
			<span class="flex max-w-full relative">
				<h1
					aria-label="Subject line"
					aria-describedby={item.subject}
					title={scrollPosition.header.x > 0 ? item.subject : null}
					bind:this={header}
					on:wheel={(e) => {
						if (scrollPosition.header.remainingWidth > 0) {
							e.preventDefault();
							header.scrollLeft += Math.abs(e.deltaX) > 0 ? e.deltaX : e.deltaY * 0.33;
							scrollPosition.header.x = header.scrollLeft;
						}
					}}
					on:touchstart={(e) => {
						if (scrollPosition.header.remainingWidth > 0) {
							scrollPosition.header.startX = e.touches[0].pageX;
							scrollPosition.header.startScrollLeft = header.scrollLeft;
						}
					}}
					on:touchmove={(e) => {
						if (scrollPosition.header.remainingWidth > 0) {
							e.preventDefault();
							const x = e.touches[0].pageX;
							const walk = (x - scrollPosition.header.startX) * 2;
							header.scrollLeft = scrollPosition.header.startScrollLeft - walk;
							scrollPosition.header.x = header.scrollLeft;
						}
					}}
					on:touchend={() => {
						if (scrollPosition.header.remainingWidth > 0) {
							scrollPosition.header.startX = 0;
							scrollPosition.header.startScrollLeft = 0;
						}
					}}
					class:scrollable={scrollPosition.header.remainingWidth > 0}
					class:scrolled={scrollPosition.header.x > 1}
					class:scrolled__max={scrollPosition.header.remainingWidth > 0 &&
						scrollPosition.header.remainingWidth == scrollPosition.header.x}
					class="max-w-full inline-block mr-1"
				>
					{item.subject}
				</h1>
				{#if expand}
					<icon
						title="Menu"
						on:click|stopPropagation={() => {
							showMenu = !showMenu;
						}}
						on:keypress|stopPropagation={(e) => {
							if (e.key === 'Enter') {
								showMenu = !showMenu;
							}
						}}
						on:mouseenter={() => (nestedHover = true)}
						on:mouseleave={() => (nestedHover = false)}
						class="z-10 flex items-center max-w-[24px] cursor-context-menu mx-1 hover:scale-125 ease-in-out duration-150"
						in:fade={{ delay: 50, duration: 200, easing: expoIn }}
						out:scale={{ delay: 50, duration: 300, easing: expoOut }}
					>
						<MenuIcon />
					</icon>
				{/if}
			</span>
			<article
				class="flex justify-between min-w-full"
				style="flex-direction:{!expand ? 'row' : 'column'}"
			>
				<div class="flex flex-col min-h-full">
					<div class="stats p-1 flex flex-row gap-x-5">
						<span title="Read count" aria-label="Number of reads" class="flex items-center">
							<icon
								title="Recipient"
								class="max-w-[36px]"
								style="filter: drop-shadow(1px 1px 1px rgb(0 0 0 / 0.4));"
							>
								<RecipientIcon color="#94D2BD" />
							</icon>
							{item.open_count}
						</span>
						<span
							title="Send count"
							aria-label="Number of sends"
							class="flex items-center gap-x-1.5"
						>
							<icon
								title="Send count"
								class="max-w-[36px]"
								style="filter: drop-shadow(1px 0.75px 0.75px rgb(0 0 0 / 0.4));"
							>
								<SentIcon color="#94D2BD" />
							</icon>
							{item.send_count}
						</span>
					</div>

					<div
						class="tags min-w-[25rem]"
						aria-label="Topic and recepient lists"
						style="max-width: {!expand ? '35rem' : '100%'};"
					>
						<div aria-label="Topic list">
							<Selector
								selectable={Tag}
								items={item.topic_list}
								itemStyle="text-[11px] text-paper-500 bg-peacockFeather-500"
								alignment="start"
								overflow="wrap"
								target="email"
								bind:selectedContent={$sessionStore.topic}
								on:select={(e) => {
									setExpand(false);
									dispatch('select', e.detail);
								}}
								on:blur={handleBlur}
							/>
						</div>
						<div aria-label="Receipient list">
							<Selector
								selectable={Tag}
								items={item.recipient_list}
								itemStyle="text-[11px] text-paper-500 bg-peacockFeather-600"
								alignment="start"
								overflow="wrap"
								target="email"
								bind:selectedContent={$sessionStore.recipient}
								on:select={(e) => {
									setExpand(false);
									dispatch('select', e.detail);
								}}
								on:blur={handleBlur}
							/>
						</div>
					</div>
				</div>
				<div
					style="text-align: initial; margin-top: {!expand ? '-1.5rem' : '0'};"
					class="whitespace-normal flex flex-col"
				>
					{#if expand}
						<p aria-label="Info text" class="text-center"><i>click again to send...</i></p>
					{/if}
					<div
						aria-label="Email body"
						class="{expand ? 'bg-artistBlue-800' : 'mt-[1.5rem]'} rounded mt-4 p-2 min-w-full"
						on:click={(e) => {
							if (e.target instanceof HTMLElement && e.target.tagName === 'A') {
								e.stopPropagation();
							}
						}}
						on:keypress={(e) => {
							if (e.key === 'Enter') {
								if (e.target instanceof HTMLElement && e.target.tagName === 'A') {
									e.stopPropagation();
								}
							}
						}}
					>
						<Reader {expand} email={item} />
					</div>
				</div>
			</article>
		{/if}
	</section>
</button>

<style lang="scss">
	.cardWrapper {
		&::after {
			background: linear-gradient(to top, theme('colors.artistBlue.600') 0%, transparent 10%);
			content: '';
			position: absolute;
			bottom: -1px;
			margin-bottom: -1px;
			height: 100%;
			width: 100%;
		}
	}
	button {
		transition: 0.2s ease-out;
		color: theme('colors.paper.500');
		&:hover {
			transform: scale(1.0073);
			box-shadow: theme('colors.larimarGreen.700') 0 0 2px 2px;
			transition: 0.1s ease-in;
		}
	}

	.clickable {
		&:active {
			transform: scale(0.9927);
			box-shadow: unset;
			transition: 0.1s ease-out;
		}
	}
	h1 {
		font-size: 1.4rem;
		font-weight: 600;
		white-space: nowrap;
		overflow-x: overlay;
		padding-bottom: 0;
	}
	.stats {
		text-align: start;
		display: flex;
		flex-direction: row;
	}
	.tags {
		white-space: normal;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		margin-bottom: 1rem;
	}

	.menu {
		&__item {
			min-width: 200%;
			background-color: theme('colors.peacockFeather.500');
			padding: 0.33em;
			margin-top: 0.5em;
			margin-left: -50%;
			cursor: pointer;
			transition: ease-in-out 0.2s;
			&--close {
				margin-top: 2em;
				background-color: theme('colors.peacockFeather.600');
			}
		}
		&__item:hover {
			transform: scale(1.08);
		}
		&__item:active {
			transform: scale(0.92);
		}
	}
	.scrollable {
		scrollbar-width: none;
		&::-webkit-scrollbar {
			display: none;
		}

		&:hover {
			overflow: scroll;
			/* prevent scrollbar from changing container dimensions in webkit */
			overflow: overlay;
		}

		&::before {
			content: '';
			display: block;
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			background: linear-gradient(to right, transparent 85%, theme('colors.artistBlue.600') 97%);
		}
	}

	.scrolled::before {
		background: linear-gradient(
			to right,
			theme('colors.artistBlue.600') 3%,
			transparent 15%,
			transparent 85%,
			theme('colors.artistBlue.600') 97%
		);
	}

	.scrolled__max::before {
		content: '';
		display: block;
		top: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(to right, theme('colors.artistBlue.600') 3%, transparent 15%);
	}
</style>
