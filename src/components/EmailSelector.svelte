<script lang="ts">
	import Email from './Email.svelte';
	import type { email } from '@prisma/client';

	export let emailList: email[];
	export let selectedEmailID = '';
</script>

<ul class="flex flex-row flex-wrap justify-center gap-5">
	{#each emailList as email}
		<Email {email} bind:selectedEmailID />
	{/each}
</ul>
