export function updateFocusableElements(focusableContainer: HTMLElement) {
	// Helper function to check if an element is focusable
	function isFocusable(element: HTMLElement) {
		if (
			element.tabIndex > -1 ||
			(element.hasAttribute('tabindex') && element.getAttribute('tabindex') !== '-1')
		) {
			return true;
		}
		const focusableSelectors =
			'a, button, textarea, input, select, [tabindex]:not([tabindex="-1"])';
		return element.matches(focusableSelectors);
	}

	// Helper function to get focusable elements, including checking children of unfocusable elements
	function getFocusableElements(parent: HTMLElement) {
		const focusableElements: HTMLElement[] = [];
		for (const child of parent.children) {
			if (isFocusable(child as HTMLElement)) {
				focusableElements.push(child as HTMLElement);
			} else {
				// If the child itself is not focusable, check its children
				focusableElements.push(...getFocusableElements(child as HTMLElement));
			}
		}
		return focusableElements;
	}

	const focusableElements = getFocusableElements(focusableContainer);
	const firstFocusableElement = focusableElements[0];
	const lastFocusableElement = focusableElements[focusableElements.length - 1];

	return [focusableElements, firstFocusableElement, lastFocusableElement];
}

export function trapFocus(e: KeyboardEvent, focusableElements: HTMLElement[]) {
	if (e.key === 'Tab') {
		e.preventDefault();

		const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement);
		let nextIndex;

		if (e.shiftKey) {
			// SHIFT + TAB
			// Subtract 1 from the index, add the length (to avoid a negative index), then apply the modulus operator
			nextIndex = (currentIndex - 1 + focusableElements.length) % focusableElements.length;
		} else {
			// TAB
			// Add 1 to the index then apply the modulus operator
			nextIndex = (currentIndex + 1) % focusableElements.length;
		}

		focusableElements[nextIndex].focus();
	}
}

export function getFlagEmoji(countryCode: string): string {
	if (countryCode.length !== 2 || !/^[A-Z]{2}$/.test(countryCode)) {
		throw new Error('Invalid country code');
	}

	const offset = 0x1f1e6;
	const chars = Array.from(countryCode).map((c) =>
		String.fromCodePoint(c.charCodeAt(0) - 65 + offset)
	);
	return chars.join('');
}
