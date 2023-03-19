<script lang="ts">
	import Editor from '@tinymce/tinymce-svelte';
	import type { Writable } from 'svelte/types/runtime/store';
	import type { Editor as EditorComponent } from 'tinymce';

	export let apiKey: string = '';
	export let content: Writable<string>;

	let context: EditorComponent;

	const conf = {
		placeholder: 'Write me a letter...',
		menubar: false,
		contextmenu: 'blocks | forecolor backcolor | link copy cut paste',
		toolbar: [
			{ name: 'formatting', items: ['bold', 'italic', 'underline'] },
			{ name: 'font', items: ['fontfamily'] },
			{ name: 'color', items: ['forecolor', 'backcolor'] },
			{ name: 'alignment', items: ['alignleft', 'aligncenter', 'alignright', 'alignjustify'] },
			{ name: 'media', items: ['link', 'table', 'image', 'example'] }
		],
		toolbar_persist: true,
		toolbar_mode: 'sliding',
		fixed_toolbar_container: '#toolbar',
		statusbar: true,
		plugins: 'quickbars image table autolink link autosave',
		// TODO implement template strings
		// external_plugins: { example: '/editorPlugins/placeholder.js' },
		quickbars_insert_toolbar: false,
		quickbars_selection_toolbar: 'forecolor backcolor | h1 h2 h3 | link  ',
		link_default_target: '_blank',
		browser_spellcheck: true,
		init_instance_callback: (editor: EditorComponent) => {
			context = editor;
		}
	};

	const editorID = 'body';
</script>

<main
	on:mouseup={(e) => e.currentTarget.focus()}
	class="relative flex flex-col items-center  bg-paper-500 px-40 py-5 min-h-[10vh]"
>
	<span id="toolbar" class="-mt-12 absolute" />
	<Editor
		on:change={() => context.save()}
		{apiKey}
		{conf}
		bind:text={$content}
		inline={true}
		id={editorID}
	/>
</main>

<style>
	:global(.tox-editor-header) {
		box-shadow: rgba(0, 0, 0, 0.16) 0px 2px 4px !important;
		transition: box-shadow 0.2s ease-out;
	}
	:global(.tox-editor-header:hover) {
		box-shadow: rgba(0, 0, 0, 0.16) 0px 4px 10px !important;
		transition: box-shadow 0.2s ease-in;
	}
	:global(.tinymce-wrapper) {
		padding-top: 1rem;
	}
	:global(.mce-content-body) {
		min-height: 10rem;
		min-width: 55vw;
	}
</style>
