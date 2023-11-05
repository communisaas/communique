<script lang="ts">
	import { onMount } from 'svelte';
	import Paragraph from '@editorjs/paragraph';
	import type EditorJS from '@editorjs/editorjs';

	export let editor: EditorJS;

	const editorID = 'editor';
	onMount(async () => {
		const EditorJS = await import('@editorjs/editorjs').then((m) => m.default);
		editor = new EditorJS({
			holder: editorID,
			hideToolbar: true,
			placeholder: 'Write me a letter...',
			tools: {
				paragraph: {
					class: Paragraph,
					config: { placeholder: 'Write me a letter...' },
					inlineToolbar: false
				}
			}
		});
	});
</script>

<main
	aria-label="Email editor"
	aria-describedby="Write your email here"
	class="relative flex flex-col items-center bg-artistBlue-600 p-5"
>
	<span id="toolbar" class="-mt-12 absolute" />
	<div
		aria-label="Email editor"
		aria-describedby="Write your email here"
		class="relative w-full h-full bg-artistBlue-600 [&>*[data-placeholder]]:text-paper-500 text-paper-500 px-5 min-h-[20vh]"
		id="editor"
	/>
</main>

<style lang="scss">
	:global(.codex-editor ::selection) {
		background-color: theme('colors.artistBlue.500');
	}
	:global(.codex-editor__redactor) {
		padding: 0 !important;
	}
	:global(
			.codex-editor--empty .ce-block:first-child .ce-paragraph[data-placeholder]:empty::before
		) {
		color: theme('colors.artistBlue.500');
	}
	:global(.ce-toolbar__plus, .ce-toolbar__settings-btn) {
		color: theme('colors.larimarGreen.600');
	}
	:global(.ce-toolbar__plus:hover, .ce-toolbar__settings-btn:hover) {
		background-color: theme('colors.peacockFeather.700');
	}

	:global(.ce-block--selected .ce-block__content) {
		background-color: theme('colors.peacockFeather.700');
		border-left: 0.45rem solid theme('colors.peacockFeather.700');
	}
	:global(.ce-popover) {
		background: theme('colors.peacockFeather.500');
		border-color: theme('colors.larimarGreen.700');
	}
	:global(.ce-popover-item) {
		color: theme('colors.paper.700');
	}
	:global(.ce-popover-item__icon) {
		background: theme('colors.peacockFeather.500');
	}
	:global(.ce-popover-item:hover:not(.ce-popover-item--no-hover)) {
		background: theme('colors.larimarGreen.700');
	}
	:global(.cdx-search-field__icon svg, .cdx-search-field__input::placeholder) {
		color: theme('colors.peacockFeather.500');
	}
</style>
