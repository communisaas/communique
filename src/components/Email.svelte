<script lang="ts">
	import type { email } from '@prisma/client';

	export let email: email;

	// TODO email card layout
</script>

<article>
	{@html email.body}
</article>
