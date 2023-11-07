<script lang="ts">
	import TagInput from '$components/input/Tag.svelte';
	import Editor from '$components/input/Editor.svelte';
	import AddRecipient from '$components/icon/Recipient.svelte';
	import AddTopic from '$components/icon/Topic.svelte';
	import Post from '$components/icon/Post.svelte';
	import Reader from '$components/Reader.svelte';

	import { writable, type Writable } from 'svelte/store';
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { createEventDispatcher, onMount } from 'svelte';
	import Modal from '$components/Modal.svelte';
	import modal, { handlePopover } from '$lib/ui/modal';
	import type EditorJS from '@editorjs/editorjs';
	import { handleAutocomplete } from '$lib/data/select';
	import { invalidateAll } from '$app/navigation';

	let postButtonHovered = writable(false);
	let sessionStore: Writable<UserState>;

	const dispatch = createEventDispatcher();

	let recipientEmails = [] as Descriptor<string>[];
	let topics = [] as Descriptor<string>[];

	let suggestedRecipientEmails = [] as Descriptor<string>[];
	let suggestedTopics = [] as Descriptor<string>[];

	let editor: EditorJS;
	let topicInput: HTMLInputElement;
	let recipientInput: HTMLInputElement;
	onMount(async () => {
		sessionStore = (await import('$lib/data/sessionStorage')).store;
	});

	let modalMapping: ModalMap = {
		privacyPolicy: {
			component: Reader,
			props: () => ({ item: $page.data.privacyPolicy, inModal: true })
		},
		moderationPolicy: {
			component: Reader,
			props: () => ({ item: $page.data.moderationPolicy, inModal: true })
		},
		termsOfUse: {
			component: Reader,
			props: () => ({ item: $page.data.termsOfUse, inModal: true })
		}
	};
</script>

<svelte:head>
	<title>Compose | Communique</title>
	<meta name="description" content="Write & share email templates!" />
</svelte:head>

