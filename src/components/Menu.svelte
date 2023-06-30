<script lang="ts">
	import { expoIn, expoOut, quintOut } from 'svelte/easing';
	import { fade, slide } from 'svelte/transition';
</script>

<aside
	class="menu rounded absolute top-0 left-0 min-h-full min-w-full z-20 flex justify-center"
	in:fade={{ delay: 25, duration: 300, easing: expoIn }}
	out:fade={{ delay: 50, duration: 300, easing: expoOut }}
>
	<div on:click|stopPropagation on:keypress|stopPropagation class="pt-[0.75rem] w-full">
		<ul transition:slide={{ delay: 50, axis: 'x', easing: quintOut }} class="flex flex-col gap-y-2">
			<slot />
		</ul>
	</div>
</aside>

<style lang="scss">
	.menu {
		background: rgba(0, 0, 0, 0.2);
		backdrop-filter: blur(8px);
		cursor: initial;
		overflow: hidden;
	}
</style>
