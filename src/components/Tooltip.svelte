<!-- Tooltip.svelte -->
<script>
	export let message = '';
	export let style = '';
</script>

{#if message}
	<div role="tooltip" class="tooltip bg-artistBlue-600 {style}">
		{message}
	</div>
{/if}

<style>
	.tooltip {
		position: absolute;
		box-shadow: 0 1px 2px 2px rgba(0, 0, 0, 0.1);
		color: theme('colors.paper.500');
		padding: 4px 8px;
		box-sizing: border-box;
		border-radius: 4px;
		transform: translateX(-50%);
		white-space: nowrap;
		z-index: 100;
	}
</style>
