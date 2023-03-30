import { writable, type Writable } from 'svelte/store';

const stored: string = sessionStorage.communique;

export const store: Writable<UserState> = writable(stored ? JSON.parse(stored) : ({} as UserState));

// patch BigInt to serialize JSON as string
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: Unreachable code error
BigInt.prototype.toJSON = function (): string {
	return this.toString();
};

store.subscribe((updated) => (sessionStorage.communique = JSON.stringify(updated)));