<script lang="ts">
	export let shortLink: URL;
	export let linkMessage = '';
</script>

<aside>
	<section>
		{#if linkMessage}
			<p class="text-center m-2">{linkMessage}</p>
		{/if}
		<span class="shortLink underline p-2 rounded inline-block" aria-label="shortened link">
			{shortLink.host + shortLink.pathname}
		</span>
	</section>
</aside>

<style lang="scss">
	.shortLink {
		cursor: pointer;
		background-color: rgba(255, 255, 255, 0.15);
		transition: 0.1s ease-in-out;

		&:hover {
			transform: scale(1.03);
		}
		&:active {
			transform: scale(0.97);
		}
	}
</style>
