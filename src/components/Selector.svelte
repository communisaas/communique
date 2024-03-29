<script lang="ts">
	import { onMount, type ComponentType } from 'svelte';
	import { flip } from 'svelte/animate';

	export let items: Selectable[] | string[];
	export let selectable: ComponentType; // item component template
	export let selectedContent: Selectable;
	export let alignment: 'start' | 'end' | 'center' | 'justify' | 'match-parent';
	export let overflow: 'scroll' | 'hidden' | 'visible' | 'wrap' | 'auto' = 'auto';
	export let scrollable = true;
	export let focusable = true;
	export let scrollOverride = false;
	export let itemStyle: string = '';
	export let selectorStyle: string = '';
	export let backgroundColor: string = '';

	$: listStyle = `mx-1 flex min-h-[0] items-${alignment} ${
		alignment == 'end' ? 'flex-row-reverse' : 'flex-row'
	}  gap-1.5 ${overflow == 'wrap' ? 'flex-wrap gap-y-1' : 'overflow-' + overflow} ${selectorStyle}`;

	let scrollPosition = {
		x: 0,
		y: 0,
		remainingWidth: 0,
		remainingHeight: 0,
		startX: 0,
		startY: 0,
		startScrollLeft: 0,
		startScrollTop: 0
	};

	let scrollX = {
		scrolled: false,
		scrolledMax: false
	};
	let scrollY = {
		scrolled: false,
		scrolledMax: false
	};

	let resizeObserver: ResizeObserver;
	let list: HTMLElement;
	onMount(async () => {
		resizeObserver = new ResizeObserver(() => {
			updateScrollableElements();
		});

		resizeObserver.observe(list);
	});

	function updateScrollableElements() {
		if (list) {
			scrollPosition.remainingWidth = list.scrollWidth - list.clientWidth;
			scrollPosition.remainingHeight = list.scrollHeight - list.clientHeight;
			scrollable =
				scrollPosition.remainingWidth == 0 && scrollPosition.remainingHeight == 0 ? false : true;

			scrollX.scrolled = scrollPosition.x > 1;
			scrollX.scrolledMax =
				scrollX.scrolled && scrollPosition.remainingWidth - scrollPosition.x <= 1;

			scrollY.scrolled = scrollPosition.y > 1;
			scrollY.scrolledMax =
				scrollY.scrolled && scrollPosition.remainingHeight - scrollPosition.y <= 1;
		}
	}

	$: {
		if (items && list && scrollable) {
			// update if new list litems
			updateScrollableElements();
		}
	}
</script>

<section class="relative h-full overflow-hidden">
	<div
		bind:this={list}
		style="--backgroundColor: {backgroundColor}"
		class={listStyle}
		class:scrollable
		class:scrollableX={scrollable && scrollPosition.remainingWidth > 0}
		class:scrollableY={scrollable && scrollPosition.remainingHeight > 0}
		class:scrolledX={scrollX.scrolled}
		class:scrolledY={scrollY.scrolled}
		class:scrolledX__max={scrollX.scrolledMax}
		class:scrolledY__max={scrollY.scrolledMax}
		on:wheel={(e) => {
			if (scrollOverride) e.preventDefault();
			if (scrollable) {
				list.scrollLeft += Math.abs(e.deltaX) > 0 ? e.deltaX : e.deltaY;
				list.scrollTop += Math.abs(e.deltaY) > 0 ? e.deltaY : e.deltaX;
				scrollPosition.x = list.scrollLeft + 1;
				scrollPosition.y = list.scrollTop + 1;
			}
		}}
		on:touchstart={(e) => {
			if (scrollable) {
				scrollPosition.startX = e.touches[0].clientX;
				scrollPosition.startY = e.touches[0].clientY;
				scrollPosition.startScrollTop = list.scrollTop;
				scrollPosition.startScrollLeft = list.scrollLeft;
			}
		}}
		on:touchmove={(e) => {
			if (scrollable) {
				const deltaX = e.touches[0].clientX - scrollPosition.startX;
				const deltaY = e.touches[0].clientY - scrollPosition.startY;

				if (Math.abs(deltaY) > Math.abs(deltaX) && list.scrollHeight > list.clientHeight) {
					// Scroll vertically
					list.scrollTop = scrollPosition.startScrollTop - deltaY;
				} else {
					// Scroll horizontally
					const walk = deltaX;
					list.scrollLeft = scrollPosition.startScrollLeft - walk;
					scrollPosition.x = list.scrollLeft + 1;
				}
			}
		}}
		on:touchend={() => {
			if (scrollable) {
				scrollPosition.startX = 0;
				scrollPosition.startY = 0;
				scrollPosition.startScrollLeft = 0;
				scrollPosition.startScrollTop = 0;
			}
		}}
	>
		{#each items as item (item)}
			<span class="max-w-full" animate:flip={{ duration: 200 }}>
				<svelte:component
					this={selectable}
					bind:selected={selectedContent}
					style={itemStyle}
					bind:focusable
					{item}
					on:select
					on:blur
					on:externalAction
				/>
			</span>
		{/each}
	</div>
</section>

<style lang="scss">
	.scrollable {
		scrollbar-width: none;
		&::-webkit-scrollbar {
			display: none;
		}
		&X {
			&::before {
				content: '';
				pointer-events: none;
				display: block;
				position: absolute;
				top: 0;
				right: 0;
				bottom: 0;
				left: 0;
				background-image: linear-gradient(to right, transparent 93%, var(--backgroundColor) 97%);
				background-repeat: no-repeat;
			}
		}

		&Y {
			&::before {
				content: '';
				pointer-events: none;
				display: block;
				position: absolute;
				top: -1px;
				right: 0;
				bottom: -1px;
				left: 0;
				background-image: linear-gradient(to bottom, transparent 93%, var(--backgroundColor) 97%);
				background-repeat: no-repeat;
			}
		}
	}

	.scrolledX {
		&::before {
			pointer-events: none;
			background-image: linear-gradient(
				to right,
				var(--backgroundColor) 3%,
				transparent 8%,
				transparent 93%,
				var(--backgroundColor) 97%
			);
			background-repeat: no-repeat;
		}
	}

	.scrolledX__max {
		&::before {
			pointer-events: none;
			content: '';
			display: block;
			top: 0;
			right: 0;
			bottom: 0;
			background-image: linear-gradient(to right, var(--backgroundColor) 3%, transparent 8%);
			background-repeat: no-repeat;
		}
	}

	.scrolledY {
		&::before {
			z-index: 20;
			background-image: linear-gradient(
					to bottom,
					var(--backgroundColor) 3%,
					transparent 8%,
					transparent 93%,
					var(--backgroundColor) 97%
				),
				linear-gradient(
					to bottom,
					var(--backgroundColor) 3%,
					transparent 8%,
					transparent 93%,
					var(--backgroundColor) 97%
				);
			background-repeat: no-repeat;
		}
	}

	.scrolledY__max {
		&::before {
			content: '';
			display: block;
			top: 0;
			right: 0;
			bottom: 0;
			background-image: linear-gradient(to right, var(--backgroundColor) 3%, transparent 8%),
				linear-gradient(to bottom, var(--backgroundColor) 3%, transparent 8%);
			background-repeat: no-repeat;
		}
	}
</style>
