<script lang="ts">
	import TagInput from '$components/input/Tag.svelte';
	import Editor from '$components/input/Editor.svelte';
	import AddRecipient from '$components/icon/Recipient.svelte';
	import AddTopic from '$components/icon/Topic.svelte';
	import Post from '$components/icon/Post.svelte';

	import { writable, type Writable } from 'svelte/store';
	import { enhance } from '$app/forms';

	export let data: ComposeSchema;

	let composed: Writable<string> = writable('');
	let postButtonHovered = writable(false);

	$: recipientEmails = [] as (string | FormDataEntryValue)[];
	$: topics = [] as (string | FormDataEntryValue)[];
</script>

<section class="gradient-background py-8">
	<form
		class="flex flex-col gap-y-5 rounded-full"
		method="POST"
		action="?/publish"
		aria-label="Compose form"
		aria-describedby="Add topics, recipients, a subject line, and email body here"
		use:enhance={async ({ form, data: post, action, cancel }) => {
			// `form` is the `<form>` element
			// `data` is its `FormData` object
			// `action` is the URL to which the form is posted
			// `cancel()` will prevent the submission
			for (const [tagName, list] of Object.entries({
				recipient_list: recipientEmails,
				topic_list: topics
			})) {
				post.set(tagName, list.join('␞'));
			}

			const letterInput = document.querySelector("input[name='body']");
			// TODO validate & sanitize email body

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
					update();
				}

				// `result` is an `ActionResult` object
				// `update` runs default reset after form submission
			};
		}}
	>
		<div class="ml-20 mr-20 flex flex-col w-fit h-full max-md:w-18 gap-x-20 gap-y-3">
			<span class="flex flex-row flex-wrap gap-5">
				<TagInput
					bind:tagList={recipientEmails}
					type="email"
					name="recipient"
					placeholder="Recipient"
					style="h-14 w-fit"
					tagStyle="px-1 py-1 rounded bg-peacockFeather-600 text-paper-500"
				>
					<AddRecipient />
				</TagInput>
				<TagInput
					bind:tagList={topics}
					type="text"
					name="topic"
					placeholder="Topic"
					style="w-fit h-14"
					tagStyle="px-1 py-1 rounded bg-peacockFeather-500 text-paper-500"
				>
					<AddTopic />
				</TagInput>
			</span>

			<span class="px-1 py-1 w-fit rounded bg-peacockFeather-400">
				<input
					required
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
					class="w-42 h-fit p-0.5 rounded"
				/>
			</span>
		</div>

		<span class="py-8">
			<Editor apiKey={data.editorKey} content={composed} />
		</span>

		<button
			type="submit"
			name="post"
			class="flex flex-row items-center gap-4 ml-20 px-3 py-2 w-28 h-14 rounded bg-peacockFeather-400 text-white"
			aria-label="Post button"
			on:mouseenter={() => ($postButtonHovered = true)}
			on:touchstart={() => ($postButtonHovered = true)}
			on:focus={() => ($postButtonHovered = true)}
			on:mouseleave={() => ($postButtonHovered = false)}
			on:touchend={() => ($postButtonHovered = false)}
			on:blur={() => ($postButtonHovered = false)}
		>
			<span><Post hovered={$postButtonHovered} /></span>Post
		</button>
	</form>
</section>

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

	.gradient-background {
		background: linear-gradient(
			90deg,
			theme('colors.peacockFeather.600'),
			theme('colors.teal.700')
		);
	}
</style>
