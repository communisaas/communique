<script lang="ts">
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
		console.log(tagList);
	}

	$: if (inputVisible) inputField.focus();

	const addIconClass = 'add bg-peacockFeather-600 h-6 w-6';
</script>

<ul
	class="{style} max-w-fit px-3 py-1 h-fit flex flex-row place-items-center items-center justify-center 
		rounded bg-larimarGreen-600 cursor-pointer flex-wrap"
	on:mouseenter={() => (deleteVisible = true)}
	on:mouseleave={() => (deleteVisible = false)}
	on:mousedown|preventDefault={(e) => {
		inputVisible = true;
	}}
>
	<li class="flex flex-row gap-3 justify-center flex-wrap max-w-40 items-center">
		{#each tagList as tag}
			<li class="relative text-xs {tagStyle} group">
				<button
					type="button"
					on:mousedown={(e) => {
						tagList = tagList.filter((item) => item != tag);
						if (!inputVisible) e.stopImmediatePropagation();
					}}
					on:focus={() => (deleteVisible = true)}
					on:blur={() => (deleteVisible = false)}
					class="delete absolute -top-1 -left-2 rounded-full bg-amber-600 w-4 h-4"
					class:show={deleteVisible}
				>
					&#215;
				</button>
				{tag}
			</li>
		{/each}
		<input
			required={tagList.length <= 0}
			{name}
			role="textbox"
			{placeholder}
			inputmode={type}
			bind:this={inputField}
			on:blur={(e) => {
				inputVisible = false;
				e.currentTarget.value = '';
			}}
			on:focus={() => (inputVisible = true)}
			on:keydown|self={(e) => {
				// clear earlier validation errors
				inputField.setCustomValidity('');
				if (e.key == 'Enter') {
					e.preventDefault();
					addTag(inputField.value);
				}
			}}
			class="space-x-2 rounded h-full bg-larimarGreen-500 shadow-artistBlue shadow-card w-0 focus:p-0.5"
			class:show={inputVisible}
			{type}
		/>
	</li>

	<button
		type="submit"
		on:click|preventDefault={() => {
			inputVisible ? addTag(inputField.value) : (inputVisible = true);
		}}
		class="flex justify-center items-center relative py-1"
	>
		<span class="relative w-12 shadow-artistBlue" class:active={inputVisible}>
			<slot />
			<icon class={addIconClass} />
		</span>
	</button>
</ul>

<style lang="scss">
	input {
		opacity: 0;
		transition: all 0.2s;
		width: 0;
		height: 0;
	}
	button span {
		filter: drop-shadow(1px 1px 1px rgb(0 0 0 / 0.4));
		transform: scale(0.97);
		transition: 0.3s all ease-out;
	}
	button .active {
		transform: scale(1);
	}
	button:hover span {
		filter: drop-shadow(3px 3px 2px rgb(0 0 0 / 0.4));
		transform: scale(1);
		transition: 0.3s all ease-in;
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
		filter: drop-shadow(0 rgb(0 0 0 / 0.4));
		transform: scale(0.75);
		transition: all 0.8s ease-in;
	}
	span:hover > .add {
		opacity: 85%;
		filter: drop-shadow(3px 3px 2px rgb(0 0 0 / 0.4));
		transform: scale(0.85);
		transition: all 0.6s ease-out;
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
		width: 5rem;
		height: 1.5rem;
		transition: all 0.2s;
	}
</style>
