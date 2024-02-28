interface Expandable {
	type: 'panel';
}

interface Panel extends Expandable {
	header: string;
	focus: Descriptor<string>;
	alignment: 'start' | 'end' | 'left' | 'right' | 'center' | 'justify' | 'match-parent';
	cardList: email[] | null;
}

type SelectableKey = 'option' | 'email' | 'topic' | 'recipient' | 'spotlight';
interface Selectable {
	id: string;
	type: SelectableKey;
	target?: SelectableKey;
	index?: number;
	content?: email;
	[key: string];
}

interface MenuItemClickArgs {
	event?: MouseEvent | KeyboardEvent;
	focusableElements?: HTMLElement[];
}

type MenuItem = {
	name: string;
	key: string;
	class: string;
	show: boolean;
	actionToggled: boolean;
	actionComponent: { component: SvelteComponent; props: props } | undefined;
	onClick: (MenuItemClickArgs?) => void;
};

interface SettablePage {
	show: boolean;
	class: string;
	onSubmit: (e: FormEventHandler<HTMLInputElement>) => Promise<unknown>;
	onLoad?: () => void;
	items: Settable[];
}
interface Settable {
	name: string;
	description: string;
	label: string;
	labelStyle: string;
	class: string;
	value?: string | boolean | number;
	placeholder?: string;
	maxLength?: number;
	type:
		| radio
		| checkbox
		| text
		| textarea
		| select
		| number
		| date
		| time
		| datetime
		| email
		| url
		| search
		| tel
		| color
		| 'menuitem';
	key: string;
	onUpdate: (e: FormEventHandler<HTMLInputElement>) => void;
	onFocus?: (e: FocusEvent) => void;
	onLoad?: () => void;
}

interface Props {
	[key: string]: unknown;
}

// load props from a function that runs after the component mounts
type ComponentProps = () => Props;

interface ButtonElementMap {
	[key: string]: HTMLButtonElement;
}

interface FlagMap {
	[key: string]: boolean;
}
