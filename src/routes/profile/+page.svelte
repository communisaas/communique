<script lang="ts">
	import { page } from '$app/stores';
	import Panel from '$components/Panel.svelte';
</script>

<Panel
	initialSelection={{ item: $page.data.session?.user?.email || 'Loading...', type: 'text' }}
	header="Profile"
	alignment="end"
>
	<span />
</Panel>
