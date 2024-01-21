<script lang="ts">
	import TagInput from '$components/input/Tag.svelte';
	import Editor from '$components/input/Editor.svelte';
	import AddRecipient from '$components/icon/Recipient.svelte';
	import AddTopic from '$components/icon/Topic.svelte';
	import AddSignature from '$components/icon/Signature.svelte';
	import Post from '$components/icon/Post.svelte';

	import { writable, type Writable } from 'svelte/store';
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import Modal from '$components/Modal.svelte';
	import modal, { getModalMap, handlePopover } from '$lib/ui/modal';
	import { handleAutocomplete } from '$lib/data/select';
	import TextField from '$components/input/TextField.svelte';
	import { goto } from '$app/navigation';
	import { signIn } from '@auth/sveltekit/client';
	import type { OutputData } from '@editorjs/editorjs';
	import type { LexicalEditor } from 'lexical';
	import { scale } from 'svelte/transition';
	import Tooltip from '$components/Tooltip.svelte';
	import { addSignature, isNodeTypePresent, removeNodeType } from '$components/input/editor';
	import { SignatureNameNode, SignatureNode } from '$components/input/editorPlugins/signature';

	let postButtonHovered = writable(false);
	let sessionStore: Writable<UserState>;

	let postButton: HTMLButtonElement;
	let initialSubmitterState = '';

	let recipientEmails = [] as Descriptor<string>[];
	let topics = [] as Descriptor<string>[];
	let subjectLine = '';
	let locationString = '';

	let bodyCharacterCount = 0;

	let suggestedRecipientEmails = [] as Descriptor<string>[];
	let suggestedTopics = [] as Descriptor<string>[];
	let suggestedLocations = [] as Descriptor<string>[] | null;

	let editor: LexicalEditor;
	let topicInput: HTMLInputElement;
	let recipientInput: HTMLInputElement;
	let locationInput: HTMLInputElement;
	let editorBlocks: OutputData;
	let showSignatureTooltip = false;
	let signatureExists = false;

	onMount(async () => {
		sessionStore = (await import('$lib/data/sessionStorage')).store;
		recipientEmails = $sessionStore.composer.recipientEmails || [];
		topics = $sessionStore.composer.topics || [];
		subjectLine = $sessionStore.composer.subjectLine || '';
		locationString = $sessionStore.composer.locationString || '';
		editorBlocks = $sessionStore.composer.editorBlocks || { blocks: [] };
	});

	$: modalMapping = getModalMap($sessionStore, $page.data as LayoutSchema);

	$: if ($sessionStore && $sessionStore.hasOwnProperty('composer')) {
		$sessionStore.composer = {
			recipientEmails,
			topics,
			subjectLine,
			locationString,
			editorBlocks
		};
	}

	$: if (editor && editorBlocks && editorBlocks.blocks.length > 0 && !editor.focus) {
		initialSubmitterState = postButton.innerHTML;
	}

	function extractText(htmlString: string) {
		const parser = new DOMParser();
		const doc = parser.parseFromString(htmlString, 'text/html');
		return doc.body.textContent || '';
	}
</script>

<svelte:head>
	<title>Compose | Communique</title>
	<meta name="description" content="Write & share email templates!" />
</svelte:head>

