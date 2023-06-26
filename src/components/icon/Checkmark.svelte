<script>
	import { expoOut } from 'svelte/easing';
	import { draw, fade } from 'svelte/transition';
</script>

<svg width="100%" viewBox="0 0 92 92" fill="none" xmlns="http://www.w3.org/2000/svg">
	<circle
		transition:fade={{ delay: 100, duration: 250, easing: expoOut }}
		cx="46"
		cy="46"
		r="46"
		fill="#D9D9D9"
		fill-opacity="0.25"
	/>
	<path
		in:draw={{ delay: 100, duration: 500, easing: expoOut }}
		out:fade={{ delay: 100, duration: 250, easing: expoOut }}
		d="M15.1725 37.8605C15.076 37.3788 15.3748 36.9063 15.8514 36.7871L18.0099 36.2475C18.5394 36.1152 19.0669 36.4701 19.1439 37.0103L22.2357 58.72L77.211 36.3215C77.6562 36.1401 78.166 36.332 78.381 36.762L79.5446 39.0893C79.7883 39.5766 79.5574 40.1678 79.0479 40.361L21.4716 62.1908C21.12 62.3242 20.7287 62.3043 20.3924 62.1362C20.1448 62.0124 19.9682 61.7813 19.9138 61.5099L15.1725 37.8605Z"
		stroke="#0A9396"
		stroke-width="1.5"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
</svg>

<style lang="scss">
	circle {
		backdrop-filter: blur(8px);
	}
</style>
