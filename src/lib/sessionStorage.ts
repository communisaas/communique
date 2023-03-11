import { writable, type Writable } from 'svelte/store';

const stored: string = sessionStorage.communique;

export const store: Writable<UserState> = writable(stored ? JSON.parse(stored) : ({} as UserState));

store.subscribe((updated) => (sessionStorage.communique = JSON.stringify(updated)));
