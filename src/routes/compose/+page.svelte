<script type="ts">
	import TagInput from '$components/input/Tag.svelte';
	import Editor from '$components/input/Editor.svelte';
	import AddRecipient from '$components/icon/Recipient.svelte';
	import AddTopic from '$components/icon/Topic.svelte';
	import Post from '$components/icon/Post.svelte';

	import { writable, type Writable } from 'svelte/store';
	import { enhance } from '$app/forms';

	import FingerprintJS from '@fingerprintjs/fingerprintjs-pro';

	type ComposeSchema = {
		profilerKey: string;
		editorKey: string;
	};

	export let data: ComposeSchema;

	let composed: Writable<string> = writable('');
	let postButtonHovered = writable(false);

	const addIconClass = 'add bg-peacockFeather-600 h-6 w-6';

	$: recipientEmails = [] as (string | FormDataEntryValue)[];
	$: topics = [] as (string | FormDataEntryValue)[];
</script>

<section class="gradient-background py-8">
	<form
		class="flex flex-col gap-y-5 rounded-full"
		method="POST"
		action="?/publish"
		use:enhance={async ({ form, data: post, action, cancel }) => {
			// `form` is the `<form>` element
			// `data` is its `FormData` object
			// `action` is the URL to which the form is posted
			// `cancel()` will prevent the submission
			for (const [tagName, list] of Object.entries({
				recipient: recipientEmails,
				topic: topics
			})) {
				post.set(tagName, list.join('␞'));
			}

			const webProfile = (
				await FingerprintJS.load({
					apiKey: data.profilerKey,
					endpoint: 'https://post.communi.email'
				})
			).get();

			post.set('profile', (await webProfile).requestId);

			return async ({ result, update }) => {
				console.log(result);
				// `result` is an `ActionResult` object
				// `update` is a function which triggers the logic that would be triggered if this callback wasn't set
			};
		}}
	>
		<div class="ml-20 flex flex-col w-fit h-full gap-x-20 gap-y-3">
			<span class="flex flex-row gap-x-5">
				<TagInput
					bind:tagList={recipientEmails}
					type="email"
					name="recipient"
					placeholder="Recipient"
					style="h-14 w-fit"
					tagStyle="px-1 py-1 rounded bg-larimarGreen-500"
				>
					<span class="relative w-12 shadow-artistBlue">
						<AddRecipient />
						<icon class={addIconClass} />
					</span>
				</TagInput>
				<TagInput
					bind:tagList={topics}
					type="text"
					name="topic"
					placeholder="Topic"
					style="w-fit h-14"
					tagStyle="px-1 py-1 rounded bg-larimarGreen-500"
				>
					<span class="relative w-12 shadow-artistBlue">
						<AddTopic />
						<icon class={addIconClass} />
					</span>
				</TagInput>
			</span>

			<span class="px-1 py-1 w-fit rounded bg-larimarGreen-600 shadow-artistBlue shadow-card">
				<input
					required
					type="text"
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
			class="flex flex-row items-center gap-4 ml-20 px-3 py-2 w-28 h-14 rounded bg-larimarGreen-600 text-white"
			on:mouseenter={() => ($postButtonHovered = true)}
			on:focus={() => ($postButtonHovered = true)}
			on:mouseleave={() => ($postButtonHovered = false)}
			on:blur={() => ($postButtonHovered = false)}
		>
			<Post hovered={$postButtonHovered} />Post
		</button>
	</form>
</section>

<style>
	.add {
		position: absolute;
		bottom: -0.125rem;
		right: -0.25rem;
		border-radius: 9999px;
		color: #fff;
		font-size: 1.5rem;
		line-height: 1.5rem;
		opacity: 75%;
		filter: drop-shadow(0 rgb(0 0 0 / 0.4));
		transform: scale(0.75);
		transition: all 0.4s ease-in;
	}
	span:hover > .add {
		opacity: 85%;
		filter: drop-shadow(3px 3px 2px rgb(0 0 0 / 0.4));
		transform: scale(0.85);
		transition: all 0.3s ease-out;
	}

	.add:after {
		content: '+';
	}

	:global(.mce-content-body) {
		padding: 0.125rem;
	}
	:global(.mce-content-body::before) {
		padding: calc(0.125rem / 2) 0.125rem;
	}
	.gradient-background {
		background: linear-gradient(
			90deg,
			theme('colors.peacockFeather.500'),
			theme('colors.larimarGreen.600')
		);
	}
</style>
