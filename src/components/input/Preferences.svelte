<script lang="ts">
	import { fade, scale, slide } from 'svelte/transition';
	import { flip } from 'svelte/animate';

	export let flow: SettablePages;
</script>

<section class="relative h-full flex cursor-default">
	<form class="m-2 flex flex-col gap-2 mx-auto">
		{#each Object.entries(flow) as [index, page]}
			{#each page as step (step.label)}
				<div
					animate:flip={{ delay: 0, duration: 200 }}
					in:slide={{ duration: 200, axis: 'y' }}
					out:scale={{ duration: 20 }}
					class="flex items-center gap-2 pointer-events-none {step.class}"
				>
					<span>
						<label for={step.label} class="cursor-pointer pointer-events-auto">
							{#if step.inputType !== 'submit'}{step.label}{/if}
							<input
								id={step.label}
								name={step.name}
								on:input={step.onUpdate}
								type={step.inputType}
								class="cursor-pointer"
							/>
						</label>
					</span>
				</div>
			{/each}
		{/each}
	</form>
</section>

<style lang="scss">
	.option {
		padding: 0.25rem;
		max-width: fit-content;
		border-radius: 10px;
		background-color: theme('colors.larimarGreen.700');
		transition: all ease-in-out 0.1s;

		&__text {
			color: theme('colors.paper.700');
		}

		&:hover {
			transform: translateY(-0.15rem);
		}
		&:active {
			transform: translateY(0);
		}
	}
</style>
