import colors from '$lib/ui/colors';
import type { BlockToolData } from '@editorjs/editorjs';

export class Signature {
	static get toolbox() {
		return {
			title: 'Signature',
			icon: '<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-66 39v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/></svg>'
		};
	}

	render() {
		// Create a container element
		const container = document.createElement('div');
		container.style.fontFamily = 'Arial, sans-serif';
		container.tabIndex = 0; // Make the container focusable

		// Add the sender's name placeholder
		const senderName = this.createPlaceholder('senderName', '*your name*');
		container.appendChild(senderName);

		// Add a line break
		container.appendChild(document.createElement('br'));

		// Add the sender's address placeholder
		const senderAddress = this.createPlaceholder('senderAddress', '*your address*');
		container.appendChild(senderAddress);

		// Add keydown event listener to the container
		container.addEventListener('keydown', (e) => {
			if (e.key === 'Backspace') {
				const focusedElement = document.activeElement;
				if (focusedElement && focusedElement.tagName === 'SPAN') {
					e.preventDefault();
					// Check if the previous sibling is a line break and remove it
					const previousSibling = focusedElement.previousSibling;
					if (previousSibling && previousSibling.nodeName === 'BR') {
						previousSibling.remove();
					}
					focusedElement.remove();
				}
			}
		});

		return container;
	}

	createPlaceholder(id: string, text: string) {
		const element = document.createElement('span');
		element.id = id;
		element.textContent = text;
		element.style.fontStyle = 'italic';
		element.style.opacity = '0.6';
		element.style.cursor = 'text';
		if (id === 'senderAddress') element.tabIndex = -1; // Make the span focusable

		// Style for focus outline
		element.style.outline = 'none'; // Remove default outline
		element.style.border = '1px solid transparent'; // Prevent layout shift on focus
		element.addEventListener('focus', () => {
			element.style.border = `2px solid ${colors.larimarGreen[500]}`;
			element.style.borderRadius = '4px';
		});
		element.addEventListener('blur', () => {
			element.style.border = '1px solid transparent'; // Remove outline on blur
		});

		return element;
	}

	save(blockContent: BlockToolData) {
		// Return the inner HTML of the container
		return { html: blockContent.innerHTML };
	}
}
