<script lang="ts">
	import { fade, scale, slide } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { afterUpdate, onDestroy, onMount } from 'svelte';
	import { trapFocus, updateFocusableElements } from '$lib/ui/ux';
	import { writable } from 'svelte/store';

	export let flow: SettablePage[];
	export let focusableElements = writable<HTMLElement[]>([]);

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

		firstFocusableElement.update((first) => {
			if (first) {
				first.focus();
				return null;
			}
			return first;
		});

		focusHandler = (e) => {
			trapFocus(e, $focusableElements);
		};

		for (const menu of menus) {
			menu.addEventListener('keydown', focusHandler);
		}
	});

	afterUpdate(() => {
		let focusElems: HTMLElement[], firstElem: HTMLElement, lastElem: HTMLElement;
		for (const [index, menu] of menus.entries()) {
			if (flow[index].show) {
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
</script>

<section class="relative h-fit max-h-40 flex">
	<div class="m-1 flex">
		{#each flow as page, index}
			<form
				class={page.class}
				class:hidden={!page.show}
				bind:this={menus[index]}
				on:submit|preventDefault={(e) => {
					console.log('submitting');
					submitting = true;
					page.show = false;
					if (flow[index + 1]) {
						console.log('showing next page');
						flow[index + 1].show = true;
					}
					const [focusElems, firstElem, lastElem] = updateFocusableElements(menus[index + 1]);
				}}
			>
				{#each page.items as step (step.label)}
					<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
					<div
						tabindex={step.type !== 'menuitem' ? 0 : -1}
						role={step.type !== 'menuitem' ? 'button' : 'menuitem'}
						animate:flip={{ duration: 200 }}
						in:slide={{ duration: 200, axis: 'y' }}
						class="flex items-center gap-2 {step.class}"
						on:keydown|stopPropagation={(e) => {
							if (e.key === 'Enter') {
								handleKeyPress(e, step.label);
							}
						}}
						on:blur
					>
						<span>
							{#if step.type !== 'menuitem'}
								<label for={step.label} class="cursor-pointer pointer-events-auto mx-2 py-2">
									{#if step.type !== 'submit'}{step.label}{/if}
									<input
										tabindex="-1"
										id={step.label}
										name={step.name}
										on:input={step.onUpdate}
										type={step.type}
										value={step.value}
										class="cursor-pointer"
										on:blur={(e) => {
											console.log('blur');
											if (submitting) {
												e.preventDefault();
												submitting = false;
												$focusableElements[0].focus();
											}
										}}
										on:keydown|stopPropagation={(e) => {
											if (e.key === 'Enter') {
												step.onUpdate(e);
											}
										}}
									/>
								</label>
							{:else}
								{step.value}
							{/if}
						</span>
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
