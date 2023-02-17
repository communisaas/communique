<script type="ts">
	import TagInput from '$components/input/Tag.svelte';
	import LineInput from '$components/input/Line.svelte';
	import Editor from '$components/input/Editor.svelte';
	import AddRecipient from '$components/icon/Recipient.svelte';
	import AddTopic from '$components/icon/Topic.svelte';

	type ServerData = {
		key: string;
	};
	export let data: ServerData;

	$: recipientEmails = [] as (string | FormDataEntryValue)[];
	$: topics = [] as (string | FormDataEntryValue)[];

	$: console.log(recipientEmails);

	const addIconClass = 'add bg-peacockFeather-600 h-6 w-6';

	function sanitizeEmailForm(click: Event) {}
</script>

<section class="gradient-background py-8">
	<form class="flex flex-col gap-y-5 rounded-full">
		<div class="ml-20 flex flex-col w-fit h-full gap-x-20 gap-y-3">
			<span class="flex flex-row gap-x-5">
				<TagInput
					bind:tagList={recipientEmails}
					type="email"
					name="Recipient"
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
					name="Topic"
					style="w-fit h-14"
					tagStyle="px-1 py-1 rounded bg-larimarGreen-500"
				>
					<span class="relative w-12 shadow-artistBlue">
						<AddTopic />
						<icon class={addIconClass} />
					</span>
				</TagInput>
			</span>

			<LineInput type="text" name="Subject" style="w-fit h-fit" />
		</div>

		<span class="py-8">
			<Editor apiKey={data.key} />
		</span>
		<button
			type="submit"
			class="ml-20 px-1 py-2 w-28 rounded bg-larimarGreen-600"
			on:click={sanitizeEmailForm}>Post</button
		>
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
		transition: all 0.2s ease-in;
	}
	span:hover > .add {
		opacity: 85%;
		filter: drop-shadow(3px 3px 2px rgb(0 0 0 / 0.4));
		transform: scale(0.85);
		transition: all 0.2s ease-out;
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
