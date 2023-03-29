interface LayoutSchema {
	loudestTopics: topic[];
	template: Panel[];
}

interface HomeSchema extends LayoutSchema {}

interface Expandable {
	type: 'panel';
}

interface Panel extends Expandable {
	header: string;
	selectable: SelectableKey;
	alignment: 'start' | 'end' | 'left' | 'right' | 'center' | 'justify' | 'match-parent';
	cardList: email[];
}

type SelectableKey = 'email' | 'topic' | 'recipient' | 'spotlight';
interface Selectable {
	name: string;
	type: SelectableKey;
	index?: number;
}

interface UserState {
	topic: Selectable;
	email: Selectable;
	recipient: Selectable;
	spotlight: Selectable;
	[key: string];
}
