import { writable, type Writable } from 'svelte/store';

const stored: string = localStorage.communique;

export const store: Writable<CommuniqueLocalStorage> = writable(
	stored ? JSON.parse(stored) : ({} as CommuniqueLocalStorage)
);

store.subscribe((updated) => (localStorage.communique = JSON.stringify(updated)));
