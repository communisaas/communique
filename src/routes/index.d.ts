interface LayoutSchema {
	topicList: topic[];
}

interface HomeSchema {
	emailList: email[];
}

interface Selectable {
	name: string;
	type: 'email' | 'topic' | 'address';
	index?: number;
}

interface CommuniqueLocalStorage {
	topic: Selectable;
	email: Selectable;
}
