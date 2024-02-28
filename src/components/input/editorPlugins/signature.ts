import { ElementNode, LineBreakNode, TextNode, type LexicalNode } from 'lexical';

export class SignatureNameNode extends TextNode {
	static getType(): string {
		return 'signature-name-node';
	}

	static clone(node: SignatureNameNode): SignatureNameNode {
		return new SignatureNameNode(node.__text, node.__key);
	}
}

export class SignatureNode extends ElementNode {
	__salutation: string;
	__name: string;
	__location: string;
	__showLocation: boolean;

	constructor(
		salutation: string,
		name: string,
		location: string,
		showLocation: boolean,
		key?: string
	) {
		super(key);
		this.__salutation = salutation;
		this.__name = name;
		this.__location = location;
		this.__showLocation = showLocation;
	}

	static getType(): string {
		return 'signature-node';
	}

	static clone(node: SignatureNode): SignatureNode {
		return new SignatureNode(
			node.__salutation,
			node.__name,
			node.__location,
			node.__showLocation,
			node.__key
		);
	}

	createDOM(): HTMLElement {
		const dom = document.createElement('div');
		dom.id = 'signature';
		return dom;
	}

	updateDOM(prevNode: SignatureNode, dom: HTMLElement): boolean {
		// Returning false tells Lexical that this node does not need its
		// DOM element replacing with a new copy from createDOM.
		if (
			prevNode.__salutation !== this.__salutation ||
			prevNode.__name !== this.__name ||
			prevNode.__location !== this.__location ||
			prevNode.__showLocation !== this.__showLocation
		) {
			return true;
		}
		return false;
	}

	appendSignatureLines() {
		const salutationNode = new TextNode(this.__salutation);
		this.append(salutationNode);
		this.append(new LineBreakNode());

		const nameNode = new SignatureNameNode(this.__name).setMode('token');
		this.append(nameNode);
		this.append(new LineBreakNode());

		if (this.__showLocation) {
			const locationNode = new TextNode(this.__location).setMode('token');
			this.append(locationNode);
		}
	}
}

export function $createSignatureNode(
	salutation: string,
	name: string,
	location: string,
	includeLocation: boolean
): SignatureNode {
	const signatureNode = new SignatureNode(salutation, name, location, includeLocation);
	signatureNode.appendSignatureLines();
	return signatureNode;
}
