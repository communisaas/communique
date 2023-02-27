<script lang="ts">
	import Email from './Email.svelte';
	import type { email } from '@prisma/client';

	export let emailList: email[];
</script>

<ul class="px-10 py-3 flex flex-row justify-end space-x-5">
	{#each emailList as email}
		<Email {email} />
	{/each}
</ul>
