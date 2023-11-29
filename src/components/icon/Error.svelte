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
		fill="#78809e"
		fill-opacity="0.25"
	/>
	<path
		in:draw={{ delay: 100, duration: 500, easing: expoOut }}
		out:fade={{ delay: 100, duration: 250, easing: expoOut }}
		d="M71.236 66.715C71.341 66.4319 71.2628 66.1135 71.0387 65.9112L24.892 24.2619C24.5372 23.9416 23.9962 23.9464 23.6472 24.2729L21.7371 26.0593C21.3409 26.4299 21.3497 27.0611 21.7562 27.4205L68.3487 68.6191C68.6148 68.8544 68.9946 68.9106 69.3174 68.7624V68.7624C69.3911 68.7286 69.4571 68.6802 69.5115 68.6202L71.236 66.715V66.715Z"
		fill="#D12A2A"
	/>
	<path
		in:draw={{ delay: 100, duration: 500, easing: expoOut }}
		out:fade={{ delay: 100, duration: 250, easing: expoOut }}
		d="M21.3461 66.715C21.2411 66.4319 21.3192 66.1135 21.5434 65.9112L67.6901 24.2619C68.0449 23.9416 68.5859 23.9464 68.9349 24.2729L70.845 26.0593C71.2412 26.4299 71.2323 27.0611 70.8259 27.4205L24.2334 68.6191C23.9673 68.8544 23.5875 68.9106 23.2646 68.7624V68.7624C23.191 68.7286 23.125 68.6802 23.0706 68.6202L21.3461 66.715V66.715Z"
		fill="#D12A2A"
	/>
</svg>

<style lang="scss">
	circle {
		backdrop-filter: blur(8px);
	}
</style>
