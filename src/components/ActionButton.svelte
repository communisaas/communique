<script lang="ts">
	import type { email } from '@prisma/client';

	export let actionButton: HTMLInputElement;
	export let visible: boolean;
	export let email: email;
</script>

<input
	style="visibility: {visible ? 'visible' : 'hidden'}"
	value="Copy to clipboard"
	bind:this={actionButton}
	type="button"
	on:click={() => {
		navigator.clipboard.writeText(email.body);
		actionButton.value = 'Copied!';
		setTimeout(() => {
			actionButton.value = 'Copy to clipboard';
		}, 1000);
	}}
	on:blur
/>
