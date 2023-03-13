interface LayoutSchema {
	loudestTopics: topic[];
}

interface HomeSchema {
	templateList: Panel[];
}

interface Expandable {
	type: 'panel';
}

type SelectableKey = 'email' | 'topic' | 'recipient' | 'spotlight';
interface Panel extends Expandable {
	header: string;
	selectableName: SelectableKey;
	alignment: 'start' | 'end' | 'left' | 'right' | 'center' | 'justify' | 'match-parent';
	cardList: email[];
}

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
	[key: SelectableKey];
}
