<script lang="ts">
	import { fade, scale, slide } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { afterUpdate, onDestroy, onMount } from 'svelte';
	import { trapFocus, updateFocusableElements } from '$lib/ui/ux';
	import { writable } from 'svelte/store';

	export let flow: SettablePage[];
	export let focusableElements = writable<HTMLElement[]>([]);
	export let firstFocus = true;

	let menus: HTMLElement[] = [];
	let firstFocusableElement = writable<HTMLElement | null>(null);
	let lastFocusableElement = writable<HTMLElement | null>(null);

	let submitting = false;

	let focusHandler: (e: KeyboardEvent) => void;
	onMount(() => {
		const [focusElems, firstElem, lastElem] = updateFocusableElements(menus[0]) as [
			HTMLElement[],
			HTMLElement,
			HTMLElement
		];
		focusableElements.set(focusElems);
		firstFocusableElement.set(firstElem);
		lastFocusableElement.set(lastElem);

		focusHandler = (e) => {
			firstFocus = false;
			trapFocus(e, $focusableElements);
		};

		firstFocusableElement.update((first) => {
			if (first && $focusableElements) {
				lastElem.focus();
				firstFocus = false;
				return null;
			}
			return first;
		});

		for (const menu of menus) {
			menu.addEventListener('keydown', focusHandler);
		}
	});

	afterUpdate(() => {
		let focusElems: HTMLElement[], firstElem: HTMLElement, lastElem: HTMLElement;
		for (const [index, menu] of menus.entries()) {
			if (flow[index].show && $focusableElements) {
				[focusElems, firstElem, lastElem] = updateFocusableElements(menu) as [
					HTMLElement[],
					HTMLElement,
					HTMLElement
				];
				focusableElements.set(focusElems);
				firstFocusableElement.set(firstElem);
				lastFocusableElement.set(lastElem);
			}
		}
	});

	onDestroy(() => {
		for (const menu of menus) menu.removeEventListener('keydown', focusHandler);
		$focusableElements = [];
	});

	function handleKeyPress(event: KeyboardEvent, labelId: string) {
		// Forward the keypress event to the nested input element
		if (event.currentTarget) {
			const input = (event.currentTarget as HTMLElement).querySelector(`#${labelId}`);
			if (input) {
				input.dispatchEvent(new KeyboardEvent(event.type, { key: event.key }));
			}
		}
	}

	function focusInput(e: FocusEvent, step: Settable) {
		if (!e || !e.currentTarget) return;
		if (step.type === 'text') {
			const input = (e.currentTarget as HTMLElement).querySelector(`#${step.label}`);
			if (input) (input as HTMLInputElement).focus();
		}
	}

	function handleInput(e: Event, index: number, step: Settable) {
		(menus[index].querySelector('input[name="type"]') as HTMLInputElement)?.setCustomValidity('');
		step.onUpdate(e);
	}
</script>

<section class="relative h-fit max-h-44 flex">
	<div class="m-1 flex">
		{#each flow as page, index}
			<form
				class={page.class}
				class:hidden={!page.show}
				bind:this={menus[index]}
				on:submit|preventDefault={async (e) => {
					submitting = true;
					try {
						await page.onSubmit(e);
					} catch (error) {
						console.error(error);
						return;
					}
					page.show = false;
					if (flow[index + 1]) {
						flow[index + 1].show = true;
					}
					if ('onLoad' in flow[index + 1]) {
						flow[index + 1].onLoad?.();
					}
					const [focusElems, firstElem, lastElem] = updateFocusableElements(menus[index + 1]);
				}}
				on:blur
			>
				{#each page.items as step, inputIndex (step.label)}
					<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
					<div
						tabindex={step.type !== 'menuitem' ? 0 : -1}
						role={step.type !== 'menuitem' ? 'button' : 'menuitem'}
						id="{step.label}__{step.type}"
						animate:flip={{ duration: 200 }}
						in:slide={{ duration: 200, axis: 'y' }}
						class="flex items-center gap-2 {step.class}"
						on:keydown|stopPropagation={(e) => {
							if (e.key === 'Enter') {
								handleKeyPress(e, step.label);
							}
						}}
						on:click={(e) => {
							if (step.type === 'text') {
								return;
							}
							// focus wrapping div to blur input upon click/tab out
							else if (step.type !== 'submit') e.currentTarget.focus();
						}}
						on:focus={(e) => focusInput(e, step)}
						on:blur
					>
						{#if step.type !== 'menuitem'}
							<label for={step.label} class="cursor-pointer pointer-events-auto mx-2 py-2">
								{#if step.type !== 'submit'}{step.label}{/if}
								<input
									tabindex="-1"
									id={step.label}
									name={step.name}
									on:input={(e) => handleInput(e, index, step)}
									type={step.type}
									value={step.value ?? ''}
									placeholder={step.placeholder}
									maxlength={step.maxLength}
									autocomplete="off"
									class="cursor-pointer"
									on:focus={(e) => {
										if ('onFocus' in step) step.onFocus?.(e);
									}}
									on:blur={(e) => {
										if (submitting) {
											e.preventDefault();
											submitting = false;
										} else {
											e?.currentTarget.blur();
										}
									}}
									on:keydown|stopPropagation={(e) => {
										if (e.key === 'Enter') {
											step.onUpdate(e);
										} else if (e.key === 'Tab' && step.type == 'text') {
											if (e.shiftKey) {
												e.preventDefault();
												menus[index]
													.querySelector(
														`#${flow[index].items[inputIndex - 1].label}__${
															flow[index].items[inputIndex - 1].type
														}`
													)
													?.focus();
											}
										}
									}}
								/>
							</label>
						{:else}
							{step.value}
						{/if}
					</div>
				{/each}
			</form>
		{/each}
	</div>
</section>

<style lang="scss">
	.option {
		max-width: fit-content;
		border-radius: 10px;
		background-color: theme('colors.larimarGreen.700');
		transition: all ease-in-out 0.1s;

		&__text {
			color: theme('colors.paper.700');
		}

		&:hover {
			transform: translateY(-0.1rem);
		}
		&:active {
			transform: translateY(0);
		}
	}

	.submit {
		background-color: theme('colors.peacockFeather.600');
		border-radius: 10px;
		transition: all ease-in-out 0.1s;
		max-width: fit-content;
		&:hover {
			transform: translateY(-0.1rem);
		}
		&:active {
			transform: translateY(0);
		}
	}
</style>
