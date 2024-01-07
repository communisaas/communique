import { $canShowPlaceholder } from '@lexical/text';
import type { EditorState, LexicalEditor } from 'lexical';
import { writable } from 'svelte/store';

export function registerUpdateListener(
	editor: LexicalEditor,
	plainTextUpdateHandler: (text: string) => void
) {
	return editor.registerUpdateListener(({ editorState }) => {
		// The latest EditorState can be found as `editorState`.
		// To read the contents of the EditorState, use the following API:

		console.log(editorState);

		editorState.read(() => {
			// Just like editor.update(), .read() expects a closure where you can use
			// the $ prefixed helper functions.
			plainTextUpdateHandler('');
			canShowPlaceholder.set($canShowPlaceholder(editor.isComposing()));
			currentState.set(editor.getEditorState());
		});
	});
}

export const canShowPlaceholder = writable(true);
export const currentState = writable(null as EditorState | null);
