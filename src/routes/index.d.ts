interface LayoutSchema {
	loudestTopics: topic[];
	template: Layout;
}

interface Layout {
	primary: Panel;
	secondary: Panel;
	[key: string];
}
