<script lang="ts">
	import type { email } from '@prisma/client';
	import { createEventDispatcher, onMount, afterUpdate } from 'svelte';
	import Selector from './Selector.svelte';
	import Tag from './Tag.svelte';
	import Reader from './popover/Reader.svelte';
	import RecipientIcon from './icon/Recipient.svelte';
	import SentIcon from './icon/Sent.svelte';
	import MenuIcon from './icon/Menu.svelte';
	import Menu from './Menu.svelte';
	import { handleCopy } from '$lib/data/select';
	import { page } from '$app/stores';
	import { writable, type Writable } from 'svelte/store';
	import Preferences from './input/Preferences.svelte';
	import { goto } from '$app/navigation';
	import colors from '$lib/ui/colors';

	export let item: email;
	export let selected: Selectable;
	export let style = '';

	let sessionStore: Writable<UserState>;

	$: scrollPosition = {
		header: { x: 0, remainingWidth: 0, startX: 0, startScrollLeft: 0 },
		card: { x: 0, remainingWidth: 0, startX: 0, startScrollLeft: 0 }
	};
	let header: HTMLHeadingElement;
	let card: HTMLElement;
	let menu: HTMLElement;
	let focusableMenuElements = writable<HTMLElement[]>([]);
	let scrollableElements: { [key: string]: HTMLElement };

	let resizeObserver: ResizeObserver;

	// state
	let scrollToCard = false;
	let expand = false;
	let nestedHover = false;
	let activationState: 'click' | 'focus' | null = null;
	let showMenu = false;
	let remove = false;

	async function handleRemove({ background = false }) {
		remove = false;
		$sessionStore.hiddenEmails.push(item.shortid);
		if ($page.data.session && $page.data.session?.user?.email) {
			const response = fetch('/data/email/' + item.shortid, {
				method: 'POST',
				headers: {
					'Remove-Email-Content': 'true',
					'User-Email': $page.data.session?.user?.email,
					'CSRF-Token': $sessionStore.csrfToken
				}
			});
			// TODO handle error response
		}
		if (background) return;
		card.focus();
		card.blur();
	}

	let menuItems = [
		{
			name: 'Get link',
			key: 'copy',
			class: 'menu__item mb-4 hover:scale-105 active:scale-100',
			show: true,
			actionToggled: false,
			actionComponent: undefined,

			onClick: async () => {
				await handleCopy('link', $page.url.host + '/' + item.shortid);
				menuItems[0].name = 'Copied!';
				setTimeout(() => {
					menuItems[0].name = 'Get link';
				}, 2000);
			}
		},
		{
			name: 'Open',
			key: 'open',
			class: 'menu__item hover:scale-105 active:scale-100',
			show: true,
			actionToggled: false,
			actionComponent: undefined,

			onClick: async () => {
				dispatch('externalAction', { type: 'email', context: item });
			}
		},
		{
			name: 'Not interested...',
			key: 'interest',
			class: 'menu__item mt-2 hover:scale-105 active:scale-100',
			show: true,
			actionToggled: false,
			actionComponent: undefined,

			onClick: () => {
				remove = true;
				handleRemove({ background: false });
			}
		},
		{
			name: 'Report',
			key: 'moderation',
			class: 'menu__item mt-2 hover:scale-105 active:scale-100',
			show: true,
			actionToggled: false,
			actionComponent: {
				component: Preferences,
				props: {
					flow: [
						{
							show: true,
							class:
								'grid md:grid-rows-3 sm:grid-rows-4 xs:grid-rows-5 grid-rows-6 grid-flow-col gap-4 mb-4 mx-auto min-w-full text-xs sm:text-sm md:text-base',
							onSubmit: async (e: SubmitEvent) => {
								const formElement = e.target as HTMLFormElement;
								const firstReportInput = formElement.querySelector(
									'input[name="reportType"]'
								) as HTMLInputElement;
								const formData = new FormData(formElement);

								const submitterElement = e.submitter as HTMLElement; // Identifying the submitter element

								const originalValue = (submitterElement as HTMLInputElement)?.value;
								if (submitterElement) {
									(submitterElement as HTMLInputElement).value = 'Confirming...'; // Setting the innerHTML to "Confirming..."
								}

								const selectedPreset = formElement.querySelector(
									'input[name="reportType"]:checked'
								)?.id;
								const customOption = formData.get('customReport');

								if (!selectedPreset && !customOption) {
									firstReportInput?.setCustomValidity('Please set an option');
									firstReportInput?.reportValidity();
									e.preventDefault();
									(submitterElement as HTMLInputElement).value = originalValue;
									throw new Error('Please set an option');
								}

								if ($page.data.session && $page.data.session?.user?.email)
									// TODO handle error response
									// Display the key/value pairs
									try {
										await fetch('/data/email/' + item.shortid, {
											method: 'POST',
											headers: {
												'Report-Email-Content': 'true',
												'User-Email': $page.data.session?.user?.email,
												'CSRF-Token': $sessionStore.csrfToken
											},
											body: JSON.stringify(Object.fromEntries(formData))
										});
									} catch (e) {
										console.error(e);
										(submitterElement as HTMLInputElement).value =
											"An error occurred! Try again, we'll look into it.";
									}

								setTimeout(() => (remove = true)); // set remove flag after form update
								handleRemove({ background: true });
							},
							items: [
								{
									type: 'radio',
									name: 'reportType',
									onUpdate: (e: KeyboardEvent | MouseEvent) => {
										if (e.currentTarget) (e.currentTarget as HTMLInputElement).checked = true;
									},
									label: 'Spam',
									labelStyle: 'radioLabel',
									value: 'Spam',
									class: 'option py-3 sm:py-2'
								},
								{
									type: 'radio',
									name: 'reportType',
									onUpdate: (e: KeyboardEvent | MouseEvent) => {
										if (e.currentTarget) (e.currentTarget as HTMLInputElement).checked = true;
									},
									label: 'Harassment',
									labelStyle: 'radioLabel',
									value: 'Harassment',
									class: 'option py-3 sm:py-2'
								},
								{
									type: 'radio',
									name: 'reportType',
									onUpdate: (e: KeyboardEvent | MouseEvent) => {
										if (e.currentTarget) (e.currentTarget as HTMLInputElement).checked = true;
									},
									label: 'Violence',
									labelStyle: 'radioLabel',
									value: 'Violence',
									class: 'option py-3 sm:py-2'
								},
								{
									type: 'radio',
									name: 'reportType',
									onUpdate: (e: KeyboardEvent | MouseEvent) => {
										if (e.currentTarget) (e.currentTarget as HTMLInputElement).checked = true;
									},
									label: 'Privacy',
									labelStyle: 'radioLabel',
									value: 'Privacy',
									class: 'option py-3 sm:py-2'
								},
								{
									type: 'radio',
									name: 'reportType',
									onUpdate: (e: KeyboardEvent | MouseEvent) => {
										if (e.currentTarget) (e.currentTarget as HTMLInputElement).checked = true;
									},
									label: 'Misleading',
									labelStyle: 'radioLabel',
									value: 'Misleading',
									class: 'option py-3 sm:py-2'
								},
								{
									type: 'text',
									name: 'customReport',
									onFocus: (e: FocusEvent) => {
										const reportRadioButtons = document.querySelectorAll(
											"input[name='reportType']"
										);
										reportRadioButtons.forEach((radio) => {
											(radio as HTMLInputElement).checked = false;
										});
									},
									label: 'Other',
									labelStyle: 'radioLabel',
									placeholder: '50 characters',
									maxLength: 50,
									class:
										'option my-0 h-6 md:h-10 [&_input]:-mr-2 [&_input]:bg-peacockFeather-600 [&_input]:rounded-r-[10px] [&_input]:px-1 [&_input]:h-6 [&_input]:md:h-10 [&_input]:ml-1 [&_label]:mr-0 [&_input]:w-28'
								},
								{
									type: 'submit',
									name: 'next',
									onUpdate: (e: KeyboardEvent | MouseEvent) => {
										if (e.currentTarget) {
											(e.currentTarget as HTMLInputElement).click();
											e.preventDefault();
										}
									},
									label: 'Next',
									value: 'Next',
									class: 'submit justify-self-end block'
								}
							]
						},
						{
							show: false,
							class: 'mx-auto min-w-full text-xs sm:text-sm md:text-base',
							onLoad: () => {
								$focusableMenuElements[$focusableMenuElements.length - 1].focus();
							},

							items: [
								{
									type: 'menuitem',
									name: 'confirm',
									onUpdate: (e: KeyboardEvent | MouseEvent) => {
										if (e.currentTarget) {
											(e.currentTarget as HTMLInputElement).click();
											e.preventDefault();
										}
									},
									label: 'confirm',
									value: 'Confirmed—check your account dashboard for updates.',
									class: 'inline'
								}
							]
						}
					]
				}
			},

			onClick: () => {
				menuItems[3].name = 'Loading...';
				if (!$page.data.session) {
					goto('/sign/in?callbackUrl=/', { noScroll: true, keepFocus: true });
					return;
				}
				menuItems = menuItems.map((item) => {
					if (item.key !== 'moderation' && item.key !== 'back') {
						item.show = false;
						item.actionToggled = false;
					} else {
						item.show = true;
						if (item.key === 'moderation') item.actionToggled = true;
					}
					return item;
				});
				menuItems[3].name = 'Report';
			}
		},
		{
			name: 'Close',
			key: 'close',
			class: 'menu__item menu__item--close mt-4 hover:scale-105 active:scale-100',
			show: true,
			actionToggled: false,
			actionComponent: undefined,
			onClick: () => {
				card.focus();
				showMenu = false;
				nestedHover = false;
				menuItems = menuItems.map((item) => {
					if (item.key !== 'back') {
						item.show = true;
					} else {
						item.show = false;
					}
					return item;
				});
			}
		},
		{
			name: 'Back',
			key: 'back',
			class: 'menu__item menu__item--close mt-4 hover:scale-105 active:scale-100',
			show: false,
			actionToggled: false,
			actionComponent: undefined,
			onClick: ({ focusableElements }: MenuItemClickArgs) => {
				menuItems = menuItems.map((item) => {
					if (item.key !== 'back') {
						item.show = true;
						item.actionToggled = false;
					} else {
						item.show = false;
					}
					return item;
				});
				if (focusableElements) {
					(menu.querySelector("div[role='menuitem']") as HTMLElement)?.focus();
				}
				if (remove) {
					handleRemove({ background: false });
				}
			}
		}
	];

	onMount(async () => {
		sessionStore = (await import('$lib/data/sessionStorage')).store;
		if (card) {
			resizeObserver = new ResizeObserver(() => {
				updateScrollableElements(scrollableElements);
			});

			resizeObserver.observe(card);
		}
	});

	afterUpdate(() => {
		if (
			scrollToCard &&
			!$sessionStore.hiddenEmails.includes(item.shortid) &&
			!showMenu &&
			!remove
		) {
			// TODO more contextual fix for resolving pending events after DOM update
			setTimeout(() => {
				card.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
			});
			scrollToCard = false;
		}
		if (card && header) {
			scrollableElements = { card, header };
			updateScrollableElements(scrollableElements), 100;
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

	let justFocused = false;

	async function handleSelect() {
		if (selected.id != item.rowid) {
			selected.id = item.rowid;
		}
		if (expand && !justFocused && !showMenu) {
			setExpand(false);
		} else {
			setExpand(true);
			scrollToCard = true;
			$sessionStore.email.id = item.rowid;
			$sessionStore.email.content = item;
		}
		dispatch('select', selected);
	}

	function handleBlur(event: FocusEvent) {
		if (
			(card && card.contains(event.relatedTarget as Node) && !remove) ||
			((event.target as HTMLElement).id === 'back' &&
				menu.contains(event.relatedTarget as Node) &&
				!remove) ||
			(card.contains(event.relatedTarget as Node) &&
				(event.relatedTarget as HTMLElement).classList.contains('menu__item') &&
				!remove) ||
			(menu && menu.contains(event.relatedTarget as Node) && !remove)
		) {
			return;
		} // keep expanded if focus is on the card
		setExpand(false);
		if (!expand) {
			header.scrollLeft = 0;
			scrollPosition.header.x = 0;
		} else {
			scrollPosition.header.x = 1;
		}
		showMenu = false;
		activationState = null;
		menuItems = menuItems.map((item) => {
			if (item.key !== 'back') {
				item.show = true;
				item.actionToggled = false;
			} else {
				item.show = false;
			}
			return item;
		});
		if (remove) {
			handleRemove({ background: false });
		}
	}
</script>

<div
	role="button"
	tabindex="0"
	bind:this={card}
	on:focus={() => {
		handleSelect();
		justFocused = true;
		setTimeout(() => {
			justFocused = false;
		}, 350);
	}}
	on:click={() => {
		handleSelect();
	}}
	on:keydown={(e) => {
		if (e.key === 'Enter') {
			handleSelect();
		} else if (e.key === 'Escape') {
			setExpand(false);
			showMenu = false;
		}
	}}
	on:blur={handleBlur}
	aria-label="Email with a subject: {item.subject}"
	class="card flex p-2 m-1 rounded bg-artistBlue-600 items-center relative
		justify-center w-[80vw] max-w-full {style}"
	class:cursor-default={expand}
	class:clickable={!nestedHover}
	style="width: {expand ? 'calc(100% + 0.25rem)' : '95%'}; margin-left: {expand ? '-0.25rem' : 0};"
>
	{#if showMenu}
		<div
			tabindex="0"
			role="menu"
			bind:this={menu}
			on:click|stopPropagation={async () => {
				if (expand) {
					showMenu = false;
				} else {
					setExpand(true);
					handleSelect();
				} // if menu recently closed but not yet destroyed, still expand the card
			}}
			on:keypress|stopPropagation={(e) => {
				if (e.key === 'Enter') {
					if (expand) {
						showMenu = false;
					} else {
						setExpand(true);
						handleSelect();
					}
				}
			}}
			class="absolute top-0 left-0 right-0 bottom-0 max-w-full"
		>
			<Menu
				on:mouseenter={() => (nestedHover = true)}
				on:blur={(e) => {
					if (e.target.id === 'back' && !remove) {
						e.preventDefault();
						return;
					}
					if (e.relatedTarget.classList.contains('menu')) {
						card.focus();
					} else {
						handleBlur(e);
					}
				}}
				items={menuItems}
				bind:focusableElements={focusableMenuElements}
			/>
		</div>
	{/if}
	<section
		class="flex flex-col relative {!expand
			? 'cardWrapper'
			: ''} min-w-full min-h-fit overflow-hidden"
	>
		{#if sessionStore}
			<span class="flex max-w-full h-fit items-baseline relative">
				<span
					class="w-[calc(85%-10vw)] xs:w-[calc(90%-6vw)] sm:w-[88%] md:w-[90%] lg:w-[calc(95%-2.5vw)] relative"
				>
					<h1
						aria-label="Subject line"
						aria-describedby={item.subject}
						title={scrollPosition.header.x > 0 ? item.subject : null}
						bind:this={header}
						on:wheel={(e) => {
							if (scrollPosition.header.remainingWidth > 0) {
								e.stopPropagation();
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
								e.stopPropagation();
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
						class:scrolled__max={scrollPosition.header.remainingWidth - scrollPosition.header.x < 1}
						class="inline-block mr-1 w-full text-left xs:text-xl text-base"
					>
						{item.subject}
					</h1>
				</span>

				<div class="stats ml-auto flex shrink-0 pl-2 -mt-1 flex-row gap-x-5">
					<!-- show read count only for emails on blockchain -->
					<!-- <span title="Read count" aria-label="Number of reads" class="flex items-center">
							<icon
								title="Recipient"
								class="max-w-[36px]"
								style="filter: drop-shadow(1px 1px 1px rgb(0 0 0 / 0.4));"
							>
								<RecipientIcon color="#94D2BD" />
							</icon>
							{item.open_count != BigInt(0) ? item.open_count : '?'}
						</span> -->
					<span
						title="Send count"
						aria-label="Number of sends"
						class="flex items-center gap-x-1.5 text-base"
					>
						<icon
							aria-label="Envelope"
							class="sm:max-w-[36px] max-w-[32px]"
							style="filter: drop-shadow(1px 0.75px 0.75px rgb(0 0 0 / 0.4));"
						>
							<SentIcon color="#94D2BD" />
						</icon>
						{item.send_count != BigInt(0) ? item.send_count : '?'}
					</span>
				</div>
			</span>
			<article
				class="flex grow justify-between min-w-full h-full flex-col"
				class:md:flex-row={!expand}
				class:md:max-h-80={!expand}
			>
				<div
					class="flex flex-col tags h-full overflow-clip mb-1 max-h-full"
					aria-label="Topic and recepient lists"
					class:md:max-w-[50%]={!expand}
					class:md:w-[200rem]={!expand}
					class:md:pr-2={!expand}
					class:mb-4={expand}
				>
					<div aria-label="Topic list" class="h-fit">
						<Selector
							selectable={Tag}
							items={item.topic_list}
							itemStyle="text-xs sm:text-sm text-paper-500 bg-peacockFeather-500"
							selectorStyle="pt-2 max-w-full md:flex-wrap"
							alignment="start"
							overflow={expand ? 'wrap' : 'auto'}
							backgroundColor={colors.artistBlue[600]}
							bind:focusable={expand}
							bind:selectedContent={$sessionStore.topic}
							on:select={(e) => {
								setExpand(false);
								dispatch('select', e.detail);
							}}
							on:blur={handleBlur}
						/>
					</div>
					<div aria-label="Receipient list" class="h-fit">
						<Selector
							selectable={Tag}
							items={item.recipient_list}
							itemStyle="text-xs sm:text-sm text-paper-500 bg-peacockFeather-600"
							selectorStyle="pt-1 max-w-full md:flex-wrap"
							alignment="start"
							overflow={expand ? 'wrap' : 'auto'}
							backgroundColor={colors.artistBlue[600]}
							bind:focusable={expand}
							bind:selectedContent={$sessionStore.recipient}
							on:select={(e) => {
								setExpand(false);
								dispatch('select', e.detail);
							}}
							on:blur={handleBlur}
						/>
					</div>
				</div>
				{#if expand && $page.route.id === '/'}
					<span class="flex max-w-full gap-5 my-4">
						<p aria-label="Info text" class="text-center ml-auto mt-1">
							<i>
								<span
									role="link"
									tabindex="0"
									class="underline cursor-alias"
									on:click={() => {
										dispatch('externalAction', { type: 'email', context: item });
									}}
									on:keydown={(e) => {
										if (e.key === 'Enter')
											dispatch('externalAction', { type: 'email', context: item });
									}}
								>
									send...
								</span>
							</i>
						</p>
						<div
							role="button"
							tabindex="0"
							title="Menu"
							on:click|stopPropagation={(e) => {
								showMenu = !showMenu;
							}}
							on:keydown|stopPropagation={(e) => {
								if (e.key === 'Enter') {
									e.preventDefault();
									showMenu = !showMenu;
								}
							}}
							on:mouseenter={() => (nestedHover = true)}
							on:mouseleave={() => (nestedHover = false)}
							on:blur={handleBlur}
							class="w-[22%] mr-auto self-start max-w-[28px] max-h-fit cursor-context-menu mx-1 hover:scale-125 active:scale-100 ease-in-out duration-150"
						>
							<MenuIcon />
						</div>
					</span>
				{/if}
				<details
					style="text-align: initial;"
					class="whitespace-normal flex flex-col appearance-none self-center md:pl-0"
					class:w-full={expand}
					class:max-w-[70%]={!expand}
				>
					<summary
						tabindex="-1"
						aria-expanded={expand}
						aria-label="Email body"
						on:click={(e) => {
							if (e.target instanceof HTMLElement && e.target.tagName === 'A') {
								e.stopPropagation();
							}
						}}
						on:keypress={(e) => {
							if (e.key === 'Enter') {
								if (e.target instanceof HTMLElement && e.target.tagName === 'A') {
									e.stopPropagation();
								} else {
									dispatch('externalAction', { type: 'email', context: item });
								}
							}
						}}
					>
						<Reader bind:expand item={item.body} />
					</summary>
				</details>
			</article>
		{/if}
	</section>
</div>

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
	.card {
		transition: all 0.2s ease-out;
		color: theme('colors.paper.500');
		&:hover {
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
			z-index: 10;
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
		z-index: 10;
		background: linear-gradient(
			to right,
			theme('colors.artistBlue.600') 3%,
			transparent 15%,
			transparent 85%,
			theme('colors.artistBlue.600') 97%
		);
	}

	.scrolled__max::before {
		z-index: 10;
		content: '';
		display: block;
		top: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(to right, theme('colors.artistBlue.600') 3%, transparent 15%);
	}

	summary {
		transition: 0.2s ease-out;
		list-style: none;
		&::-webkit-details-marker {
			display: none;
		}
	}
</style>
