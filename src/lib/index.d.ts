interface UserState {
	option: Selectable;
	topic: Selectable;
	email: Selectable;
	recipient: Selectable;
	spotlight: Selectable;
	template: Layout;
	loginCallbackURL?: `/${string}`;
	[key: string];
}

interface BigInt {
	toJSON(): string;
}
