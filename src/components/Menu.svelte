<script lang="ts">
	import { expoIn, expoOut, quintOut } from 'svelte/easing';
	import { fade, slide } from 'svelte/transition';
</script>

<aside
	class="menu rounded absolute top-0 right-0 min-h-full min-w-full z-20"
	in:fade={{ delay: 25, duration: 300, easing: expoIn }}
	out:fade={{ delay: 50, duration: 300, easing: expoOut }}
>
	<div
		transition:slide={{ delay: 50, axis: 'x', easing: quintOut }}
		on:mousedown|stopPropagation
		class="pt-[0.75rem] max-w-full"
	>
		<ul class="flex flex-col gap-y-2">
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