<section class="pt-4">
	<h1 class="text-paper-500 text-left ml-5 md:ml-20 pb-5 text-xl xs:text-3xl">email composer</h1>
	{#if $sessionStore}
		<form
			class="flex flex-col gap-y-5 mb-4 rounded-full"
			method="POST"
			action="?/publish"
			aria-label="Compose form"
			aria-describedby="Add topics, recipients, a subject line, and email body here"
			use:enhance={async ({ formData, action, cancel, submitter }) => {
				// `formData` is its `FormData` object that's about to be submitted
				// `action` is the URL to which the form is posted
				// `cancel()` will prevent the submission
				if (!submitter) throw Error('No submitter element found');

				if (!$page.data.session) {
					signIn({ callbackUrl: '/compose', redirect: false });
					return;
				} else {
					submitter.innerHTML = 'Posting...';
				}

				let composerData = await editor.save();

				formData.set('body', JSON.stringify(composerData));
				formData.set('author_email', $sessionStore.user.email);

				// validate email length
				if (bodyCharacterCount < 250) {
					submitter.innerHTML = `Email has ${bodyCharacterCount} characters... Try for at least 250.`;
					setTimeout(() => {
						if (submitter && initialSubmitterState) submitter.innerHTML = initialSubmitterState;
					}, 5000);
					return;
				}

				// validate metadata fields
				if (recipientEmails.length <= 0 || topics.length <= 0) {
					if (recipientEmails.length <= 0) recipientInput.reportValidity();
					if (topics.length <= 0) topicInput.reportValidity();
					submitter.innerHTML = initialSubmitterState;
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
					if (result.status == 200) {
						// TODO submit confirmation
						recipientEmails = [];
						topics = [];
						$sessionStore.postID = await result.data.postID;
						submitter.innerHTML = 'Posted!';
						$sessionStore.show.afterPost = true;
						update();
					} else {
						if (result.type == 'redirect') {
							goto(result.location);
						}
						console.error(result);
						if (submitter) submitter.innerHTML = "Error!! We're working on it. Try again?";
						setTimeout(() => {
							if (submitter && initialSubmitterState) submitter.innerHTML = initialSubmitterState;
						}, 5000);
					}

					// `result` is an `ActionResult` object
					// `update` runs default reset after form submission
				};
			}}
		>
			<div
				class="ml-5 md:ml-20 mr-20 flex flex-col w-fit h-full max-w-full md:w-18 gap-x-20 gap-y-5"
			>
				<span class="flex flex-row flex-wrap gap-5 mr-4 pr-14">
					<TagInput
						bind:tagList={recipientEmails}
						bind:inputField={recipientInput}
						autocomplete={false}
						allowCustomValues={true}
						maxItems={100}
						type="email"
						name="recipient"
						searchSource="recipient"
						placeholder="Recipient"
						style="h-14 w-fit bg-peacockFeather-700"
						inputStyle="bg-peacockFeather-600 text-paper-500 focus:outline-peacockFeather-500 shadow-md"
						tagStyle="text-xs px-1 py-1 rounded bg-peacockFeather-600 text-paper-500 w-fit"
						inputVisible={$sessionStore.composer.recipientEmails.length <= 0 ||
							document.activeElement === recipientInput}
						bind:searchResults={suggestedRecipientEmails}
					>
						<icon class="w-12 inline-block m-1"><AddRecipient /></icon>
					</TagInput>
					<TagInput
						bind:tagList={topics}
						bind:inputField={topicInput}
						autocomplete={true}
						allowCustomValues={true}
						maxItems={5}
						type="text"
						name="topic"
						searchSource="topic"
						placeholder="Topic"
						style="h-14 w-fit bg-peacockFeather-700"
						inputStyle="bg-peacockFeather-600 text-paper-500 focus:outline-peacockFeather-500 shadow-md"
						tagStyle="text-xs px-1 py-1 rounded bg-peacockFeather-500 text-paper-500 m-2 w-fit"
						inputVisible={$sessionStore.composer.topics.length <= 0 ||
							document.activeElement === topicInput}
						autocompleteStyle="absolute left-0 top-[75%] bg-peacockFeather-600 text-paper-500"
						bind:searchResults={suggestedTopics}
						on:autocomplete={async (e) => {
							suggestedTopics = await handleAutocomplete(e);
						}}
					>
						<icon class="w-12 inline-block m-1"><AddTopic /></icon>
					</TagInput>
				</span>

				<span class="flex flex-wrap gap-5 w-fit rounded">
					<input
						bind:value={subjectLine}
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
						class="w-42 h-fit p-1.5 bg-artistBlue-700 focus:outline-peacockFeather-500 text-paper-500 rounded"
					/>
				</span>
				<span class="relative">
					<TextField
						bind:inputField={locationInput}
						bind:searchResults={suggestedLocations}
						bind:value={locationString}
						placeholder="Search location..."
						autocomplete={true}
						searchSource="location"
						autocompleteStyle="absolute left-0 top-[100%] bg-peacockFeather-600 text-paper-500"
						style="rounded p-1.5 text-left whitespace-nowrap bg-peacockFeather-700 text-paper-500 focus:outline-peacockFeather-500 transition-colors duration-200"
						on:blur={(e) => {
							suggestedLocations = [];
						}}
						on:autocomplete={async (e) => {
							suggestedLocations = null;
							suggestedLocations = await handleAutocomplete(e);
						}}
					/>
				</span>
			</div>

			<span class="mt-8 relative">
				<Editor
					style="max-w-5xl"
					bind:editor
					on:change={async (e) => {
						bodyCharacterCount = extractText(e.detail.domString).length;
						console.log(editor);
						if (initialSubmitterState) postButton.innerHTML = initialSubmitterState;
					}}
					on:update={(e) => {
						if (signatureExists && !isNodeTypePresent(SignatureNameNode)) {
							editor.update(() => {
								removeNodeType(SignatureNode);
							});
						}
						signatureExists = isNodeTypePresent(SignatureNameNode);
					}}
				>
					<div class="flex">
						{#if bodyCharacterCount > 0}
							<button
								type="button"
								class="bg-artistBlue-800 hover:bg-artistBlue-700 p-2 flex relative items-center justify-center rounded"
								transition:scale={{ duration: 100 }}
								on:click={() => {
									editor.update(() => {
										addSignature(editor, 'Sincerely,', '*sender name*', '*sender location*', true);
									});
								}}
								on:mouseenter={() => {
									showSignatureTooltip = true;
								}}
								on:mouseleave={() => {
									showSignatureTooltip = false;
								}}
								on:focus={() => {
									showSignatureTooltip = true;
								}}
								on:blur={() => {
									showSignatureTooltip = false;
								}}
							>
								<icon class="w-6 -mr-1 inline-block transition-all origin-center">
									<AddSignature />
								</icon>
								{#if showSignatureTooltip}
									<Tooltip
										message="Add signature"
										style="absolute bg-peacockFeather-700 -bottom-6 left-12 mr-2"
									/>
								{/if}
							</button>
						{/if}
					</div>
				</Editor>

				<div class="w-full relative max-w-[calc(64rem+5rem)] right-5">
					{#if bodyCharacterCount > 0}
						<p class="absolute right-0 mt-1 text-paper-900 opacity-70">
							{bodyCharacterCount}
							{bodyCharacterCount === 1 ? 'character' : 'characters'}
						</p>
					{/if}
					<div />
				</div>
			</span>

			<div class="ml-5 mt-8 md:ml-20 flex flex-col relative">
				{#if !$page.data.session}
					<p class="italic text-paper-500 -top-7 left-1 absolute">Sign in first.</p>
				{/if}
				<button
					bind:this={postButton}
					type="submit"
					name="post"
					title="Post"
					class="flex flex-row items-center gap-4 px-3 py-2 w-min min-w-fit h-14 rounded bg-peacockFeather-700 text-white"
					class:cursor-not-allowed={!$page.data.session}
					aria-label="Post button"
					aria-live="assertive"
					on:mouseenter={() => ($postButtonHovered = true)}
					on:touchstart={() => ($postButtonHovered = true)}
					on:focus={() => ($postButtonHovered = true)}
					on:mouseleave={() => ($postButtonHovered = false)}
					on:touchend={() => ($postButtonHovered = false)}
					on:blur={() => ($postButtonHovered = false)}
				>
					<span class="w-14 -mr-2"><Post hovered={$postButtonHovered} /></span>
					Post
				</button>
			</div>
		</form>
	{/if}
</section>

{#if $sessionStore && $sessionStore.hasOwnProperty('show')}
	<div use:modal>
		{#each Object.keys($sessionStore.show) as modal (modal)}
			{#if $sessionStore.show[modal] && modalMapping.hasOwnProperty(modal)}
				<Modal
					popoverComponent={modalMapping[modal].component}
					props={modalMapping[modal].props()}
					on:popover={async (e) => {
						handlePopover(e, sessionStore, modal, '/compose');
					}}
				/>
			{/if}
		{/each}
	</div>
{/if}

<style>
	button[type='submit'] span {
		transform: scale(0.9);
		transition: 0.1s all ease-out;
	}

	button[type='submit']:hover span {
		transform: scale(1);
		transition: 0.1s all ease-in;
	}
</style>
