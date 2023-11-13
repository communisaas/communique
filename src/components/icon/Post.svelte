<script lang="ts">
	import { backInOut } from 'svelte/easing';

	export let hovered: boolean = false;
	export let color = '#D7FEF0';

	interface AnimationTiming {
		duration: number;
		delay: number;
	}
	function scalePaper(node: SVGGElement, { duration, delay }: AnimationTiming) {
		return {
			delay,
			duration,
			css: (t: number) => {
				const eased = backInOut(t);
				// steepen perspective
				const easedY = eased ** 2;
				// mostly constant width folding into envelope
				const easedX = eased > 0.9 ? eased : 0.9;

				return `
					transform: scaleY(${easedY}) scaleX(${easedX ** t});
                    transform-origin: 50% 44%;
                `;
			}
		};
	}
</script>

<svg width="100%" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
	<path
		d="M16.0599 28.5H32.1475L42.5944 39L5.4346 39L16.0599 28.5Z"
		stroke="#D7FEF0"
		stroke-width="2"
	/>
	<path
		d="M24 9.15175L42.803 19.8963L24 28.4024L5.19701 19.8963L24 9.15175Z"
		stroke="#D7FEF0"
		stroke-width="2"
	/>
	<path
		d="M44.9368 21.025L44.9367 21.0248L44.9368 21.025Z"
		fill="#D7FEF0"
		stroke="#D7FEF0"
		stroke-width="2"
	/>
	<path
		d="M4.00002 37.9497L17.1013 27.7144L4.00021 21.5732L4.00002 37.9497Z"
		stroke="#D7FEF0"
		stroke-width="2"
	/>
	<path d="M44 37.9498L30.8987 27.7144L44 21.5732V37.9498Z" stroke="#D7FEF0" stroke-width="2" />
	{#if !hovered}
		<g
			out:scalePaper|local={{ delay: 30, duration: 300 }}
			in:scalePaper|local={{ delay: 30, duration: 300 }}
			filter="url(#filter0_d_408_49)"
		>
			<path d="M4 13H44L42 20L38 22L24 27.5L10 22L6 20L4 13Z" fill="#D7FEF0" />
		</g>
	{/if}
	<path
		d="M6 21H42L40.2 24.3793L36.6 25.3448L24 28L11.4 25.3448L7.8 24.3793L6 21Z"
		fill="#D7FEF0"
	/>
	<g filter="url(#filter1_d_408_49)">
		<path d="M45 20L34 26L24 29.5L14 26L3 20L24 28L45 20Z" fill="#D7FEF0" />
	</g>
	<defs>
		<filter
			id="filter0_d_408_49"
			x="2.5"
			y="10.25"
			width="43"
			height="17.5"
			filterUnits="userSpaceOnUse"
			color-interpolation-filters="sRGB"
		>
			<feFlood flood-opacity="0" result="BackgroundImageFix" />
			<feColorMatrix
				in="SourceAlpha"
				type="matrix"
				values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
				result="hardAlpha"
			/>
			<feOffset dy="-1.25" />
			<feGaussianBlur stdDeviation="0.75" />
			<feComposite in2="hardAlpha" operator="out" />
			<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
			<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_408_49" />
			<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_408_49" result="shape" />
		</filter>
		<filter
			id="filter1_d_408_49"
			x="2.5"
			y="19"
			width="43"
			height="10.5"
			filterUnits="userSpaceOnUse"
			color-interpolation-filters="sRGB"
		>
			<feFlood flood-opacity="0" result="BackgroundImageFix" />
			<feColorMatrix
				in="SourceAlpha"
				type="matrix"
				values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
				result="hardAlpha"
			/>
			<feOffset dy="-0.5" />
			<feGaussianBlur stdDeviation="0.25" />
			<feComposite in2="hardAlpha" operator="out" />
			<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
			<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_408_49" />
			<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_408_49" result="shape" />
		</filter>
	</defs>
</svg>
