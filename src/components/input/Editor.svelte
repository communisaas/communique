<script lang="ts">
	import { onMount } from 'svelte';
	import type { Writable } from 'svelte/types/runtime/store';
	import Paragraph from '@editorjs/paragraph';

	export let apiKey: string = '';
	export let content: Writable<string>;

	let context: EditorComponent;

	// const conf = {
	// 	placeholder: 'Write me a letter...',
	// 	menubar: false,
	// 	contextmenu: 'blocks | forecolor backcolor | link copy cut paste',
	// 	toolbar: [
	// 		{ name: 'formatting', items: ['bold', 'italic', 'underline'] },
	// 		{ name: 'font', items: ['fontfamily'] },
	// 		{ name: 'color', items: ['forecolor', 'backcolor'] },
	// 		{ name: 'alignment', items: ['alignleft', 'aligncenter', 'alignright', 'alignjustify'] },
	// 		{ name: 'media', items: ['link', 'table', 'image', 'example'] }
	// 	],
	// 	toolbar_persist: true,
	// 	toolbar_mode: 'sliding',
	// 	fixed_toolbar_container: '#toolbar',
	// 	statusbar: true,
	// 	plugins: 'quickbars image table autolink link autosave',
	// 	// TODO implement template strings
	// 	// external_plugins: { example: '/editorPlugins/placeholder.js' },
	// 	quickbars_insert_toolbar: false,
	// 	quickbars_selection_toolbar: 'forecolor backcolor | h1 h2 h3 | link  ',
	// 	link_default_target: '_blank',
	// 	browser_spellcheck: true,
	// 	init_instance_callback: (editor: EditorComponent) => {
	// 		context = editor;
	// 	}
	// };

	const editorID = 'editor';
	let editor;
	let editorDiv: HTMLDivElement;
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
	on:click={(e) => e.currentTarget.focus()}
	on:keypress={(e) => e.currentTarget.focus()}
	aria-label="Email editor"
	aria-describedby="Write your email here"
	class="relative flex flex-col items-center bg-artistBlue-600 p-5 min-h-[10vh]"
>
	<span id="toolbar" class="-mt-12 absolute" />
	<div
		on:click={(e) => e.currentTarget.focus()}
		on:keypress={(e) => e.currentTarget.focus()}
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
