interface LayoutSchema {
	loudestTopics: topic[];
	template: Layout;
	authProviders: AuthSchema;
	privacyPolicy: Document;
	moderationPolicy: Document;
	termsOfUse: Document;
}

interface Layout {
	primary: Panel;
	secondary: Panel;
	[key: string];
}

interface ModalMap {
	[key: keyof ModalState]: { component: ComponentType; props: ComponentProps };
}

interface Descriptor<T> {
	type: string;
	item: T;
	field?: string;
	source?: string;
	iterable?: boolean;
	rank?: number;
}

declare module 'svelte-content-loader';
