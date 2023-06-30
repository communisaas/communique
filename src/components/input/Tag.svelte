<script lang="ts">
	import { onMount } from 'svelte';

	export let type: 'text' | 'email',
		name: string,
		placeholder: string,
		style: string,
		tagStyle: string;
	export let tagList: (string | FormDataEntryValue)[] = [];

	let inputVisible: boolean = false;
	let deleteVisible: boolean = false;

	let inputField: HTMLInputElement, tagForm: HTMLFormElement;

	function addTag(tag: string) {
		if (!inputField.checkValidity() || inputField.value == '') {
			inputField.reportValidity();
			return;
		}
		inputField.value = '';
		if (tagList.includes(tag)) {
			inputField.setCustomValidity(
				`${name.replace(name[0], name[0].toLocaleUpperCase())} already entered.`
			);
			inputField.reportValidity();
		} else {
			tagList = [...tagList, tag];
		}
	}

	$: if (inputVisible) inputField.focus();

	let canvas: HTMLCanvasElement, context: CanvasRenderingContext2D;
	let inputValueWidth: number, placeholderWidth: number;
	onMount(() => {
		canvas = document.createElement('canvas');
		context = canvas.getContext('2d') as CanvasRenderingContext2D;
		if (context) {
			// TODO measure input width smoothly using in-dom placeholder
			context.font = getComputedStyle(inputField).font;
			inputValueWidth = context.measureText(placeholder).width + 6;
			placeholderWidth = inputValueWidth;
		}
	});

	const addIconClass = 'add bg-peacockFeather-600 h-6 w-6';
</script>

<ul
	class="{style} max-w-fit px-3 py-1 h-fit flex flex-row place-items-center items-center justify-center
		rounded bg-peacockFeather-400 cursor-pointer flex-wrap"
	aria-label="{name} list"
	aria-describedby="List of {name}s with an add button"
	on:mouseenter={() => (deleteVisible = true)}
	on:mouseleave={() => (deleteVisible = false)}
	on:click|preventDefault={() => {
		inputVisible = true;
	}}
	on:keypress={(e) => {
		if (e.key == 'Enter') {
			inputVisible = true;
		}
	}}
>
	<li
		class="flex flex-row gap-3 justify-center flex-wrap max-w-40 items-center"
		class:mr-1={tagList.length > 0}
	>
		{#each tagList as tag}
			<li class="relative text-xs {tagStyle} group">
				<button
					type="button"
					on:click={(e) => {
						tagList = tagList.filter((item) => item != tag);
						if (!inputVisible) e.stopImmediatePropagation();
					}}
					on:focus={() => (deleteVisible = true)}
					on:blur={() => (deleteVisible = false)}
					class="delete absolute -top-1 -left-2 rounded-full bg-amber-600 w-4 h-4"
					class:show={deleteVisible}
					aria-label={`Remove ${name}`}
				>
					<!-- plus sign -->
					&#215;
				</button>
				{tag}
			</li>
		{/each}
	</li>
	<li>
		<input
			required={tagList.length <= 0}
			{name}
			role="textbox"
			aria-label="{name} input"
			aria-describedby="Add a {name} here"
			{placeholder}
			inputmode={type}
			bind:this={inputField}
			on:blur={(e) => {
				inputVisible = false;
				e.currentTarget.value = '';
				inputValueWidth = placeholderWidth + 6;
			}}
			on:focus={() => (inputVisible = true)}
			on:keydown|self={(e) => {
				// clear earlier validation errors
				inputField.setCustomValidity('');
				if (e.key == 'Enter') {
					e.preventDefault();
					addTag(inputField.value);
					inputValueWidth = placeholderWidth + 6;
				}
			}}
			on:input={(e) => {
				const currentValueWidth = context.measureText(inputField.value).width;
				if (currentValueWidth > placeholderWidth) {
					inputValueWidth = currentValueWidth + 6;
				} else {
					inputValueWidth = placeholderWidth + 6;
				}
			}}
			style="width: {inputVisible ? inputValueWidth : 0}px;"
			class="rounded bg-larimarGreen-500 shadow-artistBlue shadow-card w-0 h-0 focus:p-0.5"
			class:ml-1={tagList.length > 0 && inputVisible}
			class:show={inputVisible}
			{type}
		/>
	</li>

	<button
		name={`Add ${name}`}
		aria-label="Add button for {name}s"
		on:click|preventDefault={() => {
			inputVisible ? addTag(inputField.value) : (inputVisible = true);
		}}
		class="flex justify-center items-center relative py-1"
	>
		<span title={`Add ${name}`} class="relative w-12" class:active={inputVisible}>
			<slot />
			<icon class={addIconClass} />
		</span>
	</button>
</ul>

<style lang="scss">
	input {
		transition: all 0.2s;
	}
	button span {
		filter: drop-shadow(1px 1px 0.5px rgb(0 0 0 / 0.4));
		transform: scale(0.97);
		transition: 0.1s all ease-out;
	}
	button .active {
		transform: scale(1);
	}
	button:hover span {
		filter: drop-shadow(2px 2px 1px rgb(0 0 0 / 0.4));
		transform: scale(1);
		transition: 0.1s all ease-in;
	}
	.add {
		position: absolute;
		bottom: -0.125rem;
		right: -0.25rem;
		border-radius: 9999px;
		color: #fff;
		font-size: 1.5rem;
		line-height: 1.5rem;
		opacity: 75%;
		transform: scale(0.75);
		transition: all 0.2s ease-in;
	}
	span:hover > .add {
		opacity: 85%;
		transform: scale(0.85);
		transition: all 0.2s ease-out;
	}
	.add:after {
		content: '+';
	}
	.delete {
		opacity: 0;
		transform: scale(0);
		transition: opacity 0.2s, transform 0.2s, visibility 0s 0.2s;
		color: #fff;
		font-size: 1rem;
		line-height: 1rem;
		opacity: 95%;
		text-shadow: rgba(0, 0, 0, 0.25) 0 2px 2px;
		&.show:hover {
			transform: scale(1.35);
			text-shadow: rgba(0, 0, 0, 0.25) 0 1px 1px;
		}
		&.show {
			transform: scale(1);
			transition: opacity 0.2s, transform 0.2s, visibility 0s 0.2s;
		}
	}

	.show {
		visibility: visible;
		opacity: 1;
	}
	input.show {
		width: 4.55rem;
		height: 1.5rem;
		transition: all 0.2s;
	}
</style>
