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
	target?: SelectableKey;
	index?: number;
}
