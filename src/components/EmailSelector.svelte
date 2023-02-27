<script lang="ts">
	import Email from './Email.svelte';
	import type { email } from '@prisma/client';

	export let emailList: email[];
</script>

<ul class="flex flex-row flex-wrap justify-center gap-5">
	{#each emailList as email}
		<Email {email} />
	{/each}
</ul>
