import { writable, type Writable } from 'svelte/store';

// Check if sessionStorage is defined and get stored value if it is
const stored: string = typeof sessionStorage !== 'undefined' ? sessionStorage.communique : null;

export const store: Writable<UserState> = writable(stored ? JSON.parse(stored) : ({} as UserState));

// patch BigInt to serialize JSON as string
BigInt.prototype.toJSON = function (): string {
	return this.toString();
};

store.subscribe((updated) => {
	// Check if sessionStorage is defined before trying to set an item
	if (typeof sessionStorage !== 'undefined') {
		sessionStorage.communique = JSON.stringify(updated);
	}
});
