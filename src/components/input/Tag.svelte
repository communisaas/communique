<script lang="ts">
	export let type: 'text' | 'email', name: string, style: string, tagStyle: string;
	export let tagList: (string | FormDataEntryValue)[] = [];

	let inputVisible: boolean = false;
	let deleteVisible: boolean = false;

	let inputField: HTMLInputElement;
	function addTag(e: Event) {
		if (e.currentTarget == null) return;
		let form = e.currentTarget as HTMLFormElement;
		const data = new FormData(form);
		if ([...data.values()].includes('')) {
			return;
		}
		tagList = [...tagList, ...data.values()];
		form.reset();
	}

	$: if (inputField && inputVisible) inputField.focus();
</script>

<form class={style} on:submit|preventDefault={(e) => addTag(e)}>
	<ul
		class="max-w-fit px-3 py-1 h-full flex flex-row place-items-center justify-center 
		flex-wrap gap-2 rounded bg-larimarGreen-600 shadow-artistBlue shadow-card"
		on:mousedown|preventDefault={(e) => {
			inputVisible = true;
		}}
		on:mouseenter={() => (deleteVisible = true)}
		on:mouseleave={() => (deleteVisible = false)}
	>
		{#each tagList as tag}
			<li class="relative text-xs {tagStyle} group">
				<button
					type="button"
					on:click={() => {
						tagList = tagList.filter((item) => item != tag);
					}}
					class="delete absolute -top-1 -left-2 rounded-full bg-amber-600 w-4 h-4"
					class:show={deleteVisible}
				/>
				{tag}
			</li>
		{/each}

		<li class="flex flex-row place-items-center">
			<input
				{name}
				role="textbox"
				placeholder={name}
				inputmode={type}
				bind:this={inputField}
				on:blur={(e) => {
					inputVisible = false;
					e.currentTarget.value = '';
				}}
				class="space-x-2 rounded h-full bg-larimarGreen-500 shadow-artistBlue shadow-card w-0"
				class:show={inputVisible}
				{type}
			/>
			<button
				on:mousedown|preventDefault|stopPropagation={() => {
					inputVisible = inputVisible ? false : true;
				}}
				type="submit"
				class="flex justify-center items-center relative"
			>
				<slot />
			</button>
		</li>
	</ul>
</form>

<style>
	input {
		opacity: 0;
		transition: opacity 0.25s, width 0.25s;
	}
	.delete {
		opacity: 0;
		transform: scale(0);
		transition: opacity 0.25s, transform 0.25s, visibility 0s 0.25s;
	}
	.delete::before {
		content: '\D7';
		color: #fff;
		font-size: 1rem;
		line-height: 1rem;
		opacity: 95%;
		text-shadow: rgba(0, 0, 0, 0.25) 0px 2px 2px;
	}

	.show {
		visibility: visible;
		opacity: 1;
	}
	input.show {
		width: 5rem;
		transition: opacity 0.25s, width 0.25s;
	}
	.delete.show {
		transform: scale(1);
		transition: opacity 0.25s, transform 0.25s, visibility 0s 0.25s;
	}
</style>
