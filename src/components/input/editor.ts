import { $generateHtmlFromNodes } from '@lexical/html';
import { $canShowPlaceholder } from '@lexical/text';
import { $getRoot, type EditorState, type LexicalEditor, type LexicalNode } from 'lexical';
import { writable } from 'svelte/store';
import { $createSignatureNode } from './editorPlugins/signature';

export function registerUpdateListener(
	editor: LexicalEditor,
	htmlTextUpdateHandler: (text: string) => void,
	updateCallback: (args: unknown) => void
) {
	return editor.registerUpdateListener(({ editorState }) => {
		// The latest EditorState can be found as `editorState`.
		// To read the contents of the EditorState, use the following API:
		editorState.read(() => {
			// Just like editor.update(), .read() expects a closure where you can use
			// the $ prefixed helper functions.
			htmlTextUpdateHandler($generateHtmlFromNodes(editor));
			canShowPlaceholder.set($canShowPlaceholder(editor.isComposing()));
			currentState.set(editor.getEditorState());
			updateCallback({ editorState });
		});
	});
}

export function addSignature(
	editor: LexicalEditor,
	salutation: string,
	name: string,
	address: string,
	showAddress: boolean
) {
	const signatureNode = $createSignatureNode(salutation, name, address, showAddress);
	$getRoot().append(signatureNode);
}

export function isNodeTypePresent(nodeConstructor: LexicalNode) {
	let isPresent = false;

	// Recursively check each descendant node
	function checkDescendants(node: LexicalNode) {
		if (node.getType() === nodeConstructor.getType()) {
			isPresent = true;
			return; // Early exit if the node is found
		}
		// Iterate over children for deeper search
		if (typeof node.getChildren === 'function') node.getChildren().forEach(checkDescendants);
	}

	const root = $getRoot(); // Get the root node of the editor
	checkDescendants(root);

	return isPresent;
}

export function removeNodeType(nodeConstructor: LexicalNode) {
	// Recursively check each descendant node
	function checkDescendants(node: LexicalNode) {
		if (node.getType() === nodeConstructor.getType()) {
			node.remove();
		}
		// Iterate over children for deeper search
		if (typeof node.getChildren === 'function') node.getChildren().forEach(checkDescendants);
	}

	const root = $getRoot(); // Get the root node of the editor
	checkDescendants(root);
}

export const canShowPlaceholder = writable(true);
export const currentState = writable(null as EditorState | null);
