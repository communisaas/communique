<script lang="ts">
	import { signIn } from "@auth/sveltekit/client";
	import { createEventDispatcher } from "svelte";
    
    export let item: AuthSchema;

    let show: boolean;
    let chosenProvider: string;
	const dispatch = createEventDispatcher();

	function setPopover(value: boolean) {
		show = value;
		dispatch('popover', show);
	}
</script>

<section class="flex flex-col items-center">
    <p class="mb-4">{!chosenProvider ? 'Sign in with' : `Going to ${chosenProvider}...`}</p>
    <article class="flex flex-col gap-3">
        <div class="flex gap-3">
            {#each Object.entries(item.providers) as [id, attributes]}
                <button on:click={() => {signIn(id); setPopover(false); chosenProvider = attributes.name}} class="flex flex-col items-center justify-center m-2 w-14 h-14">
                    <img data-sveltekit-preload-code='eager' src={item.baseLogoURL + attributes.style.logoDark} alt='{attributes.name} logo'/>
                </button>
            {/each}
        </div>
        <button class="w-full h-10" on:click={() => setPopover(false)}>
            Close
        </button>
    </article>
</section>

<style lang="scss">
    button {
		background: rgba(255, 255, 255, 0.15);
		border-radius: 16px;
		box-shadow: 0 1px 2px 1px rgba(0, 0, 0, 0.1);
		transition: ease-in-out 0.1s;

		&:hover {
			background: rgba(255, 255, 255, 0.25);
			transform: translateY(-1px);
		}
		&:active {
			transform: translateY(1px);
			background: rgba(255, 255, 255, 0.15);
		}
	}
</style>