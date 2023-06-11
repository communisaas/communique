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
					transform: scaleY(${easedY}) scaleX(${easedX});
                    transform-origin: 50% 42%;
                `;
			}
		};
	}
</script>

<icon title="Post">
	<svg width="100%" viewBox="0 0 32 26" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M22.4165 17L29.7307 25H2.26923L9.58352 17H22.4165Z" stroke={color} stroke-width="2" />
		<path
			d="M15.9527 1.22463L29.9239 9.92937L15.9499 16.6153L2.06637 9.96973L15.9527 1.22463Z"
			stroke={color}
			stroke-width="2"
		/>
		<path
			d="M15.95 16.9154L4.93449 12.287L16.3194 12.2608H16.3205L27.0353 12.2608L15.95 16.9154Z"
			fill={color}
			stroke={color}
			stroke-width="2"
		/>
		<path
			d="M1.00001 23.8696L11.2846 15.3286L1.00015 11.4464L1.00001 23.8696Z"
			stroke={color}
			stroke-width="2"
		/>
		<path
			d="M31 23.859L20.8072 15.3281L30.9998 11.4504L31 23.859Z"
			stroke={color}
			stroke-width="2"
		/>
		{#if !hovered}
			<g
				out:scalePaper|local={{ delay: 30, duration: 300 }}
				in:scalePaper|local={{ delay: 30, duration: 300 }}
				filter="url(#filter0_d_104_9)"
			>
				<path
					d="M2.28431 3.90134H29.7843L28.1343 9.91535L24.8359 11.4062H6.75759L3.70448 9.91597L2.28431 3.90134Z"
					fill={color}
				/>
			</g>
		{/if}
		<defs>
			<filter
				id="filter0_d_104_9"
				x="0.784302"
				y="1.15134"
				width="30.5"
				height="10.5048"
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
				<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_104_9" />
				<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_104_9" result="shape" />
			</filter>
		</defs>
	</svg>
</icon>
