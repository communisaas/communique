<script lang="ts">
	import type { email } from '@prisma/client';
	import { createEventDispatcher, onMount, afterUpdate } from 'svelte';
	import type { Writable } from 'svelte/store';
	import Selector from './Selector.svelte';
	import Tag from './Tag.svelte';
	import Reader from './Reader.svelte';
	import Recipient from './icon/Recipient.svelte';
	import Sent from './icon/Sent.svelte';
	import Menu from './icon/Menu.svelte';
	import { scale, fade } from 'svelte/transition';
	import { expoIn, expoOut } from 'svelte/easing';

	export let item: email;
	export let selected: Selectable;
	export let style = '';

	let store: Writable<UserState>;

	$: scrollPosition = { header: { x: 0, remainingWidth: 0 }, card: { x: 0, remainingWidth: 0 } };
	let header: HTMLHeadingElement;
	let card: HTMLButtonElement;
	let expand = false;
	let scrollToCard = false;
	let scrollableElements: { [key: string]: HTMLElement };

	onMount(async () => {
		store = (await import('$lib/sessionStorage')).store;
		scrollableElements = { card, header };
		if (card && header) {
			for (const [name, element] of Object.entries(scrollableElements)) {
				scrollPosition[name as keyof typeof scrollPosition].remainingWidth =
					element.scrollWidth - element.clientWidth;
			}
		}
	});

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
			// TODO add user flow for Firefox (ClipboardItem is not available by default)
			await navigator.clipboard.write([
				new window.ClipboardItem({
					'text/html': new Blob([item.body], { type: 'text/html' })
				})
			]);
			const mailBaseURL = new URL(`mailto:${item.recipient_list.join(',')}`);
			const mailURL = mailBaseURL.href + `?subject=${encodeURI(item.subject)}`;
			dispatch('externalAction', { type: 'email', url: mailURL });
			window.open(mailURL, '_blank');
		} else {
			setExpand(true);
			scrollToCard = true;
		}
		dispatch('select', selected);
	}

	afterUpdate(() => {
		if (scrollToCard) {
			// TODO better fix to resolve a few events still pending after the DOM update
			setTimeout(() => {
				card.scrollIntoView({ behavior: 'smooth', block: 'center' });
			});
			scrollToCard = false;
		}
	});

	function handleBlur(event: FocusEvent) {
		if (event.relatedTarget instanceof HTMLElement) {
			// keep expanded if focus is on a nested button
			if (!card.contains(event.relatedTarget)) expand = false;
		} else setExpand(false);
	}
</script>

<button
	bind:this={card}
	on:mousedown={handleSelect}
	on:keypress={(e) => {
		if (e.key === 'Enter') {
			handleSelect();
		}
	}}
	on:blur={handleBlur}
	aria-label="Email with a subject: {item.subject}"
	class="{style} flex p-2 m-1 rounded bg-paper-900 items-center
		justify-center min-w-[95%] min-h-[15.5rem] max-w-4xl {expand && 'cursor-alias'}"
	style="min-width: {expand ? '99%' : '95%'};"
>
	<section
		class="flex flex-col relative items-center {!expand
			? 'cardWrapper'
			: ''} min-h-[14.5rem] min-w-full overflow-hidden"
	>
		{#if store}
			<span class="flex min-w-full">
				<h1
					aria-label="Subject line"
					aria-describedby={item.subject}
					title={scrollPosition.header.x > 0 ? item.subject : null}
					bind:this={header}
					on:wheel={(e) => {
						header.scrollLeft += Math.abs(e.deltaX) > 0 ? e.deltaX : e.deltaY * 0.33;
						scrollPosition.header.x = header.scrollLeft + 1;
						if (scrollPosition.header.remainingWidth > 0) {
							e.preventDefault();
						}
					}}
					class:scrollable={scrollPosition.header.remainingWidth > 0}
					class:scrolled={scrollPosition.header.x > 1}
					class:scrolled__max={scrollPosition.header.remainingWidth > 0 &&
						scrollPosition.header.remainingWidth < scrollPosition.header.x}
					class="max-w-fit inline-block"
				>
					{item.subject}
				</h1>
				{#if expand}
					<span
						on:mousedown|stopPropagation={(e) => console.log(e)}
						class="flex items-center max-w-[24px] cursor-context-menu"
						in:fade={{ delay: 50, duration: 200, easing: expoIn }}
						out:scale={{ delay: 50, duration: 500, easing: expoOut }}
					>
						<Menu />
					</span>
				{/if}
			</span>
			<article
				class="flex justify-between min-w-full"
				style="flex-direction:{!expand ? 'row' : 'column'}"
			>
				<div class="flex flex-col min-h-full">
					<div class="stats p-1 flex flex-row gap-x-5">
						<span title="Read count" aria-label="Number of reads" class="flex items-center">
							<icon class="max-w-[36px]" style="filter: drop-shadow(1px 1px 1px rgb(0 0 0 / 0.4));">
								<Recipient color="#005F73" />
							</icon>
							{item.open_count}
						</span>
						<span
							title="Send count"
							aria-label="Number of sends"
							class="flex items-center gap-x-1.5"
						>
							<icon
								class="max-w-[36px]"
								style="filter: drop-shadow(1px 0.75px 0.75px rgb(0 0 0 / 0.4));"
							>
								<Sent color="#005F73" />
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
								bind:selected={$store.topic}
								on:select={(e) => {
									expand = false;
									dispatch('select', e.detail);
								}}
								on:blur={handleBlur}
							/>
						</div>
						<div aria-label="Receipient list">
							<Selector
								selectable={Tag}
								items={item.recipient_list}
								itemStyle="text-[11px] text-paper-500 bg-artistBlue-700"
								alignment="start"
								overflow="wrap"
								target="email"
								bind:selected={$store.recipient}
								on:select={(e) => {
									expand = false;
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
					class:scrollableY={!expand}
				>
					{#if expand}
						<p aria-label="Info text" class="text-center"><i>click again to send...</i></p>
					{/if}
					<div
						aria-label="Email body"
						class="{expand ? 'bg-paper-700' : ''} rounded mt-2 p-2 min-w-full"
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
			background: linear-gradient(to top, theme('colors.paper.900') 0%, transparent 10%);
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
		&:hover {
			transform: scale(1.0025);
			box-shadow: theme('colors.larimarGreen.700') 0 0 2px 2px;
			transition: 0.1s ease-in;
		}
		&:active {
			transform: scale(1);
			box-shadow: unset;
			transition: 0.1s ease-out;
		}
	}
	h1 {
		font-size: 1.4rem;
		text-align: start;
		font-weight: 600;
		white-space: nowrap;
		overflow: scroll;
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
			background: linear-gradient(to right, transparent 90%, theme('colors.paper.900') 97%);
			transform: scaleX(1.01);
		}
	}

	.scrolled::before {
		background: linear-gradient(
			to right,
			theme('colors.paper.900') 3%,
			transparent 10%,
			transparent 90%,
			theme('colors.paper.900') 97%
		);
	}
	.scrolled__max::before {
		background: linear-gradient(to right, theme('colors.paper.900') 3%, transparent 10%);
	}
</style>
