import colors from '$lib/ui/colors';
import type { BlockToolData } from '@editorjs/editorjs';

export class Signature {
	static get toolbox() {
		return {
			title: 'Signature',
			icon: '<svg width="25" height="28" viewBox="0 0 25 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 22L6.44609 18.6258C6.87107 17.6342 8.33485 17.8463 8.46091 18.9177V18.9177C8.69916 20.9428 11.0491 21.9409 12.6719 20.7062L14.6876 19.1725C15.2209 18.7667 15.9481 18.7282 16.5214 19.0754L20.3836 21.4151C21.7299 22.2306 23.4854 21.5967 24 20.1091V20.1091" stroke="#D7FEF0" stroke-width="1.5"/><path d="M2 2H21V16H22V1H1V27H22V26H2V2Z" stroke="#D7FEF0"/><line x1="4" y1="5.75" x2="6" y2="5.75" stroke="#D7FEF0" stroke-width="2.5"/><line x1="12" y1="5.75" x2="17" y2="5.75" stroke="#D7FEF0" stroke-width="2.5"/><line x1="7" y1="5.75" x2="11" y2="5.75" stroke="#D7FEF0" stroke-width="2.5"/></svg>'
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
