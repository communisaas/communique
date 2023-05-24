export default function portal(node: HTMLElement) {
	const portalRoot = document.getElementById('portal-root');

	portalRoot?.appendChild(node);

	return {
		destroy() {
			if (portalRoot?.contains(node)) {
				portalRoot.removeChild(node);
			}
		}
	};
}
