<script lang="ts">
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import { createEditor, TextNode, type LexicalEditor } from 'lexical';
	import { registerPlainText } from '@lexical/plain-text';
	import { registerUpdateListener, canShowPlaceholder, currentState } from './editor';
	import { SignatureNameNode, SignatureNode } from './editorPlugins/signature';

	export let editor: LexicalEditor;
	export let style = '';

	let root: HTMLDivElement;
	const dispatch = createEventDispatcher();

	const editorID = 'editor';
	let removeUpdateListener: () => void;
	let removePlainTextListener: () => void;
	onMount(async () => {
		editor = createEditor({ editable: true, nodes: [TextNode, SignatureNode, SignatureNameNode] });
		if ($currentState !== null) editor.setEditorState($currentState);
		editor.setRootElement(document.getElementById(editorID));

		removePlainTextListener = registerPlainText(editor);
		removeUpdateListener = registerUpdateListener(
			editor,
			(domString) => {
				dispatch('change', { domString });
			},
			(state) => {
				dispatch('update', { state });
			}
		);
	});

	onDestroy(() => {
		removeUpdateListener();
		removePlainTextListener();
	});
</script>

<main class="relative flex flex-col w-full h-full items-start bg-artistBlue-600 p-5 md:px-20">
	<div
		bind:this={root}
		contenteditable="true"
		aria-label="Email editor"
		aria-describedby="Write a letter here"
		class="relative w-full self-start bg-artistBlue-600 focus:outline-none [&>*[data-placeholder]]:text-paper-500 max-w-7xl text-paper-500 px-1 min-h-[20vh] {style}"
		id={editorID}
	/>
	{#if $canShowPlaceholder}
		<p class="absolute px-1 text-paper-900 opacity-70 text-base">Write a letter here...</p>
	{/if}
	<slot />
</main>

<style lang="scss">
	@import 'editor.css';
</style>
