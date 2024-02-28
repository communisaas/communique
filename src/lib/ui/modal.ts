import { goto, replaceState } from '$app/navigation';
import type { Writable } from 'svelte/store';
import { signOut } from '@auth/sveltekit/client';

import Reader from '$components/popover/Reader.svelte';
import Share from '$components/popover/Share.svelte';
import Login from '$components/popover/Login.svelte';
import AfterPost from '$components/popover/AfterPost.svelte';
import Confirm from '$components/popover/Confirm.svelte';
import type { LayoutServerLoad } from '../../routes/$types';

export default function modal(node: HTMLElement) {
	const modalRoot = document.getElementById('modal-root');
	modalRoot?.appendChild(node);

	return {
		destroy() {
			if (modalRoot?.contains(node)) {
				modalRoot.removeChild(node);
			}
		}
	};
}

export function handlePopover(
	e: CustomEvent<boolean>,
	sessionStore: Writable<UserState>,
	modal: keyof ModalState,
	callback: `/${string}`
) {
	sessionStore.update((currentValue: UserState) => ({
		...currentValue,
		show: {
			...currentValue.show,
			[modal]: e.detail
		}
	}));

	if (!e.detail) {
		// close popover, go to callback path
		replaceState(callback, history.state);
	}
}

export const getModalMap = (sessionStore: UserState, pageData: LayoutSchema) => {
	return {
		confirm: {
			component: Confirm,
			props: () => ({
				advisoryText:
					'To delete your account, type your email address below to confirm. Some data might be retained, like message counts, in addition to personal info according to local laws.',
				inputToConfirm: sessionStore.user?.email,
				action: async (e: SubmitEvent) => {
					const response = await fetch('/data/user/' + sessionStore.user?.email, {
						method: 'DELETE',
					});
					if (response.status !== 200) {
						throw new Error(`Could not delete user: (${response.status}) ${response.statusText}`);
					} else {
						signOut({ callbackUrl: '/', redirect: false });
					}
				}
			})
		},
		share: { component: Share, props: () => ({ item: sessionStore.email.content }) },
		login: { component: Login, props: () => ({ providers: pageData.authProviders }) },
		privacyPolicy: {
			component: Reader,
			props: () => ({ item: pageData.privacyPolicy, inModal: true })
		},
		moderationPolicy: {
			component: Reader,
			props: () => ({ item: pageData.moderationPolicy, inModal: true })
		},
		termsOfUse: {
			component: Reader,
			props: () => ({ item: pageData.termsOfUse, inModal: true })
		},
		afterPost: {
			component: AfterPost,
			props: () => ({ postID: sessionStore.postID })
		}
	};
};
