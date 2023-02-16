<script lang="ts">
	import EditorComponent from '@tinymce/tinymce-svelte';
	import type { Editor } from 'tinymce';
	export let apiKey: string;

	let inputData: string, context: Editor;
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
		plugins: 'quickbars image table editimage autolink link',
		external_plugins: { example: '/editorPlugins/placeholder.js' },
		quickbars_insert_toolbar: false,
		quickbars_selection_toolbar: 'forecolor backcolor | h1 h2 h3 | link  ',
		link_default_target: '_blank',
		browser_spellcheck: true,
		init_instance_callback: (editor: Editor) => {
			context = editor;
			console.log(context);
		}
	};

	const editorID = 'letterWriter';
	function focusInput(wrapper: Element) {
		if (context) {
			console.log(context.hasFocus());
			context.focus();
			console.log(context.hasFocus());
		}
	}

	$: console.log(inputData);
</script>

<main
	on:mouseup={(e) => focusInput(e.currentTarget)}
	class="relative flex flex-col items-center  bg-paper px-40 py-5 min-h-[10vh]"
>
	<span id="toolbar" class="-mt-12 absolute" />
	<EditorComponent {apiKey} {conf} bind:text={inputData} inline={true} id={editorID} />
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
