<script lang="ts">
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import { createEditor, type LexicalEditor } from 'lexical';
	import { registerPlainText } from '@lexical/plain-text';
	import { registerUpdateListener, canShowPlaceholder, currentState } from './editor';

	export let editor: LexicalEditor;

	let root: HTMLDivElement;
	const dispatch = createEventDispatcher();

	const editorID = 'editor';
	let removeUpdateListener: () => void;
	onMount(async () => {
		editor = createEditor({ editable: true });
		editor.setRootElement(document.getElementById(editorID));
		registerPlainText(editor);
		if ($currentState !== null) editor.setEditorState($currentState);

		removeUpdateListener = registerUpdateListener(editor, (domString) => {
			dispatch('update', { domString });
		});
	});

	onDestroy(() => {
		removeUpdateListener();
	});
</script>

<main class="relative flex flex-col w-full h-full items-start bg-artistBlue-600 p-5 md:px-20">
	<div
		bind:this={root}
		contenteditable="true"
		aria-label="Email editor"
		aria-describedby="Write a letter here"
		class="relative w-full self-start bg-artistBlue-600 focus:outline-peacockFeather-500 [&>*[data-placeholder]]:text-paper-500 max-w-7xl text-paper-500 px-1 min-h-[20vh]"
		id={editorID}
	/>
	{#if $canShowPlaceholder}
		<div
			class="absolute pointer-events-none top-5 left-6 w-full h-full flex items-start justify-start cursor-text"
		>
			<p class="text-paper-900 opacity-70 text-base">Write a letter here...</p>
		</div>
	{/if}
</main>

<style lang="scss">
	@import 'editor.css';
</style>