<section class="pt-4 min-h-screen">
	<h1 class="text-paper-500 text-left ml-20 pb-5">email composer</h1>
	<form
		class="flex flex-col gap-y-5 rounded-full"
		method="POST"
		action="?/publish"
		aria-label="Compose form"
		aria-describedby="Add topics, recipients, a subject line, and email body here"
		use:enhance={async ({ formData, action, cancel, submitter }) => {
			// `formData` is its `FormData` object that's about to be submitted
			// `action` is the URL to which the form is posted
			// `cancel()` will prevent the submission
			if (!submitter) throw Error('No submitter element found');
			const initialSubmitterState = submitter.innerHTML;

			let composerData = await editor.save();

			formData.set('body', JSON.stringify(composerData));
			formData.set('author_email', $sessionStore.user.email);

			// validate email length
			let runningBodyLength = 0;
			for (const block of composerData.blocks) {
				runningBodyLength += block.data.text.length;
			}
			if (runningBodyLength < 250) {
				submitter.innerHTML = `Email has ${runningBodyLength} characters... Try for at least 250.`;
				setTimeout(() => {
					if (submitter && initialSubmitterState) submitter.innerHTML = initialSubmitterState;
				}, 5000);
				return;
			}

			// validate metadata fields
			if (recipientEmails.length <= 0 || topics.length <= 0) {
				if (recipientEmails.length <= 0) recipientInput.reportValidity();
				if (topics.length <= 0) topicInput.reportValidity();
				return;
			}

			for (const [tagName, list] of Object.entries({
				recipient_list: recipientEmails,
				topic_list: topics
			})) {
				const listValues = list.map((entry) => entry.item);
				formData.set(tagName, listValues.join('␞'));
			}

			// TODO validate & sanitize email body, use openAI moderation API + cheapest model to generate a shortID

			// const webProfile = (
			// 	await FingerprintJS.load({
			// 		apiKey: data.profilerKey,
			// 		endpoint: data.profilerURL,
			// 		scriptUrlPattern: data.profilerScriptURL
			// 	})
			// ).get();

			// post.set('profileRequestID', (await webProfile).requestId);

			return async ({ result, update }) => {
				console.log(result);
				if (result.status == 200) {
					// TODO submit confirmation
					recipientEmails = [];
					topics = [];
					update();
					invalidateAll();
				} else {
					// TODO present server-side submission errors
					console.error(result);
					if (submitter) submitter.innerHTML = "Error!! We're working on it.";
					setTimeout(() => {
						if (submitter && initialSubmitterState) submitter.innerHTML = initialSubmitterState;
					}, 5000);
				}

				// `result` is an `ActionResult` object
				// `update` runs default reset after form submission
			};
		}}
	>
		<div class="ml-20 mr-20 flex flex-col w-fit h-full max-md:w-18 gap-x-20 gap-y-3">
			<span class="flex flex-row flex-wrap gap-5 mr-4">
				<TagInput
					bind:tagList={recipientEmails}
					bind:inputField={recipientInput}
					autocomplete={false}
					allowCustomValues={true}
					type="email"
					name="recipient"
					searchField="recipient"
					placeholder="Recipient"
					style="h-14 w-fit bg-peacockFeather-700"
					inputStyle="bg-artistBlue-700 text-paper-500"
					tagStyle="text-xs px-1 py-1 rounded bg-peacockFeather-600 text-paper-500 m-2 w-fit"
					inputVisible={true}
					bind:searchResults={suggestedRecipientEmails}
					on:autocomplete={async (e) => {
						suggestedRecipientEmails = await handleAutocomplete(e);
					}}
				>
					<icon class="w-12 inline-block m-1"><AddRecipient /></icon>
				</TagInput>
				<TagInput
					bind:tagList={topics}
					bind:inputField={topicInput}
					autocomplete={true}
					allowCustomValues={true}
					type="text"
					name="topic"
					searchField="topic"
					placeholder="Topic"
					style="h-14 w-fit bg-peacockFeather-700"
					inputStyle="bg-artistBlue-700 text-paper-500"
					tagStyle="text-xs px-1 py-1 rounded bg-peacockFeather-500 text-paper-500 m-2 w-fit"
					inputVisible={true}
					autocompleteStyle="right-0"
					bind:searchResults={suggestedTopics}
					on:autocomplete={async (e) => {
						suggestedTopics = await handleAutocomplete(e);
					}}
				>
					<icon class="w-12 inline-block m-1"><AddTopic /></icon>
				</TagInput>
			</span>

			<span class="px-1 py-1 w-fit rounded bg-peacockFeather-700">
				<input
					required
					autocomplete="off"
					type="text"
					aria-label="Subject line"
					aria-describedby="Enter a subject line for your email"
					on:keypress={(e) => {
						if (e.key == 'Enter') {
							e.preventDefault();
						}
					}}
					name="subject"
					placeholder="Subject"
					class="w-42 h-fit p-0.5 bg-artistBlue-700 text-paper-500 rounded"
				/>
			</span>
		</div>

		<span class="py-8">
			<Editor bind:editor />
		</span>

		<button
			type="submit"
			name="post"
			title="Post"
			class="flex flex-row items-center gap-4 ml-20 px-3 py-2 w-min min-w-fit h-14 rounded bg-peacockFeather-700 text-white"
			aria-label="Post button"
			on:mouseenter={() => ($postButtonHovered = true)}
			on:touchstart={() => ($postButtonHovered = true)}
			on:focus={() => ($postButtonHovered = true)}
			on:mouseleave={() => ($postButtonHovered = false)}
			on:touchend={() => ($postButtonHovered = false)}
			on:blur={() => ($postButtonHovered = false)}
		>
			<span class="w-16 -mr-2"><Post hovered={$postButtonHovered} /></span>
			Post
		</button>
	</form>
</section>

{#if $sessionStore && $sessionStore.hasOwnProperty('show')}
	<div use:modal>
		{#each Object.keys($sessionStore.show) as modal (modal)}
			{#if $sessionStore.show[modal] && modalMapping.hasOwnProperty(modal)}
				<Modal
					popoverComponent={modalMapping[modal].component}
					props={modalMapping[modal].props()}
					on:popover={async (e) => {
						await handlePopover(e, sessionStore, modal, '/compose');
					}}
				/>
			{/if}
		{/each}
	</div>
{/if}

<style>
	:global(.mce-content-body) {
		padding: 0.125rem;
	}
	:global(.mce-content-body::before) {
		padding: calc(0.125rem / 2) 0.125rem;
	}

	button[type='submit'] span {
		transform: scale(0.9);
		transition: 0.1s all ease-out;
	}

	button[type='submit']:hover span {
		transform: scale(1);
		transition: 0.1s all ease-in;
	}
</style>
