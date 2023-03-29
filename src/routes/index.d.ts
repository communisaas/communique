interface LayoutSchema {
	loudestTopics: topic[];
	template: Layout;
}

interface Layout {
	primary: Panel;
	secondary: Panel;
}

interface HomeSchema extends LayoutSchema {}

interface Expandable {
	type: 'panel';
}

interface Panel extends Expandable {
	header: string;
	focus: SelectableKey;
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
	template: Layout;
	[key: string];
}
