<script lang="ts">
	export let type: 'email' | 'text', name: string, style: string;
</script>

<form class="flex flex-col h-fit w-fit">
	<span class="px-1 py-1  rounded bg-larimarGreen-600 shadow-artistBlue shadow-card">
		<input {name} placeholder={name} class="{style} rounded" {type} />
	</span>
</form>
