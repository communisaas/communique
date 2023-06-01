export default function modal(node: HTMLElement) {
	const modalRoot = document.getElementById('modal-root');

	modalRoot?.appendChild(node);

	return {
		destroy() {
			if (modalRoot?.contains(node)) {
				modalRoot.removeChild(node);
			}
		}
	};
}
