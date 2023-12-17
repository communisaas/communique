<script lang="ts">
	import { onMount } from 'svelte';
	import Paragraph from '@editorjs/paragraph';
	import type EditorJS from '@editorjs/editorjs';
	import { Signature } from './editorPlugins/signature';

	export let editor: EditorJS;

	const editorID = 'editor';
	onMount(async () => {
		const EditorJS = await import('@editorjs/editorjs').then((m) => m.default);
		editor = new EditorJS({
			holder: editorID,
			hideToolbar: true,
			placeholder: 'Write a letter here...',
			tools: {
				paragraph: {
					class: Paragraph,
					inlineToolbar: false
				},
				signature: {
					class: Signature,
					inlineToolbar: false
				}
			}
		});
	});
</script>

<main
	aria-label="Email editor"
	aria-describedby="Write your email here"
	class="relative flex flex-col w-full h-full items-start bg-artistBlue-600 p-5 md:px-20"
>
	<div
		aria-label="Email editor"
		aria-describedby="Write your email here"
		class="relative w-full self-start bg-artistBlue-600 [&>*[data-placeholder]]:text-paper-500 max-w-7xl text-paper-500 px-5 min-h-[20vh]"
		id="editor"
	/>
</main>

<style lang="scss">
	@import 'editor.css';
</style>
